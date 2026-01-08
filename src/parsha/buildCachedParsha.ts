import { parseSectionRange } from '../utils/parseSectionRange.ts';
import type { CachedParsha } from './cacheTypes.ts';
import type {
  AliyahNumber,
  BookName,
  ParshaName,
  ShnayimMikrahVerse,
} from './types.ts';

function findAliyahIndices(verses: ShnayimMikrahVerse[], aliyahRange: string) {
  const { startPerek, startPasuk, endPerek, endPasuk } =
    parseSectionRange(aliyahRange);

  let startIndex = -1;
  let endIndex = -1;

  verses.forEach((v, i) => {
    if (
      startIndex === -1 &&
      v.chapter === startPerek &&
      v.verse === startPasuk
    ) {
      startIndex = i;
    }

    if (v.chapter === endPerek && v.verse === endPasuk) {
      endIndex = i;
    }
  });

  if (startIndex === -1 || endIndex === -1) {
    throw new Error(`Aliyah range not found: ${aliyahRange}`);
  }

  return { startIndex, endIndex };
}

export function buildCachedParsha(
  name: ParshaName,
  book: BookName,
  verses: ShnayimMikrahVerse[],
  aliyahRanges: string[],
  fullRef: string,
  nameHebrew?: string,
): CachedParsha {
  const aliyot = {} as CachedParsha['aliyot'];

  aliyahRanges.forEach((range, i) => {
    const aliyah = (i + 1) as AliyahNumber;
    aliyot[aliyah] = {
      ...findAliyahIndices(verses, range),
      verseRange: range,
    };
  });

  return {
    name,
    nameHebrew,
    book,
    fullRef,
    verses,
    aliyot,
  };
}
