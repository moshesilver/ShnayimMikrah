import type {
  AliyahNumber,
  BookName,
  ParshaName,
  ShnayimMikrahVerse,
} from './types.ts';

export interface AliyahIndex {
  startIndex: number;
  endIndex: number;
  verseRange: string;
}

export interface CachedParsha {
  name: ParshaName;
  nameHebrew?: string;
  book: BookName;
  fullRef: string;
  verses: ShnayimMikrahVerse[];
  aliyot: Record<AliyahNumber, AliyahIndex>;
}
