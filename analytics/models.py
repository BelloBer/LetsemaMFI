from django.db import models
import mongoengine as me
from datetime import datetime
import uuid

class LesothoDistrict(models.Model):
    """
    Model to store Lesotho district information
    """
    DISTRICT_CHOICES = [
        ('BERA', 'Berea'),
        ('BUTHA', 'Butha-Buthe'),
        ('LERIBE', 'Leribe'),
        ('MAFETENG', 'Mafeteng'),
        ('MASERU', 'Maseru'),
        ('MOHALES', 'Mohale\'s Hoek'),
        ('MOKHOTLONG', 'Mokhotlong'),
        ('QACHA', 'Qacha\'s Nek'),
        ('QUTHING', 'Quthing'),
        ('THABA', 'Thaba-Tseka'),
    ]

    name = models.CharField(max_length=50, choices=DISTRICT_CHOICES)
    code = models.CharField(max_length=10)
    population = models.IntegerField(default=0)
    area = models.DecimalField(max_digits=10, decimal_places=2, default=0)  # in square kilometers

    def __str__(self):
        return self.name

class DistributionMetrics(me.Document):
    """
    MongoDB model for loan distribution metrics by location
    """
    mfi_id = me.UUIDField(required=True)
    date = me.DateTimeField(default=datetime.now)
    
    # Overall metrics
    total_loans = me.IntField(default=0)
    total_amount = me.DecimalField(precision=2, default=0)
    average_loan_size = me.DecimalField(precision=2, default=0)
    
    # Location-based distribution
    location_distribution = me.DictField(default={
        'BERA': {'count': 0, 'amount': 0, 'percentage': 0},
        'BUTHA': {'count': 0, 'amount': 0, 'percentage': 0},
        'LERIBE': {'count': 0, 'amount': 0, 'percentage': 0},
        'MAFETENG': {'count': 0, 'amount': 0, 'percentage': 0},
        'MASERU': {'count': 0, 'amount': 0, 'percentage': 0},
        'MOHALES': {'count': 0, 'amount': 0, 'percentage': 0},
        'MOKHOTLONG': {'count': 0, 'amount': 0, 'percentage': 0},
        'QACHA': {'count': 0, 'amount': 0, 'percentage': 0},
        'QUTHING': {'count': 0, 'amount': 0, 'percentage': 0},
        'THABA': {'count': 0, 'amount': 0, 'percentage': 0},
    })
    
    # Additional metrics
    active_borrowers_by_location = me.DictField(default={})
    loan_repayment_rate_by_location = me.DictField(default={})
    average_loan_size_by_location = me.DictField(default={})
    
    meta = {
        'collection': 'distribution_metrics',
        'ordering': ['-date'],
        'indexes': [
            'mfi_id',
            'date'
        ]
    }

class CreditHistory(me.Document):
    """
    MongoDB model for borrower credit history
    """
    borrower_id = me.UUIDField(required=True)
    mfi_id = me.UUIDField(required=True)
    mfi_location = me.StringField()  # Store the MFI's location
    date = me.DateTimeField(default=datetime.now)
    
    # Credit score components
    credit_score = me.IntField(default=0)
    payment_history = me.DictField(default={})
    loan_utilization = me.DecimalField(precision=2, default=0)
    loan_diversity = me.IntField(default=0)
    
    # Loan history
    total_loans = me.IntField(default=0)
    total_amount_borrowed = me.DecimalField(precision=2, default=0)
    total_amount_repaid = me.DecimalField(precision=2, default=0)
    
    # Payment behavior
    on_time_payments = me.IntField(default=0)
    late_payments = me.IntField(default=0)
    defaulted_payments = me.IntField(default=0)
    
    # Risk factors
    risk_factors = me.ListField(me.StringField(), default=[])
    
    meta = {
        'collection': 'credit_history',
        'ordering': ['-date'],
        'indexes': [
            'borrower_id',
            'mfi_id',
            'mfi_location',
            ('borrower_id', 'date'),
            ('mfi_id', 'date'),
            ('mfi_location', 'date'),
        ]
    }

class DistributedCreditHistory(me.Document):
    """
    MongoDB model for distributed borrower credit history across MFIs in the same location
    """
    borrower_id = me.UUIDField(required=True)
    national_id = me.StringField(required=True)  # To identify borrowers across MFIs
    location = me.StringField(required=True)  # Location code (e.g., 'MASERU')
    date = me.DateTimeField(default=datetime.now)
    
    # Aggregated credit score from all MFIs in the location
    aggregated_credit_score = me.IntField(default=0)
    
    # Contributing MFIs
    contributing_mfis = me.ListField(me.DictField(), default=[])  # List of {mfi_id, mfi_name, location}
    
    # Aggregated loan history
    total_loans_count = me.IntField(default=0)
    total_amount_borrowed = me.DecimalField(precision=2, default=0)
    total_amount_repaid = me.DecimalField(precision=2, default=0)
    
    # Aggregated payment behavior
    on_time_payments = me.IntField(default=0)
    late_payments = me.IntField(default=0)
    defaulted_payments = me.IntField(default=0)
    
    # Consolidated risk factors
    risk_factors = me.ListField(me.StringField(), default=[])
    
    # Detailed history from each MFI (limited information)
    mfi_records = me.DictField(default={})
    
    # Audit trail for data sharing
    data_sharing_log = me.ListField(me.DictField(), default=[])  # List of {mfi_id, timestamp, action}
    
    meta = {
        'collection': 'distributed_credit_history',
        'ordering': ['-date'],
        'indexes': [
            'borrower_id',
            'national_id',
            'location',
            ('national_id', 'location'),
            ('borrower_id', 'date'),
            ('location', 'date'),
        ]
    }
