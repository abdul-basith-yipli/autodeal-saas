import pytest
from django.urls import reverse
from apps.vehicles.models import (
    VehicleCategory, VehicleBrand, VehicleModel, VehicleYear,
    VehicleSpecification, Vehicle, VehicleSpecValue,
    VehicleImage, VehicleInspection, VehiclePriceHistory,
)


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


@pytest.mark.django_db
class TestCategoryAPI:
    def test_create_category(self, auth_client, tenant):
        url = reverse("vehiclecategory-list")
        data = {"name": "SUV", "slug": "suv", "tenant": tenant.id}
        response = auth_client.post(url, data)
        assert response.status_code == 201

    def test_list_categories(self, auth_client, tenant):
        VehicleCategory.objects.create(tenant=tenant, name="Sedan", slug="sedan")
        url = reverse("vehiclecategory-list")
        response = auth_client.get(url)
        assert len(response.data["results"]) == 1


@pytest.mark.django_db
class TestSpecificationAPI:
    def test_list_specs_by_category(self, auth_client, tenant):
        cat = VehicleCategory.objects.create(tenant=tenant, name="SUV", slug="suv")
        VehicleSpecification.objects.create(
            tenant=tenant, category=cat, name="Engine", field_type="text"
        )
        url = reverse("vehiclespecification-list", args=[cat.id])
        response = auth_client.get(url)
        assert response.status_code == 200
        assert len(response.data["results"]) == 1
        assert response.data["results"][0]["name"] == "Engine"

    def test_create_spec(self, auth_client, tenant):
        cat = VehicleCategory.objects.create(tenant=tenant, name="SUV", slug="suv")
        url = reverse("vehiclespecification-list", args=[cat.id])
        data = {
            "name": "Horsepower", "field_type": "number",
            "category": cat.id, "tenant": tenant.id,
        }
        response = auth_client.post(url, data)
        assert response.status_code == 201


@pytest.mark.django_db
class TestSpecValueAPI:
    def test_create_spec_value(self, auth_client, tenant, showroom):
        cat = VehicleCategory.objects.create(tenant=tenant, name="SUV", slug="suv")
        brand = VehicleBrand.objects.create(tenant=tenant, name="Toyota")
        vehicle = Vehicle.objects.create(
            tenant=tenant, showroom=showroom, category=cat, brand=brand,
            year=2024, vin="TEST123", mileage=0, fuel_type="petrol",
            transmission="automatic", condition="new", price=30000,
        )
        spec = VehicleSpecification.objects.create(
            tenant=tenant, category=cat, name="Color", field_type="text",
        )
        url = reverse("vehiclespecvalue-list", args=[vehicle.id])
        data = {
            "vehicle": vehicle.id, "specification": spec.id, "value": "Red",
        }
        response = auth_client.post(url, data)
        assert response.status_code == 201

    def test_list_spec_values(self, auth_client, tenant, showroom):
        cat = VehicleCategory.objects.create(tenant=tenant, name="SUV", slug="suv")
        brand = VehicleBrand.objects.create(tenant=tenant, name="Toyota")
        vehicle = Vehicle.objects.create(
            tenant=tenant, showroom=showroom, category=cat, brand=brand,
            year=2024, vin="TEST456", mileage=0, fuel_type="petrol",
            transmission="automatic", condition="new", price=30000,
        )
        url = reverse("vehiclespecvalue-list", args=[vehicle.id])
        response = auth_client.get(url)
        assert response.status_code == 200


def _create_vehicle(tenant, showroom, vin="VEHICLE1"):
    cat = VehicleCategory.objects.create(tenant=tenant, name="SUV", slug="suv")
    brand = VehicleBrand.objects.create(tenant=tenant, name="Toyota")
    return Vehicle.objects.create(
        tenant=tenant, showroom=showroom, category=cat, brand=brand,
        year=2024, vin=vin, mileage=1000, fuel_type="petrol",
        transmission="automatic", condition="good", price=25000,
        status="available",
    )


