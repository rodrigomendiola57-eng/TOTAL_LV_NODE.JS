from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    DevelopmentUnitModelViewSet,
    DevelopmentViewSet,
    DevelopmentsPageViewSet,
)

router = DefaultRouter()
router.register(
    r"developments-page",
    DevelopmentsPageViewSet,
    basename="developments-page",
)
router.register(r"developments", DevelopmentViewSet, basename="developments")
router.register(
    r"development-models",
    DevelopmentUnitModelViewSet,
    basename="development-models",
)

urlpatterns = [
    path("", include(router.urls)),
]
