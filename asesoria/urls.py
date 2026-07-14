from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import AsesoriaPageViewSet

router = DefaultRouter()
router.register(r"asesoria-page", AsesoriaPageViewSet, basename="asesoria-page")

urlpatterns = [
    path("", include(router.urls)),
]
