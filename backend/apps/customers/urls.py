from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import WishlistViewSet, BookingViewSet, PaymentViewSet

router = DefaultRouter()
router.register("wishlist", WishlistViewSet, basename="wishlist")
router.register("bookings", BookingViewSet, basename="booking")
router.register("payments", PaymentViewSet, basename="payment")

urlpatterns = [
    path("", include(router.urls)),
]
