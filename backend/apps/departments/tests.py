import pytest
from django.urls import reverse
from apps.departments.models import Department


@pytest.mark.django_db
class TestDepartmentAPI:
    def test_list_departments(self, auth_client, tenant):
        Department.objects.create(tenant=tenant, name="Sales", code="SALES")
        url = reverse("department-list")
        response = auth_client.get(url)
        assert response.status_code == 200
        assert len(response.data["results"]) == 1

    def test_create_department(self, auth_client, tenant):
        url = reverse("department-list")
        data = {"name": "Service", "code": "SRV", "tenant": tenant.id}
        response = auth_client.post(url, data)
        assert response.status_code == 201

    def test_tenant_isolation(self, auth_client, tenant):
        other = type(tenant).objects.create(name="Other", slug="other")
        Department.objects.create(tenant=other, name="Other Dept", code="OT")
        url = reverse("department-list")
        response = auth_client.get(url)
        assert len(response.data["results"]) == 0
