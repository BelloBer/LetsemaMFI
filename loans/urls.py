#loans/urls.py
from django.urls import path
from .views import LoanApplicationView

urlpatterns = [
    path('apply/', LoanApplicationView.as_view(), name='loan-application'),
]