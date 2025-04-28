from decimal import Decimal
from .models import DistributionMetrics, CreditHistory, DistributedCreditHistory, LesothoDistrict
from django.utils import timezone
from datetime import timedelta
from users.models import Borrower, MFI
import uuid
from .atlas_utils import get_atlas_db
import logging

logger = logging.getLogger(__name__)

def get_location_code_from_name(location_name):
    """
    Extract location code from location name
    """
    for code, name in LesothoDistrict.DISTRICT_CHOICES:
        if name.upper() in location_name.upper():
            return code
    return None

def calculate_location_distribution(mfi_id, days=30):
    """
    Calculate loan distribution metrics by location for the specified time period
    """
    start_date = timezone.now() - timedelta(days=days)
    
    # Get MFI location
    try:
        mfi = MFI.objects.get(mfi_id=mfi_id)
        mfi_location = mfi.location
        location_code = get_location_code_from_name(mfi_location)
    except MFI.DoesNotExist:
        return None
    
    # Get all credit histories for the period
    credit_histories = CreditHistory.objects(
        mfi_id=str(mfi_id),
        date__gte=start_date
    )
    
    # Initialize distribution metrics
    distribution = {
        'total_loans': 0,
        'total_amount': Decimal('0'),
        'location_distribution': {
            district[0]: {'count': 0, 'amount': Decimal('0'), 'percentage': 0}
            for district in LesothoDistrict.DISTRICT_CHOICES
        },
        'active_borrowers_by_location': {},
        'loan_repayment_rate_by_location': {},
        'average_loan_size_by_location': {}
    }
    
    # Calculate metrics
    for history in credit_histories:
        history_location = history.mfi_location or location_code
        
        distribution['total_loans'] += history.total_loans
        distribution['total_amount'] += history.total_amount_borrowed
        
        # Update location distribution
        if history_location in distribution['location_distribution']:
            location_data = distribution['location_distribution'][history_location]
            location_data['count'] += history.total_loans
            location_data['amount'] += history.total_amount_borrowed
        
        # Update active borrowers
        if history_location not in distribution['active_borrowers_by_location']:
            distribution['active_borrowers_by_location'][history_location] = 0
        distribution['active_borrowers_by_location'][history_location] += 1
        
        # Calculate repayment rate
        if history.total_amount_borrowed > 0:
            repayment_rate = (history.total_amount_repaid / history.total_amount_borrowed) * 100
            if history_location not in distribution['loan_repayment_rate_by_location']:
                distribution['loan_repayment_rate_by_location'][history_location] = []
            distribution['loan_repayment_rate_by_location'][history_location].append(repayment_rate)
    
    # Calculate percentages and averages
    for location in distribution['location_distribution']:
        location_data = distribution['location_distribution'][location]
        if distribution['total_loans'] > 0:
            location_data['percentage'] = (location_data['count'] / distribution['total_loans']) * 100
        
        # Calculate average loan size by location
        if location_data['count'] > 0:
            distribution['average_loan_size_by_location'][location] = location_data['amount'] / location_data['count']
        
        # Calculate average repayment rate by location
        if location in distribution['loan_repayment_rate_by_location']:
            rates = distribution['loan_repayment_rate_by_location'][location]
            if rates:
                distribution['loan_repayment_rate_by_location'][location] = sum(rates) / len(rates)
    
    # Calculate overall average loan size
    if distribution['total_loans'] > 0:
        distribution['average_loan_size'] = distribution['total_amount'] / distribution['total_loans']
    
    return distribution

def update_distribution_metrics(mfi_id, days=30):
    """
    Update the distribution metrics in the database
    """
    distribution = calculate_location_distribution(mfi_id, days)
    
    if not distribution:
        return None
    
    # Create or update the distribution metrics
    metrics = DistributionMetrics.objects(
        mfi_id=str(mfi_id),
        date=timezone.now()
    ).first()
    
    if not metrics:
        metrics = DistributionMetrics(
            mfi_id=str(mfi_id),
            date=timezone.now(),
            total_loans=distribution['total_loans'],
            total_amount=distribution['total_amount'],
            average_loan_size=distribution['average_loan_size'],
            location_distribution=distribution['location_distribution'],
            active_borrowers_by_location=distribution['active_borrowers_by_location'],
            loan_repayment_rate_by_location=distribution['loan_repayment_rate_by_location'],
            average_loan_size_by_location=distribution['average_loan_size_by_location']
        )
        metrics.save()
    else:
        metrics.update(
            total_loans=distribution['total_loans'],
            total_amount=distribution['total_amount'],
            average_loan_size=distribution['average_loan_size'],
            location_distribution=distribution['location_distribution'],
            active_borrowers_by_location=distribution['active_borrowers_by_location'],
            loan_repayment_rate_by_location=distribution['loan_repayment_rate_by_location'],
            average_loan_size_by_location=distribution['average_loan_size_by_location']
        )
    
    return metrics

