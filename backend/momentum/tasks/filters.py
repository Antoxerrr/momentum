from django.db.models import Q
from django_filters import rest_framework as filters

from tasks.models import Task


class TasksFilter(filters.FilterSet):

    current = filters.BooleanFilter(method='filter_current')

    class Meta:
        model = Task
        fields = ['archived', 'current']

    def filter_current(self, queryset, name, value):
        if value:
            return queryset.current()
        return queryset.upcoming()
