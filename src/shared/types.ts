// src/shared/types.ts

export type ThemeMode = 'light' | 'dark' | 'system';
export type ReadingMode = 'mushaf' | 'list';

export type Settings = {
  arabicSize: number;
  translationSize: number;
  showTranslation: boolean;
  theme: ThemeMode;
  readingMode: ReadingMode;
};
