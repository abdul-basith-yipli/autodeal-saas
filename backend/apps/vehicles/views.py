from rest_framework import viewsets
from common.views import TenantAwareViewSet
from .models import (
    VehicleCategory, VehicleBrand, VehicleModel, VehicleYear,
    VehicleSpecification, VehicleSpecValue, Vehicle, VehicleImage,
    VehicleInspection, VehiclePriceHistory,
)
from .serializers import (
    VehicleCategorySerializer, VehicleBrandSerializer, VehicleModelSerializer,
    VehicleYearSerializer, VehicleSpecificationSerializer,
    VehicleSpecValueSerializer, VehicleSerializer, VehicleImageSerializer,
    VehicleInspectionSerializer, VehiclePriceHistorySerializer,
)


class VehicleCategoryViewSet(TenantAwareViewSet):
    queryset = VehicleCategory.objects.all()
    serializer_class = VehicleCategorySerializer


class VehicleBrandViewSet(TenantAwareViewSet):
    queryset = VehicleBrand.objects.all()
    serializer_class = VehicleBrandSerializer


class VehicleModelViewSet(viewsets.ModelViewSet):
    queryset = VehicleModel.objects.select_related("brand").all()
    serializer_class = VehicleModelSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        brand_id = self.kwargs.get("brand_id")
        if brand_id:
            qs = qs.filter(brand_id=brand_id)
        return qs


class VehicleYearViewSet(viewsets.ModelViewSet):
    queryset = VehicleYear.objects.select_related("model__brand").all()
    serializer_class = VehicleYearSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        model_id = self.kwargs.get("model_id")
        if model_id:
            qs = qs.filter(model_id=model_id)
        return qs


class VehicleSpecificationViewSet(TenantAwareViewSet):
    queryset = VehicleSpecification.objects.all()
    serializer_class = VehicleSpecificationSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        category_id = self.kwargs.get("category_id")
        if category_id:
            qs = qs.filter(category_id=category_id)
        return qs


class VehicleSpecValueViewSet(viewsets.ModelViewSet):
    queryset = VehicleSpecValue.objects.all()
    serializer_class = VehicleSpecValueSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        vehicle_id = self.kwargs.get("vehicle_id")
        if vehicle_id:
            qs = qs.filter(vehicle_id=vehicle_id)
        return qs


class VehicleViewSet(TenantAwareViewSet):
    queryset = Vehicle.objects.select_related(
        "category", "brand", "model", "showroom", "added_by"
    ).all()
    serializer_class = VehicleSerializer

    def perform_create(self, serializer):
        serializer.save(added_by=self.request.user)


class VehicleImageViewSet(viewsets.ModelViewSet):
    queryset = VehicleImage.objects.all()
    serializer_class = VehicleImageSerializer

    def get_queryset(self):
        return super().get_queryset().filter(vehicle_id=self.kwargs["vehicle_id"])


class VehicleInspectionViewSet(viewsets.ModelViewSet):
    queryset = VehicleInspection.objects.all()
    serializer_class = VehicleInspectionSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        vehicle_id = self.kwargs.get("vehicle_id")
        if vehicle_id:
            qs = qs.filter(vehicle_id=vehicle_id)
        return qs

    def perform_create(self, serializer):
        serializer.save(inspector=self.request.user)


class VehiclePriceHistoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = VehiclePriceHistory.objects.all()
    serializer_class = VehiclePriceHistorySerializer

    def get_queryset(self):
        qs = super().get_queryset()
        vehicle_id = self.kwargs.get("vehicle_id")
        if vehicle_id:
            qs = qs.filter(vehicle_id=vehicle_id)
        return qs
