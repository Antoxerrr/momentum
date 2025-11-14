from zoneinfo import available_timezones

from django.contrib.auth import get_user_model
from drf_spectacular.utils import extend_schema, inline_serializer
from rest_framework import serializers
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from users.serializers import RegisterSerializer, UserSerializer

User = get_user_model()


@extend_schema(request=RegisterSerializer, responses=None)
@api_view(['POST'])
def register_view(request):
    serializer = RegisterSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response()


@extend_schema(
    responses=inline_serializer(
        name='AvailableTimezonesResponse',
        fields={'timezones': serializers.ListField(child=serializers.CharField())},
    )
)
@api_view()
def available_timezones_view(request):
    return Response({'timezones': available_timezones()})


@extend_schema(request=UserSerializer, responses=UserSerializer)
@api_view(['GET', 'PATCH'])
@permission_classes([IsAuthenticated])
def user_view(request):
    if request.method == 'GET':
        return Response(UserSerializer(request.user).data)
    serializer = UserSerializer(request.user, data=request.data, partial=True)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data)
