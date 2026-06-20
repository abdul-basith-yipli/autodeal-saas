from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import StaffProfileViewSet, PerformanceRecordViewSet

router = DefaultRouter()
router.register("", StaffProfileViewSet)
router.register(r"(?P<staff_id>\d+)/performance", PerformanceRecordViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
