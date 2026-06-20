from django.db import models
from common.models import TimeStampedModel


class Notification(TimeStampedModel):
    recipient = models.ForeignKey(
        "accounts.User",
        on_delete=models.CASCADE,
        related_name="notifications",
    )
    title = models.CharField(max_length=255)
    message = models.TextField()
    notification_type = models.CharField(max_length=50, blank=True)
    is_read = models.BooleanField(default=False)
    link = models.CharField(max_length=500, blank=True)

    class Meta:
        db_table = "notifications_notification"
        ordering = ["-created_at"]

    def __str__(self):
        return self.title
