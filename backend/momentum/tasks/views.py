from django.db.transaction import atomic
from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import extend_schema
from rest_framework.decorators import action
from rest_framework.generics import get_object_or_404
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from tasks.filters import TasksFilter
from tasks.models import Task, TaskCompletion
from tasks.serializers import TaskSerializer


class TaskViewSet(ModelViewSet):

    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = LimitOffsetPagination
    filter_backends = [DjangoFilterBackend]
    filterset_class = TasksFilter

    def get_queryset(self):
        user_tz = self.request.headers['x-user-timezone']

        return (
            self.request.user.tasks
            .annotate_user_today(user_tz)
            .annotate_actual_state()
        )

    def _get_task(self) -> Task:
        user_tz = self.request.headers['x-user-timezone']
        qs = (
            Task.objects
            .annotate_user_today(user_tz)
            .annotate_actual_deadline()
            .annotate_expired()
        )

        return get_object_or_404(
            qs,
            pk=self.kwargs[self.lookup_field]
        )

    @atomic
    @extend_schema(request=None, responses=None)
    @action(methods=('POST',), detail=True)
    def complete(self, request, pk):
        task = self._get_task()
        task.create_completion()
        if not task.period:
            task.archived = True
            task.save()
        return Response()

    @atomic
    @extend_schema(request=None, responses=None)
    @action(methods=('POST',), detail=True)
    def undo_complete(self, request, pk):
        task = self._get_task()
        TaskCompletion.objects.filter(
            task=task
        ).order_by('-created').first().delete()
        if not task.period:
            task.archived = False
            task.save()
        return Response()

    @extend_schema(request=None, responses=None)
    @action(methods=('PATCH',), detail=True)
    def archive(self, request, pk):
        task = self._get_task()
        task.archived = True
        task.save()
        return Response(TaskSerializer(task).data)
