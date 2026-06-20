from rest_framework import viewsets
from .models import (
    VehicleCategory, VehicleBrand, VehicleModel, VehicleYear,
    VehicleSpecification, Vehicle, VehicleImage,
)
from .serializers import (
    VehicleCategorySerializer, VehicleBrandSerializer, VehicleModelSerializer,
    VehicleYearSerializer, VehicleSpecificationSerializer, VehicleSerializer,
    VehicleImageSerializer,
)


class VehicleCategoryViewSet(viewsets.ModelViewSet):
    queryset = VehicleCategory.objects.all()
    serializer_class = VehicleCategorySerializer


class VehicleBrandViewSet(viewsets.ModelViewSet):
    queryset = VehicleBrand.objects.all()
    serializer_class = VehicleBrandSerializer


class VehicleModelViewSet(viewsets.ModelViewSet):
    queryset = VehicleModel.objects.all()
    serializer_class = VehicleModelSerializer


class VehicleYearViewSet(viewsets.ModelViewSet):
    queryset = VehicleYear.objects.all()
    serializer_class = VehicleYearSerializer


class VehicleSpecificationViewSet(viewsets.ModelViewSet):
    queryset = VehicleSpecification.objects.all()
    serializer_class = VehicleSpecificationSerializer


class VehicleViewSet(viewsets.ModelViewSet):
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer


class VehicleImageViewSet(viewsets.ModelViewSet):
    queryset = VehicleImage.objects.all()
    serializer_class = VehicleImageSerializer

    def get_queryset(self):
        return super().get_queryset().filter(vehicle_id=self.kwargs["vehicle_id"])
