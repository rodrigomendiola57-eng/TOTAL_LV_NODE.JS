"""Alertas de seguridad (login fallido, picos de leads).

Config:
  SECURITY_ALERT_WEBHOOK_URL — Slack/Discord/compatible (JSON {"text": "..."})
  SECURITY_LOGIN_FAIL_ALERT_THRESHOLD — default 5 / hora / IP
  SECURITY_LEAD_SPIKE_THRESHOLD — default 20 leads / hora
"""

from __future__ import annotations

import json
import logging
import urllib.error
import urllib.request
from datetime import timedelta

from django.conf import settings
from django.core.cache import cache
from django.utils import timezone

from accounts.client_ip import get_client_ip

logger = logging.getLogger("totalliving.security")


def client_ip(request) -> str:
    """IP del cliente (solo XFF/X-Real-IP si el peer es proxy de confianza)."""
    return get_client_ip(request)


def send_security_alert(message: str) -> None:
    """Log + webhook opcional. Nunca lanza (no romper login/leads)."""
    logger.warning("SECURITY_ALERT %s", message)
    url = (getattr(settings, "SECURITY_ALERT_WEBHOOK_URL", None) or "").strip()
    if not url:
        return
    try:
        body = json.dumps({"text": message}).encode("utf-8")
        req = urllib.request.Request(
            url,
            data=body,
            headers={"Content-Type": "application/json"},
            method="POST",
        )
        with urllib.request.urlopen(req, timeout=5) as resp:
            resp.read()
    except (urllib.error.URLError, TimeoutError, OSError) as exc:
        logger.error("No se pudo enviar webhook de seguridad: %s", exc)


def record_failed_login(request, username: str) -> None:
    ip = client_ip(request)
    key = f"sec:login_fail:{ip}"
    count = int(cache.get(key) or 0) + 1
    cache.set(key, count, timeout=3600)

    logger.warning(
        "login_failed ip=%s username=%s count=%s",
        ip,
        username[:80],
        count,
    )

    threshold = int(
        getattr(settings, "SECURITY_LOGIN_FAIL_ALERT_THRESHOLD", 5),
    )
    if threshold > 0 and (count == threshold or (count > threshold and count % threshold == 0)):
        send_security_alert(
            f"[Total Living] {count} logins fallidos en 1h desde IP {ip} "
            f"(último usuario intentado: {username[:40]!r})",
        )


def clear_failed_login(request) -> None:
    ip = client_ip(request)
    cache.delete(f"sec:login_fail:{ip}")


def maybe_alert_lead_spike() -> None:
    """Tras crear un lead real, avisa si hay pico en la última hora."""
    from crm.models import Lead, LeadChannel

    threshold = int(getattr(settings, "SECURITY_LEAD_SPIKE_THRESHOLD", 20))
    if threshold <= 0:
        return

    window_start = timezone.now() - timedelta(hours=1)
    count = Lead.objects.filter(
        channel=LeadChannel.WEB,
        created_at__gte=window_start,
    ).count()

    if count < threshold:
        return

    # Una alerta por hora calendario (debounce).
    flag = f"sec:lead_spike:{timezone.now().strftime('%Y%m%d%H')}"
    if cache.get(flag):
        return
    cache.set(flag, 1, timeout=3600)
    send_security_alert(
        f"[Total Living] Pico de leads web: {count} en la última hora "
        f"(umbral {threshold}). Revisa spam / bot.",
    )
