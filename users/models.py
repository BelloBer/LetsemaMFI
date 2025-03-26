from django.contrib.auth.models import AbstractUser
from django.db import models

class MFI(models.Model):
    name = models.CharField(max_length=255, unique=True)
    registration_number = models.CharField(max_length=100, unique=True)
    
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
        ('BORROWER', 'Borrower'),
        ('LOAN_OFFICER', 'Loan Officer'),
        ('MFI_ADMIN', 'MFI Admin'),
        ('CREDIT_ANALYST', 'Credit Analyst'),
        ('AUDITOR', 'Auditor'),
        ('SYSTEM_ADMIN', 'System Admin'),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='BORROWER')
    mfi = models.ForeignKey(MFI, on_delete=models.SET_NULL, null=True, blank=True)  # Link to MFI for staff roles
    
    groups = models.ManyToManyField(
        'auth.Group',
        verbose_name='groups',
        blank=True,
        related_name='custom_user_set',
        related_query_name='user'
    )
    
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        verbose_name='user permissions',
        blank=True,
        related_name='custom_user_set',
        related_query_name='user'
    )

    def __str__(self):
        return f"{self.username} - {self.get_role_display()}"
