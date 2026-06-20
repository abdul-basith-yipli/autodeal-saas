from rest_framework import viewsets
from .models import StaffProfile, Position, PerformanceRecord
from .serializers import StaffProfileSerializer, PositionSerializer, PerformanceRecordSerializer


class StaffProfileViewSet(viewsets.ModelViewSet):
    queryset = StaffProfile.objects.all()
    serializer_class = StaffProfileSerializer


class PositionViewSet(viewsets.ModelViewSet):
    queryset = Position.objects.all()
    serializer_class = PositionSerializer


class PerformanceRecordViewSet(viewsets.ModelViewSet):
    queryset = PerformanceRecord.objects.all()
    serializer_class = PerformanceRecordSerializer

    def get_queryset(self):
        return super().get_queryset().filter(staff_id=self.kwargs["staff_id"])
