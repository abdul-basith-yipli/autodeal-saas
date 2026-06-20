from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    VehicleCategoryViewSet, VehicleBrandViewSet, VehicleModelViewSet,
    VehicleYearViewSet, VehicleSpecificationViewSet, VehicleViewSet,
    VehicleImageViewSet,
)

router = DefaultRouter()
router.register("vehicle-categories", VehicleCategoryViewSet)
router.register("brands", VehicleBrandViewSet)
router.register("models", VehicleModelViewSet)
router.register("years", VehicleYearViewSet)
router.register("vehicle-specs", VehicleSpecificationViewSet)
router.register("vehicles", VehicleViewSet)
router.register(r"vehicles/(?P<vehicle_id>\d+)/images", VehicleImageViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
