from django.db import models
from common.models import TimeStampedModel, TenantScopedModel


class Position(TenantScopedModel, TimeStampedModel):
    title = models.CharField(max_length=255)
    department = models.ForeignKey(
        "departments.Department",
        on_delete=models.CASCADE,
        related_name="positions",
    )
    level = models.IntegerField(default=1)
    base_salary = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    class Meta:
        db_table = "staff_position"

    def __str__(self):
        return f"{self.department.name} - {self.title}"


class StaffProfile(TenantScopedModel, TimeStampedModel):
    user = models.OneToOneField(
        "accounts.User",
        on_delete=models.CASCADE,
        related_name="staff_profile",
    )
    showroom = models.ForeignKey(
        "showrooms.Showroom",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="staff_members",
    )
    department = models.ForeignKey(
        "departments.Department",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="staff_members",
    )
    position = models.ForeignKey(
        Position,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="staff_members",
    )
    employee_id = models.CharField(max_length=50, blank=True)
    joining_date = models.DateField(null=True, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = "staff_profile"

    def __str__(self):
        return f"{self.user.full_name} ({self.employee_id})"


class PerformanceRecord(TenantScopedModel, TimeStampedModel):
    staff = models.ForeignKey(
        StaffProfile,
        on_delete=models.CASCADE,
        related_name="performance_records",
    )
    period_start = models.DateField()
    period_end = models.DateField()
    metric_name = models.CharField(max_length=100)
    metric_value = models.DecimalField(max_digits=12, decimal_places=2)
    target_value = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)

    class Meta:
        db_table = "staff_performance_record"

    def __str__(self):
        return f"{self.staff} - {self.metric_name}"
