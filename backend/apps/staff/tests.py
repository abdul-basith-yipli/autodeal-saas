import pytest
from django.urls import reverse
from apps.staff.models import StaffProfile, Position


@pytest.mark.django_db
class TestStaffAPI:
    def test_list_staff(self, auth_client, tenant, tenant_admin):
        StaffProfile.objects.create(
            tenant=tenant,
            user=tenant_admin,
            employee_id="EMP001",
        )
        url = reverse("staffprofile-list")
        response = auth_client.get(url)
        assert response.status_code == 200
        assert len(response.data["results"]) == 1

    def test_create_staff(self, auth_client, tenant, tenant_admin):
        url = reverse("staffprofile-list")
        data = {
            "user": tenant_admin.id,
            "tenant": tenant.id,
            "employee_id": "EMP002",
        }
        response = auth_client.post(url, data)
        assert response.status_code == 201

    def test_tenant_isolation(self, auth_client, tenant, tenant_admin):
        other = type(tenant).objects.create(name="Other", slug="other")
        StaffProfile.objects.create(tenant=other, user=tenant_admin, employee_id="EMP999")
        url = reverse("staffprofile-list")
        response = auth_client.get(url)
        assert len(response.data["results"]) == 0


@pytest.mark.django_db
class TestPositionAPI:
    def test_create_position(self, auth_client, tenant):
        from apps.departments.models import Department
        dept = Department.objects.create(tenant=tenant, name="Sales", code="SALES")
        url = reverse("position-list")
        data = {"title": "Sales Rep", "department": dept.id, "tenant": tenant.id}
        response = auth_client.post(url, data)
        assert response.status_code == 201
