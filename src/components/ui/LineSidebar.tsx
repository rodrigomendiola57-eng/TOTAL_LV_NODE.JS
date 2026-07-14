"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
} from "react";

import "./LineSidebar.css";

const FALLOFF_CURVES = {
  linear: (p: number) => p,
  smooth: (p: number) => p * p * (3 - 2 * p),
  sharp: (p: number) => p * p * p,
} as const;

type Falloff = keyof typeof FALLOFF_CURVES;

export interface LineSidebarProps {
  items?: string[];
  accentColor?: string;
  textColor?: string;
  markerColor?: string;
  showIndex?: boolean;
  showMarker?: boolean;
  proximityRadius?: number;
  maxShift?: number;
  falloff?: Falloff;
  markerLength?: number;
  markerGap?: number;
  tickScale?: number;
  scaleTick?: boolean;
  itemGap?: number;
  fontSize?: number;
  smoothing?: number;
  defaultActive?: number | null;
  /** Controlled active index (scroll sync). */
  activeIndex?: number | null;
  onItemClick?: (index: number, label: string) => void;
  className?: string;
  /** Right-rail: shift labels toward the page (negative X). */
  alignEnd?: boolean;
}

export function LineSidebar({
  items = [],
  accentColor = "#d6b585",
  textColor = "rgba(242, 236, 224, 0.55)",
  markerColor = "rgba(214, 181, 133, 0.35)",
  showIndex = true,
  showMarker = true,
  proximityRadius = 100,
  maxShift = 30,
  falloff = "smooth",
  markerLength = 60,
  markerGap = 0,
  tickScale = 0.5,
  scaleTick = true,
  itemGap = 20,
  fontSize = 1.1,
  smoothing = 100,
  defaultActive = null,
  activeIndex: activeIndexProp,
  onItemClick,
  className = "",
  alignEnd = false,
}: LineSidebarProps) {
  const listRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const targetsRef = useRef<number[]>([]);
  const currentRef = useRef<number[]>([]);
  const rafRef = useRef<number | null>(null);
  const lastRef = useRef(0);
  const activeRef = useRef<number | null>(defaultActive);
  const smoothingRef = useRef(smoothing);
  const [activeIndex, setActiveIndex] = useState<number | null>(
    activeIndexProp ?? defaultActive,
  );

  useEffect(() => {
    if (activeIndexProp === undefined) return;
    setActiveIndex(activeIndexProp);
  }, [activeIndexProp]);

  activeRef.current = activeIndex;
  smoothingRef.current = smoothing;

  const runFrame = useCallback((now: number) => {
    const dt = Math.min((now - lastRef.current) / 1000, 0.05);
    lastRef.current = now;
    const tau = Math.max(smoothingRef.current, 1) / 1000;
    const k = 1 - Math.exp(-dt / tau);

    let moving = false;
    const els = itemRefs.current;
    for (let i = 0; i < els.length; i++) {
      const el = els[i];
      if (!el) continue;
      const target = Math.max(
        targetsRef.current[i] || 0,
        activeRef.current === i ? 1 : 0,
      );
      const cur = currentRef.current[i] || 0;
      const next = cur + (target - cur) * k;
      const settled = Math.abs(target - next) < 0.0015;
      const value = settled ? target : next;
      currentRef.current[i] = value;
      el.style.setProperty("--effect", value.toFixed(4));
      if (!settled) moving = true;
    }

    rafRef.current = moving ? requestAnimationFrame(runFrame) : null;
  }, []);

  const startLoop = useCallback(() => {
    if (rafRef.current != null) return;
    lastRef.current = performance.now();
    rafRef.current = requestAnimationFrame(runFrame);
  }, [runFrame]);

  // Reinicia buffers y arranca la animación cuando montan / cambian los ítems.
  useLayoutEffect(() => {
    // Reinicio limpio del bucle: cancela cualquier frame previo y libera el
    // ref. Imprescindible porque en dev (StrictMode) los refs sobreviven al
    // ciclo montaje→desmontaje→remontaje; si `rafRef` quedara con un id ya
    // cancelado, la guarda de `startLoop` bloquearía el bucle para siempre.
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    const count = items.length;
    targetsRef.current = Array.from({ length: count }, () => 0);
    currentRef.current = Array.from({ length: count }, () => 0);
    itemRefs.current = itemRefs.current.slice(0, count);

    for (let i = 0; i < count; i++) {
      const el = itemRefs.current[i];
      el?.style.setProperty("--effect", "0");
    }

    startLoop();
  }, [items, startLoop]);

  const handlePointerMove = useCallback(
    (e: PointerEvent<HTMLUListElement>) => {
      const list = listRef.current;
      if (!list) return;
      const pointerY = e.clientY;
      const ease = FALLOFF_CURVES[falloff] ?? FALLOFF_CURVES.linear;
      const els = itemRefs.current;
      for (let i = 0; i < els.length; i++) {
        const el = els[i];
        if (!el) continue;
        const itemRect = el.getBoundingClientRect();
        const center = itemRect.top + itemRect.height / 2;
        const distance = Math.abs(pointerY - center);
        targetsRef.current[i] = ease(
          Math.max(0, 1 - distance / proximityRadius),
        );
      }
      startLoop();
    },
    [falloff, proximityRadius, startLoop],
  );

  const handlePointerLeave = useCallback(() => {
    targetsRef.current = targetsRef.current.map(() => 0);
    startLoop();
  }, [startLoop]);

  const handleClick = useCallback(
    (index: number, label: string) => {
      setActiveIndex(index);
      onItemClick?.(index, label);
    },
    [onItemClick],
  );

  useEffect(() => {
    startLoop();
  }, [activeIndex, startLoop]);

  useEffect(
    () => () => {
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    },
    [],
  );

  return (
    <nav
      className={[
        "line-sidebar",
        showMarker ? "line-sidebar--markers" : "",
        scaleTick ? "line-sidebar--scale-tick" : "",
        alignEnd ? "line-sidebar--end" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={
        {
          "--accent-color": accentColor,
          "--text-color": textColor,
          "--marker-color": markerColor,
          "--marker-length": `${markerLength}px`,
          "--marker-gap": `${markerGap}px`,
          "--tick-scale": tickScale,
          "--max-shift": `${maxShift}px`,
          "--item-gap": `${itemGap}px`,
          "--font-size": `${fontSize}rem`,
          "--smoothing": `${smoothing}ms`,
        } as CSSProperties
      }
      aria-label="Navegación de zonas"
    >
      <ul
        ref={listRef}
        className="line-sidebar__list"
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        {items.map((label, index) => (
          <li
            key={`${label}-${index}`}
            ref={(el) => {
              itemRefs.current[index] = el;
            }}
            className="line-sidebar__item"
            aria-current={activeIndex === index ? "true" : undefined}
          >
            <button
              type="button"
              className="line-sidebar__button"
              onClick={() => handleClick(index, label)}
            >
              {showMarker ? (
                <span className="line-sidebar__marker" aria-hidden="true" />
              ) : null}
              <span className="line-sidebar__label">
                {showIndex ? (
                  <span className="line-sidebar__index">
                    {String(index).padStart(2, "0")}
                  </span>
                ) : null}
                <span className="line-sidebar__text">{label}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
