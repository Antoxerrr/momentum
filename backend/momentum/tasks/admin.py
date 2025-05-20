from django.contrib import admin

from tasks.models import Task, TaskCompletion

admin.site.register(Task)
admin.site.register(TaskCompletion)
