// src/components/SurahRow.tsx

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { StarBadge } from './StarBadge';
import { typography } from '../theme/typography';
import type { Surah } from '../types/quran';

interface SurahRowProps {
  surah: Surah;
  onPress: () => void;
}

const SurahRowComponent: React.FC<SurahRowProps> = ({ surah, onPress }) => {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        {
          backgroundColor: pressed ? colors.primarySoft : colors.background,
          borderBottomColor: colors.border,
        },
      ]}
    >
      <StarBadge number={surah.number} size={38} />
      <View style={styles.nameContainer}>
        <Text style={[styles.englishName, { color: colors.text }]} numberOfLines={1}>
          {surah.nameEnglish}
        </Text>
        <Text style={[styles.metaText, { color: colors.textMuted }]}>
          {surah.type} · {surah.ayahCount}
        </Text>
      </View>
      <Text
        style={[
          styles.arabicName,
          {
            color: colors.primary,
            fontFamily: typography.fontFamily.surahTitle,
          },
        ]}
      >
        {surah.nameArabic}
      </Text>
    </Pressable>
  );
};

export const SurahRow = React.memo(SurahRowComponent);

const styles = StyleSheet.create({
  row: {
    height: 72,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  nameContainer: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  englishName: {
    fontSize: 16,
    fontWeight: '500',
  },
  metaText: {
    fontSize: 13,
    marginTop: 3,
  },
  arabicName: {
    fontSize: 22,
    lineHeight: 38,
    includeFontPadding: true,
    paddingVertical: 2,
    textAlign: 'right',
  },
});

