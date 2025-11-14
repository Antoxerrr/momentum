from django.contrib import admin
from mptt.admin import MPTTModelAdmin

from snippets.models import Snippet, SnippetsCategory

admin.site.register(Snippet)
admin.site.register(SnippetsCategory, MPTTModelAdmin)