def update_distributed_credit_history(borrower_id, national_id, mfi_id=None):
    """
    Update the distributed credit history for a borrower across all MFIs in the same location
    """
    logger.info(f"Updating distributed credit history for borrower {borrower_id} with national ID {national_id}")
    
    # Get MongoDB Atlas connection
    atlas_db = get_atlas_db()
    if not atlas_db:
        logger.error("Failed to connect to MongoDB Atlas")
        return None
        
    try:
        # Get borrower information
        borrower = Borrower.objects.get(borrower_id=borrower_id)
        
        # Get MFI information
        if mfi_id:
            mfi = MFI.objects.get(mfi_id=mfi_id)
        elif borrower.mfi:
            mfi = borrower.mfi
        else:
            return None
        
        # Get location code from MFI location
        location_name = mfi.location
        location_code = get_location_code_from_name(location_name)
        
        if not location_code:
            return None
        
        # Get all credit histories for this borrower
        credit_histories = CreditHistory.objects(
            borrower_id=str(borrower_id)
        )
        
        # Get all MFIs in the same location
        mfis_in_location = MFI.objects.filter(location__icontains=location_name)
        mfi_ids = [str(mfi.mfi_id) for mfi in mfis_in_location]
        
        # Get credit histories from other MFIs in the same location for the same national ID
        borrowers_with_same_id = Borrower.objects.filter(national_id=national_id)
        other_borrower_ids = [str(b.borrower_id) for b in borrowers_with_same_id if str(b.borrower_id) != str(borrower_id)]
        
        other_credit_histories = []
        if other_borrower_ids:
            other_credit_histories = CreditHistory.objects(
                borrower_id__in=other_borrower_ids,
                mfi_id__in=mfi_ids
            )
        
        # Combine all credit histories
        all_histories = list(credit_histories) + list(other_credit_histories)
        
        if not all_histories:
            return None
        
        # Initialize aggregated data
        aggregated_data = {
            'aggregated_credit_score': 0,
            'contributing_mfis': [],
            'total_loans_count': 0,
            'total_amount_borrowed': Decimal('0'),
            'total_amount_repaid': Decimal('0'),
            'on_time_payments': 0,
            'late_payments': 0,
            'defaulted_payments': 0,
            'risk_factors': set(),
            'mfi_records': {},
            'data_sharing_log': []
        }
        
        # Aggregate data from all histories
        credit_scores = []
        for history in all_histories:
            history_mfi_id = str(history.mfi_id)
            
            # Get MFI information
            try:
                history_mfi = MFI.objects.get(mfi_id=uuid.UUID(history_mfi_id))
                mfi_name = history_mfi.name
                mfi_location = history_mfi.location
            except MFI.DoesNotExist:
                mfi_name = f"MFI {history_mfi_id}"
                mfi_location = "Unknown"
            
            # Add to contributing MFIs if not already added
            mfi_info = {
                'mfi_id': history_mfi_id,
                'mfi_name': mfi_name,
                'location': mfi_location
            }
            
            if mfi_info not in aggregated_data['contributing_mfis']:
                aggregated_data['contributing_mfis'].append(mfi_info)
            
            credit_scores.append(history.credit_score)
            aggregated_data['total_loans_count'] += history.total_loans
            aggregated_data['total_amount_borrowed'] += history.total_amount_borrowed
            aggregated_data['total_amount_repaid'] += history.total_amount_repaid
            aggregated_data['on_time_payments'] += history.on_time_payments
            aggregated_data['late_payments'] += history.late_payments
            aggregated_data['defaulted_payments'] += history.defaulted_payments
            
            for risk in history.risk_factors:
                aggregated_data['risk_factors'].add(risk)
            
            # Store limited information about each MFI's record
            aggregated_data['mfi_records'][history_mfi_id] = {
                'mfi_name': mfi_name,
                'credit_score': history.credit_score,
                'total_loans': history.total_loans,
                'total_amount_borrowed': float(history.total_amount_borrowed),
                'on_time_payments': history.on_time_payments,
                'late_payments': history.late_payments,
                'defaulted_payments': history.defaulted_payments,
                'last_updated': history.date.isoformat()
            }
            
            # Add to data sharing log
            aggregated_data['data_sharing_log'].append({
                'mfi_id': history_mfi_id,
                'mfi_name': mfi_name,
                'timestamp': timezone.now().isoformat(),
                'action': 'data_contributed'
            })
        
        # Calculate aggregated credit score (weighted average)
        if credit_scores:
            aggregated_data['aggregated_credit_score'] = sum(credit_scores) // len(credit_scores)
        
        # Convert risk factors set to list
        aggregated_data['risk_factors'] = list(aggregated_data['risk_factors'])
        
        # Create or update distributed credit history
        distributed_history = DistributedCreditHistory.objects(
            national_id=national_id,
            location=location_code
        ).first()
        
        if not distributed_history:
            distributed_history = DistributedCreditHistory(
                borrower_id=str(borrower_id),
                national_id=national_id,
                location=location_code,
                date=timezone.now(),
                aggregated_credit_score=aggregated_data['aggregated_credit_score'],
                contributing_mfis=aggregated_data['contributing_mfis'],
                total_loans_count=aggregated_data['total_loans_count'],
                total_amount_borrowed=aggregated_data['total_amount_borrowed'],
                total_amount_repaid=aggregated_data['total_amount_repaid'],
                on_time_payments=aggregated_data['on_time_payments'],
                late_payments=aggregated_data['late_payments'],
                defaulted_payments=aggregated_data['defaulted_payments'],
                risk_factors=aggregated_data['risk_factors'],
                mfi_records=aggregated_data['mfi_records'],
                data_sharing_log=aggregated_data['data_sharing_log']
            )
            distributed_history.save()
        else:
            # Add new data sharing log entries
            current_log = distributed_history.data_sharing_log
            current_log.extend(aggregated_data['data_sharing_log'])
            
            distributed_history.update(
                borrower_id=str(borrower_id),
                date=timezone.now(),
                aggregated_credit_score=aggregated_data['aggregated_credit_score'],
                contributing_mfis=aggregated_data['contributing_mfis'],
                total_loans_count=aggregated_data['total_loans_count'],
                total_amount_borrowed=aggregated_data['total_amount_borrowed'],
                total_amount_repaid=aggregated_data['total_amount_repaid'],
                on_time_payments=aggregated_data['on_time_payments'],
                late_payments=aggregated_data['late_payments'],
                defaulted_payments=aggregated_data['defaulted_payments'],
                risk_factors=aggregated_data['risk_factors'],
                mfi_records=aggregated_data['mfi_records'],
                data_sharing_log=current_log
            )
        
        return distributed_history
    
    except (Borrower.DoesNotExist, MFI.DoesNotExist) as e:
        print(f"Error updating distributed credit history: {str(e)}")
        return None

