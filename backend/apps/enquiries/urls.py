from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CustomerViewSet, EnquiryViewSet, FollowUpViewSet, CommunicationLogViewSet

router = DefaultRouter()
router.register("customers", CustomerViewSet)
router.register("enquiries", EnquiryViewSet)
router.register(r"enquiries/(?P<enquiry_id>\d+)/followups", FollowUpViewSet)
router.register(r"enquiries/(?P<enquiry_id>\d+)/communication-log", CommunicationLogViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
