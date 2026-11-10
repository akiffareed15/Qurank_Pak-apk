// src/store/bookmarksStore.ts

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Bookmark } from '../../quran';

interface BookmarksState {
  bookmarks: Bookmark[];
  _hasHydrated: boolean;
  toggleBookmark: (surah: number, ayah: number) => void;
  removeBookmark: (surah: number, ayah: number) => void;
  isBookmarked: (surah: number, ayah: number) => boolean;
  setHasHydrated: (state: boolean) => void;
}

export const useBookmarksStore = create<BookmarksState>()(
  persist(
    (set, get) => ({
      bookmarks: [],
      _hasHydrated: false,
      toggleBookmark: (surah, ayah) => {
        const { bookmarks } = get();
        const exists = bookmarks.some((b) => b.surah === surah && b.ayah === ayah);
        if (exists) {
          set({
            bookmarks: bookmarks.filter((b) => !(b.surah === surah && b.ayah === ayah)),
          });
        } else {
          set({
            bookmarks: [
              { surah, ayah, createdAt: Date.now() },
              ...bookmarks,
            ],
          });
        }
      },
      removeBookmark: (surah, ayah) => {
        const { bookmarks } = get();
        set({
          bookmarks: bookmarks.filter((b) => !(b.surah === surah && b.ayah === ayah)),
        });
      },
      isBookmarked: (surah, ayah) => {
        return get().bookmarks.some((b) => b.surah === surah && b.ayah === ayah);
      },
      setHasHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: 'noor-reader-bookmarks',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

