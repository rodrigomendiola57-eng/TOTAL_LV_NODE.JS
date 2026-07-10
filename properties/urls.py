"""Rutas API de propiedades."""

from rest_framework.routers import DefaultRouter

from .views import AmenityViewSet, PropertyViewSet

router = DefaultRouter()
router.register("properties", PropertyViewSet, basename="property")
router.register("amenities", AmenityViewSet, basename="amenity")

urlpatterns = router.urls
