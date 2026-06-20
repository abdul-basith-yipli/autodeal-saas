from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CustomerViewSet, EnquiryViewSet, FollowUpViewSet, CommunicationLogViewSet

router = DefaultRouter()
router.register("customers", CustomerViewSet)
router.register("enquiries", EnquiryViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path("enquiries/<int:enquiry_id>/followups/", FollowUpViewSet.as_view({"get": "list", "post": "create"})),
    path("enquiries/<int:enquiry_id>/communication-log/", CommunicationLogViewSet.as_view({"get": "list", "post": "create"})),
]
