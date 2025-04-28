from django.urls import path, include

urlpatterns = [
    # ... existing urls ...
    path('api/analytics/', include('analytics.urls')),
] 