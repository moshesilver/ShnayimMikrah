import { Tabs } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Tabs>
        <Tabs.Screen name="(tabs)/index" options={{ title: 'Home' }} />
        <Tabs.Screen name="(tabs)/parsha" options={{ title: 'Parsha' }} />
      </Tabs>
    </GestureHandlerRootView>
  );
}
