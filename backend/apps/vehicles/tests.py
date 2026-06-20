import pytest
from django.urls import reverse
from apps.vehicles.models import VehicleBrand, VehicleModel, VehicleYear


@pytest.mark.django_db
class TestBrandAPI:
    def test_list_brands(self, auth_client, tenant):
        VehicleBrand.objects.create(tenant=tenant, name="Toyota")
        url = reverse("vehiclebrand-list")
        response = auth_client.get(url)
        assert response.status_code == 200
        assert len(response.data["results"]) == 1

    def test_create_brand(self, auth_client, tenant):
        url = reverse("vehiclebrand-list")
        data = {"name": "Honda", "tenant": tenant.id}
        response = auth_client.post(url, data)
        assert response.status_code == 201
        assert response.data["name"] == "Honda"

    def test_tenant_isolation(self, auth_client, tenant):
        other = type(tenant).objects.create(name="Other", slug="other")
        VehicleBrand.objects.create(tenant=other, name="BMW")
        url = reverse("vehiclebrand-list")
        response = auth_client.get(url)
        assert len(response.data["results"]) == 0


@pytest.mark.django_db
class TestVehicleModelAPI:
    def test_list_models_by_brand(self, auth_client, tenant):
        brand = VehicleBrand.objects.create(tenant=tenant, name="Toyota")
        VehicleModel.objects.create(brand=brand, name="Camry")
        url = reverse("vehiclemodel-list", args=[brand.id])
        response = auth_client.get(url)
        assert response.status_code == 200
        assert len(response.data["results"]) == 1
        assert response.data["results"][0]["name"] == "Camry"

    def test_create_model(self, auth_client, tenant):
        brand = VehicleBrand.objects.create(tenant=tenant, name="Honda")
        url = reverse("vehiclemodel-list", args=[brand.id])
        data = {"brand": brand.id, "name": "Civic"}
        response = auth_client.post(url, data)
        assert response.status_code == 201


@pytest.mark.django_db
class TestVehicleYearAPI:
    def test_list_years_by_model(self, auth_client, tenant):
        brand = VehicleBrand.objects.create(tenant=tenant, name="Toyota")
        model = VehicleModel.objects.create(brand=brand, name="Camry")
        VehicleYear.objects.create(model=model, year=2024)
        url = reverse("vehicleyear-list", args=[model.id])
        response = auth_client.get(url)
        assert response.status_code == 200
        assert len(response.data["results"]) == 1
        assert response.data["results"][0]["year"] == 2024

    def test_create_year(self, auth_client, tenant):
        brand = VehicleBrand.objects.create(tenant=tenant, name="Honda")
        model = VehicleModel.objects.create(brand=brand, name="Accord")
        url = reverse("vehicleyear-list", args=[model.id])
        data = {"model": model.id, "year": 2025}
        response = auth_client.post(url, data)
        assert response.status_code == 201
