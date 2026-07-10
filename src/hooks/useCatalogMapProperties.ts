"use client";

import {
  fetchCatalogMapPropertiesClient,
  prefetchCatalogMapBundle,
  type GetPropertiesPageParams,
} from "@/lib/api";
import type { Property } from "@/types/property";
import { useEffect, useMemo, useState } from "react";

interface UseCatalogMapPropertiesOptions {
  /** Precarga datos en segundo plano aunque la vista activa sea lista. */
  prefetch?: boolean;
}

interface UseCatalogMapPropertiesResult {
  properties: Property[];
  isLoading: boolean;
  error: Error | null;
}

export function useCatalogMapProperties(
  params: Omit<GetPropertiesPageParams, "page">,
  options: UseCatalogMapPropertiesOptions = {},
): UseCatalogMapPropertiesResult {
  const { prefetch = true } = options;
  const paramsKey = useMemo(() => JSON.stringify(params), [params]);

  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!prefetch) return;
    prefetchCatalogMapBundle();
  }, [prefetch]);

  useEffect(() => {
    if (!prefetch) {
      setProperties([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    fetchCatalogMapPropertiesClient(params)
      .then((data) => {
        if (!cancelled) {
          setProperties(data);
          setIsLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error("Error al cargar mapa"));
          setProperties([]);
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [paramsKey, prefetch, params]);

  return { properties, isLoading, error };
}
