from rest_framework import serializers
from .models import Showroom, ShowroomPerformance


class ShowroomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Showroom
        fields = "__all__"


class ShowroomPerformanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShowroomPerformance
        fields = "__all__"
