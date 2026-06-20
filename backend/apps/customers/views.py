from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from apps.vehicles.models import Vehicle
from .models import Wishlist, Booking, Payment
from .serializers import WishlistSerializer, BookingSerializer, PaymentSerializer


class IsCustomer(permissions.BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == "customer"
        )


class WishlistViewSet(viewsets.ModelViewSet):
    serializer_class = WishlistSerializer
    permission_classes = [IsCustomer]

    def get_queryset(self):
        return Wishlist.objects.filter(customer=self.request.user).select_related(
            "vehicle__category", "vehicle__brand", "vehicle__model"
        )

    def perform_create(self, serializer):
        serializer.save(customer=self.request.user)

    @action(detail=False, methods=["post"])
    def toggle(self, request):
        vehicle_id = request.data.get("vehicle_id")
        vehicle = get_object_or_404(Vehicle, id=vehicle_id)
        item, created = Wishlist.objects.get_or_create(
            customer=request.user, vehicle=vehicle
        )
        if not created:
            item.delete()
            return Response({"wishlisted": False}, status=status.HTTP_200_OK)
        return Response(
            WishlistSerializer(item).data, status=status.HTTP_201_CREATED
        )


class BookingViewSet(viewsets.ModelViewSet):
    serializer_class = BookingSerializer
    permission_classes = [IsCustomer]

    def get_queryset(self):
        return Booking.objects.filter(customer=self.request.user).select_related(
            "vehicle__category", "vehicle__brand", "vehicle__model"
        )

    def perform_create(self, serializer):
        serializer.save(customer=self.request.user)

    @action(detail=True, methods=["post"])
    def cancel(self, request, pk=None):
        booking = self.get_object()
        booking.status = Booking.Status.CANCELLED
        booking.save()
        return Response(BookingSerializer(booking).data)

    @action(detail=True, methods=["post"])
    def pay(self, request, pk=None):
        booking = self.get_object()
        if booking.status != Booking.Status.PENDING:
            return Response(
                {"detail": "Only pending bookings can be paid"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if hasattr(booking, "payment"):
            return Response(
                {"detail": "Payment already exists for this booking"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        payment = Payment.objects.create(
            booking=booking,
            amount=request.data.get("amount", 0),
            method=request.data.get("method", Payment.Method.CARD),
            status=Payment.Status.COMPLETED,
            transaction_id=request.data.get("transaction_id", ""),
        )
        booking.status = Booking.Status.CONFIRMED
        booking.save()
        return Response(PaymentSerializer(payment).data, status=status.HTTP_201_CREATED)


class PaymentViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = PaymentSerializer
    permission_classes = [IsCustomer]

    def get_queryset(self):
        return Payment.objects.filter(booking__customer=self.request.user)
