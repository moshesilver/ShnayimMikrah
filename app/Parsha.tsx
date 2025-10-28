import { useNavigation } from 'expo-router';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import RenderHTMLBase from 'react-native-render-html';
import { parshaStyles } from '../src/styles/parshaStyles.ts';
import { toHebrewNumeral } from '../src/utils/toHebrewNumeral.ts';
const RenderHTML = RenderHTMLBase as unknown as React.ComponentType<any>;

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
  const [psukim, setPsukim] = useState<string[]>([]);
  const [parshaName, setParshaName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { width } = useWindowDimensions();

  const [fullScreen, setFullScreen] = useState(false);
  const navigation = useNavigation();
  const mountedRef = useRef(true);
  const titleOpacity = useRef(new Animated.Value(1)).current;

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
          const pasukNumberOffset = i === 0 ? startPasuk : 1;
          perek.forEach((pasuk: string, j: number) => {
            const pasukNumber = pasukNumberOffset + j;
            // should perek be marked for first pasuk of parsha even if not first pasuk of perek?
            if (pasukNumber === 1 /* || (i === 0 && j === 0) */) {
              flattened.push(`<h2>פרק ${toHebrewNumeral(i + startPerek)}</h2>`);
            }
            flattened.push(
              `<p><b>${toHebrewNumeral(pasukNumber)}.</b> ${pasuk}</p>`,
            );
          });
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

  const flatListContainerStyle = useMemo(
    () => ({
      paddingTop: fullScreen ? 12 : 0,
      paddingBottom: 40,
    }),
    [fullScreen],
  );

  const renderItem = useCallback(
    ({ item }: { item: string }) => <PasukItem item={item} width={width} />,
    [width],
  );

  const toggleInProgress = useRef(false);

  const handleToggleFullScreen = useCallback(() => {
    if (toggleInProgress.current) return;
    toggleInProgress.current = true;

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
        toggleInProgress.current = false;
      });

      return newFull;
    });
  }, [navigation, titleOpacity]);

  // Gesture: double tap using runOnJS to safely call JS functions from gesture context
  const doubleTapGesture = useMemo(
    () =>
      Gesture.Tap()
        .numberOfTaps(2)
        .maxDelay(300)
        .onEnd(() => {
          runOnJS(handleToggleFullScreen)();
        }),
    [handleToggleFullScreen],
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
      {/* <StatusBar hidden={fullScreen} animated={false} /> */}
      <GestureDetector gesture={doubleTapGesture}>
        <View style={parshaStyles.container}>
          {parshaName && (
            <Animated.View style={{ opacity: titleOpacity }}>
              <Text style={parshaStyles.titleText}>{parshaName}</Text>
            </Animated.View>
          )}
          <FlatList
            data={psukim}
            keyExtractor={(_, i) => i.toString()}
            renderItem={({ item }) => <PasukItem item={item} width={width} />}
            contentContainerStyle={flatListContainerStyle}
            initialNumToRender={15}
            maxToRenderPerBatch={8}
            updateCellsBatchingPeriod={75}
            windowSize={10}
            extraData={fullScreen}
            removeClippedSubviews={false}
          />
        </View>
      </GestureDetector>
    </>
  );
}
