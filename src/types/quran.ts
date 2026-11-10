// src/types/quran.ts

export type Surah = {
  number: number;
  nameArabic: string;
  nameEnglish: string;
  nameTransliteration: string;
  ayahCount: number;
  type: 'Makki' | 'Madani';
  bismillahHeader: boolean;
};

export type Ayah = {
  n: number;
  ar: string;
  tr: string;
};

export type SurahContent = {
  number: number;
  bismillahHeader: boolean;
  ayahs: Ayah[];
};

export type Bookmark = {
  surah: number;
  ayah: number;
  createdAt: number;
};

export type { ThemeMode, ReadingMode, Settings } from '../shared/types';

export type PageAyahRef = {
  surah: number;
  ayah: number;
};

export type PageMeta = {
  page: number;
  juz: number;
  surahs: number[];
  start: PageAyahRef;
  ayahs: PageAyahRef[];
};

export type PageItem =
  | { type: 'surah_banner'; surah: Surah; key: string }
  | { type: 'bismillah'; surahNumber: number; key: string }
  | { type: 'ayah'; surahNumber: number; ayah: Ayah; key: string };

export type PageContent = {
  pageNumber: number;
  juzNumber: number;
  primarySurah: Surah;
  surahs: Surah[];
  items: PageItem[];
};
