from pathlib import Path

from django.contrib.auth.models import AnonymousUser, User
from django.core.cache import cache
from django.http import HttpResponse
from django.test import RequestFactory, SimpleTestCase, override_settings
from rest_framework.test import APIRequestFactory

from accounts.client_ip import get_client_ip
from accounts.middleware import AdminIPRestrictMiddleware
from accounts.permissions import IsStaffOrReadOnly
from accounts.security_alerts import (
    clear_failed_login,
    record_failed_login,
    send_security_alert,
)


class SecurityAlertsTests(SimpleTestCase):
    def setUp(self):
        cache.clear()
        self.factory = RequestFactory()

    @override_settings(SECURITY_LOGIN_FAIL_ALERT_THRESHOLD=3, SECURITY_ALERT_WEBHOOK_URL="")
    def test_failed_login_increments_and_alerts_at_threshold(self):
        request = self.factory.post("/api/auth/login/")
        request.META["REMOTE_ADDR"] = "203.0.113.10"

        with self.assertLogs("totalliving.security", level="WARNING") as logs:
            record_failed_login(request, "alice")
            record_failed_login(request, "alice")
            record_failed_login(request, "alice")

        joined = "\n".join(logs.output)
        self.assertIn("login_failed", joined)
        self.assertIn("SECURITY_ALERT", joined)
        self.assertIn("203.0.113.10", joined)

    def test_clear_failed_login(self):
        request = self.factory.post("/api/auth/login/")
        request.META["REMOTE_ADDR"] = "203.0.113.11"
        record_failed_login(request, "bob")
        clear_failed_login(request)
        self.assertIsNone(cache.get("sec:login_fail:203.0.113.11"))

    @override_settings(SECURITY_ALERT_WEBHOOK_URL="")
    def test_send_alert_without_webhook_only_logs(self):
        with self.assertLogs("totalliving.security", level="WARNING") as logs:
            send_security_alert("ping de prueba")
        self.assertTrue(any("ping de prueba" in line for line in logs.output))


@override_settings(TRUSTED_PROXY_IPS=["127.0.0.1", "::1"])
class ClientIpTrustedProxyTests(SimpleTestCase):
    def setUp(self):
        self.factory = RequestFactory()

    def test_direct_client_ignores_spoofed_xff(self):
        request = self.factory.get("/")
        request.META["REMOTE_ADDR"] = "203.0.113.50"
        request.META["HTTP_X_FORWARDED_FOR"] = "198.51.100.1"
        request.META["HTTP_X_REAL_IP"] = "198.51.100.1"
        self.assertEqual(get_client_ip(request), "203.0.113.50")

    def test_trusted_proxy_uses_x_real_ip(self):
        request = self.factory.get("/")
        request.META["REMOTE_ADDR"] = "127.0.0.1"
        request.META["HTTP_X_REAL_IP"] = "203.0.113.77"
        request.META["HTTP_X_FORWARDED_FOR"] = "198.51.100.9"
        self.assertEqual(get_client_ip(request), "203.0.113.77")

    def test_trusted_proxy_falls_back_to_xff(self):
        request = self.factory.get("/")
        request.META["REMOTE_ADDR"] = "127.0.0.1"
        request.META["HTTP_X_FORWARDED_FOR"] = "203.0.113.88, 10.0.0.1"
        self.assertEqual(get_client_ip(request), "203.0.113.88")

    @override_settings(SECURITY_LOGIN_FAIL_ALERT_THRESHOLD=2, SECURITY_ALERT_WEBHOOK_URL="")
    def test_failed_login_alert_uses_forwarded_ip_via_proxy(self):
        cache.clear()
        request = self.factory.post("/api/auth/login/")
        request.META["REMOTE_ADDR"] = "127.0.0.1"
        request.META["HTTP_X_REAL_IP"] = "203.0.113.99"

        with self.assertLogs("totalliving.security", level="WARNING") as logs:
            record_failed_login(request, "carol")
            record_failed_login(request, "carol")

        joined = "\n".join(logs.output)
        self.assertIn("203.0.113.99", joined)
        self.assertNotIn("127.0.0.1", joined.split("SECURITY_ALERT")[-1])


@override_settings(
    ADMIN_URL="admin/",
    ADMIN_ALLOWED_IPS=["203.0.113.10"],
    TRUSTED_PROXY_IPS=["127.0.0.1", "::1"],
)
class AdminIPRestrictMiddlewareTests(SimpleTestCase):
    def setUp(self):
        self.factory = RequestFactory()
        self.middleware = AdminIPRestrictMiddleware(lambda r: HttpResponse("ok"))

    def test_spoofed_xff_from_untrusted_peer_denied(self):
        request = self.factory.get("/admin/")
        request.META["REMOTE_ADDR"] = "198.51.100.50"
        request.META["HTTP_X_FORWARDED_FOR"] = "203.0.113.10"
        response = self.middleware(request)
        self.assertEqual(response.status_code, 403)

    def test_allowed_via_trusted_proxy_x_real_ip(self):
        request = self.factory.get("/admin/")
        request.META["REMOTE_ADDR"] = "127.0.0.1"
        request.META["HTTP_X_REAL_IP"] = "203.0.113.10"
        response = self.middleware(request)
        self.assertEqual(response.status_code, 200)


class StaffOrReadOnlyPermissionTests(SimpleTestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.perm = IsStaffOrReadOnly()

    def test_anon_can_get(self):
        request = self.factory.get("/api/properties/")
        request.user = AnonymousUser()
        self.assertTrue(self.perm.has_permission(request, None))

    def test_anon_cannot_post(self):
        request = self.factory.post("/api/properties/")
        request.user = AnonymousUser()
        self.assertFalse(self.perm.has_permission(request, None))

    def test_staff_can_post(self):
        request = self.factory.post("/api/properties/")
        request.user = User(username="staff", is_staff=True, is_active=True)
        self.assertTrue(self.perm.has_permission(request, None))


class DjangoProxyAuthBlockContractTests(SimpleTestCase):
    """Contrato: el proxy Next no reexpone /api/django/auth/*."""

    def test_guard_module_blocks_auth_segment(self):
        root = Path(__file__).resolve().parent.parent
        guards = (root / "src" / "lib" / "api" / "django-proxy-guards.ts").read_text(
            encoding="utf-8",
        )
        route = (
            root / "src" / "app" / "api" / "django" / "[...path]" / "route.ts"
        ).read_text(encoding="utf-8")
        self.assertIn('return root === "auth"', guards)
        self.assertIn("isBlockedAuthProxyPath", route)
