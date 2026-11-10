// src/components/SurahBanner.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../shared/theme/ThemeProvider';
import { typography } from '../shared/theme/typography';
import { GeometricPattern } from '../shared/components/GeometricPattern';
import type { Surah } from '../features/quran';

interface SurahBannerProps {
  surah: Surah;
}

export const SurahBanner: React.FC<SurahBannerProps> = ({ surah }) => {
  const { colors, isDark } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          borderColor: isDark ? colors.primary : '#0D6646',
          backgroundColor: isDark ? colors.card : '#FFFFFF',
        },
      ]}
    >
      <GeometricPattern color={colors.primary} opacity={0.06} />
      <Text
        style={[
          styles.arabicName,
          {
            color: isDark ? colors.primary : '#0D6646',
            fontFamily: typography.fontFamily.surahTitle,
          },
        ]}
      >
        {surah.nameArabic}
      </Text>
      <Text style={[styles.englishName, { color: isDark ? colors.textMuted : '#2C3E36' }]}>
        {surah.nameEnglish} · {surah.type} · {surah.ayahCount} Ayahs
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    paddingVertical: 22,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  arabicName: {
    fontSize: 34,
    lineHeight: 52,
    includeFontPadding: true,
    textAlign: 'center',
    marginBottom: 4,
  },
  englishName: {
    fontSize: 13,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
});

