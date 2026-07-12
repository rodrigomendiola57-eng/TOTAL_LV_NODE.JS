"""
Django settings for totalliving_backend project.

Backend headless para Total Living — portal inmobiliario premium + CRM.
"""

from pathlib import Path

import environ

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

env = environ.Env(
    DEBUG=(bool, False),
    # Sin ngrok por defecto (A4). En DEBUG se añaden abajo para tunnels.
    ALLOWED_HOSTS=(list, ["localhost", "127.0.0.1"]),
    EASYBROKER_API_KEY=(str, ""),
    EASYBROKER_API_BASE_URL=(str, "https://api.easybroker.com/v1"),
)

environ.Env.read_env(BASE_DIR / ".env")

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = env("DEBUG")

# SECURITY WARNING: keep the secret key used in production secret!
# En producción (DEBUG=False) SECRET_KEY es obligatorio (sin default débil).
if DEBUG:
    SECRET_KEY = env(
        "SECRET_KEY",
        default="django-insecure-dev-only-change-in-production",
    )
else:
    SECRET_KEY = env("SECRET_KEY")

ALLOWED_HOSTS = list(env("ALLOWED_HOSTS"))


def _host_looks_like_ngrok(host: str) -> bool:
    h = (host or "").lower().strip()
    if not h:
        return False
    markers = (
        "ngrok-free.dev",
        "ngrok-free.app",
        "ngrok.io",
        "ngrok.app",
    )
    bare = h.lstrip(".")
    return any(bare == m or bare.endswith("." + m) or m in bare for m in markers)


# Dev: tunnels ngrok convenientes. Prod: nunca (aunque vengan en .env).
if DEBUG:
    for _extra in (".ngrok-free.dev", ".ngrok-free.app", ".ngrok.io"):
        if _extra not in ALLOWED_HOSTS:
            ALLOWED_HOSTS.append(_extra)
else:
    ALLOWED_HOSTS = [h for h in ALLOWED_HOSTS if not _host_looks_like_ngrok(h)]
    if not ALLOWED_HOSTS:
        from django.core.exceptions import ImproperlyConfigured

        raise ImproperlyConfigured(
            "DEBUG=False requiere ALLOWED_HOSTS explícitos (sin comodines ngrok).",
        )


# Application definition

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
  # GeoDjango — requiere PostgreSQL + extensión PostGIS
    "django.contrib.gis",
    # Terceros
    "rest_framework",
    "rest_framework.authtoken",
    "rest_framework_gis",
    "corsheaders",
    "django_filters",
  # Apps del proyecto
    "accounts",
    "properties",
    "crm",
    "site_content",
    "developments",
    "zones",
    "about",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    # Debe ir al inicio para inyectar headers CORS correctamente.
    "corsheaders.middleware.CorsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "accounts.middleware.AdminIPRestrictMiddleware",
]

# Permite peticiones del frontend Next.js en desarrollo y ngrok.
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
CORS_ALLOWED_ORIGIN_REGEXES = [
    r"^https://.*\.ngrok-free\.dev$",
    r"^https://.*\.ngrok-free\.app$",
    r"^https://.*\.ngrok\.io$",
]

# Token del panel: misma ventana que la cookie Next (7 días).
AUTH_TOKEN_TTL_SECONDS = env.int("AUTH_TOKEN_TTL_SECONDS", default=60 * 60 * 24 * 7)

# Django Admin — path configurable + allowlist IP opcional (Fase 1).
ADMIN_URL = env("ADMIN_URL", default="admin/")
if not str(ADMIN_URL).endswith("/"):
    ADMIN_URL = f"{ADMIN_URL}/"
ADMIN_ALLOWED_IPS = env.list("ADMIN_ALLOWED_IPS", default=[])

# Proxies que pueden fijar X-Real-IP / X-Forwarded-For (Next → Django).
# Vacío no es recomendable en prod: sin peer de confianza no se lee XFF.
TRUSTED_PROXY_IPS = env.list(
    "TRUSTED_PROXY_IPS",
    default=["127.0.0.1", "::1"],
)

# Cache compartido entre workers (A1). Redis si hay URL; en prod sin Redis
# DatabaseCache; en DEBUG LocMem basta.
REDIS_URL = (env("REDIS_URL", default="") or "").strip()
if REDIS_URL:
    CACHES = {
        "default": {
            "BACKEND": "django.core.cache.backends.redis.RedisCache",
            "LOCATION": REDIS_URL,
        }
    }
elif not DEBUG:
    CACHES = {
        "default": {
            "BACKEND": "django.core.cache.backends.db.DatabaseCache",
            "LOCATION": "django_cache_table",
        }
    }
