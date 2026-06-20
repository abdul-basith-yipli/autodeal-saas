from django.db import models
from common.models import TimeStampedModel, TenantScopedModel


class Department(TenantScopedModel, TimeStampedModel):
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=20)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = "departments_department"
        unique_together = ["tenant", "code"]

    def __str__(self):
        return f"{self.tenant.name} - {self.name}"
