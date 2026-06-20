from django.contrib import admin
from .models import Sale, SaleDocument, Commission

admin.site.register(Sale)
admin.site.register(SaleDocument)
admin.site.register(Commission)
