#users/admin.py
from django.contrib import admin
from .models import MFI, User

@admin.register(MFI)
class MFIAdmin(admin.ModelAdmin):
    list_display = ('name', 'is_active', 'total_loans_disbursed', 'num_active_borrowers', 'regulatory_status')
    list_filter = ('is_active',)
    search_fields = ('name', 'registration_number')
    readonly_fields = ('created_at', 'updated_at')