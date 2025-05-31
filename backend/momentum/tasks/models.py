import datetime
from datetime import timedelta

from dateutil.relativedelta import relativedelta
from django.contrib.auth import get_user_model
from django.db import models
from django.db.models import CheckConstraint, Q, Subquery, Case, When, F
from django.db.models.expressions import RawSQL, ExpressionWrapper, Value
from django.db.models.functions import Coalesce, TruncDate, ExtractWeek, ExtractYear, ExtractMonth
from django.db.models.lookups import GreaterThan, LessThan, IsNull, Exact

from core.models import BaseModel
from core.utils.aggregation import WeekEnd, MonthEnd, AddMonth, TimezoneDate
from core.utils.datetime import get_end_of_week, get_end_of_month

User = get_user_model()


class TaskPeriod(models.TextChoices):

    DAILY = 'DAILY', 'Ежедневно'
    WEEKLY = 'WEEKLY', 'Еженедельно'
    MONTHLY = 'MONTHLY', 'Ежемесячно'


class TasksQuerySet(models.QuerySet["Task"]):

    def annotate_actual_state(self):
        return (
            self
            .annotate_actual_deadline()
            .annotate_expired()
            .annotate_completed()
        )

    def annotate_user_today(self):
        return self.annotate(
            user_today=TimezoneDate(F('user__timezone'))
        )

    def annotate_last_completion_date(self):
        return self.annotate(
            last_completion_date=Subquery(
                TaskCompletion.objects.order_by('-date').values_list('date', flat=True)[:1]
            )
        )

    def annotate_actual_deadline(self):
        return self.annotate_last_completion_date().annotate(
            actual_deadline=Case(
                When(
                    period=TaskPeriod.DAILY.value,
                    then=TruncDate(
                        Coalesce(
                            F('last_completion_date') + datetime.timedelta(days=1),
                            F('created')
                        )
                    )
                ),
                When(
                    period=TaskPeriod.WEEKLY.value,
                    then=TruncDate(
                        Coalesce(
                            WeekEnd('last_completion_date') + datetime.timedelta(days=7),
                            WeekEnd('created')
                        )
                    )
                ),
                When(
                    period=TaskPeriod.MONTHLY.value,
                    then=TruncDate(
                        Coalesce(
                            AddMonth(MonthEnd('last_completion_date')),
                            MonthEnd('created')
                        )
                    )
                ),
                default=F('date'),
                output_field=models.DateField()
            )
        )

    def annotate_completed(self):
        same_year = Exact(ExtractYear(F('last_completion_date')), ExtractYear(F('user_today')))
        same_week = Exact(ExtractWeek(F('last_completion_date')), ExtractWeek(F('user_today')))
        same_month = Exact(ExtractMonth(F('last_completion_date')), ExtractMonth(F('user_today')))

        return self.annotate_user_today().annotate_last_completion_date().annotate(
            completed=Case(
                When(
                    period=TaskPeriod.DAILY.value,
                    then=Coalesce(
                        Exact(F('last_completion_date'), F('user_today')),
                        Value(False)
                    )
                ),
                When(
                    period=TaskPeriod.WEEKLY.value,
                    then=Coalesce(
                        same_week & same_year,
                        Value(False)
                    )
                ),
                When(
                    period=TaskPeriod.MONTHLY.value,
                    then=Coalesce(
                        same_month & same_year,
                        Value(False)
                    )
                ),
                default=ExpressionWrapper(
                    Q(last_completion_date__isnull=False),
                    output_field=models.BooleanField()
                ),
                output_field=models.BooleanField()
            )
        )

    def annotate_expired(self):
        return self.annotate_user_today().annotate(
            expired=LessThan(F('actual_deadline'), F('user_today'))
        )


class Task(BaseModel):

    user = models.ForeignKey(User, verbose_name='Пользователь', on_delete=models.CASCADE)
    name = models.CharField("Название", max_length=256)
    description = models.TextField("Описание", null=True, blank=True)
    penalty_task = models.ForeignKey('self', verbose_name='Штрафная задача', on_delete=models.SET_NULL, null=True, blank=True, related_name='original_task')
    date = models.DateField('Дата', null=True, blank=True)
    period = models.CharField('Период', choices=TaskPeriod.choices, max_length=16, null=True, blank=True)
    archived = models.BooleanField('В архиве', default=False)

    objects: models.Manager | TasksQuerySet = TasksQuerySet.as_manager()

    class Meta:
        verbose_name = 'Задача'
        verbose_name_plural = 'Задачи'
        constraints = [
            CheckConstraint(
                condition=(
                    (Q(period__isnull=False) | Q(date__isnull=False)) &
                    ~Q(period__isnull=False, date__isnull=False)
                ),
                name="period_or_date_and_not_both",
            )
        ]

    def create_completion(self):
        if not hasattr(self, 'expired'):
            raise RuntimeError('Call annotation')

        return TaskCompletion.objects.create(
            task=self,
            date=self.user.get_today(),
            expired=self.expired
        )

    def __str__(self):
        return f'Задача "{self.name}"'


class TaskCompletion(BaseModel):

    task = models.ForeignKey(Task, verbose_name='Задача', on_delete=models.CASCADE, related_name='task_completion')
    date = models.DateField("Когда")
    expired = models.BooleanField('Просрочено')

    class Meta:
        verbose_name = 'Выполнение задачи'
        verbose_name_plural = 'Выполнения задач'

    def __str__(self):
        return f'Выполнение задачи "{self.task.name}" ({self.date})'
