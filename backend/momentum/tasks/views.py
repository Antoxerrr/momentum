from django.db.transaction import atomic
from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import extend_schema
from rest_framework.decorators import action
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from tasks.filters import TasksFilter
from tasks.models import TaskCompletion
from tasks.serializers import TaskSerializer


class TaskViewSet(ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = LimitOffsetPagination
    filter_backends = [DjangoFilterBackend]
    filterset_class = TasksFilter

    def get_queryset(self):
        user_tz = self.request.headers['x-user-timezone']

        return self.request.user.tasks.annotate_user_today(user_tz).annotate_actual_state()

    def filter_queryset(self, queryset):
        queryset = super().filter_queryset(queryset)
        archived_param = self.request.query_params.get('archived')

        if archived_param in ('1', 'true', 'True'):
            return queryset.order_by('-updated')[:15]

        return queryset

    @atomic
    @extend_schema(request=None, responses=None)
    @action(methods=('POST',), detail=True)
    def complete(self, request, pk):
        task = self.get_object()
        task.create_completion()
        if not task.period:
            task.archived = True
            task.save()
        return self._fresh_object_response()

    @atomic
    @extend_schema(request=None, responses=None)
    @action(methods=('POST',), detail=True)
    def undo_complete(self, request, pk):
        task = self.get_object()
        TaskCompletion.objects.filter(task=task).order_by('-created').first().delete()
        if not task.period:
            task.archived = False
            task.save()
        return self._fresh_object_response()

    @extend_schema(request=None, responses=None)
    @action(methods=('PATCH',), detail=True)
    def archive(self, request, pk):
        task = self.get_object()
        task.archived = True
        task.save()
        return self._fresh_object_response()

    def _fresh_object_response(self):
        return Response(TaskSerializer(self.get_object()).data)
