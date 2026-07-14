"""
URL configuration for totalliving_backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf import settings
from django.contrib import admin
from django.urls import include, path, re_path

from totalliving_backend.media_views import serve_media

admin_path = getattr(settings, "ADMIN_URL", "admin/")

urlpatterns = [
    path(admin_path, admin.site.urls),
    path("api/", include("accounts.urls")),
    path("api/", include("properties.urls")),
    path("api/", include("crm.urls")),
    path("api/", include("site_content.urls")),
    path("api/", include("developments.urls")),
    path("api/", include("zones.urls")),
    path("api/", include("about.urls")),
    path("api/", include("asesoria.urls")),
    path("api/", include("contact.urls")),
    re_path(r"^media/(?P<path>.*)$", serve_media, name="serve-media"),
]
