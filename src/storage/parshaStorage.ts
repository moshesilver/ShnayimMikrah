import AsyncStorage from '@react-native-async-storage/async-storage';
import type { CachedParsha } from '../parsha/cacheTypes.ts';

function storageKey(ref: string) {
  return `parsha:${ref}`;
}

export async function saveCachedParsha(parsha: CachedParsha) {
  const key = storageKey(parsha.fullRef);
  await AsyncStorage.setItem(key, JSON.stringify(parsha));
}

export async function loadCachedParsha(
  ref: string,
): Promise<CachedParsha | null> {
  const key = storageKey(ref);
  const raw = await AsyncStorage.getItem(key);
  return raw ? JSON.parse(raw) : null;
}

export async function hasCachedParsha(ref: string): Promise<boolean> {
  const key = storageKey(ref);
  return (await AsyncStorage.getItem(key)) !== null;
}
