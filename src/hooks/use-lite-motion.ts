"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const LITE_MOTION_QUERY = "(max-width: 1023px), (pointer: coarse)";

/**
 * Activa animaciones ligeras en móvil / pantalla táctil o si el usuario prefiere
 * menos movimiento. Evita parallax, blur y scroll-linked transforms costosos.
 */
export function useLiteMotion(): boolean {
  const reducedMotion = useReducedMotion();
  const [isLiteDevice, setIsLiteDevice] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia(LITE_MOTION_QUERY);

    const sync = () => {
      setIsLiteDevice(mediaQuery.matches);
    };

    sync();
    mediaQuery.addEventListener("change", sync);
    return () => mediaQuery.removeEventListener("change", sync);
  }, []);

  return Boolean(reducedMotion) || isLiteDevice;
}

export function matchesLiteMotionViewport(): boolean {
  if (typeof window === "undefined") return true;
  return window.matchMedia(LITE_MOTION_QUERY).matches;
}
