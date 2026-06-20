from django.contrib import admin
from .models import StaffProfile, Position, PerformanceRecord

admin.site.register(StaffProfile)
admin.site.register(Position)
admin.site.register(PerformanceRecord)
