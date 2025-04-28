"""
Views for MongoDB Atlas integration testing
"""
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .atlas_utils import test_atlas_connection, get_atlas_db
import logging

logger = logging.getLogger(__name__)

class TestAtlasConnectionView(APIView):
    """
    Test the MongoDB Atlas connection
    """
    permission_classes = [IsAuthenticated, IsAdminUser]
    
    def get(self, request, *args, **kwargs):
        """
        Test the MongoDB Atlas connection
        """
        result = test_atlas_connection()
        return Response(result, status=status.HTTP_200_OK if result["status"] == "success" else status.HTTP_500_INTERNAL_SERVER_ERROR)

class DistributedCreditHistoryStatsView(APIView):
    """
    Get statistics about distributed credit history
    """
    permission_classes = [IsAuthenticated, IsAdminUser]
    
    def get(self, request, *args, **kwargs):
        """
        Get statistics about distributed credit history
        """
        try:
            atlas_db = get_atlas_db()
            if not atlas_db:
                return Response(
                    {"status": "error", "message": "Failed to connect to MongoDB Atlas"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
            
            # Get count of distributed credit history records
            distributed_history_count = atlas_db.distributed_credit_history.count_documents({})
            
            # Get count by location
            pipeline = [
                {"$group": {"_id": "$location", "count": {"$sum": 1}}},
                {"$sort": {"count": -1}}
            ]
            location_stats = list(atlas_db.distributed_credit_history.aggregate(pipeline))
            
            # Get count of unique borrowers
            unique_borrowers = len(atlas_db.distributed_credit_history.distinct("national_id"))
            
            # Get average credit score
            pipeline = [
                {"$group": {"_id": None, "avg_score": {"$avg": "$aggregated_credit_score"}}}
            ]
            avg_score_result = list(atlas_db.distributed_credit_history.aggregate(pipeline))
            avg_score = avg_score_result[0]["avg_score"] if avg_score_result else 0
            
            return Response({
                "status": "success",
                "total_records": distributed_history_count,
                "unique_borrowers": unique_borrowers,
                "average_credit_score": avg_score,
                "location_distribution": location_stats
            })
            
        except Exception as e:
            logger.error(f"Error getting distributed credit history stats: {str(e)}")
            return Response(
                {"status": "error", "message": f"Error: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
