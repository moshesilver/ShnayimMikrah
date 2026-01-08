import AsyncStorage from '@react-native-async-storage/async-storage';
import type { CachedParsha } from '../parsha/cacheTypes.ts';
import type { ParshaName, BookName } from '../parsha/types.ts';

function storageKey(book: BookName, parsha: ParshaName) {
  return `parsha:${book}:${parsha}`;
}

export async function saveCachedParsha(parsha: CachedParsha) {
  const key = storageKey(parsha.book, parsha.name);
  await AsyncStorage.setItem(key, JSON.stringify(parsha));
}

export async function loadCachedParsha(
  book: BookName,
  parsha: ParshaName,
): Promise<CachedParsha | null> {
  const key = storageKey(book, parsha);
  const raw = await AsyncStorage.getItem(key);
  return raw ? JSON.parse(raw) : null;
}

export async function hasCachedParsha(
  book: BookName,
  parsha: ParshaName,
): Promise<boolean> {
  const key = storageKey(book, parsha);
  return (await AsyncStorage.getItem(key)) !== null;
}
