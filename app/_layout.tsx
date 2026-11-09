// app/_layout.tsx

import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider, useTheme } from '../src/theme/ThemeProvider';
import { useSettingsStore } from '../src/store/settingsStore';
import { useLastReadStore } from '../src/store/lastReadStore';
import { useBookmarksStore } from '../src/store/bookmarksStore';
import { AppSplashScreen } from '../src/components/AppSplashScreen';

SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const { colors, isDark } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} backgroundColor="transparent" translucent />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="index" options={{ animation: 'fade' }} />
        <Stack.Screen name="surahs" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="reader/[surah]" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="bookmarks" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="settings" options={{ animation: 'slide_from_right' }} />
      </Stack>
    </View>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    DigitalKhattIndoPak: require('../assets/fonts/DigitalKhattIndoPak.otf'),
    'AmiriQuran-Regular': require('../assets/fonts/AmiriQuran-Regular.ttf'),
    'ScheherazadeNew-Regular': require('../assets/fonts/ScheherazadeNew-Regular.ttf'),
    'KFGQPCHAFSUthmanicScript-Regula': require('../assets/fonts/UthmanHafs.ttf'),
  });

  const settingsHydrated = useSettingsStore((s) => s._hasHydrated);
  const lastReadHydrated = useLastReadStore((s) => s._hasHydrated);
  const bookmarksHydrated = useBookmarksStore((s) => s._hasHydrated);

  const [isReady, setIsReady] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Check if fonts and hydration are ready
    if ((fontsLoaded || fontError) && settingsHydrated && lastReadHydrated && bookmarksHydrated) {
      setIsReady(true);
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, fontError, settingsHydrated, lastReadHydrated, bookmarksHydrated]);

  // Fallback timer to hide native splash screen even if hydration took longer than expected
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
      SplashScreen.hideAsync().catch(() => {});
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <ThemeProvider>
          {isReady && <RootNavigator />}
          {showSplash && (
            <AppSplashScreen
              isReady={isReady}
              onAnimationComplete={() => setShowSplash(false)}
            />
          )}
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