else:
    CACHES = {
        "default": {
            "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
            "LOCATION": "totalliving-dev",
        }
    }

REST_FRAMEWORK = {
    # Lectura pública; escritura del panel solo staff (IsStaffOrReadOnly).
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "accounts.authentication.ExpiringTokenAuthentication",
        "rest_framework.authentication.SessionAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "accounts.permissions.IsStaffOrReadOnly",
    ],
    "DEFAULT_THROTTLE_CLASSES": [
        "rest_framework.throttling.AnonRateThrottle",
        "rest_framework.throttling.UserRateThrottle",
    ],
    "DEFAULT_THROTTLE_RATES": {
        "anon": "240/hour",
        "user": "2000/hour",
        "auth_login": "8/minute",
        "lead_create": "12/hour",
    },
    "DEFAULT_PAGINATION_CLASS": "totalliving_backend.pagination.StandardResultsSetPagination",
    "PAGE_SIZE": 12,
    "DEFAULT_FILTER_BACKENDS": [
        "django_filters.rest_framework.DjangoFilterBackend",
    ],
}


ROOT_URLCONF = "totalliving_backend.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "totalliving_backend.wsgi.application"


# Database — PostgreSQL con soporte espacial (PostGIS)
# https://docs.djangoproject.com/en/6.0/ref/contrib/gis/install/postgis/

DATABASES = {
    "default": {
        "ENGINE": "django.contrib.gis.db.backends.postgis",
        "NAME": env("DB_NAME", default="totalliving_db"),
        "USER": env("DB_USER", default="postgres"),
        "PASSWORD": (
            env("DB_PASSWORD")
            if not DEBUG
            else env("DB_PASSWORD", default="postgres")
        ),
        "HOST": env("DB_HOST", default="localhost"),
        "PORT": env("DB_PORT", default="5432"),
    }
}


# GeoDjango — librerías nativas (opcional en Windows vía OSGeo4W)
if env("GDAL_LIBRARY_PATH", default=None):
    GDAL_LIBRARY_PATH = env("GDAL_LIBRARY_PATH")
if env("GEOS_LIBRARY_PATH", default=None):
    GEOS_LIBRARY_PATH = env("GEOS_LIBRARY_PATH")


# Password validation

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


# Internationalization

LANGUAGE_CODE = "es-mx"

TIME_ZONE = "America/Mexico_City"

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)

STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

# Media — fotos de perfil de asesores, etc.

MEDIA_URL = "media/"
MEDIA_ROOT = BASE_DIR / "media"
# True: Django sirve /media/ (dev + proxy Next). En prod con nginx/S3 → False.
MEDIA_SERVE_FROM_DJANGO = env.bool("MEDIA_SERVE_FROM_DJANGO", default=True)

# EasyBroker — sincronización de inventario
EASYBROKER_API_KEY = env("EASYBROKER_API_KEY")
EASYBROKER_API_BASE_URL = env("EASYBROKER_API_BASE_URL")

# Alertas de seguridad (Fase 3) — ver docs/SECURITY_FASE3.md
SECURITY_ALERT_WEBHOOK_URL = env("SECURITY_ALERT_WEBHOOK_URL", default="")
SECURITY_LOGIN_FAIL_ALERT_THRESHOLD = env.int(
    "SECURITY_LOGIN_FAIL_ALERT_THRESHOLD",
    default=5,
)
SECURITY_LEAD_SPIKE_THRESHOLD = env.int("SECURITY_LEAD_SPIKE_THRESHOLD", default=20)

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
        },
    },
    "loggers": {
        "totalliving.security": {
            "handlers": ["console"],
            "level": "WARNING",
            "propagate": False,
        },
    },
}

# --- Producción HTTPS / cookies (solo si DEBUG=False) ---
if not DEBUG:
    SECURE_SSL_REDIRECT = env.bool("SECURE_SSL_REDIRECT", default=True)
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_HSTS_SECONDS = env.int("SECURE_HSTS_SECONDS", default=31_536_000)
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True
    SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
    SECURE_CONTENT_TYPE_NOSNIFF = True
    SECURE_REFERRER_POLICY = "strict-origin-when-cross-origin"
    CSRF_TRUSTED_ORIGINS = env.list("CSRF_TRUSTED_ORIGINS", default=[])
    # Prod: siempre sin regex ngrok. Orígenes solo los de env (explícitos).
    CORS_ALLOWED_ORIGIN_REGEXES = []
    CORS_ALLOWED_ORIGINS = env.list("CORS_ALLOWED_ORIGINS", default=[])

