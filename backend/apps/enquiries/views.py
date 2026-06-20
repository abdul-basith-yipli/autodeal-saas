from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
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
        qs = super().get_queryset()
        enquiry_id = self.kwargs.get("enquiry_id")
        if enquiry_id:
            qs = qs.filter(enquiry_id=enquiry_id)
        return qs

    @action(detail=True, methods=["post"])
    def complete(self, request, pk=None, enquiry_id=None):
        followup = self.get_object()
        followup.status = FollowUp.Status.COMPLETED
        followup.completed_at = timezone.now()
        followup.save()
        return Response(FollowUpSerializer(followup).data)


class CommunicationLogViewSet(TenantAwareViewSet):
    queryset = CommunicationLog.objects.all()
    serializer_class = CommunicationLogSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        enquiry_id = self.kwargs.get("enquiry_id")
        if enquiry_id:
            qs = qs.filter(enquiry_id=enquiry_id)
        return qs
