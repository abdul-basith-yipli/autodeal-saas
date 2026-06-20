from django.db import models
from common.models import TimeStampedModel, TenantScopedModel


class Sale(TenantScopedModel, TimeStampedModel):
    class PaymentMethod(models.TextChoices):
        CASH = "cash", "Cash"
        FINANCE = "finance", "Finance"
        LEASE = "lease", "Lease"
        BANK_TRANSFER = "bank_transfer", "Bank Transfer"

    class PaymentStatus(models.TextChoices):
        PENDING = "pending", "Pending"
        PARTIAL = "partial", "Partial"
        PAID = "paid", "Paid"
        REFUNDED = "refunded", "Refunded"

    showroom = models.ForeignKey(
        "showrooms.Showroom",
        on_delete=models.CASCADE,
        related_name="sales",
    )
    vehicle = models.ForeignKey(
        "vehicles.Vehicle",
        on_delete=models.CASCADE,
        related_name="sales",
    )
    customer = models.ForeignKey(
        "enquiries.Customer",
        on_delete=models.CASCADE,
        related_name="sales",
    )
    sales_staff = models.ForeignKey(
        "accounts.User",
        on_delete=models.SET_NULL,
        null=True,
        related_name="sales",
    )
    sale_price = models.DecimalField(max_digits=12, decimal_places=2)
    tax = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    fees = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total_amount = models.DecimalField(max_digits=12, decimal_places=2)
    payment_method = models.CharField(max_length=20, choices=PaymentMethod.choices)
    payment_status = models.CharField(max_length=20, choices=PaymentStatus.choices, default=PaymentStatus.PENDING)
    sale_date = models.DateField()
    delivery_date = models.DateField(null=True, blank=True)

    class Meta:
        db_table = "sales_sale"

    def __str__(self):
        return f"Sale {self.id} - {self.vehicle}"


class SaleDocument(TenantScopedModel):
    sale = models.ForeignKey(Sale, on_delete=models.CASCADE, related_name="documents")
    document_type = models.CharField(max_length=50)
    file = models.FileField(upload_to="sales/documents/")
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "sales_document"


class Commission(TenantScopedModel):
    sale = models.ForeignKey(Sale, on_delete=models.CASCADE, related_name="commissions")
    staff = models.ForeignKey(
        "accounts.User",
        on_delete=models.CASCADE,
        related_name="commissions",
    )
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    paid = models.BooleanField(default=False)

    class Meta:
        db_table = "sales_commission"
