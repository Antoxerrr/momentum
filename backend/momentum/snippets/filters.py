from unicodedata import category

from django.forms.widgets import SelectMultiple
from django_filters import rest_framework as filters

from snippets.models import Snippet


class SnippetsFilter(filters.FilterSet):
    category = filters.BaseInFilter(widget=SelectMultiple)

    class Meta:
        model = Snippet
        fields = ['category']
