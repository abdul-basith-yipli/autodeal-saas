import pytest
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from apps.tenants.models import Tenant

User = get_user_model()


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def tenant():
    return Tenant.objects.create(name="Test Dealership", slug="test-dealership")


@pytest.fixture
def tenant_admin(tenant):
    return User.objects.create_user(
        email="admin@test.com",
        password="testpass123",
        full_name="Admin User",
        role="tenant_admin",
        tenant=tenant,
    )


@pytest.fixture
def auth_client(api_client, tenant_admin):
    api_client.force_authenticate(user=tenant_admin)
    return api_client


@pytest.fixture
def super_admin():
    return User.objects.create_superuser(
        email="super@test.com",
        password="testpass123",
        full_name="Super Admin",
    )


@pytest.fixture
def super_admin_client(api_client, super_admin):
    api_client.force_authenticate(user=super_admin)
    return api_client
