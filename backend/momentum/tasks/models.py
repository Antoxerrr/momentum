import datetime
from datetime import timedelta

from dateutil.relativedelta import relativedelta
from django.contrib.auth import get_user_model
from django.db import models
from django.db.models import CheckConstraint, Q
from django.utils import timezone
from django.utils.functional import cached_property

from core.models import BaseModel
from core.utils.datetime import get_end_of_week, get_end_of_month

User = get_user_model()


class TaskPeriod(models.TextChoices):

    DAILY = 'DAILY', 'Ежедневно'
    WEEKLY = 'WEEKLY', 'Еженедельно'
    MONTHLY = 'MONTHLY', 'Ежемесячно'


class Task(BaseModel):

    user = models.ForeignKey(User, verbose_name='Пользователь', on_delete=models.CASCADE)
    name = models.CharField("Название", max_length=256)
    description = models.TextField("Описание", null=True, blank=True)
    penalty_task = models.ForeignKey('self', verbose_name='Штрафная задача', on_delete=models.SET_NULL, null=True, blank=True, related_name='original_task')
    date = models.DateTimeField('Дата', null=True, blank=True)
    period = models.CharField('Период', choices=TaskPeriod.choices, max_length=16, null=True, blank=True)
    archived = models.BooleanField('В архиве', default=False)

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

    @cached_property
    def last_completion_date(self) -> datetime.date | None:
        last = self.task_completion.order_by('-timestamp').first()
        return last.date if last else None

    @cached_property
    def actual_deadline(self) -> datetime.date:
        last_completion_date = self.last_completion_date

        match self.period:
            case TaskPeriod.DAILY.value:
                if not last_completion_date:
                    result = self.created
                else:
                    result = last_completion_date + timedelta(days=1)
            case TaskPeriod.WEEKLY.value:
                if not last_completion_date:
                    result = get_end_of_week(self.created)
                else:
                    result = get_end_of_week(last_completion_date) + timedelta(days=7)
            case TaskPeriod.MONTHLY.value:
                if not last_completion_date:
                    result = get_end_of_month(self.created)
                else:
                    result = get_end_of_month(last_completion_date) + relativedelta(months=1)
            case _:
                result = self.date

        return result.date() if isinstance(result, datetime.datetime) else result

    @cached_property
    def expired(self) -> bool:
        return self.actual_deadline < timezone.now().date()

    @cached_property
    def completed(self) -> bool:
        last_completion_date = self.last_completion_date
        if not last_completion_date:
            return False

        today = timezone.now().date()
        today_week_number = today.isocalendar()[1]
        last_completion_week_number = last_completion_date.isocalendar()[1]
        match self.period:
            case TaskPeriod.DAILY.value:
                result = last_completion_date == today
            case TaskPeriod.WEEKLY.value:
                result = (
                    last_completion_week_number == today_week_number and
                    last_completion_date.year == today.year
                )
            case TaskPeriod.MONTHLY.value:
                result = (
                    last_completion_date.month == today.month and
                    last_completion_date.year == today.year
                )
            case _:
                result = True

        return result

    def __str__(self):
        return f'Задача "{self.name}"'


class TaskCompletion(BaseModel):

    task = models.ForeignKey(Task, verbose_name='Задача', on_delete=models.CASCADE, related_name='task_completion')
    timestamp = models.DateTimeField("Когда", default=timezone.now)
    expired = models.BooleanField('Просрочено')

    class Meta:
        verbose_name = 'Выполнение задачи'
        verbose_name_plural = 'Выполнения задач'

    def __str__(self):
        return f'Выполнение задачи "{self.task.name}" ({self.timestamp})'
