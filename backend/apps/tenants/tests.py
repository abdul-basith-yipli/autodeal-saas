import pytest
from django.urls import reverse
from apps.tenants.models import Tenant


@pytest.mark.django_db
class TestTenantAPI:
    def test_list_tenants_as_super_admin(self, super_admin_client, tenant):
        url = reverse("tenant-list")
        response = super_admin_client.get(url)
        assert response.status_code == 200
        assert len(response.data["results"]) == 1

    def test_list_tenants_as_tenant_admin(self, auth_client, tenant):
        url = reverse("tenant-list")
        response = auth_client.get(url)
        assert response.status_code == 200
        assert response.data["results"][0]["id"] == tenant.id

    def test_create_tenant(self, super_admin_client):
        url = reverse("tenant-list")
        data = {"name": "New Dealer", "slug": "new-dealer"}
        response = super_admin_client.post(url, data)
        assert response.status_code == 201
        assert response.data["slug"] == "new-dealer"

    def test_unauthenticated_access(self, api_client):
        url = reverse("tenant-list")
        response = api_client.get(url)
        assert response.status_code == 401
