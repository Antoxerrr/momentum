from zoneinfo import available_timezones

from django.contrib.auth import get_user_model
from django.db.transaction import atomic
from rest_framework import serializers
from rest_framework.authtoken.models import Token

User = get_user_model()


class RegisterSerializer(serializers.Serializer):
    email = serializers.EmailField(min_length=3, max_length=254)
    username = serializers.CharField(min_length=3, max_length=32)
    password = serializers.CharField(min_length=8, max_length=128)
    timezone = serializers.CharField(max_length=32)

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError('Пользователь с таким логином уже существует')
        return value

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError('Пользователь с таким email уже существует')
        return value

    def validate_timezone(self, value):
        if value not in available_timezones():
            raise serializers.ValidationError('Неверная временная зона')
        return value

    @atomic
    def create(self, validated_data):
        user = User(
            username=validated_data['username'],
            email=validated_data['email'],
            timezone=validated_data['timezone'],
        )
        user.set_password(validated_data['password'])
        user.save()

        Token.objects.get_or_create(user=user)
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('timezone', 'username', 'email')
        read_only_fields = ('email',)
