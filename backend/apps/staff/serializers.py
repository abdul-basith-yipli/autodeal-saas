from rest_framework import serializers
from .models import StaffProfile, Position, PerformanceRecord


class PositionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Position
        fields = "__all__"


class StaffProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = StaffProfile
        fields = "__all__"


class PerformanceRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = PerformanceRecord
        fields = "__all__"
