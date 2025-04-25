#users/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models
from dateutil.relativedelta import relativedelta
from django.utils import timezone
import uuid
from django.core.validators import MinValueValidator, MaxValueValidator
class MFI(models.Model):
    mfi_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255, unique=True)
    registration_number = models.CharField(max_length=100, unique=True)
    location = models.CharField(max_length=255, default='Maseruka')

    #Contact Information
    address = models.TextField()
    phone_number = models.CharField(max_length=20)
    email = models.EmailField(unique=True)
    website = models.URLField(blank=True, null=True)

    founding_date = models.DateField()
    is_active = models.BooleanField(default=True)

    total_assets = models.DecimalField(max_digits=15, decimal_places=2)
    total_loans_disbursed = models.DecimalField(max_digits=15, decimal_places=2, default=0.00)
    num_active_borrowers = models.IntegerField(default=0)
    regulatory_status = models.CharField(max_length=100, choices=[
        ('REGISTERED', 'Registered'),
        ('PENDING', 'Pending Approval'),
        ('SUSPENDED', 'Suspended')
    ], default='REGISTERED')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = "Microfinance Institution"
        verbose_name_plural = "Microfinance Institutions"
        ordering = ['name']

class User(AbstractUser):
    ROLE_CHOICES = [
        ('LOAN_OFFICER', 'Loan Officer'),
        ('MFI_ADMIN', 'MFI Admin'),
        ('CREDIT_ANALYST', 'Credit Analyst'),
        ('SYSTEM_ADMIN', 'System Admin'),
        ('BORROWER', 'borrower'),
    ]

    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='BORROWER')
    mfi = models.ForeignKey(MFI, on_delete=models.SET_NULL, null=True, blank=True)  # Link to MFI for staff roles
    
    groups = models.ManyToManyField(
        'auth.Group',
        verbose_name='groups',
        blank=True,
        related_name='letsema_user_set',
        related_query_name='user',
        help_text='The groups this user belongs to for permission grouping'
   )
    
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        verbose_name='user permissions',
        blank=True,
        related_name='letsema_user_set',
        related_query_name='user',
        help_text='Specific permissions for this user'
    )

    def __str__(self):
        return f"{self.username} - {self.get_role_display()}"

class Borrower(models.Model):
    borrower_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True)   
    national_id = models.CharField(max_length=20, unique=True)
    date_of_birth = models.DateField(default='1990-01-01')
    full_name = models.CharField(max_length=100)
    phone = models.CharField(max_length=15, unique=True)  # Auth via SMS OTP
    address = models.JSONField()  # Store address as JSON
    mfi = models.ForeignKey('MFI', on_delete=models.PROTECT, null=True, blank=True) 
    created_at = models.DateTimeField(auto_now_add=True)
    
    # Security fields
    failed_login_attempts = models.IntegerField(default=0)
    last_login = models.DateTimeField(null=True)

    def __str__(self):
        return f"{self.national_id} : (MFI: {self.mfi.name})"
 


