from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenBlacklistView

api_urls = [
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/blacklist/', TokenBlacklistView.as_view(), name='token_blacklist'),
    path('users/', include('users.urls')),
    path('tasks/', include('tasks.urls')),
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
