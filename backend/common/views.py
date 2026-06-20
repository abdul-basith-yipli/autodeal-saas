from rest_framework import viewsets, status
from rest_framework.response import Response


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

    def create(self, request, *args, **kwargs):
        tenant = _get_tenant(request)
        if tenant and "tenant" not in request.data:
            mutable = request.data.copy()
            mutable["tenant"] = tenant.id
            serializer = self.get_serializer(data=mutable)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        return super().create(request, *args, **kwargs)
