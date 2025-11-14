from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet

from snippets.filters import SnippetsFilter
from snippets.models import SnippetsCategory
from snippets.serializers import (
    CategorySerializer,
    CreateUpdateSnippetSerializer,
    SnippetSerializer,
)


class SnippetsViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = SnippetSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_class = SnippetsFilter
    search_fields = ['text']

    def get_queryset(self):
        return self.request.user.snippets.all()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_serializer_class(self):
        if self.action in ('create', 'update', 'partial_update'):
            return CreateUpdateSnippetSerializer
        return self.serializer_class


class SnippetsCategoryViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = CategorySerializer
    queryset = SnippetsCategory.objects.all()
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']
