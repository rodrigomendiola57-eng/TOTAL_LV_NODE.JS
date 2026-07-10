"use client";

import { ZONE_CATALOG } from "@/lib/data/zones";
import { useEffect, useState } from "react";

import { getApiBaseUrl } from "@/lib/api-base-url";

function emptyZonePropertyCounts(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const zone of ZONE_CATALOG) {
    counts[zone.name] = 0;
  }
  return counts;
}

export function useZonePropertyCounts() {
  const [counts, setCounts] = useState(emptyZonePropertyCounts);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const next = emptyZonePropertyCounts();

      try {
        let page = 1;
        let hasNext = true;

        while (hasNext && page <= 100) {
          const response = await fetch(`${getApiBaseUrl()}/properties/?page=${page}`, {
            headers: { Accept: "application/json" },
          });

          if (!response.ok) break;

          const data = (await response.json()) as {
            next?: string | null;
            results?: {
              features?: { properties?: { zone?: string } }[];
            };
          };

          for (const feature of data.results?.features ?? []) {
            const zone = feature.properties?.zone;
            if (zone && zone in next) {
              next[zone] += 1;
            }
          }

          hasNext = Boolean(data.next);
          page += 1;
        }
      } catch {
        // Sin API: mantener ceros
      }

      if (!cancelled) {
        setCounts(next);
        setIsLoading(false);
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  return { counts, isLoading };
}
