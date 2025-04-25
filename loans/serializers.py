#loans/serializers.py
from rest_framework import serializers
from .models import Loan
from users.models import MFI
# loans/serializers.py
class LoanApplicationSerializer(serializers.ModelSerializer):
    mfi_id = serializers.UUIDField(write_only=True)  # Add this field

    class Meta:
        model = Loan
        fields = ['amount', 'term', 'purpose', 'additional_notes', 'mfi_id']
        
    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("Loan amount must be greater than 0")
        return value
        
    def validate_term(self, value):
        if value not in [3, 6, 12, 24, 36, 48, 60]:
            raise serializers.ValidationError("Invalid loan term")
        return value

    def validate_purpose(self, value):
        valid_purposes = dict(Loan.PURPOSE_CHOICES).keys()
        if value.upper() not in valid_purposes:
            raise serializers.ValidationError("Invalid loan purpose")
        return value.upper()

    def validate_mfi_id(self, value):
        try:
            mfi = MFI.objects.get(mfi_id=value, is_active=True)
            return value
        except MFI.DoesNotExist:
            raise serializers.ValidationError("Selected MFI is not active or does not exist")