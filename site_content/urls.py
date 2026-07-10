from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    HomeAboutSlideViewSet,
    HomeExpertisePillarViewSet,
    HomeExpertiseServiceViewSet,
    HomePageViewSet,
)

router = DefaultRouter()
router.register(r"home", HomePageViewSet, basename="home")
router.register(r"home/about-slides", HomeAboutSlideViewSet, basename="home-about-slides")
router.register(
    r"home/expertise-services",
    HomeExpertiseServiceViewSet,
    basename="home-expertise-services",
)
router.register(
    r"home/expertise-pillars",
    HomeExpertisePillarViewSet,
    basename="home-expertise-pillars",
)

urlpatterns = [
    path("", include(router.urls)),
]
