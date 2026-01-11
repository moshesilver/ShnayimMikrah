import { useNavigation } from '@react-navigation/native';
import { useCallback, useRef, useState } from 'react';
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
import { VerseRow } from '../../src/components/VerseRow.tsx';
import { useParsha } from '../../src/hooks/useParsha.ts';
import { selectAliyah } from '../../src/parsha/selectors.ts';
import {
  AliyahNumber,
  type BookName,
  type ShnayimMikrahVerse,
} from '../../src/parsha/types.ts';
import { parshaStyles } from '../../src/styles/parshaStyles.ts';

const verseId = (verse: ShnayimMikrahVerse, book: BookName) =>
  `${book}:${verse.chapter}:${verse.verse}`;

export default function ParshaScreen({ fullRef }: { fullRef?: string }) {
  const [aliyah, setAliyah] = useState<AliyahNumber | undefined>(undefined);

  const { parsha, loading } = useParsha(fullRef);
  const { width } = useWindowDimensions();
  const navigation = useNavigation();

  // Fullscreen state and animation
  const [fullScreen, setFullScreen] = useState(false);
  const titleOpacity = useRef(new Animated.Value(1)).current;
  const doubleTapRef = useRef<TapGestureHandler>(null);

  const toggleFullScreen = useCallback(() => {
    setFullScreen((prev) => {
      const newFull = !prev;

      // Animate title fade
      Animated.timing(titleOpacity, {
        toValue: newFull ? 0 : 1,
        duration: 200,
        useNativeDriver: true,
      }).start();

      // Hide/show header & tab bar
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
  }, [navigation, titleOpacity]);

  const onDoubleTap = useCallback(
    (event: any) => {
      if (event.nativeEvent.state === State.END) {
        toggleFullScreen();
      }
    },
    [toggleFullScreen],
  );

  if (loading || !parsha) {
    return (
      <View style={parshaStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={parshaStyles.loadingText}>Loading Parsha…</Text>
      </View>
    );
  }

  const verses = selectAliyah(parsha, aliyah);

  return (
    <>
      {/* Hide status bar in fullscreen */}
      <StatusBar hidden={fullScreen} animated />

      <TapGestureHandler
        ref={doubleTapRef}
        onHandlerStateChange={onDoubleTap}
        numberOfTaps={2}
      >
        <View style={parshaStyles.container}>
          {/* Animated title */}
          <Animated.View style={{ opacity: titleOpacity }} pointerEvents="none">
            <Text style={parshaStyles.titleText}>
              {parsha.nameHebrew ?? parsha.name}
            </Text>
          </Animated.View>

          <View style={parshaStyles.aliyahBar}>
            {[1, 2, 3, 4, 5, 6, 7].map((a) => (
              <Text
                key={a}
                style={[
                  parshaStyles.aliyahButton,
                  aliyah === a && parshaStyles.aliyahButtonActive,
                ]}
                onPress={() => setAliyah(a as AliyahNumber)}
              >
                {a}
              </Text>
            ))}

            <Text
              style={[
                parshaStyles.aliyahButton,
                aliyah === undefined && parshaStyles.aliyahButtonActive,
              ]}
              onPress={() => setAliyah(undefined)}
            >
              All
            </Text>
          </View>

          {/* Verses list */}
          <FlatList
            data={verses}
            keyExtractor={(item) => verseId(item, parsha.book)}
            renderItem={({ item }) => (
              <VerseRow verse={item} book={parsha.book} />
            )}
            contentContainerStyle={{ flexGrow: 1 }}
            initialNumToRender={15}
            maxToRenderPerBatch={8}
            updateCellsBatchingPeriod={75}
            windowSize={10}
            removeClippedSubviews={false}
          />
        </View>
      </TapGestureHandler>
    </>
  );
}
