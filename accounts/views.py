from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes, throttle_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from accounts.permissions import IsStaffUser
from accounts.security_alerts import clear_failed_login, record_failed_login
from accounts.throttles import AuthLoginThrottle


def _user_payload(user):
    return {
        "id": user.id,
        "username": user.username,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "email": user.email,
        "is_staff": user.is_staff,
        "is_superuser": user.is_superuser,
    }


@api_view(["POST"])
@permission_classes([AllowAny])
@throttle_classes([AuthLoginThrottle])
def login_view(request):
    """Login del panel Total Living. Solo usuarios staff/superuser."""
    username = (request.data.get("username") or "").strip()
    password = request.data.get("password") or ""

    if not username or not password:
        return Response(
            {"detail": "Usuario y contraseña son obligatorios."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    user = authenticate(
        request,
        username=username,
        password=password,
    )
    if user is None or not user.is_active:
        record_failed_login(request, username)
        return Response(
            {"detail": "Credenciales incorrectas."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if not (user.is_staff or user.is_superuser):
        record_failed_login(request, username)
        return Response(
            {
                "detail": "Este usuario no tiene acceso al panel. "
                "Marca 'Staff status' en Django Admin."
            },
            status=status.HTTP_403_FORBIDDEN,
        )

    clear_failed_login(request)
    # Rotación: un solo token vigente por usuario tras cada login.
    Token.objects.filter(user=user).delete()
    token = Token.objects.create(user=user)
    return Response({"token": token.key, "user": _user_payload(user)})


@api_view(["POST"])
@permission_classes([IsAuthenticated, IsStaffUser])
def logout_view(request):
    Token.objects.filter(user=request.user).delete()
    return Response({"detail": "Sesión cerrada."})


@api_view(["GET"])
@permission_classes([IsAuthenticated, IsStaffUser])
def me_view(request):
    return Response({"user": _user_payload(request.user)})
