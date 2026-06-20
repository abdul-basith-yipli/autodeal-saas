from common.views import TenantAwareViewSet
from .models import Customer, Enquiry, FollowUp, CommunicationLog
from .serializers import (
    CustomerSerializer, EnquirySerializer, FollowUpSerializer,
    CommunicationLogSerializer,
)


class CustomerViewSet(TenantAwareViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer


class EnquiryViewSet(TenantAwareViewSet):
    queryset = Enquiry.objects.all()
    serializer_class = EnquirySerializer


class FollowUpViewSet(TenantAwareViewSet):
    queryset = FollowUp.objects.all()
    serializer_class = FollowUpSerializer

    def get_queryset(self):
        return super().get_queryset().filter(enquiry_id=self.kwargs["enquiry_id"])


class CommunicationLogViewSet(TenantAwareViewSet):
    queryset = CommunicationLog.objects.all()
    serializer_class = CommunicationLogSerializer

    def get_queryset(self):
        return super().get_queryset().filter(enquiry_id=self.kwargs["enquiry_id"])
