from django.conf import settings
import mongoengine

# Connect to MongoDB using MongoEngine
def connect_mongodb():
    """
    Connect to MongoDB using MongoEngine with connection string
    """
    from django.conf import settings
    import os
    
    # Use the connection string if available
    connection_string = os.environ.get('MONGODB_URI')
    
    if connection_string:
        # Connect using the connection string
        mongoengine.connect(
            host=connection_string,
            alias='default'
        )
        print("Successfully connected to MongoDB Atlas using connection string")
    else:
        # Fallback to individual parameters
        mongoengine.connect(
            db=settings.MONGODB_NAME,
            host=settings.MONGODB_HOST,
            port=settings.MONGODB_PORT,
            username=settings.MONGODB_USERNAME,
            password=settings.MONGODB_PASSWORD,
            authentication_source='admin'
        )
        print("Successfully connected to MongoDB Atlas using individual parameters")

# MongoDB router
class MongoDBRouter:
    """
    Router to handle MongoDB models
    """
    def db_for_read(self, model, **hints):
        if hasattr(model, '_meta') and hasattr(model._meta, 'mongodb_model'):
            return 'mongodb'
        return None

    def db_for_write(self, model, **hints):
        if hasattr(model, '_meta') and hasattr(model._meta, 'mongodb_model'):
            return 'mongodb'
        return None

    def allow_relation(self, obj1, obj2, **hints):
        return None

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        if db == 'mongodb':
            return False
        return None
