#loans/urls.py
from django.urls import path
from .views import (
    LoanApplicationView, 
    MFILoansView, 
    LoanStatusUpdateView,
    BorrowerLoansView,
    LoanDetailView,
    RepaymentListView,
    BorrowerRepaymentListView,
    RepaymentDetailView,
    RepaymentCreateView
)

urlpatterns = [
    path('apply/', LoanApplicationView.as_view(), name='loan-application'),
    path('mfi/', MFILoansView.as_view(), name='mfi-loans'),
    path('<uuid:pk>/status/', LoanStatusUpdateView.as_view(), name='loan-status-update'),
    path('borrower/', BorrowerLoansView.as_view(), name='borrower-loans'),
    path('<uuid:pk>/', LoanDetailView.as_view(), name='loan-detail'),
    
    # Repayment URLs
    path('repayments/', RepaymentListView.as_view(), name='repayment-list'),
    path('repayments/borrower/', BorrowerRepaymentListView.as_view(), name='borrower-repayment-list'),
    path('repayments/<uuid:pk>/', RepaymentDetailView.as_view(), name='repayment-detail'),
    path('repayments/create/', RepaymentCreateView.as_view(), name='repayment-create'),
]