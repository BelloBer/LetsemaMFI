#users/serializers.py
from rest_framework import serializers
from .models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'role', 'mfi']
        extra_kwargs = {
            'password': {'write_only': True},
            'role': {'required': True},
            'mfi': {'required': False}
        }

    def validate(self, data):
        user = self.context['request'].user
        requested_role = data.get('role', 'BORROWER')
        
        # System Admin can create any user
        if user.role == 'SYSTEM_ADMIN':
            return data
            
        # MFI Admin can create borrowers and loan officers
        if user.role == 'MFI_ADMIN':
            if requested_role not in ['BORROWER', 'LOAN_OFFICER']:
                raise serializers.ValidationError("MFI Admins can only register borrowers and loan officers")
            data['mfi'] = user.mfi  # Automatically assign to their MFI
            return data
            
        # Loan Officer can only create borrowers
        if user.role == 'LOAN_OFFICER':
            if requested_role != 'BORROWER':
                raise serializers.ValidationError("Loan Officers can only register borrowers")
            data['mfi'] = user.mfi  # Assign to their MFI
            return data
            
        raise serializers.ValidationError("You don't have permission to register users")
    

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'mfi']
        extra_kwargs = {
            'role': {'read_only': True},  # Role shouldn't be changed via this serializer
            'mfi': {'read_only': True}    # MFI should only be set during registration
        }

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['role'] = user.role
        token['mfi_id'] = user.mfi.id if user.mfi else None
        return token
