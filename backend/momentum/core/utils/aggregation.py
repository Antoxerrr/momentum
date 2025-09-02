from django.db.models import Func, DateField


class _DateTruncAggregations(Func):
    output_field = DateField()

    def __init__(self, expression, **extra):
        extra.setdefault('function', 'DATE_TRUNC')
        super().__init__(expression, **extra)


class AddDays(_DateTruncAggregations):
    template = "(%(expressions)s + INTERVAL '%(days)s DAY')::date"
    
    def __init__(self, expression, days, **extra):
        super().__init__(expression, **extra)
        self.extra['days'] = days

    def as_sql(self, compiler, connection, **extra_context):
        # Добавляем days в контекст
        extra_context['days'] = self.extra['days']
        return super().as_sql(compiler, connection, **extra_context)


class WeekEnd(_DateTruncAggregations):
    template = '%(function)s(\'week\', %(expressions)s) + INTERVAL \'6 days\''


class MonthEnd(_DateTruncAggregations):
    template = '%(function)s(\'month\', %(expressions)s) + INTERVAL \'1 month\' - INTERVAL \'1 day\''


class AddMonth(Func):
    template = '%(expressions)s + INTERVAL \'1 month\''
    output_field = DateField()


class TimezoneDate(Func):
    function = 'TIMEZONE'
    template = "(%(function)s(%(expressions)s, CURRENT_TIMESTAMP))::date"
    output_field = DateField()
