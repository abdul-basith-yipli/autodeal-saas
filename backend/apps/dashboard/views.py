from rest_framework import generics, permissions
from rest_framework.response import Response


class OverviewView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response({
            "total_vehicles": 0,
            "total_enquiries": 0,
            "total_sales": 0,
            "total_revenue": "0.00",
        })


class ShowroomComparisonView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response([])


class StaffLeaderboardView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response([])


class SalesTrendsView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response({
            "labels": [],
            "data": [],
        })


class InventoryReportView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response({
            "by_status": {},
            "by_category": {},
        })
