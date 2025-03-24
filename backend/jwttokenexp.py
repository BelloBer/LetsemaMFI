from datetime import timedelta

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=60),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
    "ALGORITHM": "HS256",
    "SIGNING_KEY": "django-insecure-$!c*b=*tcpo4k8fv5lac*$!cgp=76#(f*@ew8k6ih=)3x1)(k)",
    "VERIFYING_KEY": None,
    "AUTH_HEADER_TYPES": ("Bearer",),
}







