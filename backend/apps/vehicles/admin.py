from django.contrib import admin
from .models import (
    VehicleCategory, VehicleBrand, VehicleModel, VehicleYear,
    VehicleSpecification, Vehicle, VehicleImage, VehicleInspection,
    VehiclePriceHistory,
)

admin.site.register(VehicleCategory)
admin.site.register(VehicleBrand)
admin.site.register(VehicleModel)
admin.site.register(VehicleYear)
admin.site.register(VehicleSpecification)
admin.site.register(Vehicle)
admin.site.register(VehicleImage)
admin.site.register(VehicleInspection)
admin.site.register(VehiclePriceHistory)
