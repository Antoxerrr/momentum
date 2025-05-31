import datetime
import uuid

import pytest
from dateutil.relativedelta import relativedelta
from django.utils import timezone
from freezegun import freeze_time

from core.utils.datetime import get_end_of_month, get_end_of_week
from tasks.models import Task, TaskPeriod


def _create_task(user, **kwargs):
    task = Task.objects.create(user=user, name=uuid.uuid4().hex, **kwargs)
    return _reload_task(task)


def _create_completion(task: Task):
    task.create_completion()
    return _reload_task(task)


def _reload_task(task: Task):
    return Task.objects.annotate_actual_state().get(pk=task.pk)


@pytest.mark.parametrize("period", [
    None,
    TaskPeriod.DAILY,
    TaskPeriod.WEEKLY,
    TaskPeriod.MONTHLY
])
def test_task_completed(user, period):
    kwargs = {'period': period} if period else {'date': timezone.now().date()}
    task = _create_task(user, **kwargs)
    assert task.completed is False

    task = _create_completion(task)
    assert task.completed is True


@pytest.mark.parametrize("period", [
    None,
    TaskPeriod.DAILY,
    TaskPeriod.WEEKLY,
    TaskPeriod.MONTHLY
])
def test_task_expired(user, period):
    kwargs = {'period': period} if period else {'date': timezone.now().date()}
    task = _create_task(user, **kwargs)
    assert task.expired is False

    prev_year = timezone.now().date() - relativedelta(years=1)
    kwargs = {'period': period} if period else {'date': prev_year}

    with freeze_time(prev_year):
        task = _create_task(user, **kwargs)

    task = _reload_task(task)
    assert task.expired is True

    task = _create_completion(task)

    if period is None:
        # Одноразовая таска просрочена навсегда
        assert task.expired is True
    else:
        assert task.expired is False


def test_task_user_today(user):
    task = _create_task(user, date=timezone.now())
    assert task.user_today == task.user.get_today()


def test_task_last_completion_date(user, frozen_date):
    task = _create_task(user, date=frozen_date)
    assert task.last_completion_date is None

    task.create_completion()
    task = _reload_task(task)
    assert task.last_completion_date == frozen_date

    next_day = frozen_date + datetime.timedelta(days=1)
    with freeze_time(next_day):
        task.create_completion()
        task = _reload_task(task)
        assert task.last_completion_date == next_day

    past_date = frozen_date - datetime.timedelta(days=100)
    with freeze_time(past_date):
        task.create_completion()
        task = _reload_task(task)
        assert task.last_completion_date == next_day


@pytest.mark.parametrize("period,expected_deadline,expected_shift", [
    (None, lambda d: d, datetime.timedelta(days=0)),
    (TaskPeriod.DAILY, lambda d: d, datetime.timedelta(days=1)),
    (TaskPeriod.WEEKLY, get_end_of_week, relativedelta(weeks=1)),
    (TaskPeriod.MONTHLY, get_end_of_month, relativedelta(months=1))
])
def test_task_actual_deadline(user, frozen_date, period, expected_deadline, expected_shift):
    kwargs = {'period': period} if period else {'date': frozen_date}
    task = _create_task(user, **kwargs)
    assert task.actual_deadline == expected_deadline(frozen_date)

    task = _create_completion(task)
    assert task.actual_deadline == expected_deadline(frozen_date) + expected_shift
