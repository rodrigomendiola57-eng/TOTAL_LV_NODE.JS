/**
 * Animaciones de cámara para el catálogo.
 * - animateMapCamera: interpolación continua (ficha individual).
 * - animateClusterDive: pan + zoom por niveles enteros (círculos/clusters).
 */

export type MapCameraTarget = {
  center: google.maps.LatLngLiteral;
  zoom: number;
};

export type MapCameraAnimation = {
  cancel: () => void;
  done: Promise<void>;
};

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function readCenter(map: google.maps.Map): google.maps.LatLngLiteral | null {
  const center = map.getCenter();
  if (!center) return null;
  return { lat: center.lat(), lng: center.lng() };
}

function applyCamera(
  map: google.maps.Map,
  center: google.maps.LatLngLiteral,
  zoom: number,
) {
  if (typeof map.moveCamera === "function") {
    map.moveCamera({ center, zoom });
    return;
  }
  map.setCenter(center);
  map.setZoom(zoom);
}

/**
 * Interpola centro y zoom (para ir a una propiedad concreta).
 */
export function animateMapCamera(
  map: google.maps.Map,
  target: MapCameraTarget,
  options?: { durationMs?: number },
): MapCameraAnimation {
  const startCenter = readCenter(map);
  const startZoom = map.getZoom() ?? target.zoom;

  if (!startCenter) {
    applyCamera(map, target.center, target.zoom);
    return { cancel: () => undefined, done: Promise.resolve() };
  }

  const zoomDelta = Math.abs(target.zoom - startZoom);
  const durationMs =
    options?.durationMs ??
    Math.round(Math.min(900, Math.max(420, 320 + zoomDelta * 160)));

  let rafId = 0;
  let cancelled = false;
  const startTime = performance.now();

  let resolveDone!: () => void;
  const done = new Promise<void>((resolve) => {
    resolveDone = resolve;
  });

  const tick = (now: number) => {
    if (cancelled) {
      resolveDone();
      return;
    }
    const t = Math.min(1, (now - startTime) / durationMs);
    const e = easeInOutCubic(t);

    applyCamera(
      map,
      {
        lat: startCenter.lat + (target.center.lat - startCenter.lat) * e,
        lng: startCenter.lng + (target.center.lng - startCenter.lng) * e,
      },
      startZoom + (target.zoom - startZoom) * e,
    );

    if (t < 1) {
      rafId = window.requestAnimationFrame(tick);
    } else {
      applyCamera(map, target.center, target.zoom);
      resolveDone();
    }
  };

  rafId = window.requestAnimationFrame(tick);

  return {
    cancel: () => {
      cancelled = true;
      window.cancelAnimationFrame(rafId);
      resolveDone();
    },
    done,
  };
}

/**
 * Transición de cluster (estilo Leaflet):
 * 1) centra el grupo con pan nativo
 * 2) sube el zoom de 1 en 1 (los círculos se recalculan limpio en cada nivel)
 * Sin fitBounds + corrección = sin rebote.
 */
export function animateClusterDive(
  map: google.maps.Map,
  target: MapCameraTarget,
  options?: { panMs?: number; stepMs?: number },
): MapCameraAnimation {
  const panMs = options?.panMs ?? 320;
  const stepMs = options?.stepMs ?? 160;
  let cancelled = false;
  const timeouts: number[] = [];

  const wait = (ms: number) =>
    new Promise<void>((resolve) => {
      const id = window.setTimeout(() => resolve(), ms);
      timeouts.push(id);
    });

  let resolveDone!: () => void;
  const done = new Promise<void>((resolve) => {
    resolveDone = resolve;
  });

  void (async () => {
    try {
      map.panTo(target.center);
      await wait(panMs);
      if (cancelled) return;

      const startZoom = Math.round(map.getZoom() ?? target.zoom);
      const endZoom = Math.round(target.zoom);
      if (startZoom === endZoom) {
        map.panTo(target.center);
        return;
      }

      const dir = endZoom > startZoom ? 1 : -1;
      for (
        let z = startZoom + dir;
        dir > 0 ? z <= endZoom : z >= endZoom;
        z += dir
      ) {
        if (cancelled) return;
        map.setZoom(z);
        // Re-centra suave en cada paso para no “perder” el grupo
        map.panTo(target.center);
        await wait(stepMs);
      }

      if (!cancelled) {
        map.setZoom(endZoom);
        map.panTo(target.center);
      }
    } finally {
      resolveDone();
    }
  })();

  return {
    cancel: () => {
      cancelled = true;
      for (const id of timeouts) window.clearTimeout(id);
      resolveDone();
    },
    done,
  };
}

export function toLatLngLiteral(
  value: google.maps.LatLng | google.maps.LatLngLiteral,
): google.maps.LatLngLiteral {
  if (typeof (value as google.maps.LatLng).lat === "function") {
    const latLng = value as google.maps.LatLng;
    return { lat: latLng.lat(), lng: latLng.lng() };
  }
  return value as google.maps.LatLngLiteral;
}
