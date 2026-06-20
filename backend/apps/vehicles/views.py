from rest_framework import viewsets
from common.views import TenantAwareViewSet
from .models import (
    VehicleCategory, VehicleBrand, VehicleModel, VehicleYear,
    VehicleSpecification, Vehicle, VehicleImage,
)
from .serializers import (
    VehicleCategorySerializer, VehicleBrandSerializer, VehicleModelSerializer,
    VehicleYearSerializer, VehicleSpecificationSerializer, VehicleSerializer,
    VehicleImageSerializer,
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


class VehicleViewSet(TenantAwareViewSet):
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer


class VehicleImageViewSet(viewsets.ModelViewSet):
    queryset = VehicleImage.objects.all()
    serializer_class = VehicleImageSerializer

    def get_queryset(self):
        return super().get_queryset().filter(vehicle_id=self.kwargs["vehicle_id"])
