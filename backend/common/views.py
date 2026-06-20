from rest_framework import viewsets


def _get_tenant(request):
    if hasattr(request, "tenant") and request.tenant:
        return request.tenant
    if request.user.is_authenticated and request.user.tenant:
        return request.user.tenant
    return None


class TenantAwareViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        qs = super().get_queryset()
        tenant = _get_tenant(self.request)
        if tenant:
            return qs.filter(tenant=tenant)
        return qs

    def perform_create(self, serializer):
        tenant = _get_tenant(self.request)
        if tenant:
            serializer.save(tenant=tenant)
        else:
            serializer.save()
