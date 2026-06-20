from common.views import TenantAwareViewSet
from .models import Sale
from .serializers import SaleSerializer


class SaleViewSet(TenantAwareViewSet):
    queryset = Sale.objects.all()
    serializer_class = SaleSerializer
