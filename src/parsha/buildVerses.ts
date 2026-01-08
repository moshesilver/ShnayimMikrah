import { parseSectionRange } from '../utils/parseSectionRange.ts';
import type {
  RashiResponse,
  ShnayimMikrahVerse,
  TargumResponse,
  TextResponse,
} from './types.ts';

function hasText(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

export function buildVerses(
  range: string,
  chumash: TextResponse,
  targum?: TargumResponse,
  rashi?: RashiResponse,
  rashiEnglish?: RashiResponse,
): ShnayimMikrahVerse[] {
  const verses: ShnayimMikrahVerse[] = [];
  const { startPerek, startPasuk } = parseSectionRange(range);

  // Single pasuk
  if (!Array.isArray(chumash.he)) {
    const verse: ShnayimMikrahVerse = {
      chapter: startPerek,
      verse: startPasuk,
      hebrew: chumash.he as string,
    };

    if (hasText(chumash.text)) {
      verse.english = chumash.text as string;
    }

    if (hasText(targum?.he)) {
      verse.targum = targum!.he as string;
    }

    if (Array.isArray(rashi?.he)) {
      verse.rashi = {
        comments: (rashi.he as string[]).map((text, i) => ({
          index: i,
          text,
        })),
      };
    }

    if (Array.isArray(rashiEnglish?.text)) {
      verse.rashiEnglish = {
        comments: (rashiEnglish.text as string[]).map((text, i) => ({
          index: i,
          text,
        })),
      };
    }

    verses.push(verse);
    return verses;
  }

  // Same perek
  if (!Array.isArray(chumash.he[0])) {
    (chumash.he as string[]).forEach((hebrewText, i) => {
      const verse: ShnayimMikrahVerse = {
        chapter: startPerek,
        verse: startPasuk + i,
        hebrew: hebrewText,
      };

      const english = (chumash.text as string[] | undefined)?.[i];
      if (hasText(english)) {
        verse.english = english;
      }

      const targumText = (targum?.he as string[] | undefined)?.[i];
      if (hasText(targumText)) {
        verse.targum = targumText;
      }

      const rashiComments = (rashi?.he as string[][] | undefined)?.[i];
      if (Array.isArray(rashiComments)) {
        verse.rashi = {
          comments: rashiComments.map((text, j) => ({
            index: j,
            text,
          })),
        };
      }

      const rashiEnComments = (rashiEnglish?.text as string[][] | undefined)?.[
        i
      ];
      if (Array.isArray(rashiEnComments)) {
        verse.rashiEnglish = {
          comments: rashiEnComments.map((text, j) => ({
            index: j,
            text,
          })),
        };
      }

      verses.push(verse);
    });

    return verses;
  }

  // Multiple perakim
  (chumash.he as string[][]).forEach((perek, perekIndex) => {
    const chapter = startPerek + perekIndex;
    let verseNumber = perekIndex === 0 ? startPasuk : 1;

    perek.forEach((hebrewText, i) => {
      const verse: ShnayimMikrahVerse = {
        chapter,
        verse: verseNumber++,
        hebrew: hebrewText,
      };

      const english = (chumash.text as string[][] | undefined)?.[perekIndex]?.[
        i
      ];
      if (hasText(english)) {
        verse.english = english;
      }

      const targumText = (targum?.he as string[][] | undefined)?.[perekIndex]?.[
        i
      ];
      if (hasText(targumText)) {
        verse.targum = targumText;
      }

      const rashiComments = (rashi?.he as string[][][] | undefined)?.[
        perekIndex
      ]?.[i];
      if (Array.isArray(rashiComments)) {
        verse.rashi = {
          comments: rashiComments.map((text, j) => ({
            index: j,
            text,
          })),
        };
      }

      const rashiEnComments = (
        rashiEnglish?.text as string[][][] | undefined
      )?.[perekIndex]?.[i];
      if (Array.isArray(rashiEnComments)) {
        verse.rashiEnglish = {
          comments: rashiEnComments.map((text, j) => ({
            index: j,
            text,
          })),
        };
      }

      verses.push(verse);
    });
  });

  return verses;
}
