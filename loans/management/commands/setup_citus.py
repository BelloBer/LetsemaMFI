from django.core.management.base import BaseCommand
from loans.citus_utils import (
    setup_citus_extension,
    create_distributed_table,
    create_reference_table,
    get_table_distribution_info
)

class Command(BaseCommand):
    help = 'Set up Citus distributed tables for Letsema MFI'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Setting up Citus extension...'))
        setup_citus_extension()
        
        # Distribute tables based on appropriate distribution keys
        self.stdout.write(self.style.SUCCESS('Creating distributed tables...'))
        
        # MFI table as reference table (small, needs to be available everywhere)
        create_reference_table('users_mfi')
        
        # Distribute borrowers by location (from the address JSON field)
        create_distributed_table('users_borrower', 'mfi_id')
        
        # Distribute loans by borrower_id for co-location with borrowers
        create_distributed_table('loans_loan', 'borrower_id')
        
        # Distribute repayments by loan_id for co-location with loans
        create_distributed_table('loans_repayment', 'loan_id')
        
        # Show distribution information
        self.stdout.write(self.style.SUCCESS('Distribution information:'))
        for table_info in get_table_distribution_info():
            self.stdout.write(f"Table: {table_info['table_name']}")
            self.stdout.write(f"  Method: {table_info['partmethod']}")
            self.stdout.write(f"  Key: {table_info['partkey']}")
            self.stdout.write(f"  Co-location ID: {table_info['colocationid']}")
