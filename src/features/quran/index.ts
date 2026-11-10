// src/features/quran/index.ts

import { quranRepository } from './quranRepository';

export const {
  getSurahs,
  getSurahMeta,
  getSurah,
  getPageMeta,
  getPageForAyah,
  getSurahPages,
  getPageContent,
} = quranRepository;

export { quranRepository };

export type * from './types';
