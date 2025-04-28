import os

# MongoDB settings
MONGODB_NAME = os.environ.get('MONGODB_DATABASE', 'letsema_mfi')
MONGODB_HOST = os.environ.get('MONGODB_HOST', 'letsema.iasgr.mongodb.net')
MONGODB_PORT = int(os.environ.get('MONGODB_PORT', 27017))
MONGODB_USERNAME = os.environ.get('MONGODB_USERNAME', 'tebellolenyatsabernice')
MONGODB_PASSWORD = os.environ.get('MONGODB_PASSWORD', 'Letsema123')
MONGODB_URI = os.environ.get('MONGODB_URI', 'mongodb+srv://tebellolenyatsabernice:Letsema123@letsema.iasgr.mongodb.net/?retryWrites=true&w=majority&appName=letsema')

# Add MongoDB to databases
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ.get('SUPABASE_DBNAME', 'postgres'),
        'USER': os.environ.get('SUPABASE_USER', 'postgres'),
        'PASSWORD': os.environ.get('SUPABASE_PASSWORD', ''),
        'HOST': os.environ.get('SUPABASE_HOST', 'localhost'),
        'PORT': os.environ.get('SUPABASE_PORT', '5432'),
    },
    'mongodb': {
        'ENGINE': 'django_mongodb_engine',
        'NAME': MONGODB_NAME,
        'HOST': MONGODB_HOST,
        'PORT': MONGODB_PORT,
        'USER': MONGODB_USERNAME,
        'PASSWORD': MONGODB_PASSWORD,
        'TZ_AWARE': True,
        'OPTIONS': {
            'retryWrites': True,
            'w': 'majority',
            'appName': 'letsema',
            'ssl': True,
            'ssl_cert_reqs': False  # For Atlas connections
        }
    }
}

# Add MongoDB router
DATABASE_ROUTERS = ['LetsemaMFI.settings.mongodb.MongoDBRouter']

INSTALLED_APPS = [
    # ... existing apps ...
    'analytics',
    'mongoengine',
]

# Initialize MongoDB connection
from .mongodb import connect_mongodb
connect_mongodb()
