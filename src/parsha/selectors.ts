import type { CachedParsha } from './cacheTypes.ts';
import type { AliyahNumber } from './types.ts';

/**
 * Returns verses for the given aliyah number.
 * If no aliyah is specified, returns all verses.
 */
export function selectAliyah(parsha: CachedParsha, aliyah?: AliyahNumber) {
  if (!aliyah) return parsha.verses;

  const aliyahData = parsha.aliyot[aliyah];

  if (!aliyahData) {
    console.warn(`Aliyah ${aliyah} not found in parsha ${parsha.name}`);
    return parsha.verses;
  }

  const { startIndex, endIndex } = aliyahData;
  return parsha.verses.slice(startIndex, endIndex + 1);
}
