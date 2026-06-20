from common.views import TenantAwareViewSet
from .models import Showroom, ShowroomPerformance
from .serializers import ShowroomSerializer, ShowroomPerformanceSerializer


class ShowroomViewSet(TenantAwareViewSet):
    queryset = Showroom.objects.all()
    serializer_class = ShowroomSerializer


class ShowroomPerformanceViewSet(TenantAwareViewSet):
    queryset = ShowroomPerformance.objects.all()
    serializer_class = ShowroomPerformanceSerializer

    def get_queryset(self):
        return super().get_queryset().filter(showroom_id=self.kwargs["showroom_id"])
