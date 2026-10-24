"use client";

import { useEffect, useState } from "react";

const MAX_AGE_MS = 24 * 60 * 60 * 1000;
const PREFIX = "icpep-cache:";

export const readCache = <T,>(key: string): T | null => {
  try {
    const raw = sessionStorage.getItem(PREFIX + key);
    if (!raw) return null;
    const { savedAt, data } = JSON.parse(raw) as { savedAt: number; data: T };
    return Date.now() - savedAt < MAX_AGE_MS ? data : null;
  } catch {
    return null;
  }
};

export const writeCache = (key: string, data: unknown) => {
  try {
    sessionStorage.setItem(PREFIX + key, JSON.stringify({ savedAt: Date.now(), data }));
  } catch {
    return;
  }
};

export function useCachedFetch<T>(key: string, fetcher: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const cached = readCache<T>(key);
    if (cached !== null) {
      setData(cached);
      setLoading(false);
    }

    fetcher()
      .then((fresh) => {
        if (!active) return;
        setData(fresh);
        writeCache(key, fresh);
      })
      .catch(() => undefined)
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [key]);

  return { data, loading };
}
