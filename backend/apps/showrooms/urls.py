from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ShowroomViewSet, ShowroomPerformanceViewSet

router = DefaultRouter()
router.register("", ShowroomViewSet)
router.register(r"(?P<showroom_id>\d+)/performance", ShowroomPerformanceViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
