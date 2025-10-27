import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import RenderHTMLBase from 'react-native-render-html';
import { parshaStyles } from '../src/styles/parshaStyles.ts';
import { toHebrewNumeral } from '../src/utils/toHebrewNumeral.ts';
const RenderHTML = RenderHTMLBase as unknown as React.ComponentType<any>;

export default function ParshaScreen() {
  const [psukim, setPsukim] = useState<string[]>([]);
  const [parshaName, setParshaName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { width } = useWindowDimensions();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const calRes = await fetch(
          'https://www.sefaria.org/api/calendars?diaspora=1&tz=America/New_York',
        );
        const calJson = await calRes.json();
        const parshaItem = calJson.calendar_items?.find(
          (item: any) => item.title?.en === 'Parashat Hashavua',
        );
        const url = parshaItem?.url;
        if (!url) throw new Error('Parsha not found');

        const name = parshaItem.displayValue.he;
        if (!cancelled) setParshaName(name);

        const textRes = await fetch(
          `https://www.sefaria.org/api/texts/${url}?language=he&commentary=0&context=0`,
        );
        const textJson = await textRes.json();

        const sectionStart = textJson.ref.split('-')[0]; // e.g. Genesis 6:9
        const startPerek = parseInt(sectionStart.match(/\d+/)); // e.g. 6
        const startPasuk = parseInt(sectionStart.split(':')[1]); // e.g. 9

        const raw = textJson.he || [];
        const flattened: string[] = [];

        raw.forEach((perek: any, i: number) => {
          /* if (Array.isArray(perek)) { */
          const pasukNumberOffset = i === 0 ? startPasuk : 1;
          perek.forEach((pasuk: string, j: number) => {
            const pasukNumber = pasukNumberOffset + j;
            if (pasukNumber === 1 /* || (i === 0 && j === 0) */) {
              flattened.push(`<h2>פרק ${toHebrewNumeral(i + startPerek)}</h2>`);
            }
            flattened.push(
              `<p><b>${toHebrewNumeral(pasukNumber)}.</b> ${pasuk}</p>`,
            );
          });
          /* } else if (typeof perek === 'string') {
            flattened.push(`<p>${perek}</p>`);
          } */
        });

        if (!cancelled) setPsukim(flattened);
      } catch (e) {
        console.error(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Memoize HTML wrapping for efficiency
  const psukimHtml = useMemo(() => psukim.map((v) => `<p>${v}</p>`), [psukim]);

  const renderItem = useCallback(
    ({ item }: { item: string }) => (
      <View style={parshaStyles.pasukContainer}>
        <RenderHTML
          contentWidth={width}
          source={{ html: item }}
          baseStyle={parshaStyles.hebrewText}
        />
      </View>
    ),
    [width],
  );

  if (loading) {
    return (
      <View style={parshaStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={parshaStyles.loadingText}>Loading Parsha…</Text>
      </View>
    );
  }

  return (
    <View style={parshaStyles.container}>
      {parshaName && (
        <Text style={parshaStyles.titleText}>
          {/* פרשת  */}
          {parshaName}
        </Text>
      )}
      <FlatList
        data={psukimHtml}
        keyExtractor={(_, i) => i.toString()}
        renderItem={renderItem}
      />
    </View>
  );
}
