# users/views.py
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSerializer
from users.models import User
from .permissions import IsAdminUser, IsManagerOrAdmin

# Public view: Only admins can register users
class RegisterUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    #permission_classes = [IsAuthenticated, IsAdminUser]  # Only admins can create users
    permission_classes = [AllowAny]  # Allow anyone to create users 
    serializer_class = UserSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Protected: Only logged-in users can access their profile
class UserProfileView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer

    def get(self, request, *args, **kwargs):
        serializer = self.serializer_class(request.user)
        return Response(serializer.data)

# Protected: Only managers & admins can access this view
class ManagerOnlyView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsManagerOrAdmin]

    def get_queryset(self):
        return User.objects.all()