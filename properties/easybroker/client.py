"""Cliente HTTP para la API de EasyBroker."""

from __future__ import annotations

import json
import urllib.error
import urllib.parse
import urllib.request
from typing import Any

from django.conf import settings


class EasyBrokerError(Exception):
    """Error al comunicarse con EasyBroker."""


class EasyBrokerClient:
    def __init__(
        self,
        *,
        api_key: str | None = None,
        base_url: str | None = None,
        country_code: str = "MX",
    ) -> None:
        self.api_key = api_key or settings.EASYBROKER_API_KEY
        self.base_url = (base_url or settings.EASYBROKER_API_BASE_URL).rstrip("/")
        self.country_code = country_code

        if not self.api_key:
            raise EasyBrokerError(
                "Falta EASYBROKER_API_KEY en .env. Agregala en Configuracion de EasyBroker."
            )

    def _request(self, path: str) -> dict[str, Any]:
        url = f"{self.base_url}{path}"
        request = urllib.request.Request(
            url,
            headers={
                "X-Authorization": self.api_key,
                "accept": "application/json",
                "Country-Code": self.country_code,
                "User-Agent": "TotalLiving/1.0",
            },
            method="GET",
        )

        try:
            with urllib.request.urlopen(request, timeout=45) as response:
                payload = response.read().decode("utf-8")
        except urllib.error.HTTPError as exc:
            body = exc.read().decode("utf-8", errors="replace")
            if exc.code == 401:
                raise EasyBrokerError(
                    "API Key invalida. Verifica EASYBROKER_API_KEY en EasyBroker > Configuracion > API."
                ) from exc
            raise EasyBrokerError(f"EasyBroker respondió {exc.code}: {body}") from exc
        except urllib.error.URLError as exc:
            raise EasyBrokerError(f"No se pudo conectar con EasyBroker: {exc.reason}") from exc

        try:
            return json.loads(payload)
        except json.JSONDecodeError as exc:
            raise EasyBrokerError("Respuesta inválida de EasyBroker.") from exc

    def list_properties(
        self,
        *,
        page: int = 1,
        limit: int = 50,
        published_only: bool = True,
    ) -> dict[str, Any]:
        query: dict[str, str | int] = {"page": page, "limit": limit}
        if published_only:
            query["search[statuses][]"] = "published"
        return self._request(f"/properties?{urllib.parse.urlencode(query)}")

    def get_property(self, public_id: str) -> dict[str, Any]:
        return self._request(f"/properties/{urllib.parse.quote(public_id)}")

    def iter_published_properties(self, *, limit: int = 50) -> list[dict[str, Any]]:
        page = 1
        items: list[dict[str, Any]] = []

        while True:
            data = self.list_properties(page=page, limit=limit, published_only=True)
            batch = data.get("content") or []
            items.extend(batch)

            pagination = data.get("pagination") or {}
            if not pagination.get("next_page"):
                break
            page += 1

        return items
