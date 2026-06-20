from django.db import models
from common.models import TimeStampedModel, TenantScopedModel


class VehicleCategory(TenantScopedModel, TimeStampedModel):
    name = models.CharField(max_length=255)
    slug = models.SlugField()
    parent = models.ForeignKey(
        "self",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="children",
    )

    class Meta:
        db_table = "vehicles_category"
        unique_together = ["tenant", "slug"]

    def __str__(self):
        return self.name


class VehicleBrand(TenantScopedModel, TimeStampedModel):
    name = models.CharField(max_length=255)
    logo = models.ImageField(upload_to="brands/", blank=True)

    class Meta:
        db_table = "vehicles_brand"

    def __str__(self):
        return self.name


class VehicleModel(models.Model):
    brand = models.ForeignKey(VehicleBrand, on_delete=models.CASCADE, related_name="models")
    name = models.CharField(max_length=255)

    class Meta:
        db_table = "vehicles_model"
        unique_together = ["brand", "name"]

    def __str__(self):
        return f"{self.brand.name} {self.name}"


class VehicleYear(models.Model):
    model = models.ForeignKey(VehicleModel, on_delete=models.CASCADE, related_name="years")
    year = models.IntegerField()

    class Meta:
        db_table = "vehicles_year"
        unique_together = ["model", "year"]

    def __str__(self):
        return f"{self.model} ({self.year})"


class VehicleSpecification(TenantScopedModel):
    category = models.ForeignKey(VehicleCategory, on_delete=models.CASCADE, related_name="specifications")
    name = models.CharField(max_length=255)
    field_type = models.CharField(
        max_length=20,
        choices=[
            ("text", "Text"),
            ("number", "Number"),
            ("boolean", "Boolean"),
            ("select", "Select"),
        ],
        default="text",
    )
    is_required = models.BooleanField(default=False)
    options = models.JSONField(default=list, blank=True)

    class Meta:
        db_table = "vehicles_specification"

    def __str__(self):
        return self.name


class Vehicle(TenantScopedModel, TimeStampedModel):
    class FuelType(models.TextChoices):
        PETROL = "petrol", "Petrol"
        DIESEL = "diesel", "Diesel"
        ELECTRIC = "electric", "Electric"
        HYBRID = "hybrid", "Hybrid"

    class Transmission(models.TextChoices):
        MANUAL = "manual", "Manual"
        AUTOMATIC = "automatic", "Automatic"

    class Condition(models.TextChoices):
        NEW = "new", "New"
        LIKE_NEW = "like_new", "Like New"
        EXCELLENT = "excellent", "Excellent"
        GOOD = "good", "Good"
        FAIR = "fair", "Fair"

    class Status(models.TextChoices):
        AVAILABLE = "available", "Available"
        SOLD = "sold", "Sold"
        RESERVED = "reserved", "Reserved"
        IN_TRANSIT = "in_transit", "In Transit"

    showroom = models.ForeignKey(
        "showrooms.Showroom",
        on_delete=models.CASCADE,
        related_name="vehicles",
    )
    category = models.ForeignKey(VehicleCategory, on_delete=models.SET_NULL, null=True, related_name="vehicles")
    brand = models.ForeignKey(VehicleBrand, on_delete=models.SET_NULL, null=True, related_name="vehicles")
    model = models.ForeignKey(VehicleModel, on_delete=models.SET_NULL, null=True, related_name="vehicles")
    year = models.IntegerField()
    vin = models.CharField(max_length=50, unique=True)
    reg_number = models.CharField(max_length=50, blank=True)
    mileage = models.IntegerField(default=0)
    fuel_type = models.CharField(max_length=20, choices=FuelType.choices)
    transmission = models.CharField(max_length=20, choices=Transmission.choices)
    color = models.CharField(max_length=50, blank=True)
    condition = models.CharField(max_length=20, choices=Condition.choices)
    price = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.AVAILABLE)
    description = models.TextField(blank=True)
    added_by = models.ForeignKey(
        "accounts.User",
        on_delete=models.SET_NULL,
        null=True,
        related_name="added_vehicles",
    )

    class Meta:
        db_table = "vehicles_vehicle"

    def __str__(self):
        return f"{self.brand} {self.model} ({self.year}) - {self.vin}"


class VehicleSpecValue(models.Model):
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, related_name="spec_values")
    specification = models.ForeignKey(VehicleSpecification, on_delete=models.CASCADE)
    value = models.JSONField()

    class Meta:
        db_table = "vehicles_spec_value"
        unique_together = ["vehicle", "specification"]


class VehicleImage(models.Model):
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, related_name="images")
    image = models.ImageField(upload_to="vehicles/")
    is_primary = models.BooleanField(default=False)
    sort_order = models.IntegerField(default=0)

    class Meta:
        db_table = "vehicles_image"
        ordering = ["sort_order"]


class VehicleInspection(TimeStampedModel):
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, related_name="inspections")
    inspector = models.ForeignKey(
        "accounts.User",
        on_delete=models.SET_NULL,
        null=True,
        related_name="inspections",
    )
    report = models.TextField()
    rating = models.IntegerField()

    class Meta:
        db_table = "vehicles_inspection"


class VehiclePriceHistory(TimeStampedModel):
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, related_name="price_history")
    old_price = models.DecimalField(max_digits=12, decimal_places=2)
    new_price = models.DecimalField(max_digits=12, decimal_places=2)
    changed_by = models.ForeignKey(
        "accounts.User",
        on_delete=models.SET_NULL,
        null=True,
    )

    class Meta:
        db_table = "vehicles_price_history"
