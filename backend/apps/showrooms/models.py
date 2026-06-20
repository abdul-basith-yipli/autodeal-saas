from django.db import models
from common.models import TimeStampedModel, TenantScopedModel


class Showroom(TenantScopedModel, TimeStampedModel):
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=20)
    address = models.TextField(blank=True)
    phone = models.CharField(max_length=20, blank=True)
    email = models.EmailField(blank=True)
    manager = models.ForeignKey(
        "accounts.User",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="managed_showrooms",
    )
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = "showrooms_showroom"
        unique_together = ["tenant", "code"]

    def __str__(self):
        return f"{self.tenant.name} - {self.name}"


class ShowroomPerformance(TenantScopedModel, TimeStampedModel):
    showroom = models.ForeignKey(Showroom, on_delete=models.CASCADE, related_name="performance_records")
    period = models.DateField()
    metrics = models.JSONField(default=dict)

    class Meta:
        db_table = "showrooms_performance"
        unique_together = ["showroom", "period"]

    def __str__(self):
        return f"{self.showroom.name} - {self.period}"
