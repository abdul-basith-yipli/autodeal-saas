from rest_framework import serializers
from .models import Wishlist, Booking, Payment


class WishlistSerializer(serializers.ModelSerializer):
    vehicle_details = serializers.SerializerMethodField()

    class Meta:
        model = Wishlist
        fields = ["id", "customer", "vehicle", "vehicle_details", "created_at"]
        read_only_fields = ["id", "customer", "created_at"]

    def get_vehicle_details(self, obj):
        from apps.vehicles.serializers import VehicleSerializer
        return VehicleSerializer(obj.vehicle).data


class BookingSerializer(serializers.ModelSerializer):
    vehicle_details = serializers.SerializerMethodField()
    payment = serializers.SerializerMethodField()

    class Meta:
        model = Booking
        fields = [
            "id", "customer", "vehicle", "vehicle_details",
            "status", "message", "payment", "created_at", "updated_at",
        ]
        read_only_fields = ["id", "customer", "status", "created_at", "updated_at"]

    def get_vehicle_details(self, obj):
        from apps.vehicles.serializers import VehicleSerializer
        return VehicleSerializer(obj.vehicle).data

    def get_payment(self, obj):
        if hasattr(obj, "payment"):
            return PaymentSerializer(obj.payment).data
        return None


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = [
            "id", "booking", "amount", "method",
            "status", "transaction_id", "created_at",
        ]
        read_only_fields = ["id", "booking", "status", "created_at"]
