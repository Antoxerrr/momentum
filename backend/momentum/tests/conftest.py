import datetime

import pytest
from freezegun import freeze_time

from users.models import DEFAULT_USER_TIMEZONE


@pytest.fixture(autouse=True)
def db_access_for_all_tests(db):
    pass


@pytest.fixture
def user(django_user_model):
    return django_user_model.objects.create_user('user', 'user@user.ru', timezone=DEFAULT_USER_TIMEZONE)


@pytest.fixture
def frozen_date():  # TODO: Freeze DB time
    frozen_date = datetime.date(2025, 1, 1)
    with freeze_time(frozen_date):
        yield frozen_date
