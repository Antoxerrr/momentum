from rest_framework.routers import SimpleRouter
from . import views

router = SimpleRouter()
router.register('categories', views.SnippetsCategoryViewSet, basename='snippets_category')
router.register('', views.SnippetsViewSet, basename='snippets')

urlpatterns = router.urls
