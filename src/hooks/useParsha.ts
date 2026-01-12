import { useEffect, useState } from 'react';
import type { CachedParsha } from '../parsha/cacheTypes.ts';
import { fetchParsha } from '../parsha/fetchParsha.ts';
import {
  loadCachedParsha,
  saveCachedParsha,
} from '../storage/parshaStorage.ts';

export function useParsha(fullRef?: string) {
  const [parsha, setParsha] = useState<CachedParsha | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!fullRef) return;

    let cancelled = false;

    (async () => {
      setLoading(true);
      try {
        // Check cache first
        const cached = await loadCachedParsha(fullRef);
        if (cached && !cancelled) {
          setParsha(cached);
          setLoading(false);
          return; // skip fetch
        }

        // If not in cache, fetch
        const fetched = await fetchParsha({ fullRef });
        if (!cancelled) {
          setParsha(fetched);
          await saveCachedParsha(fetched);
        }
      } catch (err) {
        console.error(err);
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
