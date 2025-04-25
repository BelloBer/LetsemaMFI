
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import User, Borrower, MFI
from rest_framework.permissions import IsAuthenticated


# from .serializers import MFISerializer 
from .serializers import (
    StaffRegistrationSerializer,
    BorrowerRegistrationSerializer,
    UserProfileSerializer,
    BorrowerLoginSerializer,
    BorrowerProfileSerializer,
    MFIListSerializer
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
    


class BorrowerProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = BorrowerProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        try:
            return Borrower.objects.get(user=self.request.user)
        except Borrower.DoesNotExist:
            return Response(
                {"detail": "Borrower profile not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)

        try:
            self.perform_update(serializer)
        except Exception as e:
            return Response(
                {"detail": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response(serializer.data)

    def partial_update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)
    



class ActiveMFIListView(generics.ListAPIView):
    serializer_class = MFIListSerializer
    
    def get_queryset(self):
        return MFI.objects.filter(is_active=True)

# class MFIListView(generics.ListAPIView):
#     """
#     API endpoint that lists all MFIs
#     """
#     queryset = MFI.objects.all()
#     serializer_class = MFISerializer
#     permission_classes = [AllowAny]  # Or your preferred permission




















