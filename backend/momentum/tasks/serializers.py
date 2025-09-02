import datetime

from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import extend_schema_field
from django.db.transaction import atomic
from rest_framework import serializers

from tasks.models import Task


class PenaltyTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = (
            'name',
            'description'
        )


class TaskSerializer(serializers.ModelSerializer):

    penalty_task = PenaltyTaskSerializer(required=False)
    actual_deadline = serializers.DateField(read_only=True)
    completed = serializers.BooleanField(read_only=True)
    expired = serializers.BooleanField(read_only=True)

    class Meta:
        model = Task
        fields = (
            'id',
            'name',
            'description',
            'penalty_task',
            'date',
            'period',
            'completed',
            'expired',
            'actual_deadline',
        )
        read_only_fields = (
            'id',
            'completed',
            'expired',
            'actual_deadline',
        )

    def validate(self, attrs):
        if attrs.get('period') and attrs.get('date'):
            raise serializers.ValidationError('Укажите только дату или только период')
        if not attrs.get('period') and not attrs.get('date'):
            raise serializers.ValidationError('Укажите дату или период')
        return attrs

    @atomic
    def create(self, validated_data: dict):
        request = self.context['request']

        penalty_task_data = validated_data.pop('penalty_task', None)
        penalty_task = None

        if penalty_task_data:
            penalty_task = Task.objects.create(**penalty_task_data, user=request.user)
        
        task = Task(**validated_data, user=request.user)
        if penalty_task:
            task.penalty_task = penalty_task
        task.save()

        return task
