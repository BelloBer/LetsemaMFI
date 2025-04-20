
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import User, Borrower
from .models import MFI
# from .serializers import MFISerializer 
from .serializers import (
    StaffRegistrationSerializer,
    BorrowerRegistrationSerializer,
    UserProfileSerializer,
    BorrowerLoginSerializer
)
from .permissions import AllowAny, BasicAuthPermission

class RegisterStaffView(generics.CreateAPIView):
    serializer_class = StaffRegistrationSerializer
    permission_classes = [AllowAny]
    
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        refresh = RefreshToken.for_user(user)
        return Response({
            "user": serializer.data,
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)

class RegisterBorrowerView(generics.CreateAPIView):
    serializer_class = BorrowerRegistrationSerializer
    permission_classes = [AllowAny]
    
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        borrower = serializer.save()

        refresh = RefreshToken.for_user(borrower.user)
        return Response({
            "message": "Borrower registered successfully",
            "borrower_id": str(borrower.borrower_id),
            "user_id": borrower.user.id,
            "username": borrower.user.username,
            "refresh": str(refresh),
            "access": str(refresh.access_token)
        }, status=status.HTTP_201_CREATED)

class BorrowerLoginView(generics.GenericAPIView):
    serializer_class = BorrowerLoginSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.validated_data, status=status.HTTP_200_OK)

class UserProfileView(generics.RetrieveAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [BasicAuthPermission]

    def get_object(self):
        return self.request.user
    


# class MFIListView(generics.ListAPIView):
#     """
#     API endpoint that lists all MFIs
#     """
#     queryset = MFI.objects.all()
#     serializer_class = MFISerializer
#     permission_classes = [AllowAny]  # Or your preferred permission




















