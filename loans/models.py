# loans/models.py
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from dateutil.relativedelta import relativedelta
from django.utils import timezone
import uuid
from users.models import Borrower, MFI

class Loan(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('APPROVED', 'Approved'),
        ('REJECTED', 'Rejected'),
        ('REPAID', 'Repaid'),
    ]
    
    PURPOSE_CHOICES = [
        ('PERSONAL', 'Personal'),
        ('BUSINESS', 'Business'),
        ('EDUCATION', 'Education'),
        ('MEDICAL', 'Medical'),
        ('OTHER', 'Other'),
    ]
    
    TERM_CHOICES = [
        (3, '3 months'),
        (6, '6 months'),
        (12, '12 months'),
        (24, '24 months'),
        (36, '36 months'),
        (48, '48 months'),
        (60, '60 months'),
    ]
    
    loan_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    borrower = models.ForeignKey(Borrower, on_delete=models.PROTECT)
    mfi = models.ForeignKey(MFI, on_delete=models.PROTECT)
    amount = models.DecimalField(max_digits=15, decimal_places=2)
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    purpose = models.CharField(max_length=20, choices=PURPOSE_CHOICES, blank=True)
    
    issued_date = models.DateTimeField(auto_now_add=True)
    due_date = models.DateTimeField(blank=True, null=True)
    term = models.IntegerField(
        choices=TERM_CHOICES,
        validators=[MinValueValidator(1), MaxValueValidator(60)]
    )
    additional_notes = models.TextField(blank=True, null=True)
    interest = models.DecimalField(max_digits=15, decimal_places=3)

    def save(self, *args, **kwargs):
        if not self.due_date:
            self.due_date = timezone.now() + relativedelta(months=self.term)
        super().save(*args, **kwargs)    

    def __str__(self):
        return f"Loan {self.loan_id} - {self.borrower.full_name}"

class Repayment(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('PAID', 'Paid'),
        ('OVERDUE', 'Overdue'),
        ('UPCOMING', 'Upcoming'),
        ('VERIFIED', 'Verified')
    ]

    PAYMENT_METHOD_CHOICES = [
        ('CASH', 'Cash'),
        ('BANK_TRANSFER', 'Bank Transfer'),
        ('MOBILE_MONEY', 'Mobile Money'),
        ('CHEQUE', 'Cheque')
    ]

    repayment_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    loan = models.ForeignKey(Loan, on_delete=models.PROTECT, related_name='repayments')
    amount = models.DecimalField(max_digits=15, decimal_places=2)
    remaining_amount = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    due_date = models.DateTimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    payment_date = models.DateTimeField(null=True, blank=True)
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES, null=True, blank=True)
    payment_reference = models.CharField(max_length=100, blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    marked_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f"Repayment {self.repayment_id} - {self.loan.borrower.full_name}"

    def save(self, *args, **kwargs):
        # Only update status if it's not PENDING or VERIFIED
        if self.status not in ['PENDING', 'VERIFIED']:
            now = timezone.now()
            if self.due_date < now:
                self.status = 'OVERDUE'
            elif (self.due_date - now).days <= 7:  # If due within 7 days
                self.status = 'UPCOMING'
            else:
                self.status = 'PENDING'
        super().save(*args, **kwargs)

    class Meta:
        ordering = ['-due_date']