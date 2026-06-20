from rest_framework import serializers
from .models import (
    VehicleCategory, VehicleBrand, VehicleModel, VehicleYear,
    VehicleSpecification, VehicleSpecValue, Vehicle, VehicleImage,
    VehicleInspection, VehiclePriceHistory,
)


class VehicleCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = VehicleCategory
        fields = "__all__"


class VehicleBrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = VehicleBrand
        fields = "__all__"


class VehicleModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = VehicleModel
        fields = "__all__"


class VehicleYearSerializer(serializers.ModelSerializer):
    class Meta:
        model = VehicleYear
        fields = "__all__"


class VehicleSpecificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = VehicleSpecification
        fields = "__all__"


class VehicleSpecValueSerializer(serializers.ModelSerializer):
    class Meta:
        model = VehicleSpecValue
        fields = "__all__"


class VehicleImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = VehicleImage
        fields = "__all__"


class VehicleSerializer(serializers.ModelSerializer):
    images = VehicleImageSerializer(many=True, read_only=True)
    spec_values = VehicleSpecValueSerializer(many=True, read_only=True)

    class Meta:
        model = Vehicle
        fields = "__all__"
