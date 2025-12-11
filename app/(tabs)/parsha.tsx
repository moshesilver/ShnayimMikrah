import { useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  FlatList,
  StatusBar,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { State, TapGestureHandler } from 'react-native-gesture-handler';
import RenderHTMLBase from 'react-native-render-html';
import { parshaStyles } from '../../src/styles/parshaStyles.ts';
import { parseSectionRef } from '../../src/utils/parseSectionRef.ts';
import { toHebrewNumeral } from '../../src/utils/toHebrewNumeral.ts';

const RenderHTML = RenderHTMLBase as any;

const PasukItem = React.memo(
  ({ item, width }: { item: string; width: number }) => (
    <View style={parshaStyles.pasukContainer}>
      <RenderHTML
        contentWidth={width}
        source={{ html: item }}
        baseStyle={parshaStyles.hebrewText}
      />
    </View>
  ),
  (prev, next) => prev.item === next.item && prev.width === next.width,
);

export default function ParshaScreen() {
  const { mode, aliyah } = useLocalSearchParams();
  const [displayPsukim, setDisplayPsukim] = useState<string[]>([]);
  const [parshaName, setParshaName] = useState<string | null>(null);
  const [parshaStart, setParshaStart] = useState<{
    perek: number;
    pasuk: number;
  } | null>(null);
  const [parshaEnd, setParshaEnd] = useState<{
    perek: number;
    pasuk: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const { width } = useWindowDimensions();

  const [fullScreen, setFullScreen] = useState(false);
  const navigation = useNavigation();
  const mountedRef = useRef(true);
  const titleOpacity = useRef(new Animated.Value(1)).current;
  const doubleTapRef = useRef(null);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

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

        const aliyahBreakup = parshaItem?.extraDetails.aliyot.slice(0, 7);

        const textRes = await fetch(
          `https://www.sefaria.org/api/texts/${url}?language=he&commentary=0&context=0`,
        );
        const textJson = await textRes.json();

        const parshaRefNumbers = parseSectionRef(textJson.ref);
        setParshaStart({
          perek: parshaRefNumbers.startPerek,
          pasuk: parshaRefNumbers.startPasuk,
        });
        setParshaEnd({
          perek: parshaRefNumbers.endPerek,
          pasuk: parshaRefNumbers.endPasuk,
        });

        const raw = textJson.he || [];

        const flattenedFull: string[] = [];
        const flattenedPartial: string[] = [];

        if (mode === 'full') {
          flattenedFull.push(...flattenEntireParsha(raw));
        }

        if (mode === 'aliyah') {
          const { startPerek, startPasuk, endPerek, endPasuk } =
            parseSectionRef(aliyahBreakup[+aliyah - 1]); // maybe fix this?
          flattenedPartial.push(
            ...flattenAliyah(raw, startPerek, startPasuk, endPerek, endPasuk),
          );
        }

        if (!cancelled) {
          if (mode === 'full') {
            setDisplayPsukim(flattenedFull);
          } else if (mode === 'aliyah') {
            setDisplayPsukim(flattenedPartial);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [mode, aliyah]);

  const flattenEntireParsha = (rawData: any) => {
    const flattened: string[] = [];

    rawData.forEach((perek: any, i: number) => {
      const pasukNumberOffset = i === 0 ? parshaStart?.pasuk! : 1;

      perek.forEach((pasuk: string, j: number) => {
        const pasukNumber = pasukNumberOffset + j;

        // should perek be marked for first pasuk of parsha even if not first pasuk of perek?
        const shouldShowHeader = pasukNumber === 1 || (i === 0 && j === 0);

        const perekHeader = shouldShowHeader
          ? `<h2>פרק ${toHebrewNumeral(i + parshaStart?.perek!)}</h2>`
          : '';

        flattened.push(
          perekHeader +
            `<p><b>${toHebrewNumeral(pasukNumber)}.</b> ${pasuk}</p>`,
        );
      });
    });
    return flattened;
  };

  const flattenAliyah = (
    rawData: any,
    startPerek: number,
    startPasuk: number,
    endPerek: number,
    endPasuk: number,
  ) => {
    const flattened: string[] = [];

    let actualPerek = startPerek;
    let actualPasuk = startPasuk;

    let numPerekOfParsha = startPerek - parshaStart?.perek!;

    for (
      let relativePerek = numPerekOfParsha;
      relativePerek < rawData.length;
      relativePerek++, actualPerek++
    ) {
      // if first perek of aliyah, start at startPasuk, else start at 0
      let relativePasuk =
        relativePerek === numPerekOfParsha ? startPasuk - 1 : 0;

      // special case for first perek of parsha
      if (numPerekOfParsha === 0) {
        relativePasuk = startPasuk - parshaStart?.pasuk!;
      }

      for (
        ;
        relativePasuk < rawData[relativePerek].length;
        relativePasuk++, actualPasuk++
      ) {
        const isEndPerek = relativePerek === endPerek - parshaStart?.perek!;
        const isEndPasuk = relativePasuk === endPasuk - 1;

        // should perek be marked for first pasuk of parsha even if not first pasuk of perek?
        const perekHeader =
          actualPasuk === 0
            ? `<h2>פרק ${toHebrewNumeral(actualPerek)}</h2>`
            : '';

        flattened.push(
          perekHeader +
            `<p><b>${toHebrewNumeral(actualPasuk)}.</b> ${rawData[relativePerek][relativePasuk]}</p>`,
        );

        // stop exactly at aliyah end
        if (isEndPerek && isEndPasuk) return flattened;
      }
    }
    return flattened;
  };

  const renderItem = useCallback(
    ({ item }: { item: string }) => <PasukItem item={item} width={width} />,
    [width],
  );

  const onDoubleTap = useCallback(
    (event: any) => {
      if (event.nativeEvent.state === State.END) {
        setFullScreen((prev) => {
          const newFull = !prev;

          // Fade animation for title
          Animated.timing(titleOpacity, {
            toValue: newFull ? 0 : 1,
            duration: 200,
            useNativeDriver: true,
          }).start();

          // Single requestAnimationFrame for smoother update
          requestAnimationFrame(() => {
            try {
              if (navigation && typeof navigation.setOptions === 'function') {
                navigation.setOptions({
                  headerShown: !newFull,
                  tabBarStyle: {
                    display: newFull ? 'none' : 'flex',
                  },
                });
              }
            } catch (err) {
              console.error('navigation.setOptions error:', err);
            }
          });

          return newFull;
        });
      }
    },
    [navigation, titleOpacity],
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
    <>
      <StatusBar hidden={fullScreen} animated={false} />
      <TapGestureHandler
        ref={doubleTapRef}
        onHandlerStateChange={onDoubleTap}
        numberOfTaps={2}
      >
        <View style={parshaStyles.container}>
          {parshaName && (
            <Animated.View
              style={{ opacity: titleOpacity }}
              pointerEvents="none"
            >
              <Text style={parshaStyles.titleText}>{parshaName}</Text>
            </Animated.View>
          )}
          <View
            style={{
              flex: 1,
            }}
          >
            <FlatList
              data={displayPsukim}
              keyExtractor={(_, i) => i.toString()}
              renderItem={renderItem}
              contentContainerStyle={{ flexGrow: 1 }}
              initialNumToRender={15}
              maxToRenderPerBatch={8}
              updateCellsBatchingPeriod={75}
              windowSize={10}
              removeClippedSubviews={false}
            />
          </View>
        </View>
      </TapGestureHandler>
    </>
  );
}
