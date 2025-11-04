from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

api_urls = [
    path('users/', include('users.urls')),
    path('tasks/', include('tasks.urls')),
    path('snippets/', include('snippets.urls')),
]

docs_urls = [
    path('schema/', SpectacularAPIView.as_view(), name='spectacular_schema'),
    path('', SpectacularSwaggerView.as_view(url_name='spectacular_schema'), name='swagger_ui_docs'),
]

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(api_urls)),
    path('docs/', include(docs_urls)),
]
