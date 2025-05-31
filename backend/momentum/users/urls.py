from django.urls import path

from . import views


urlpatterns = [
    path('register/', views.register_view, name="register"),
    path('available_timezones/', views.available_timezones_view, name="available_timezones"),
    path('', views.user_view, name="user")
]
