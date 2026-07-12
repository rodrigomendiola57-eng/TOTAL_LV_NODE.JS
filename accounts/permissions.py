from rest_framework.permissions import SAFE_METHODS, BasePermission


class IsStaffOrReadOnly(BasePermission):
    """
    GET/HEAD/OPTIONS: público.
    Escritura: solo usuarios autenticados con is_staff (panel Total Living).
    """

    def has_permission(self, request, view) -> bool:
        if request.method in SAFE_METHODS:
            return True
        user = request.user
        return bool(user and user.is_authenticated and user.is_staff)


class IsStaffUser(BasePermission):
    """Acceso total solo para staff del panel (CRM, etc.)."""

    def has_permission(self, request, view) -> bool:
        user = request.user
        return bool(user and user.is_authenticated and user.is_staff)
