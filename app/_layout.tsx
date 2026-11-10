// app/_layout.tsx

import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider, useTheme } from '../src/shared/theme/ThemeProvider';
import { useSettingsStore } from '../src/shared/store/settingsStore';
import { useLastReadStore } from '../src/store/lastReadStore';
import { useBookmarksStore } from '../src/store/bookmarksStore';
import { AppSplashScreen } from '../src/shared/components/AppSplashScreen';

// Native splash screen auto-hides as soon as React Native mounts,
// allowing AppSplashScreen to handle the unified, single startup animation seamlessly.

function RootNavigator() {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
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

function AppContent({
  isReady,
  showSplash,
  onSplashComplete,
}: {
  isReady: boolean;
  showSplash: boolean;
  onSplashComplete: () => void;
}) {
  const { isDark } = useTheme();

  return (
    <>
      <StatusBar
        style={showSplash ? 'dark' : isDark ? 'light' : 'dark'}
        backgroundColor="transparent"
        translucent
      />
      {isReady && <RootNavigator />}
      {showSplash && (
        <AppSplashScreen
          isReady={isReady}
          onAnimationComplete={onSplashComplete}
        />
      )}
    </>
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

  // Immediately hand off from native Android splash to single custom loading animation
  useEffect(() => {
    SplashScreen.hideAsync().catch(() => {});
  }, []);

  useEffect(() => {
    // Check if fonts and hydration are ready
    if ((fontsLoaded || fontError) && settingsHydrated && lastReadHydrated && bookmarksHydrated) {
      setIsReady(true);
    }
  }, [fontsLoaded, fontError, settingsHydrated, lastReadHydrated, bookmarksHydrated]);

  // Fallback timer to mark ready even if an asset takes slightly longer
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AppContent
            isReady={isReady}
            showSplash={showSplash}
            onSplashComplete={() => setShowSplash(false)}
          />
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
