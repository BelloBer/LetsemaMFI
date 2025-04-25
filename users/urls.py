# users/urls.py
# from django.urls import path
# from .views import RegisterUserView, UserProfileView
# from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

# urlpatterns = [
#     path("register/", RegisterUserView.as_view(), name="register"),
#     path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
#     path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
#     path("profile/", UserProfileView.as_view(), name="user_profile"),  # Protected

# ]

from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    RegisterStaffView,
    RegisterBorrowerView,
    BorrowerLoginView,
    UserProfileView,
    BorrowerProfileView,
    ActiveMFIListView
)

urlpatterns = [
    path('register/staff/', RegisterStaffView.as_view(), name='register-staff'),
    path('register/borrower/', RegisterBorrowerView.as_view(), name='register-borrower'),
    
    # Login URLs
    path('login/borrower/', BorrowerLoginView.as_view(), name='login-borrower'),
    path('login/staff/', BorrowerLoginView.as_view(), name='login-staff'),
    
    # JWT Token URLs
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('token/', TokenObtainPairView.as_view(), name='token-obtain'),
    # Protected URLs
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('profile/borrower/', BorrowerProfileView.as_view(), name='user-profile-borrower'),
    path('mfis/active/', ActiveMFIListView.as_view(), name='mfi-list'),
    # path('api/users/mfis/', MFIListView.as_view(), name='mfi-list'),
]


