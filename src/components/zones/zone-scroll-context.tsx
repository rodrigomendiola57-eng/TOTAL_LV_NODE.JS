"use client";

import { createContext, useContext, type RefObject } from "react";

export const ZoneScrollContext = createContext<RefObject<HTMLElement | null> | null>(
  null,
);

export function useZoneScrollRoot(): RefObject<HTMLElement | null> | null {
  return useContext(ZoneScrollContext);
}
