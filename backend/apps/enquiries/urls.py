from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CustomerViewSet, EnquiryViewSet, FollowUpViewSet, CommunicationLogViewSet

router = DefaultRouter()
router.register("customers", CustomerViewSet)
router.register("enquiries", EnquiryViewSet)

followup_detail = FollowUpViewSet.as_view({
    "get": "retrieve", "patch": "partial_update", "delete": "destroy",
})
followup_complete = FollowUpViewSet.as_view({
    "post": "complete",
})

urlpatterns = [
    path("", include(router.urls)),
    path("enquiries/<int:enquiry_id>/followups/", FollowUpViewSet.as_view({"get": "list", "post": "create"}), name="followup-list"),
    path("enquiries/<int:enquiry_id>/followups/<int:pk>/", followup_detail, name="followup-detail"),
    path("enquiries/<int:enquiry_id>/followups/<int:pk>/complete/", followup_complete, name="followup-complete"),
    path("enquiries/<int:enquiry_id>/communication-log/", CommunicationLogViewSet.as_view({"get": "list", "post": "create"}), name="communicationlog-list"),
]
