// src/store/lastReadStore.ts

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LastReadState {
  surah: number | null;
  ayah: number | null;
  page: number | null;
  _hasHydrated: boolean;
  setLastRead: (surah: number, ayah: number, page?: number) => void;
  setHasHydrated: (state: boolean) => void;
}

export const useLastReadStore = create<LastReadState>()(
  persist(
    (set) => ({
      surah: null,
      ayah: null,
      page: null,
      _hasHydrated: false,
      setLastRead: (surah, ayah, page) =>
        set((state) => ({
          surah,
          ayah,
          page: page ?? state.page,
        })),
      setHasHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: 'noor-reader-last-read',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
