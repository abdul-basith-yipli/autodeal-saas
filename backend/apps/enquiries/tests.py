import pytest
from django.urls import reverse
from django.utils import timezone
from .models import Customer, Enquiry, FollowUp, CommunicationLog


@pytest.mark.django_db
class TestCustomerAPI:
    def test_list_customers(self, auth_client, tenant):
        Customer.objects.create(tenant=tenant, name="John Doe", phone="+1234567890")
        url = reverse("customer-list")
        response = auth_client.get(url)
        assert response.status_code == 200
        assert len(response.data["results"]) == 1

    def test_create_customer(self, auth_client, tenant):
        url = reverse("customer-list")
        data = {"name": "Jane Doe", "phone": "+9876543210", "tenant": tenant.id}
        response = auth_client.post(url, data)
        assert response.status_code == 201
        assert response.data["name"] == "Jane Doe"

    def test_tenant_isolation(self, auth_client, tenant):
        other = type(tenant).objects.create(name="Other", slug="other")
        Customer.objects.create(tenant=other, name="Other Co", phone="+1111111111")
        url = reverse("customer-list")
        response = auth_client.get(url)
        assert len(response.data["results"]) == 0


@pytest.mark.django_db
class TestEnquiryAPI:
    def test_create_enquiry(self, auth_client, tenant, showroom, vehicle):
        customer = Customer.objects.create(tenant=tenant, name="Bob", phone="+123")
        url = reverse("enquiry-list")
        data = {
            "customer": customer.id, "showroom": showroom.id,
            "vehicle": vehicle.id, "message": "Interested",
            "status": "new", "tenant": tenant.id,
        }
        response = auth_client.post(url, data)
        assert response.status_code == 201
        assert response.data["message"] == "Interested"

    def test_list_enquiries(self, auth_client, tenant, showroom, vehicle):
        customer = Customer.objects.create(tenant=tenant, name="Bob", phone="+123")
        Enquiry.objects.create(
            tenant=tenant, customer=customer, showroom=showroom,
            vehicle=vehicle, message="Test",
        )
        url = reverse("enquiry-list")
        response = auth_client.get(url)
        assert response.status_code == 200
        assert len(response.data["results"]) == 1

    def test_enquiry_nested_followups(self, auth_client, tenant, showroom, vehicle):
        customer = Customer.objects.create(tenant=tenant, name="Bob", phone="+123")
        enquiry = Enquiry.objects.create(
            tenant=tenant, customer=customer, showroom=showroom,
            vehicle=vehicle, message="Test",
        )
        url = reverse("enquiry-list")
        response = auth_client.get(url)
        assert response.data["results"][0]["followups"] == []


@pytest.mark.django_db
class TestFollowUpAPI:
    def test_create_followup(self, auth_client, tenant, showroom, vehicle, tenant_admin):
        customer = Customer.objects.create(tenant=tenant, name="Bob", phone="+123")
        enquiry = Enquiry.objects.create(
            tenant=tenant, customer=customer, showroom=showroom,
            vehicle=vehicle, message="Test",
        )
        url = reverse("followup-list", args=[enquiry.id])
        data = {
            "enquiry": enquiry.id, "assigned_to": tenant_admin.id,
            "followup_type": "call", "scheduled_at": timezone.now().isoformat(),
            "tenant": tenant.id,
        }
        response = auth_client.post(url, data)
        assert response.status_code == 201

    def test_list_followups(self, auth_client, tenant, showroom, vehicle, tenant_admin):
        customer = Customer.objects.create(tenant=tenant, name="Bob", phone="+123")
        enquiry = Enquiry.objects.create(
            tenant=tenant, customer=customer, showroom=showroom,
            vehicle=vehicle, message="Test",
        )
        FollowUp.objects.create(
            tenant=tenant, enquiry=enquiry, assigned_to=tenant_admin,
            followup_type="call", scheduled_at=timezone.now(),
        )
        url = reverse("followup-list", args=[enquiry.id])
        response = auth_client.get(url)
        assert response.status_code == 200
        assert len(response.data["results"]) == 1

    def test_complete_followup(self, auth_client, tenant, showroom, vehicle, tenant_admin):
        customer = Customer.objects.create(tenant=tenant, name="Bob", phone="+123")
        enquiry = Enquiry.objects.create(
            tenant=tenant, customer=customer, showroom=showroom,
            vehicle=vehicle, message="Test",
        )
        followup = FollowUp.objects.create(
            tenant=tenant, enquiry=enquiry, assigned_to=tenant_admin,
            followup_type="call", scheduled_at=timezone.now(),
        )
        url = reverse("followup-complete", args=[enquiry.id, followup.id])
        response = auth_client.post(url)
        assert response.status_code == 200
        followup.refresh_from_db()
        assert followup.status == "completed"
        assert followup.completed_at is not None

    def test_update_followup(self, auth_client, tenant, showroom, vehicle, tenant_admin):
        customer = Customer.objects.create(tenant=tenant, name="Bob", phone="+123")
        enquiry = Enquiry.objects.create(
            tenant=tenant, customer=customer, showroom=showroom,
            vehicle=vehicle, message="Test",
        )
        followup = FollowUp.objects.create(
            tenant=tenant, enquiry=enquiry, assigned_to=tenant_admin,
            followup_type="call", scheduled_at=timezone.now(),
        )
        url = reverse("followup-detail", args=[enquiry.id, followup.id])
        response = auth_client.patch(url, {"note": "Updated note"})
        assert response.status_code == 200
        assert response.data["note"] == "Updated note"

    def test_tenant_isolation(self, auth_client, tenant, showroom, vehicle, tenant_admin):
        other = type(tenant).objects.create(name="Other", slug="other")
        customer = Customer.objects.create(tenant=other, name="Other", phone="+999")
        enquiry = Enquiry.objects.create(
            tenant=other, customer=customer, showroom=showroom,
            vehicle=vehicle, message="Other",
        )
        FollowUp.objects.create(
            tenant=other, enquiry=enquiry, assigned_to=tenant_admin,
            followup_type="call", scheduled_at=timezone.now(),
        )
        our_customer = Customer.objects.create(tenant=tenant, name="Our", phone="+111")
        our_enquiry = Enquiry.objects.create(
            tenant=tenant, customer=our_customer, showroom=showroom,
            vehicle=vehicle, message="Our",
        )
        url = reverse("followup-list", args=[our_enquiry.id])
        response = auth_client.get(url)
        assert len(response.data["results"]) == 0


@pytest.mark.django_db
class TestCommunicationLogAPI:
    def test_create_log(self, auth_client, tenant, showroom, vehicle, tenant_admin):
        customer = Customer.objects.create(tenant=tenant, name="Bob", phone="+123")
        enquiry = Enquiry.objects.create(
            tenant=tenant, customer=customer, showroom=showroom,
            vehicle=vehicle, message="Test",
        )
        url = reverse("communicationlog-list", args=[enquiry.id])
        data = {
            "enquiry": enquiry.id, "staff": tenant_admin.id,
            "note": "Called customer", "tenant": tenant.id,
        }
        response = auth_client.post(url, data)
        assert response.status_code == 201
        assert response.data["note"] == "Called customer"