@pytest.mark.django_db
class TestVehicleCRUD:
    def test_create_vehicle(self, auth_client, tenant, showroom):
        url = reverse("vehicle-list")
        data = {
            "showroom": showroom.id, "year": 2024, "vin": "NEWVIN001",
            "mileage": 500, "fuel_type": "petrol", "transmission": "automatic",
            "condition": "new", "price": 30000, "tenant": tenant.id,
        }
        response = auth_client.post(url, data)
        assert response.status_code == 201
        assert response.data["vin"] == "NEWVIN001"

    def test_list_vehicles(self, auth_client, tenant, showroom):
        _create_vehicle(tenant, showroom)
        url = reverse("vehicle-list")
        response = auth_client.get(url)
        assert response.status_code == 200

    def test_retrieve_vehicle(self, auth_client, tenant, showroom):
        vehicle = _create_vehicle(tenant, showroom)
        url = reverse("vehicle-detail", args=[vehicle.id])
        response = auth_client.get(url)
        assert response.status_code == 200
        assert response.data["vin"] == "VEHICLE1"

    def test_update_vehicle(self, auth_client, tenant, showroom):
        vehicle = _create_vehicle(tenant, showroom)
        url = reverse("vehicle-detail", args=[vehicle.id])
        response = auth_client.patch(url, {"price": 22000})
        assert response.status_code == 200
        assert response.data["price"] == "22000.00"

    def test_delete_vehicle(self, auth_client, tenant, showroom):
        vehicle = _create_vehicle(tenant, showroom)
        url = reverse("vehicle-detail", args=[vehicle.id])
        response = auth_client.delete(url)
        assert response.status_code == 204


@pytest.mark.django_db
class TestVehicleImageAPI:
    def test_upload_image(self, auth_client, tenant, showroom):
        vehicle = _create_vehicle(tenant, showroom, vin="IMGVEH1")
        url = reverse("vehicleimage-list", args=[vehicle.id])
        response = auth_client.post(url, {"vehicle": vehicle.id, "is_primary": True})
        assert response.status_code == 201

    def test_list_images(self, auth_client, tenant, showroom):
        vehicle = _create_vehicle(tenant, showroom, vin="IMGVEH2")
        VehicleImage.objects.create(vehicle=vehicle, is_primary=True)
        url = reverse("vehicleimage-list", args=[vehicle.id])
        response = auth_client.get(url)
        assert response.status_code == 200
        assert len(response.data["results"]) == 1


@pytest.mark.django_db
class TestVehicleInspectionAPI:
    def test_create_inspection(self, auth_client, tenant, showroom, tenant_admin):
        vehicle = _create_vehicle(tenant, showroom, vin="INSP1")
        url = reverse("vehicleinspection-list", args=[vehicle.id])
        data = {"vehicle": vehicle.id, "report": "All good", "rating": 4}
        response = auth_client.post(url, data)
        assert response.status_code == 201

    def test_list_inspections(self, auth_client, tenant, showroom):
        vehicle = _create_vehicle(tenant, showroom, vin="INSP2")
        url = reverse("vehicleinspection-list", args=[vehicle.id])
        response = auth_client.get(url)
        assert response.status_code == 200


@pytest.mark.django_db
class TestVehiclePriceHistoryAPI:
    def test_list_price_history(self, auth_client, tenant, showroom, tenant_admin):
        vehicle = _create_vehicle(tenant, showroom, vin="PRICE1")
        VehiclePriceHistory.objects.create(
            vehicle=vehicle, old_price=30000, new_price=25000,
            changed_by=tenant_admin,
        )
        url = reverse("vehiclepricehistory-list", args=[vehicle.id])
        response = auth_client.get(url)
        assert response.status_code == 200
        assert len(response.data["results"]) == 1
