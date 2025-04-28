from .mongodb import MONGODB_DATABASES, MongoDBRouter

# MongoDB settings
MONGODB_NAME = 'letsema_mfi'
MONGODB_HOST = 'localhost'
MONGODB_PORT = 27017
MONGODB_USERNAME = ''
MONGODB_PASSWORD = ''

MONGODB_HOST = os.environ.get('MONGODB_HOST', 'letsema.iasgr.mongodb.net')
MONGODB_PORT = int(os.environ.get('MONGODB_PORT', 27017))
MONGODB_USERNAME = os.environ.get('MONGODB_USERNAME', 'tebellolenyatsabernice')
MONGODB_PASSWORD = os.environ.get('MONGODB_PASSWORD', '')
MONGODB_DATABASE = os.environ.get('MONGODB_DATABASE', 'letsema_mfi')

# Add MongoDB to databases
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ.get('DB_NAME', 'letsema_mfi'),
        'USER': os.environ.get('DB_USER', 'postgres'),
        'PASSWORD': os.environ.get('DB_PASSWORD', ''),
        'HOST': os.environ.get('DB_HOST', 'localhost'),
        'PORT': os.environ.get('DB_PORT', '5432'),
    },
    'mongodb': {
        'ENGINE': 'django_mongodb_engine',
        'NAME': MONGODB_DATABASE,
        'HOST': MONGODB_HOST,
        'PORT': MONGODB_PORT,
        'USER': MONGODB_USERNAME,
        'PASSWORD': MONGODB_PASSWORD,
        'TZ_AWARE': True,
        'OPTIONS': {
            'retryWrites': True,
            'w': 'majority',
            'appName': 'letsema'
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
