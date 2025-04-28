"""
Utility functions for MongoDB Atlas integration
"""
import os
import logging
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ConfigurationError

logger = logging.getLogger(__name__)

def get_atlas_client():
    """
    Get a MongoDB Atlas client using environment variables
    """
    try:
        # First try using the full URI if available
        uri = os.environ.get('MONGODB_URI')
        if uri:
            client = MongoClient(uri)
        else:
            # Otherwise construct from individual components
            host = os.environ.get('MONGODB_HOST', 'letsema.iasgr.mongodb.net')
            port = int(os.environ.get('MONGODB_PORT', 27017))
            username = os.environ.get('MONGODB_USERNAME', 'tebellolenyatsabernice')
            password = os.environ.get('MONGODB_PASSWORD', '')
            
            # Construct MongoDB Atlas URI
            uri = f"mongodb+srv://{username}:{password}@{host}/?retryWrites=true&w=majority&appName=letsema"
            client = MongoClient(uri)
            
        # Test connection
        client.admin.command('ping')
        logger.info("Successfully connected to MongoDB Atlas")
        return client
    
    except (ConnectionFailure, ConfigurationError) as e:
        logger.error(f"Failed to connect to MongoDB Atlas: {e}")
        return None

def get_atlas_db(client=None):
    """
    Get MongoDB Atlas database
    """
    if client is None:
        client = get_atlas_client()
    
    if client:
        db_name = os.environ.get('MONGODB_DATABASE', 'letsema_mfi')
        return client[db_name]
    
    return None
