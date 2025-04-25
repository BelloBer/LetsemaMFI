
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