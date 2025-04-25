from django.shortcuts import render

# Create your views here.

#loans/views.py
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Loan
from .serializers import LoanApplicationSerializer
from users.models import Borrower, MFI
from decimal import Decimal

# loans/views.py
class LoanApplicationView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = LoanApplicationSerializer

    def create(self, request, *args, **kwargs):
        try:
            # Get the borrower associated with the user
            borrower = Borrower.objects.get(user=self.request.user)
            
            # Get the MFI from the request data
            try:
                mfi = MFI.objects.get(mfi_id=request.data.get('mfi_id'), is_active=True)
            except MFI.DoesNotExist:
                return Response(
                    {'detail': 'Selected MFI is not active or does not exist'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Create serializer with data
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)

            # Set default interest rate
            interest_rate = Decimal('0.12')  # 12% annual interest rate

            # Save with additional fields
            loan = serializer.save(
                borrower=borrower,
                mfi=mfi,
                status='PENDING',
                interest=interest_rate
            )

            return Response({
                'message': 'Loan application submitted successfully',
                'loan_id': str(loan.loan_id),
                'status': loan.status
            }, status=status.HTTP_201_CREATED)

        except Borrower.DoesNotExist:
            return Response({
                'detail': 'User is not registered as a borrower'
            }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({
                'detail': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)