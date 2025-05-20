import calendar
import datetime


def get_end_of_week(date: datetime.date) -> datetime.date:
    days_until_end = 6 - date.weekday() % 7
    return date + datetime.timedelta(days=days_until_end)


def get_end_of_month(date: datetime.date) -> datetime.date:
    _, last_day = calendar.monthrange(date.year, date.month)
    return date.replace(day=last_day)
