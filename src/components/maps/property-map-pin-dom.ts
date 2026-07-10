import { formatMapPinPrice } from "@/lib/format-map-price";
import type { Property } from "@/types/property";

/** Contenido DOM del pin con precio (para AdvancedMarker imperativo). */
export function createPropertyPinContent(
  property: Property,
  active = false,
): HTMLElement {
  const root = document.createElement("div");
  root.className = active ? "tl-gmap-pin tl-gmap-pin--active" : "tl-gmap-pin";
  root.title = property.title;

  const price = document.createElement("span");
  price.className = "tl-gmap-pin__price";
  price.textContent = formatMapPinPrice(property.price, property.currency);

  const dot = document.createElement("span");
  dot.className = "tl-gmap-pin__dot";

  root.append(price, dot);
  return root;
}

export function setPropertyPinActive(content: HTMLElement, active: boolean) {
  content.classList.toggle("tl-gmap-pin--active", active);
}

export function createClusterContent(count: number): HTMLElement {
  const sizeClass =
    count < 10 ? "" : count < 25 ? " tl-gmap-cluster--md" : " tl-gmap-cluster--lg";
  const el = document.createElement("div");
  el.className = `tl-gmap-cluster${sizeClass}`;
  el.innerHTML = `<span>${count}</span>`;
  return el;
}
