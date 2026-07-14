from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import ContactPageViewSet

router = DefaultRouter()
router.register(r"contact-page", ContactPageViewSet, basename="contact-page")

urlpatterns = [
    path("", include(router.urls)),
]
