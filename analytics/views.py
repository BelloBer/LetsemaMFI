from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from analytics.atlas_utils import get_atlas_client, get_atlas_db
from analytics.models import DistributedCreditHistory, CreditHistory, DistributionMetrics
import logging

logger = logging.getLogger(__name__)

@api_view(['GET'])
def test_mongodb_atlas_connection(request):
    """
    Test MongoDB Atlas connection
    """
    client = get_atlas_client()
    if not client:
        return Response(
            {"status": "error", "message": "Failed to connect to MongoDB Atlas"}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    
    db = get_atlas_db(client)
    if not db:
        return Response(
            {"status": "error", "message": "Failed to get MongoDB Atlas database"}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    
    # Get list of collections
    collections = db.list_collection_names()
    
    return Response({
        "status": "success",
        "message": "Successfully connected to MongoDB Atlas",
        "database": db.name,
        "collections": collections
    })

@api_view(['GET'])
def get_distributed_credit_history(request, national_id=None):
    """
    Get distributed credit history for a borrower by national ID
    """
    if not national_id:
        national_id = request.query_params.get('national_id')
    
    if not national_id:
        return Response(
            {"status": "error", "message": "National ID is required"}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        # Query distributed credit history
        credit_history = DistributedCreditHistory.objects(national_id=national_id).first()
        
        if not credit_history:
            return Response(
                {"status": "error", "message": "No credit history found for this national ID"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Log access
        mfi_id = request.query_params.get('mfi_id', 'unknown')
        user_id = request.user.id if request.user.is_authenticated else 'anonymous'
        credit_history.add_access_log(mfi_id, user_id, 'API query')
        
        # Convert to dictionary for response
        result = {
            "borrower_id": credit_history.borrower_id,
            "national_id": credit_history.national_id,
            "full_name": credit_history.full_name,
            "location": credit_history.location,
            "credit_score": credit_history.credit_score,
            "total_loans": credit_history.total_loans,
            "active_loans": credit_history.active_loans,
            "total_amount_borrowed": credit_history.total_amount_borrowed,
            "outstanding_amount": credit_history.outstanding_amount,
            "avg_days_late": credit_history.avg_days_late,
            "source_mfis": credit_history.source_mfis
        }
        
        return Response({"status": "success", "data": result})
    
    except Exception as e:
        logger.error(f"Error retrieving distributed credit history: {str(e)}")
        return Response(
            {"status": "error", "message": f"Error retrieving credit history: {str(e)}"}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
def get_distributed_credit_stats(request):
    """
    Get statistics about distributed credit history
    """
    try:
        # Count records by location
        locations = DistributedCreditHistory.objects.aggregate([
            {"$group": {"_id": "$location", "count": {"$sum": 1}}}
        ])
        
        # Calculate average credit scores
        avg_scores = DistributedCreditHistory.objects.aggregate([
            {"$group": {"_id": None, "avg_score": {"$avg": "$credit_score"}}}
        ])
        
        # Count active loans
        active_loans = DistributedCreditHistory.objects.aggregate([
            {"$group": {"_id": None, "total_active": {"$sum": "$active_loans"}}}
        ])
        
        # Format results
        locations_result = list(locations)
        avg_score = list(avg_scores)[0]['avg_score'] if list(avg_scores) else 0
        total_active = list(active_loans)[0]['total_active'] if list(active_loans) else 0
        
        return Response({
            "status": "success", 
            "data": {
                "locations": locations_result,
                "avg_credit_score": avg_score,
                "total_active_loans": total_active,
                "total_borrowers": DistributedCreditHistory.objects.count()
            }
        })
    
    except Exception as e:
        logger.error(f"Error retrieving distributed credit stats: {str(e)}")
        return Response(
            {"status": "error", "message": f"Error retrieving credit stats: {str(e)}"}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
