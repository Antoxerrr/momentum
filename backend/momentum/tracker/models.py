from django.contrib.auth import get_user_model
from django.db import models

from core.models import BaseModel


User = get_user_model()

class TrackerProject(BaseModel):
    name = models.CharField('Название', max_length=128)
    tag = models.CharField('Короткий тег', max_length=6)
    owner = models.ForeignKey(
        User, on_delete=models.CASCADE, verbose_name='Создатель', related_name='tracker_projects'
    )

    class Meta:
        verbose_name = 'Проект'
        verbose_name_plural = 'Проекты'

    def __str__(self):
        return self.name


class TrackerEpic(BaseModel):
    name = models.CharField('Название', max_length=128)
    project = models.ForeignKey(TrackerProject, on_delete=models.CASCADE, verbose_name='Проект', related_name='epics')

    class Meta:
        verbose_name = 'Эпик'
        verbose_name_plural = 'Эпики'

    def __str__(self):
        return self.name


class TrackerTask(BaseModel):
    name = models.CharField('Название', max_length=128)
    epic = models.ForeignKey(
        TrackerEpic, on_delete=models.SET_NULL, verbose_name='Эпик', related_name='tasks', null=True, blank=True
    )

    class Meta:
        verbose_name = 'Задача'
        verbose_name_plural = 'Задачи'

    def __str__(self):
        return self.name


class TrackerTaskTag(BaseModel):
    name = models.CharField('<UNK>', max_length=128)
    color = ...
