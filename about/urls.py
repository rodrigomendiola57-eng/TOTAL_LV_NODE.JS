from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import AboutPageViewSet, TeamMemberViewSet

router = DefaultRouter()
router.register(r"about-page", AboutPageViewSet, basename="about-page")
router.register(r"team-members", TeamMemberViewSet, basename="team-members")

urlpatterns = [
    path("", include(router.urls)),
]
