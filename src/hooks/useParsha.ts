import { useEffect, useState } from 'react';
import type { CachedParsha } from '../parsha/cacheTypes.ts';
import { fetchParsha } from '../parsha/fetchParsha.ts';

export function useParsha(fullRef?: string) {
  const [parsha, setParsha] = useState<CachedParsha | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const result = await fetchParsha({ fullRef });
        if (!cancelled) setParsha(result);
      } catch (e) {
        console.error(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [fullRef]);

  return { parsha, loading };
}
