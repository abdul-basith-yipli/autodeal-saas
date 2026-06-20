import pytest
from django.urls import reverse
from apps.showrooms.models import Showroom


@pytest.mark.django_db
class TestShowroomAPI:
    def test_list_showrooms(self, auth_client, tenant):
        Showroom.objects.create(tenant=tenant, name="Downtown", code="DT")
        url = reverse("showroom-list")
        response = auth_client.get(url)
        assert response.status_code == 200
        assert len(response.data["results"]) == 1

    def test_create_showroom(self, auth_client, tenant):
        url = reverse("showroom-list")
        data = {"name": "Uptown", "code": "UT", "tenant": tenant.id}
        response = auth_client.post(url, data)
        assert response.status_code == 201

    def test_tenant_isolation(self, auth_client, tenant):
        other_tenant = type(tenant).objects.create(name="Other", slug="other")
        Showroom.objects.create(tenant=other_tenant, name="Other Branch", code="OB")
        url = reverse("showroom-list")
        response = auth_client.get(url)
        assert len(response.data["results"]) == 0

    def test_retrieve_showroom(self, auth_client, tenant):
        showroom = Showroom.objects.create(tenant=tenant, name="Downtown", code="DT")
        url = reverse("showroom-detail", args=[showroom.id])
        response = auth_client.get(url)
        assert response.status_code == 200
        assert response.data["name"] == "Downtown"
