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
router.register("vehicle-specs", VehicleSpecificationViewSet)
router.register("vehicles", VehicleViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path("brands/<int:brand_id>/models/", VehicleModelViewSet.as_view({"get": "list", "post": "create"})),
    path("models/<int:model_id>/years/", VehicleYearViewSet.as_view({"get": "list", "post": "create"})),
    path("vehicles/<int:vehicle_id>/images/", VehicleImageViewSet.as_view({"get": "list", "post": "create"})),
]
