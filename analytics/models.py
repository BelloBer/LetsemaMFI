from django.db import models
from mongoengine import Document, StringField, DateTimeField, IntField, DictField, ListField, FloatField, EmbeddedDocument, EmbeddedDocumentField
import datetime

class DistributedCreditHistory(Document):
    """
    Distributed Credit History model for MongoDB
    
    This model stores aggregated credit history data from multiple MFIs in the same location.
    It's designed to be queried by borrower's national ID to get a complete credit history.
    """
    borrower_id = StringField(required=True)
    national_id = StringField(required=True, unique_with='location')
    full_name = StringField(required=True)
    location = StringField(required=True)  # City, district, or region
    credit_score = FloatField(default=0.0)
    
    # Aggregated loan history from all MFIs in this location
    total_loans = IntField(default=0)
    active_loans = IntField(default=0)
    total_amount_borrowed = FloatField(default=0.0)
    outstanding_amount = FloatField(default=0.0)
    last_payment_date = DateTimeField()
    avg_days_late = FloatField(default=0.0)
    
    # Loan status across MFIs (to prevent loan stacking)
    loan_statuses = ListField(DictField())  # List of dicts with MFI ID, loan status, amount, etc.
    
    # Source MFIs for this aggregated data
    source_mfis = ListField(StringField())
    
    # Data sharing and privacy
    data_sharing_agreement = StringField(default='limited')  # full, limited, none
    data_sharing_log = ListField(DictField())  # Who accessed this data and when
    
    # Metadata
    created_at = DateTimeField(default=datetime.datetime.now)
    updated_at = DateTimeField(default=datetime.datetime.now)
    
    meta = {
        'collection': 'distributed_credit_history',
        'indexes': [
            'borrower_id',
            'national_id',
            'location',
            ('national_id', 'location'),  # Compound index
            ('borrower_id', '-created_at')
        ]
    }
    
    def add_access_log(self, mfi_id, user_id, purpose):
        """Add an entry to the data sharing log"""
        log_entry = {
            'mfi_id': mfi_id,
            'user_id': user_id,
            'purpose': purpose,
            'timestamp': datetime.datetime.now()
        }
        self.data_sharing_log.append(log_entry)
        self.save()

class CreditHistory(Document):
    """
    Credit History model for MongoDB
    
    This model stores individual credit history records for each MFI.
    These records are then aggregated into the DistributedCreditHistory model.
    """
    borrower_id = StringField(required=True)
    national_id = StringField(required=True)
    mfi_id = StringField(required=True)
    mfi_name = StringField(required=True)
    mfi_location = StringField(required=True)
    
    # Loan history at this MFI
    loans_count = IntField(default=0)
    active_loans = IntField(default=0)
    total_amount = FloatField(default=0.0)
    outstanding_amount = FloatField(default=0.0)
    repayment_history = ListField(DictField())  # List of dicts with date, amount, on_time
    
    # Borrower risk assessment
    internal_score = FloatField()
    days_late_avg = FloatField(default=0.0)
    
    # Metadata
    date = DateTimeField(default=datetime.datetime.now)
    
    meta = {
        'collection': 'credit_history',
        'indexes': [
            'borrower_id',
            'national_id',
            'mfi_id',
            'mfi_location',
            ('borrower_id', '-date'),
            ('mfi_id', '-date'),
            ('mfi_location', '-date')
        ]
    }

class DistributionMetrics(Document):
    """
    Distribution Metrics model for MongoDB
    
    This model tracks loan distribution metrics by location, MFI, and time period.
    It's used for analytics and reporting.
    """
    mfi_id = StringField(required=True)
    location = StringField(required=True)
    date = DateTimeField(default=datetime.datetime.now)
    
    # Distribution metrics
    num_loans = IntField(default=0)
    total_amount = FloatField(default=0.0)
    avg_loan_size = FloatField(default=0.0)
    default_rate = FloatField(default=0.0)
    
    # Demographics
    borrower_demographics = DictField()  # Age groups, gender distribution, etc.
    
    meta = {
        'collection': 'distribution_metrics',
        'indexes': [
            'mfi_id',
            'location',
            'date',
            ('mfi_id', '-date'),
            ('location', '-date')
        ]
    }
