from django.urls import path
from .views import (
    OverviewView, ShowroomComparisonView, StaffLeaderboardView,
    SalesTrendsView, InventoryReportView,
)

urlpatterns = [
    path("overview/", OverviewView.as_view(), name="dashboard-overview"),
    path("showroom-comparison/", ShowroomComparisonView.as_view(), name="dashboard-showroom-comparison"),
    path("staff-leaderboard/", StaffLeaderboardView.as_view(), name="dashboard-staff-leaderboard"),
    path("sales-trends/", SalesTrendsView.as_view(), name="dashboard-sales-trends"),
    path("inventory-report/", InventoryReportView.as_view(), name="dashboard-inventory-report"),
]
