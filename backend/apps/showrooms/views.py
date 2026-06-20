from rest_framework import viewsets
from .models import Showroom, ShowroomPerformance
from .serializers import ShowroomSerializer, ShowroomPerformanceSerializer


class ShowroomViewSet(viewsets.ModelViewSet):
    queryset = Showroom.objects.all()
    serializer_class = ShowroomSerializer


class ShowroomPerformanceViewSet(viewsets.ModelViewSet):
    queryset = ShowroomPerformance.objects.all()
    serializer_class = ShowroomPerformanceSerializer
