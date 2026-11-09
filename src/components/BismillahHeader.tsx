// src/components/BismillahHeader.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { typography } from '../theme/typography';

const BISMILLAH_TEXT = 'بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ';

export const BismillahHeader: React.FC = () => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.text,
          {
            color: colors.primary,
            fontFamily: typography.fontFamily.quran,
          },
        ]}
      >
        {BISMILLAH_TEXT}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 18,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 28,
    lineHeight: 56,
    includeFontPadding: true,
    paddingVertical: 4,
    textAlign: 'center',
    writingDirection: 'rtl',
  },
});

