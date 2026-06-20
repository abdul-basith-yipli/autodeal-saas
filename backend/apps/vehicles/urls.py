from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    VehicleCategoryViewSet, VehicleBrandViewSet, VehicleModelViewSet,
    VehicleYearViewSet, VehicleSpecificationViewSet, VehicleViewSet,
    VehicleSpecValueViewSet,
    VehicleImageViewSet, VehicleInspectionViewSet, VehiclePriceHistoryViewSet,
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
    path("vehicle-categories/<int:category_id>/specs/", VehicleSpecificationViewSet.as_view({"get": "list", "post": "create"})),
    path("vehicles/<int:vehicle_id>/spec-values/", VehicleSpecValueViewSet.as_view({"get": "list", "post": "create"})),
    path("vehicles/<int:vehicle_id>/images/", VehicleImageViewSet.as_view({"get": "list", "post": "create"})),
    path("vehicles/<int:vehicle_id>/inspections/", VehicleInspectionViewSet.as_view({"get": "list", "post": "create"})),
    path("vehicles/<int:vehicle_id>/price-history/", VehiclePriceHistoryViewSet.as_view({"get": "list"})),
]
