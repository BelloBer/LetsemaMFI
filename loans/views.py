from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Loan, Repayment
from .serializers import LoanApplicationSerializer, LoanSerializer, RepaymentSerializer, RepaymentUpdateSerializer, RepaymentCreateSerializer
from users.models import Borrower, MFI
from decimal import Decimal
from django.http import Http404
from rest_framework.exceptions import PermissionDenied

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

class MFILoansView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = LoanSerializer

    def get_queryset(self):
        # Get the MFI associated with the user
        mfi = self.request.user.mfi
        if not mfi:
            return Loan.objects.none()
        return Loan.objects.filter(mfi=mfi).order_by('-issued_date')

class LoanStatusUpdateView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = LoanSerializer
    queryset = Loan.objects.all()

    def update(self, request, *args, **kwargs):
        loan = self.get_object()
        
        # Check if user belongs to the same MFI as the loan
        if request.user.mfi != loan.mfi:
            return Response(
                {'detail': 'You do not have permission to update this loan'},
                status=status.HTTP_403_FORBIDDEN
            )

        # Get the new status from request data
        new_status = request.data.get('status')
        if new_status not in ['APPROVED', 'REJECTED']:
            return Response(
                {'detail': 'Invalid status. Must be either APPROVED or REJECTED'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Update the loan status
        loan.status = new_status
        loan.save()

        return Response(self.get_serializer(loan).data)

class BorrowerLoansView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = LoanSerializer

    def get_queryset(self):
        # Get the borrower associated with the user
        try:
            borrower = Borrower.objects.get(user=self.request.user)
            return Loan.objects.filter(borrower=borrower).order_by('-issued_date')
        except Borrower.DoesNotExist:
            return Loan.objects.none()

class LoanDetailView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = LoanSerializer
    queryset = Loan.objects.all()

    def get_object(self):
        try:
            loan = super().get_object()
            # Check if the user is either the borrower or belongs to the loan's MFI
            if (hasattr(self.request.user, 'borrower') and 
                self.request.user.borrower == loan.borrower) or (
                hasattr(self.request.user, 'mfi') and 
                self.request.user.mfi == loan.mfi):
                return loan
            raise PermissionError("You do not have permission to view this loan")
        except Loan.DoesNotExist:
            raise Http404("Loan not found")
        except PermissionError as e:
            raise PermissionDenied(str(e))

class RepaymentListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = RepaymentSerializer

    def get_queryset(self):
        # Get the MFI associated with the user
        mfi = self.request.user.mfi
        if not mfi:
            return Repayment.objects.none()
        return Repayment.objects.filter(loan__mfi=mfi).order_by('-due_date')

class BorrowerRepaymentListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = RepaymentSerializer

    def get_queryset(self):
        try:
            borrower = Borrower.objects.get(user=self.request.user)
            return Repayment.objects.filter(loan__borrower=borrower).order_by('-due_date')
        except Borrower.DoesNotExist:
            return Repayment.objects.none()

class RepaymentDetailView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = RepaymentUpdateSerializer
    queryset = Repayment.objects.all()

    def update(self, request, *args, **kwargs):
        repayment = self.get_object()
        
        # Check if user belongs to the same MFI as the loan
        if request.user.mfi != repayment.loan.mfi:
            return Response(
                {'detail': 'You do not have permission to update this repayment'},
                status=status.HTTP_403_FORBIDDEN
            )

        # Set the marked_by field to the current user
        request.data['marked_by'] = request.user.id

        return super().update(request, *args, **kwargs)

class RepaymentCreateView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = RepaymentCreateSerializer

    def create(self, request, *args, **kwargs):
        try:
            # Get the borrower associated with the user
            borrower = Borrower.objects.get(user=self.request.user)
            
            # Get the loan from the request data
            try:
                loan = Loan.objects.get(loan_id=request.data.get('loan'))
            except Loan.DoesNotExist:
                return Response(
                    {'detail': 'Loan not found'},
                    status=status.HTTP_404_NOT_FOUND
                )

            # Check if the loan belongs to the borrower
            if loan.borrower != borrower:
                return Response(
                    {'detail': 'You do not have permission to make payments for this loan'},
                    status=status.HTTP_403_FORBIDDEN
                )

            # Create serializer with data
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)

            # Save the repayment with PENDING status
            repayment = serializer.save(
                loan=loan,
                status='PENDING'  # Initial status is PENDING until verified by staff
            )

            return Response({
                'message': 'Repayment submitted successfully. Waiting for verification.',
                'repayment_id': str(repayment.repayment_id),
                'status': repayment.status,
                'remaining_amount': repayment.remaining_amount
            }, status=status.HTTP_201_CREATED)

        except Borrower.DoesNotExist:
            return Response({
                'detail': 'User is not registered as a borrower'
            }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({
                'detail': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)