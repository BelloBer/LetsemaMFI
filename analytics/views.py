from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from .models import DistributionMetrics, CreditHistory, DistributedCreditHistory, LesothoDistrict
from .serializers import DistributionMetricsSerializer, CreditHistorySerializer, DistributedCreditHistorySerializer
from .utils import update_distribution_metrics, update_distributed_credit_history, create_credit_history_entry, get_location_code_from_name
from django.utils import timezone
from datetime import timedelta
from users.models import Borrower, MFI

# Create your views here.

class DistributionMetricsView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = DistributionMetricsSerializer

    def get_queryset(self):
        mfi_id = self.request.user.mfi.mfi_id if hasattr(self.request.user, 'mfi') else None
        if not mfi_id:
            return []
        
        # Get time range from query params
        days = int(self.request.query_params.get('days', 30))
        start_date = timezone.now() - timedelta(days=days)
        
        # Update metrics before returning
        update_distribution_metrics(mfi_id, days)
        
        return DistributionMetrics.objects(
            mfi_id=str(mfi_id),
            date__gte=start_date
        ).order_by('-date')

    def post(self, request, *args, **kwargs):
        mfi_id = request.user.mfi.mfi_id if hasattr(request.user, 'mfi') else None
        if not mfi_id:
            return Response(
                {'detail': 'User is not associated with an MFI'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        days = int(request.data.get('days', 30))
        metrics = update_distribution_metrics(mfi_id, days)
        
        if not metrics:
            return Response(
                {'detail': 'Failed to update distribution metrics'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        return Response(
            self.get_serializer(metrics).data,
            status=status.HTTP_201_CREATED
        )

class CreditHistoryView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CreditHistorySerializer

    def get_queryset(self):
        # For MFI staff, they can view any borrower's history
        if hasattr(self.request.user, 'mfi'):
            mfi_id = self.request.user.mfi.mfi_id
            borrower_id = self.request.query_params.get('borrower_id')
            location = self.request.query_params.get('location')
            
            queryset = CreditHistory.objects(mfi_id=str(mfi_id))
            
            if borrower_id:
                queryset = queryset.filter(borrower_id=str(borrower_id))
            if location:
                queryset = queryset.filter(mfi_location=location)
                
            return queryset.order_by('-date')
        
        # For borrowers, they can only view their own history
        if hasattr(self.request.user, 'borrower'):
            borrower_id = self.request.user.borrower.borrower_id
            return CreditHistory.objects(
                borrower_id=str(borrower_id)
            ).order_by('-date')
        
        return []
    
    def post(self, request, *args, **kwargs):
        # Only MFI staff can create credit history entries
        if not hasattr(request.user, 'mfi'):
            return Response(
                {'detail': 'Only MFI staff can create credit history entries'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        mfi_id = request.user.mfi.mfi_id
        borrower_id = request.data.get('borrower_id')
        
        if not borrower_id:
            return Response(
                {'detail': 'borrower_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            borrower = Borrower.objects.get(borrower_id=borrower_id)
        except Borrower.DoesNotExist:
            return Response(
                {'detail': 'Borrower not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Create credit history entry
        credit_data = request.data.get('credit_data', {})
        credit_history = create_credit_history_entry(borrower_id, mfi_id, credit_data)
        
        if not credit_history:
            return Response(
                {'detail': 'Failed to create credit history entry'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        return Response(
            self.get_serializer(credit_history).data,
            status=status.HTTP_201_CREATED
        )

class BorrowerCreditHistoryView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CreditHistorySerializer

    def get_object(self):
        if not hasattr(self.request.user, 'borrower'):
            return None
        
        borrower_id = self.request.user.borrower.borrower_id
        return CreditHistory.objects(
            borrower_id=str(borrower_id)
        ).order_by('-date').first()

class DistributedCreditHistoryView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, *args, **kwargs):
        # Only MFI staff can access distributed credit history
        if not hasattr(request.user, 'mfi'):
            return Response(
                {'detail': 'Only MFI staff can access distributed credit history'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        mfi_id = request.user.mfi.mfi_id
        national_id = request.query_params.get('national_id')
        borrower_id = request.query_params.get('borrower_id')
        
        if not national_id and not borrower_id:
            return Response(
                {'detail': 'Either national_id or borrower_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # If borrower_id is provided, get the national_id
        if borrower_id and not national_id:
            try:
                borrower = Borrower.objects.get(borrower_id=borrower_id)
                national_id = borrower.national_id
            except Borrower.DoesNotExist:
                return Response(
                    {'detail': 'Borrower not found'},
                    status=status.HTTP_404_NOT_FOUND
                )
        
        # Get the location of the MFI
        try:
            mfi = MFI.objects.get(mfi_id=mfi_id)
            location_name = mfi.location
            location_code = get_location_code_from_name(location_name)
            
            if not location_code:
                return Response(
                    {'detail': 'MFI location could not be determined'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        except MFI.DoesNotExist:
            return Response(
                {'detail': 'MFI not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Get or create distributed credit history
        try:
            borrower = Borrower.objects.get(national_id=national_id)
            distributed_history = update_distributed_credit_history(
                borrower.borrower_id, national_id, mfi_id
            )
            
            if not distributed_history:
                return Response(
                    {'detail': 'No credit history found for this borrower'},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            serializer = DistributedCreditHistorySerializer(distributed_history)
            return Response(serializer.data)
            
        except Borrower.DoesNotExist:
            return Response(
                {'detail': 'Borrower not found'},
                status=status.HTTP_404_NOT_FOUND
            )

class UpdateDistributedCreditHistoryView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, *args, **kwargs):
        # Only MFI staff can update distributed credit history
        if not hasattr(request.user, 'mfi'):
            return Response(
                {'detail': 'Only MFI staff can update distributed credit history'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        mfi_id = request.user.mfi.mfi_id
        borrower_id = request.data.get('borrower_id')
        national_id = request.data.get('national_id')
        
        if not borrower_id and not national_id:
            return Response(
                {'detail': 'Either borrower_id or national_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # If national_id is provided, get the borrower_id
        if national_id and not borrower_id:
            try:
                borrower = Borrower.objects.get(national_id=national_id)
                borrower_id = borrower.borrower_id
            except Borrower.DoesNotExist:
                return Response(
                    {'detail': 'Borrower not found'},
                    status=status.HTTP_404_NOT_FOUND
                )
        
        # If borrower_id is provided, get the national_id
        if borrower_id and not national_id:
            try:
                borrower = Borrower.objects.get(borrower_id=borrower_id)
                national_id = borrower.national_id
            except Borrower.DoesNotExist:
                return Response(
                    {'detail': 'Borrower not found'},
                    status=status.HTTP_404_NOT_FOUND
                )
        
        # Update distributed credit history
        distributed_history = update_distributed_credit_history(
            borrower_id, national_id, mfi_id
        )
        
        if not distributed_history:
            return Response(
                {'detail': 'Failed to update distributed credit history'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        serializer = DistributedCreditHistorySerializer(distributed_history)
        return Response(serializer.data, status=status.HTTP_200_OK)
