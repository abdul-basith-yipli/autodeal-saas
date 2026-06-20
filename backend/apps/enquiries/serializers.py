from rest_framework import serializers
from .models import Customer, Enquiry, FollowUp, CommunicationLog


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = "__all__"


class FollowUpSerializer(serializers.ModelSerializer):
    class Meta:
        model = FollowUp
        fields = "__all__"


class CommunicationLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommunicationLog
        fields = "__all__"


class EnquirySerializer(serializers.ModelSerializer):
    followups = FollowUpSerializer(many=True, read_only=True)
    communication_logs = CommunicationLogSerializer(many=True, read_only=True)

    class Meta:
        model = Enquiry
        fields = "__all__"
