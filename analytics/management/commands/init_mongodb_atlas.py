"""
Management command to initialize MongoDB Atlas
"""
from django.core.management.base import BaseCommand
from analytics.atlas_utils import get_atlas_client, get_atlas_db
import logging

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Initialize MongoDB Atlas with necessary collections and indexes'
    
    def handle(self, *args, **options):
        self.stdout.write('Initializing MongoDB Atlas...')
        
        # Get MongoDB Atlas client
        client = get_atlas_client()
        if not client:
            self.stderr.write(self.style.ERROR('Failed to connect to MongoDB Atlas'))
            return
        
        # Get database
        db = get_atlas_db(client)
        if not db:
            self.stderr.write(self.style.ERROR('Failed to get MongoDB Atlas database'))
            return
        
        # Create collections if they don't exist
        collections = ['distribution_metrics', 'credit_history', 'distributed_credit_history']
        existing_collections = db.list_collection_names()
        
        for collection in collections:
            if collection not in existing_collections:
                db.create_collection(collection)
                self.stdout.write(self.style.SUCCESS(f'Created collection: {collection}'))
            else:
                self.stdout.write(f'Collection already exists: {collection}')
        
        # Create indexes
        try:
            # Indexes for distribution_metrics
            db.distribution_metrics.create_index('mfi_id')
            db.distribution_metrics.create_index('date')
            
            # Indexes for credit_history
            db.credit_history.create_index('borrower_id')
            db.credit_history.create_index('mfi_id')
            db.credit_history.create_index('mfi_location')
            db.credit_history.create_index([('borrower_id', 1), ('date', -1)])
            db.credit_history.create_index([('mfi_id', 1), ('date', -1)])
            db.credit_history.create_index([('mfi_location', 1), ('date', -1)])
            
            # Indexes for distributed_credit_history
            db.distributed_credit_history.create_index('borrower_id')
            db.distributed_credit_history.create_index('national_id')
            db.distributed_credit_history.create_index('location')
            db.distributed_credit_history.create_index([('national_id', 1), ('location', 1)], unique=True)
            db.distributed_credit_history.create_index([('borrower_id', 1), ('date', -1)])
            db.distributed_credit_history.create_index([('location', 1), ('date', -1)])
            
            self.stdout.write(self.style.SUCCESS('Created all indexes'))
            
        except Exception as e:
            self.stderr.write(self.style.ERROR(f'Error creating indexes: {str(e)}'))
        
        self.stdout.write(self.style.SUCCESS('MongoDB Atlas initialization complete'))
