from django.urls import path
from analytics import views

urlpatterns = [
    path('test-atlas-connection/', views.test_mongodb_atlas_connection, name='test_mongodb_atlas_connection'),
    path('distributed-credit-history/<str:national_id>/', views.get_distributed_credit_history, name='get_distributed_credit_history'),
    path('distributed-credit-history/', views.get_distributed_credit_history, name='get_distributed_credit_history_query'),
    path('distributed-credit-stats/', views.get_distributed_credit_stats, name='get_distributed_credit_stats'),
]
