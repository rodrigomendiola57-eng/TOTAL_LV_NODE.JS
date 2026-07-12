from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import ZoneViewSet, ZonesPageViewSet

router = DefaultRouter()
router.register(r"zones-page", ZonesPageViewSet, basename="zones-page")
router.register(r"zones", ZoneViewSet, basename="zones")

urlpatterns = [
    path("", include(router.urls)),
]
