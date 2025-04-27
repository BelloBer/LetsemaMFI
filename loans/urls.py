#loans/urls.py
from django.urls import path
from .views import (
    LoanApplicationView, 
    MFILoansView, 
    LoanStatusUpdateView,
    BorrowerLoansView,
    LoanDetailView
)

urlpatterns = [
    path('apply/', LoanApplicationView.as_view(), name='loan-application'),
    path('mfi/', MFILoansView.as_view(), name='mfi-loans'),
    path('<uuid:pk>/status/', LoanStatusUpdateView.as_view(), name='loan-status-update'),
    path('borrower/', BorrowerLoansView.as_view(), name='borrower-loans'),
    path('<uuid:pk>/', LoanDetailView.as_view(), name='loan-detail'),
]