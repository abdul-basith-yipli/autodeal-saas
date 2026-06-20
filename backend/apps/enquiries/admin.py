from django.contrib import admin
from .models import Customer, Enquiry, FollowUp, CommunicationLog

admin.site.register(Customer)
admin.site.register(Enquiry)
admin.site.register(FollowUp)
admin.site.register(CommunicationLog)
