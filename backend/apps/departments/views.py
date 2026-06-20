from common.views import TenantAwareViewSet
from .models import Department
from .serializers import DepartmentSerializer


class DepartmentViewSet(TenantAwareViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
