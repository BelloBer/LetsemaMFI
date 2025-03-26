#users/views.py
from rest_framework import generics, status
from rest_framework.response import Response
from .serializers import UserRegistrationSerializer, UserSerializer
from .permissions import CanRegisterUsers
from rest_framework.permissions import IsAuthenticated



class RegisterUserView(generics.CreateAPIView):
    serializer_class = UserRegistrationSerializer
    permission_classes = [CanRegisterUsers]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # For MFI staff, automatically assign the new user to their MFI
        if request.user.role in ['MFI_ADMIN', 'LOAN_OFFICER']:
            serializer.validated_data['mfi'] = request.user.mfi
            
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    


class UserProfileView(generics.RetrieveAPIView):
    """
    View for users to see their own profile
    """
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user