from rest_framework.routers import SimpleRouter

from . import views

router = SimpleRouter()
router.register('', views.TaskViewSet, basename='tasks')

urlpatterns = router.urls
