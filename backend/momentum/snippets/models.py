from django.contrib.auth import get_user_model
from django.db import models
from mptt.fields import TreeForeignKey
from mptt.models import MPTTModel

from core.models import BaseModel

User = get_user_model()


class SnippetsCategory(BaseModel, MPTTModel):
    name = models.CharField('Название', max_length=256)
    parent = TreeForeignKey(
        'self',
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name='children',
        verbose_name='Родительская категория'
    )

    class Meta:
        verbose_name = 'Категория сниппетов'
        verbose_name_plural = 'Категории сниппетов'

    def __str__(self):
        return self.name


class Snippet(BaseModel):
    text = models.TextField('Текст')
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        verbose_name='Пользователь',
    )
    category = models.ForeignKey(
        SnippetsCategory,
        verbose_name='Категория',
        on_delete=models.PROTECT,
    )

    class Meta:
        verbose_name = 'Сниппет'
        verbose_name_plural = 'Сниппеты'
        default_related_name = 'snippets'

    def __str__(self):
        return f'Сниппет <{self.pk}>'
