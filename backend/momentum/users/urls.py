from django.urls import path
from rest_framework.authtoken.views import obtain_auth_token

from . import views


urlpatterns = [
    path('login/', obtain_auth_token, name="login"),
    path('register/', views.register_view, name="register"),
    path('available_timezones/', views.available_timezones_view, name="available_timezones"),
    path('me/', views.user_view, name="user")
]
