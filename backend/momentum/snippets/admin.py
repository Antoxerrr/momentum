from django.contrib import admin
from mptt.admin import MPTTModelAdmin

from snippets.models import SnippetsCategory, Snippet

admin.site.register(Snippet)
admin.site.register(SnippetsCategory, MPTTModelAdmin)
