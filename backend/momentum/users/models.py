import datetime
from zoneinfo import available_timezones, ZoneInfo

from django.contrib.auth.models import AbstractUser
from django.db import models

TIMEZONE_CHOICES = [(tz, tz) for tz in sorted(available_timezones())]
DEFAULT_USER_TIMEZONE = 'UTC'


class User(AbstractUser):
    timezone = models.CharField(
        max_length=32,
        choices=TIMEZONE_CHOICES,
        default=DEFAULT_USER_TIMEZONE
    )

    def get_today(self) -> datetime.date:
        timezone = ZoneInfo(self.timezone)
        return datetime.datetime.now(timezone).date()
