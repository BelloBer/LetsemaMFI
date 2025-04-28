from django.urls import path
from .views import (
    DistributionMetricsView, 
    CreditHistoryView, 
    BorrowerCreditHistoryView,
    DistributedCreditHistoryView,
    UpdateDistributedCreditHistoryView
)

urlpatterns = [
    path('metrics/', DistributionMetricsView.as_view(), name='distribution-metrics'),
    path('credit-history/', CreditHistoryView.as_view(), name='credit-history'),
    path('borrower-credit-history/', BorrowerCreditHistoryView.as_view(), name='borrower-credit-history'),
    path('distributed-credit-history/', DistributedCreditHistoryView.as_view(), name='distributed-credit-history'),
    path('update-distributed-credit-history/', UpdateDistributedCreditHistoryView.as_view(), name='update-distributed-credit-history'),
]
