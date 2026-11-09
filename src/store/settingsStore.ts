// src/store/settingsStore.ts

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Settings, ThemeMode, ReadingMode } from '../types/quran';

interface SettingsState extends Settings {
  _hasHydrated: boolean;
  setArabicSize: (size: number) => void;
  setTranslationSize: (size: number) => void;
  setShowTranslation: (show: boolean) => void;
  setTheme: (theme: ThemeMode) => void;
  setReadingMode: (mode: ReadingMode) => void;
  setHasHydrated: (state: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      arabicSize: 28,
      translationSize: 16,
      showTranslation: true,
      theme: 'dark', // Pre-default dark theme for new users
      readingMode: 'mushaf', // Default to authentic 604 Madinah Mushaf Page Mode
      _hasHydrated: false,
      setArabicSize: (arabicSize) => set({ arabicSize }),
      setTranslationSize: (translationSize) => set({ translationSize }),
      setShowTranslation: (showTranslation) => set({ showTranslation }),
      setTheme: (theme) => set({ theme }),
      setReadingMode: (readingMode) => set({ readingMode }),
      setHasHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: 'noor-reader-settings',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
