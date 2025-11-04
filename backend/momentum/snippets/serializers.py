from rest_framework import serializers

from snippets.models import Snippet, SnippetsCategory


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = SnippetsCategory
        fields = ('id', 'name', 'parent_id')


class SnippetSerializer(serializers.ModelSerializer):
    category = CategorySerializer()

    class Meta:
        model = Snippet
        fields = ('id', 'text', 'created', 'updated', 'category')


class CreateUpdateSnippetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Snippet
        fields = ('text', 'category')

    def to_representation(self, instance):
        return SnippetSerializer(instance).data
