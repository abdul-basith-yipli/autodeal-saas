from rest_framework import viewsets


class TenantAwareViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        qs = super().get_queryset()
        if hasattr(self.request, "tenant") and self.request.tenant:
            return qs.filter(tenant=self.request.tenant)
        return qs

    def perform_create(self, serializer):
        if hasattr(self.request, "tenant") and self.request.tenant:
            serializer.save(tenant=self.request.tenant)
        else:
            serializer.save()
