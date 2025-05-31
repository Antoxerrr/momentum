import datetime

from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import extend_schema_field
from rest_framework import serializers

from tasks.models import Task


class SingleTaskCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'
        read_only_fields = (
            'completed',
            'archived',
            'user',
            'penalty_task'
        )


class TaskSerializer(serializers.ModelSerializer):

    penalty_task = SingleTaskCreateSerializer()
    periodical = serializers.SerializerMethodField()
    actual_deadline = serializers.SerializerMethodField()
    completed = serializers.BooleanField(read_only=True)

    class Meta:
        model = Task
        fields = '__all__'
        read_only_fields = (
            'completed',
            'archived',
            'user'
        )

    @staticmethod
    @extend_schema_field(OpenApiTypes.OBJECT)
    def get_penalty_task(task: Task) -> dict | None:
        penalty_task = task.penalty_task
        if penalty_task:
            return TaskSerializer(penalty_task).data
        return None

    @staticmethod
    @extend_schema_field(OpenApiTypes.BOOL)
    def get_periodical(task: Task) -> bool:
        return bool(task.period)

    @staticmethod
    @extend_schema_field(OpenApiTypes.DATE)
    def get_actual_deadline(task: Task) -> datetime.date:
        return task.actual_deadline
