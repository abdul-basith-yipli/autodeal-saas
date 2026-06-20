from django.db import models
from common.models import TimeStampedModel


class Tenant(TimeStampedModel):
    class Tier(models.TextChoices):
        BASIC = "basic", "Basic"
        PROFESSIONAL = "professional", "Professional"
        ENTERPRISE = "enterprise", "Enterprise"

    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    domain = models.CharField(max_length=255, blank=True)
    logo = models.ImageField(upload_to="tenants/logos/", blank=True)
    subscription_tier = models.CharField(max_length=20, choices=Tier.choices, default=Tier.BASIC)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = "tenants_tenant"

    def __str__(self):
        return self.name


class TenantConfig(models.Model):
    tenant = models.OneToOneField(Tenant, on_delete=models.CASCADE, related_name="config")
    currency = models.CharField(max_length=3, default="USD")
    timezone = models.CharField(max_length=50, default="UTC")
    date_format = models.CharField(max_length=20, default="YYYY-MM-DD")

    class Meta:
        db_table = "tenants_tenant_config"

    def __str__(self):
        return f"{self.tenant.name} config"
