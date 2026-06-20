from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Notification
from .serializers import NotificationSerializer


class NotificationViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = NotificationSerializer

    def get_queryset(self):
        return Notification.objects.filter(recipient=self.request.user)

    @action(detail=True, methods=["patch"])
    def read(self, request, pk=None):
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        return Response(NotificationSerializer(notification).data)
