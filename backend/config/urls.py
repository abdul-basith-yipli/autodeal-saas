from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="docs"),
    path("api/auth/", include("apps.accounts.urls")),
    path("api/tenants/", include("apps.tenants.urls")),
    path("api/showrooms/", include("apps.showrooms.urls")),
    path("api/departments/", include("apps.departments.urls")),
    path("api/staff/", include("apps.staff.urls")),
    path("api/customers/", include("apps.customers.urls")),
    path("api/", include("apps.vehicles.urls")),
    path("api/", include("apps.enquiries.urls")),
    path("api/sales/", include("apps.sales.urls")),
    path("api/notifications/", include("apps.notifications.urls")),
    path("api/dashboard/", include("apps.dashboard.urls")),
]
