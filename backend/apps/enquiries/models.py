from django.db import models
from common.models import TimeStampedModel, TenantScopedModel


class Customer(TenantScopedModel, TimeStampedModel):
    name = models.CharField(max_length=255)
    phone = models.CharField(max_length=20)
    email = models.EmailField(blank=True)
    address = models.TextField(blank=True)
    city = models.CharField(max_length=100, blank=True)
    state = models.CharField(max_length=100, blank=True)
    source = models.CharField(max_length=50, blank=True)

    class Meta:
        db_table = "enquiries_customer"

    def __str__(self):
        return f"{self.name} ({self.phone})"


class Enquiry(TenantScopedModel, TimeStampedModel):
    class Status(models.TextChoices):
        NEW = "new", "New"
        CONTACTED = "contacted", "Contacted"
        QUALIFIED = "qualified", "Qualified"
        NEGOTIATION = "negotiation", "Negotiation"
        CLOSED_WON = "closed_won", "Closed Won"
        CLOSED_LOST = "closed_lost", "Closed Lost"

    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name="enquiries")
    vehicle = models.ForeignKey(
        "vehicles.Vehicle",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="enquiries",
    )
    showroom = models.ForeignKey(
        "showrooms.Showroom",
        on_delete=models.CASCADE,
        related_name="enquiries",
    )
    assigned_to = models.ForeignKey(
        "accounts.User",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="assigned_enquiries",
    )
    source = models.CharField(max_length=50, blank=True)
    message = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.NEW)
    expected_budget = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)

    class Meta:
        db_table = "enquiries_enquiry"

    def __str__(self):
        return f"{self.customer.name} - {self.status}"


class FollowUp(TenantScopedModel, TimeStampedModel):
    class Type(models.TextChoices):
        CALL = "call", "Call"
        EMAIL = "email", "Email"
        VISIT = "visit", "Visit"
        TEST_DRIVE = "test_drive", "Test Drive"

    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        COMPLETED = "completed", "Completed"
        CANCELLED = "cancelled", "Cancelled"

    enquiry = models.ForeignKey(Enquiry, on_delete=models.CASCADE, related_name="followups")
    assigned_to = models.ForeignKey(
        "accounts.User",
        on_delete=models.SET_NULL,
        null=True,
        related_name="followups",
    )
    note = models.TextField(blank=True)
    followup_type = models.CharField(max_length=20, choices=Type.choices, default=Type.CALL)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    scheduled_at = models.DateTimeField()
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "enquiries_followup"

    def __str__(self):
        return f"Follow-up for {self.enquiry} - {self.scheduled_at}"


class CommunicationLog(TenantScopedModel, TimeStampedModel):
    enquiry = models.ForeignKey(Enquiry, on_delete=models.CASCADE, related_name="communication_logs")
    staff = models.ForeignKey(
        "accounts.User",
        on_delete=models.SET_NULL,
        null=True,
        related_name="communication_logs",
    )
    note = models.TextField()
    attachment = models.FileField(upload_to="communications/", blank=True)

    class Meta:
        db_table = "enquiries_communication_log"

    def __str__(self):
        return f"Log for {self.enquiry} by {self.staff}"
