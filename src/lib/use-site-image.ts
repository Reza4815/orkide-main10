"use client";

import { useQuery } from "@tanstack/react-query";

export function useSiteImage(key: string, fallback: string): string {
  const { data } = useQuery({
    queryKey: ["site-image", key],
    queryFn: async () => {
      const res = await fetch(`/api/public/site-images?key=${encodeURIComponent(key)}`);
      if (!res.ok) return null;
      const row = (await res.json()) as { url?: string } | null;
      return row?.url || null;
    },
    staleTime: 60_000,
  });
  return data || fallback;
}
