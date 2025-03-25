# users/urls.py
from django.urls import path
from .views import RegisterUserView, UserProfileView, ManagerOnlyView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path("register/", RegisterUserView.as_view(), name="register"),
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("profile/", UserProfileView.as_view(), name="user_profile"),  # Protected
    path("managers/", ManagerOnlyView.as_view(), name="manager_only"),  # Protected
]