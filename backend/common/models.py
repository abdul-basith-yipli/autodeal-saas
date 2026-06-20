from django.db import models


class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class TenantScopedModel(models.Model):
    tenant = models.ForeignKey(
        "tenants.Tenant",
        on_delete=models.CASCADE,
        related_name="%(class)s_set",
    )

    class Meta:
        abstract = True

    @property
    def tenant_id(self):
        return self.tenant_id
