from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import extend_schema
from rest_framework.decorators import action
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from tasks.models import Task, TaskCompletion
from tasks.serializers import TaskSerializer


class TaskViewSet(ModelViewSet):

    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['archived']

    def _get_task(self) -> Task:
        return get_object_or_404(
            Task,
            pk=self.request.parser_context['kwargs'][self.lookup_field]
        )

    @extend_schema(request=None, responses=None)
    @action(methods=('POST',), detail=True)
    def complete(self, request, pk):
        self._get_task().create_completion()
        return Response()

    @extend_schema(request=None, responses=None)
    @action(methods=('POST',), detail=True)
    def undo_complete(self, request, pk):
        TaskCompletion.objects.filter(
            task=self._get_task()
        ).order_by('-created').first().delete()
        return Response()
