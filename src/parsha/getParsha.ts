import { fetchJSON } from '../utils/fetchJSON.ts';
import type { CalendarResponse } from './types.ts';

export async function getWeeklyParsha(timezone: string, diaspora = 1) {
  const calendar = await fetchJSON<CalendarResponse>(
    `https://www.sefaria.org/api/calendars?timezone=${timezone}&diaspora=${diaspora}`,
  );

  const item = calendar.calendar_items[0];

  return {
    fullRef: item.ref,
    aliyot: item.extraDetails.aliyot,
    name: item.displayValue.en,
  };
}
