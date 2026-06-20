from rest_framework import serializers
from .models import Sale, SaleDocument, Commission


class SaleDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = SaleDocument
        fields = "__all__"


class CommissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Commission
        fields = "__all__"


class SaleSerializer(serializers.ModelSerializer):
    documents = SaleDocumentSerializer(many=True, read_only=True)
    commissions = CommissionSerializer(many=True, read_only=True)

    class Meta:
        model = Sale
        fields = "__all__"
