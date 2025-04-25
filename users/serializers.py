

from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import make_password
from .models import User, Borrower, MFI

User = get_user_model()

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        
        # Add custom claims
        refresh = self.get_token(self.user)
        data['refresh'] = str(refresh)
        data['access'] = str(refresh.access_token)
        data['user_id'] = self.user.id
        data['role'] = self.user.role
        data['mfi'] = self.user.mfi_id if self.user.mfi else None
        
        # Add borrower-specific data if user is a borrower
        if self.user.role == 'BORROWER':
            try:
                borrower = Borrower.objects.get(user=self.user)
                data['borrower_id'] = str(borrower.borrower_id)
                data['full_name'] = borrower.full_name
            except Borrower.DoesNotExist:
                pass
                
        return data

class UserSerializer(serializers.ModelSerializer):
    # mfi_details = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'mfi']

    # def get_mfi_details(self, obj):
    #     if obj.mfi:
    #         return MFISerializer(obj.mfi).data
    #     return None
    
class BorrowerRegistrationSerializer(serializers.ModelSerializer):
    username = serializers.CharField(write_only=True)
    email = serializers.EmailField(write_only=True)
    password = serializers.CharField(write_only=True, min_length=4, max_length=128)

    class Meta:
        model = Borrower
        fields = [
            'username', 'email', 'password', 'full_name', 'date_of_birth',
            'national_id', 'phone', 'address'
        ]

    def validate(self, attrs):
        if User.objects.filter(username=attrs['username']).exists():
            raise serializers.ValidationError({'username': 'Username already exists'})
        if User.objects.filter(email=attrs['email']).exists():
            raise serializers.ValidationError({'email': 'Email already exists'})
        
                # Validate address structure
        address = attrs.get('address', {})
        required_address_fields = ['street', 'city', 'district', 'postal_code']
        if not all(field in address for field in required_address_fields):
            raise serializers.ValidationError({
                'address': f"Must include {', '.join(required_address_fields)}"
            })
        
        return attrs

    def create(self, validated_data):
        username = validated_data.pop('username')
        email = validated_data.pop('email')
        password = validated_data.pop('password')

        user = User.objects.create(
            username=username,
            email=email,
            role='BORROWER',
            password=make_password(password)
        )

        borrower = Borrower.objects.create(user=user, **validated_data)
        return borrower

class BorrowerLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    access = serializers.CharField(read_only=True)
    refresh = serializers.CharField(read_only=True)
    user_id = serializers.CharField(read_only=True)
    borrower_id = serializers.CharField(read_only=True)
    role = serializers.CharField(read_only=True)

    def validate(self, data):
        username = data['username']
        password = data['password']

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            raise serializers.ValidationError("Invalid credentials")

        if not user.check_password(password):
            raise serializers.ValidationError("Invalid credentials")

        if user.role != 'BORROWER':
            raise serializers.ValidationError("User is not a borrower")

        try:
            borrower = Borrower.objects.get(user=user)
        except Borrower.DoesNotExist:
            raise serializers.ValidationError("Borrower profile not found")

        refresh = RefreshToken.for_user(user)

        return {
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user_id': user.id,
            'borrower_id': str(borrower.borrower_id),
            'role': user.role
        }

class StaffRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'role', 'mfi']

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user

class UserProfileSerializer(serializers.ModelSerializer):
    borrower_id = serializers.SerializerMethodField()
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'mfi', 'borrower_id', 'full_name']

    def get_borrower_id(self, obj):
        if hasattr(obj, 'borrower'):
            return obj.borrower.borrower_id
        return None

    def get_full_name(self, obj):
        if hasattr(obj, 'borrower'):
            return obj.borrower.full_name
        return obj.get_full_name()
    


# class MFISerializer(serializers.ModelSerializer):
#     class Meta:
#         model = MFI
#         fields = [
#             'mfi_id', 
#             'name', 
#             'registration_number',
#             'location',
#             'address',
#             'phone_number',
#             'email',
#             'website',
#             'founding_date',
#             'is_active',
#             'total_assets',
#             'total_loans_disbursed',
#             'num_active_borrowers',
#             'regulatory_status',
#             'created_at',
#             'updated_at'
#         ]
#         read_only_fields = [
#             'mfi_id',
#             'created_at',
#             'updated_at',
#             'total_loans_disbursed',
#             'num_active_borrowers'
#         ]

#     def validate_registration_number(self, value):
#         if not value.isalnum():
#             raise serializers.ValidationError("Registration number must be alphanumeric")
#         return value

#     def validate_phone_number(self, value):
#         if not value.startswith('+'):
#             raise serializers.ValidationError("Phone number must start with country code (e.g. +266)")
#         return value


# class CompactMFISerializer(serializers.ModelSerializer):
#     class Meta:
#         model = MFI
#         fields = ['mfi_id', 'name', 'code']