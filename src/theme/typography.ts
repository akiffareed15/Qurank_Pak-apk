// src/theme/typography.ts

import { Platform } from 'react-native';

export const typography = {
  fontFamily: {
    // Primary Quran Arabic font for verses (Indo-Pak script)
    quran: 'DigitalKhattIndoPak',
    digitalKhattIndoPak: 'DigitalKhattIndoPak',
    amiri: Platform.select({
      android: 'AmiriQuran-Regular',
      ios: 'AmiriQuran',
      default: 'AmiriQuran',
    }),
    scheherazade: Platform.select({
      android: 'ScheherazadeNew-Regular',
      ios: 'ScheherazadeNew-Regular',
      default: 'ScheherazadeNew-Regular',
    }),
    // Dedicated font for Surah titles, headers, and navigation metadata.
    // Scheherazade New provides full Arabic cursive ligatures for unvocalized titles,
    // avoiding the character detachment/fragmentation that happens in ayah-only fonts.
    surahTitle: Platform.select({
      android: 'ScheherazadeNew-Regular',
      ios: 'ScheherazadeNew-Regular',
      default: 'ScheherazadeNew-Regular',
    }),
  },
  defaults: {
    arabicSize: 26,
    translationSize: 15,
  },
  limits: {
    arabicMin: 20,
    arabicMax: 44,
    translationMin: 12,
    translationMax: 26,
  },
  ui: {
    heroTitle: {
      fontSize: 40,
    },
    screenTitle: {
      fontSize: 20,
      fontWeight: '600' as const,
    },
    rowTitle: {
      fontSize: 16,
      fontWeight: '500' as const,
    },
    caption: {
      fontSize: 13,
      fontWeight: '400' as const,
    },
  },
};
