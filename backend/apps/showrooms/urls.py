from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ShowroomViewSet, ShowroomPerformanceViewSet

router = DefaultRouter()
router.register("", ShowroomViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path("<int:showroom_id>/performance/", ShowroomPerformanceViewSet.as_view({"get": "list", "post": "create"})),
]
