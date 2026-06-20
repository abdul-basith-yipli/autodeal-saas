from rest_framework import serializers
from .models import Tenant, TenantConfig


class TenantConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = TenantConfig
        fields = ["currency", "timezone", "date_format"]


class TenantSerializer(serializers.ModelSerializer):
    config = TenantConfigSerializer(read_only=True)

    class Meta:
        model = Tenant
        fields = "__all__"
