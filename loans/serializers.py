#loans/serializers.py
from rest_framework import serializers
from .models import Loan, Repayment
from users.models import MFI
from users.serializers import BorrowerProfileSerializer, MFIListSerializer
from django.db import models
from .utils import calculateLoanDetails
from django.utils import timezone
from dateutil.relativedelta import relativedelta

class LoanSerializer(serializers.ModelSerializer):
    borrower_details = BorrowerProfileSerializer(source='borrower', read_only=True)
    mfi_details = MFIListSerializer(source='mfi', read_only=True)
    
    class Meta:
        model = Loan
        fields = [
            'loan_id', 
            'borrower', 
            'borrower_details',
            'mfi',
            'mfi_details',
            'amount', 
            'status',
            'purpose',
            'issued_date',
            'due_date',
            'term',
            'interest',
            'additional_notes'
        ]
        read_only_fields = ['loan_id', 'borrower', 'mfi', 'issued_date', 'due_date']

class LoanApplicationSerializer(serializers.ModelSerializer):
    mfi_id = serializers.UUIDField(write_only=True)  # Add this field

    class Meta:
        model = Loan
        fields = ['amount', 'term', 'purpose', 'additional_notes', 'mfi_id']
        
    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("Loan amount must be greater than 0")
        return value
        
    def validate_term(self, value):
        if value not in [3, 6, 12, 24, 36, 48, 60]:
            raise serializers.ValidationError("Invalid loan term")
        return value

    def validate_purpose(self, value):
        valid_purposes = dict(Loan.PURPOSE_CHOICES).keys()
        if value.upper() not in valid_purposes:
            raise serializers.ValidationError("Invalid loan purpose")
        return value.upper()

    def validate_mfi_id(self, value):
        try:
            mfi = MFI.objects.get(mfi_id=value, is_active=True)
            return value
        except MFI.DoesNotExist:
            raise serializers.ValidationError("Selected MFI is not active or does not exist")

class RepaymentSerializer(serializers.ModelSerializer):
    loan_details = LoanSerializer(source='loan', read_only=True)
    marked_by_name = serializers.SerializerMethodField()

    class Meta:
        model = Repayment
        fields = [
            'repayment_id',
            'loan',
            'loan_details',
            'amount',
            'due_date',
            'status',
            'payment_date',
            'payment_method',
            'notes',
            'created_at',
            'updated_at',
            'marked_by',
            'marked_by_name'
        ]
        read_only_fields = ['repayment_id', 'created_at', 'updated_at']

    def get_marked_by_name(self, obj):
        if obj.marked_by:
            return obj.marked_by.username
        return None

class RepaymentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Repayment
        fields = [
            'loan',
            'amount',
            'remaining_amount',
            'due_date',
            'payment_method',
            'payment_reference',
            'notes'
        ]

    def validate(self, data):
        loan = data['loan']
        amount = data['amount']

        # Check if the loan exists and belongs to the borrower
        if not loan:
            raise serializers.ValidationError("Loan is required")

        # Validate amount
        if amount <= 0:
            raise serializers.ValidationError("Amount must be greater than 0")

        # Check if the loan is active
        if loan.status not in ['APPROVED']:
            raise serializers.ValidationError("Can only make payments for approved loans")

        # Calculate remaining amount
        total_paid = Repayment.objects.filter(
            loan=loan,
            status__in=['PAID', 'VERIFIED']
        ).aggregate(total=models.Sum('amount'))['total'] or 0

        remaining_amount = loan.amount - total_paid
        if amount > remaining_amount:
            raise serializers.ValidationError(f"Payment amount cannot exceed remaining amount of M{remaining_amount}")

        # Set the remaining amount
        data['remaining_amount'] = remaining_amount - amount

        # Calculate payment schedule
        payment_schedule = calculateLoanDetails(
            float(loan.amount),
            float(loan.interest),
            int(loan.term)
        ).paymentSchedule

        # Find the next due payment
        next_payment = next(
            (payment for payment in payment_schedule if payment['remainingBalance'] > 0),
            None
        )

        if next_payment:
            # Calculate due date based on loan issue date and payment number
            months_since_issue = next_payment['paymentNumber'] - 1
            due_date = loan.issued_date + relativedelta(months=months_since_issue)
            data['due_date'] = due_date
        else:
            raise serializers.ValidationError("No remaining payments for this loan")

        return data

class RepaymentUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Repayment
        fields = [
            'status',
            'payment_date',
            'payment_method',
            'payment_reference',
            'notes'
        ]