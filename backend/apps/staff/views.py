from common.views import TenantAwareViewSet
from .models import StaffProfile, Position, PerformanceRecord
from .serializers import StaffProfileSerializer, PositionSerializer, PerformanceRecordSerializer


class StaffProfileViewSet(TenantAwareViewSet):
    queryset = StaffProfile.objects.all()
    serializer_class = StaffProfileSerializer


class PositionViewSet(TenantAwareViewSet):
    queryset = Position.objects.all()
    serializer_class = PositionSerializer


class PerformanceRecordViewSet(TenantAwareViewSet):
    queryset = PerformanceRecord.objects.all()
    serializer_class = PerformanceRecordSerializer

    def get_queryset(self):
        return super().get_queryset().filter(staff_id=self.kwargs["staff_id"])
