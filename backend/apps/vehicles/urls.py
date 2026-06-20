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

urlpatterns = [
    path("", include(router.urls)),
    path("vehicles/<int:vehicle_id>/images/", VehicleImageViewSet.as_view({"get": "list", "post": "create"})),
]
