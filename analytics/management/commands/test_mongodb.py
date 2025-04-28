from django.core.management.base import BaseCommand
import mongoengine
from analytics.models import DistributionMetrics
import datetime

class Command(BaseCommand):
    help = 'Test MongoDB connection'

    def handle(self, *args, **options):
        try:
            # Try to create a test document
            test_metric = DistributionMetrics(
                name='test_connection',
                value=1.0,
                location='TEST',
                mfi_id='test_mfi'
            )
            test_metric.save()
            
            # Try to retrieve it
            retrieved = DistributionMetrics.objects(name='test_connection').first()
            
            if retrieved:
                self.stdout.write(self.style.SUCCESS(
                    f'Successfully connected to MongoDB! Test document created with ID: {retrieved.metric_id}'
                ))
                
                # Clean up the test document
                retrieved.delete()
                self.stdout.write('Test document deleted.')
            else:
                self.stdout.write(self.style.ERROR('Failed to retrieve test document.'))
                
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'MongoDB connection failed: {str(e)}'))
