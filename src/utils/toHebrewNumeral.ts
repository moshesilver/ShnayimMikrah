const hebrewNumerals: Record<number, string> = {
  1: 'א',
  2: 'ב',
  3: 'ג',
  4: 'ד',
  5: 'ה',
  6: 'ו',
  7: 'ז',
  8: 'ח',
  9: 'ט',
  10: 'י',
  20: 'כ',
  30: 'ל',
  40: 'מ',
  50: 'נ',
  60: 'ס',
  70: 'ע',
  80: 'פ',
  90: 'צ',
  100: 'ק',
  200: 'ר',
  300: 'ש',
  400: 'ת',
};

export function toHebrewNumeral(num: number): string {
  let result = '';

  result += hebrewNumerals[400].repeat(num / 400);
  num = num % 400;

  result += hebrewNumerals[num - (num % 100)] || '';
  num = num % 100;

  if (num === 15) {
    result += 'טו';
    return result;
  }
  if (num === 16) {
    result += 'טז';
    return result;
  }
  result += hebrewNumerals[num - (num % 10)] || '';
  num = num % 10;

  result += hebrewNumerals[num] || '';

  return result;
}