def create_credit_history_entry(borrower_id, mfi_id, credit_data):
    """
    Create a new credit history entry for a borrower
    """
    try:
        # Get borrower and MFI information
        borrower = Borrower.objects.get(borrower_id=borrower_id)
        mfi = MFI.objects.get(mfi_id=mfi_id)
        
        # Get location code from MFI location
        location_name = mfi.location
        location_code = get_location_code_from_name(location_name)
        
        # Create credit history entry
        credit_history = CreditHistory(
            borrower_id=str(borrower_id),
            mfi_id=str(mfi_id),
            mfi_location=location_code,
            date=timezone.now(),
            credit_score=credit_data.get('credit_score', 0),
            payment_history=credit_data.get('payment_history', {}),
            loan_utilization=credit_data.get('loan_utilization', 0),
            loan_diversity=credit_data.get('loan_diversity', 0),
            total_loans=credit_data.get('total_loans', 0),
            total_amount_borrowed=credit_data.get('total_amount_borrowed', 0),
            total_amount_repaid=credit_data.get('total_amount_repaid', 0),
            on_time_payments=credit_data.get('on_time_payments', 0),
            late_payments=credit_data.get('late_payments', 0),
            defaulted_payments=credit_data.get('defaulted_payments', 0),
            risk_factors=credit_data.get('risk_factors', [])
        )
        credit_history.save()
        
        # Update distributed credit history
        update_distributed_credit_history(borrower_id, borrower.national_id, mfi_id)
        
        return credit_history
    
    except (Borrower.DoesNotExist, MFI.DoesNotExist) as e:
        print(f"Error creating credit history entry: {str(e)}")
        return None
