from rest_framework import viewsets, permissions
from .models import Tenant
from .serializers import TenantSerializer


class TenantViewSet(viewsets.ModelViewSet):
    queryset = Tenant.objects.all()
    serializer_class = TenantSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        user = self.request.user
        if user.is_authenticated and user.role != "super_admin":
            return qs.filter(id=user.tenant_id)
        return qs
