import { fetchJSON } from '../utils/fetchJSON.ts';
import { buildCachedParsha } from './buildCachedParsha.ts';
import { buildVerses } from './buildVerses.ts';
import type { CachedParsha } from './cacheTypes.ts';
import { getWeeklyParsha } from './getParsha.ts';
import type {
  BookName,
  EnglishTextVersionOptions,
  HebrewTextVersionOptions,
  ParshaName,
} from './types.ts';

interface FetchParshaOptions {
  fullRef?: string; // optional; if missing, fetch current parsha
  hebrewTextVersion?: HebrewTextVersionOptions;
  englishTextVersion?: EnglishTextVersionOptions;
  timezone?: string;
  diaspora?: number;
}

export async function fetchParsha({
  fullRef,
  hebrewTextVersion = 'Miqra_according_to_the_Masorah',
  englishTextVersion = 'The_Koren_Jerusalem_Bible',
  timezone = 'America/New_York',
  diaspora = 1,
}: FetchParshaOptions): Promise<CachedParsha> {
  let ref = fullRef;
  let aliyahRanges: string[] = [];
  let parshaName: ParshaName;
  let book: BookName;

  // If no ref, get current parsha
  if (!ref) {
    const weekly = await getWeeklyParsha(timezone, diaspora);
    ref = weekly.fullRef;
    aliyahRanges = weekly.aliyot;
    parshaName = weekly.name as ParshaName;
  }

  // Fetch parsha text from Sefaria
  const textJson = await fetchJSON<any>(
    `https://www.sefaria.org/api/texts/${ref}?context=0&lang=he&vhe=${hebrewTextVersion}&ven=${englishTextVersion}`,
  );
  const chumash = textJson.he;
  const english = textJson.text;

  /*
   * Additional fetches if needed - they could use specific types instead of any:
   * fetchJSON<any>(`https://www.sefaria.org/api/texts/Onkelos_${ref}?context=0`),${targumVersion} (or whatever the name actually is)
   * fetchJSON<any>(`https://www.sefaria.org/api/texts/Rashi_on_${ref}?context=0`),${rashiVersion}
   * fetchJSON<any>(`https://www.sefaria.org/api/texts/Rashi_on_${ref}?context=0&lang=en`)${rashiEnglishVersion}
   */

  // Determine book and parsha name
  book = textJson.book as BookName;
  parshaName ??= (textJson.displayValue.he ??
    textJson.displayValue.en) as ParshaName;

  // Build verses
  const verses = buildVerses(
    ref,
    {
      book,
      he: chumash,
      text: english,
    },
    undefined, // fix undefined
    undefined,
    undefined,
  );

  // If aliyahRanges is empty, infer from calendar if possible
  if (aliyahRanges.length === 0) {
    const weekly = await getWeeklyParsha(timezone, diaspora);
    aliyahRanges = weekly.aliyot;
  }

  // Build cached structure with aliyot
  return buildCachedParsha(parshaName, book, verses, aliyahRanges, ref);
}
