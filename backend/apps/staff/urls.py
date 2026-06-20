from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import StaffProfileViewSet, PerformanceRecordViewSet

router = DefaultRouter()
router.register("", StaffProfileViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path("<int:staff_id>/performance/", PerformanceRecordViewSet.as_view({"get": "list", "post": "create"})),
]
