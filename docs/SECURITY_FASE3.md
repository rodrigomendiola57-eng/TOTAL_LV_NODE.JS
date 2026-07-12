# Seguridad — Fase 3 (defensa en profundidad)

Complementa Fases 0–2. Lo que está **en el código** vs lo que configuras en el edge.

## 1. Headers y CSP (Next.js)

`next.config.ts` envía en cada respuesta (excepto `output: export` / GitHub Pages):

| Header | Valor |
|--------|--------|
| `Content-Security-Policy` | `self` + Maps + Matterport + Unsplash + blob/WebGL |
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `SAMEORIGIN` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | camera/mic off; geolocation self |
| `Strict-Transport-Security` | solo `NODE_ENV=production` |

Si algo se rompe (mapa, iframe Matterport), revisa la CSP en DevTools → Network → Response Headers y amplía el host necesario.

Django en prod también: `SECURE_CONTENT_TYPE_NOSNIFF`, `SECURE_REFERRER_POLICY` (con `DEBUG=False`).

## 2. Rate limit en el edge

DRF ya limita login (8/min) y leads (12/h). En producción añade capa delante:

### Cloudflare (recomendado)

Dashboard → **Security → WAF → Rate limiting rules**:

1. **Protect your login** (o regla custom) sobre:
   - `POST /api/auth/login` (si el origen expone Django)
   - `POST /api/auth/login` vía Next: path `/api/auth/login`
2. Regla para contacto: `POST /api/django/leads/` o `/api/leads/` según cómo publiques la API.
3. Umbrales orientativos: login 10 req / 1 min → Block 15 min; leads 30 / 1 h → Challenge.

Docs: [Cloudflare Rate limiting](https://developers.cloudflare.com/waf/rate-limiting-rules/).

### Nginx

```nginx
limit_req_zone $binary_remote_addr zone=tl_login:10m rate=8r/m;
limit_req_zone $binary_remote_addr zone=tl_leads:10m rate=12r/h;

location = /api/auth/login {
  limit_req zone=tl_login burst=3 nodelay;
  proxy_pass http://next_upstream;
}
```

## 3. Alertas (código)

Variables en `.env`:

```env
SECURITY_ALERT_WEBHOOK_URL=https://hooks.slack.com/services/...
SECURITY_LOGIN_FAIL_ALERT_THRESHOLD=5
SECURITY_LEAD_SPIKE_THRESHOLD=20
```

- **Login fallido:** tras N intentos/hora/IP → log `totalliving.security` + webhook JSON `{"text":"..."}` (Slack Incoming Webhook / Discord compatible con adaptador).
- **Pico de leads:** ≥ N leads web en 1 h → una alerta por hora.

Sin webhook, solo verás el log en la consola de Django.

## 3b. Cache compartido + IP real (PR 1 / A1+A2)

Throttles DRF y alertas usan `django.core.cache`. Sin `CACHES` explícito,
Django usa LocMem **por proceso** → en gunicorn con N workers el límite real
es ~N× el configurado.

| Entorno | Backend |
|---------|---------|
| `REDIS_URL` definido | `RedisCache` |
| `DEBUG=False` sin Redis | `DatabaseCache` (`django_cache_table`) |
| `DEBUG=True` | `LocMemCache` (dev) |

En prod con DatabaseCache, una vez:

```powershell
.\venv\Scripts\python.exe manage.py createcachetable
```

Next reenvía `X-Forwarded-For` / `X-Real-IP` en `/api/auth/*`, `/api/django/*`,
`/api/media/*` y el middleware. Django solo lee esos headers si
`REMOTE_ADDR` ∈ `TRUSTED_PROXY_IPS` (default `127.0.0.1,::1`).

```env
REDIS_URL=redis://127.0.0.1:6379/1
TRUSTED_PROXY_IPS=127.0.0.1,::1
```

## 3c. Superficie de producción (PR 2 / A3–A5)

- **Admin IP:** `AdminIPRestrictMiddleware` usa `get_client_ip` (solo XFF/X-Real-IP
  si el peer está en `TRUSTED_PROXY_IPS`). Spoofear `X-Forwarded-For` desde
  Internet no salta el allowlist.
- **ALLOWED_HOSTS / CORS:** con `DEBUG=False` se vacían regex ngrok siempre;
  `CORS_ALLOWED_ORIGINS` solo viene de env; hosts ngrok se eliminan de
  `ALLOWED_HOSTS` aunque estén en `.env`. Con `DEBUG=True` se añaden
  comodines ngrok para tunnels.
- **Ficha técnica PDF:** upload exige cabecera `%PDF-` (además de extensión /
  content-type / 15 MB). GET de `/technical-sheet/` permanece **público** (descarga
  en ficha pública); POST/DELETE solo staff.

## 3d. Red de seguridad tests + 500s (PR 3 / A6–A8)

- Reorder de fotos: `id`/`order`/`cover_id` deben ser enteros → **400** (no 500).
- `Lead.touch_from_message`: `unread_count` con `F("unread_count") + 1`.
- Tests: honeypot CRM, permisos staff, SVG/media path-safe, magic PDF, proxy auth bloqueado.

```powershell
.\venv\Scripts\python.exe manage.py test accounts crm.tests properties.tests
```

## 4. Auditoría de dependencias

```powershell
npm.cmd run audit:deps
.\venv\Scripts\python.exe -m pip_audit
```

O el script: `scripts/security-audit.ps1` / `scripts/security-audit.sh`.

Corre al menos cada sprint o en CI.

## 5. 2FA en Django Admin (opcional)

No está instalado (invasivo). Si lo necesitas: `django-otp` + `django-two-factor-auth`, o acceso solo por VPN + `ADMIN_ALLOWED_IPS` (ya en Fase 1).

## Checklist deploy

- [ ] CSP no rompe Maps / Matterport / media
- [ ] Rate limit Cloudflare o nginx en login + leads
- [ ] `SECURITY_ALERT_WEBHOOK_URL` configurado (o aceptar solo logs)
- [ ] Cache: `REDIS_URL` o `createcachetable` si usas DatabaseCache
- [ ] `TRUSTED_PROXY_IPS` incluye la IP de Next hacia Django
- [ ] `npm run audit:deps` + `pip-audit` sin críticos abiertos
- [ ] `CORS_ALLOWED_ORIGINS` y `ALLOWED_HOSTS` de dominio real (sin ngrok)
- [ ] `ADMIN_URL` / `ADMIN_ALLOWED_IPS` en prod
