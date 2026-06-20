from rest_framework import viewsets
from .models import Customer, Enquiry, FollowUp, CommunicationLog
from .serializers import (
    CustomerSerializer, EnquirySerializer, FollowUpSerializer,
    CommunicationLogSerializer,
)


class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer


class EnquiryViewSet(viewsets.ModelViewSet):
    queryset = Enquiry.objects.all()
    serializer_class = EnquirySerializer


class FollowUpViewSet(viewsets.ModelViewSet):
    queryset = FollowUp.objects.all()
    serializer_class = FollowUpSerializer

    def get_queryset(self):
        return super().get_queryset().filter(enquiry_id=self.kwargs["enquiry_id"])


class CommunicationLogViewSet(viewsets.ModelViewSet):
    queryset = CommunicationLog.objects.all()
    serializer_class = CommunicationLogSerializer

    def get_queryset(self):
        return super().get_queryset().filter(enquiry_id=self.kwargs["enquiry_id"])
