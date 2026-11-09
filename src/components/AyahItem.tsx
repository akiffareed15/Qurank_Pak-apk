// src/components/AyahItem.tsx

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withSpring,
  interpolateColor,
  ReduceMotion,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeProvider';
import { typography } from '../theme/typography';
import { toArabicNumber } from '../utils/arabicNumber';
import type { Ayah } from '../types/quran';

interface AyahItemProps {
  ayah: Ayah;
  surahNumber: number;
  arabicSize: number;
  translationSize: number;
  showTranslation: boolean;
  isBookmarked: boolean;
  isHighlighted?: boolean;
  onToggleBookmark: (surahNumber: number, ayahNumber: number) => void;
}

const AyahItemComponent: React.FC<AyahItemProps> = ({
  ayah,
  surahNumber,
  arabicSize,
  translationSize,
  showTranslation,
  isBookmarked,
  isHighlighted = false,
  onToggleBookmark,
}) => {
  const { colors, isDark } = useTheme();

  // Bookmark spring pop animation (lightweight worklet)
  const bookmarkScale = useSharedValue(1);

  // Highlight flash animation — only initialized if actually highlighted
  const highlightProgress = useSharedValue(isHighlighted ? 1 : 0);

  useEffect(() => {
    if (isHighlighted) {
      highlightProgress.value = 1;
      highlightProgress.value = withTiming(0, {
        duration: 1500,
        reduceMotion: ReduceMotion.System,
      });
    }
  }, [isHighlighted]);

  const handleBookmarkPress = () => {
    bookmarkScale.value = withSequence(
      withSpring(1.3, { damping: 6, stiffness: 350, reduceMotion: ReduceMotion.System }),
      withSpring(1, { damping: 12, stiffness: 220, reduceMotion: ReduceMotion.System })
    );
    onToggleBookmark(surahNumber, ayah.n);
  };

  const bookmarkAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: bookmarkScale.value }],
  }));

  const containerAnimatedStyle = useAnimatedStyle(() => {
    if (!isHighlighted && highlightProgress.value === 0) {
      return { backgroundColor: 'transparent' };
    }
    const bg = interpolateColor(
      highlightProgress.value,
      [0, 1],
      ['transparent', colors.primarySoft]
    );
    return {
      backgroundColor: bg,
    };
  });

  return (
    <Animated.View style={[styles.container, containerAnimatedStyle]}>
      {/* Top action row: bookmark on left */}
      <View style={styles.topRow}>
        <Pressable
          onPress={handleBookmarkPress}
          hitSlop={12}
          style={styles.bookmarkButton}
        >
          <Animated.View style={bookmarkAnimatedStyle}>
            <Ionicons
              name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
              size={18}
              color={isBookmarked ? colors.primary : colors.textMuted}
              style={{ opacity: isBookmarked ? 1 : 0.45 }}
            />
          </Animated.View>
        </Pressable>
      </View>

      {/* Arabic text with inline end-marker */}
      <Text
        style={[
          styles.arabicText,
          {
            fontSize: arabicSize,
            lineHeight: Math.round(arabicSize * 2.05),
            color: isDark ? colors.text : '#06150E',
            fontFamily: typography.fontFamily.quran,
          },
        ]}
      >
        {ayah.ar}
        {!ayah.ar.includes('۝') && (
          <>
            {' '}
            <Text style={[styles.endMarker, { color: isDark ? colors.primary : '#0D6646' }]}>
              {`﴿${toArabicNumber(ayah.n)}﴾`}
            </Text>
          </>
        )}
      </Text>

      {/* Translation below */}
      {showTranslation && (
        <View style={styles.translationContainer}>
          <Text
            style={[
              styles.translationText,
              {
                fontSize: translationSize,
                lineHeight: Math.round(translationSize * 1.55),
                color: isDark ? colors.textMuted : '#22342C',
              },
            ]}
          >
            {ayah.tr}
          </Text>
        </View>
      )}

      {/* Inset hairline separator */}
      <View style={[styles.separator, { backgroundColor: colors.border }]} />
    </Animated.View>
  );
};

export const AyahItem = React.memo(
  AyahItemComponent,
  (prev, next) =>
    prev.ayah.n === next.ayah.n &&
    prev.ayah.ar === next.ayah.ar &&
    prev.surahNumber === next.surahNumber &&
    prev.arabicSize === next.arabicSize &&
    prev.translationSize === next.translationSize &&
    prev.showTranslation === next.showTranslation &&
    prev.isBookmarked === next.isBookmarked &&
    prev.isHighlighted === next.isHighlighted
);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 6,
  },
  bookmarkButton: {
    padding: 4,
  },
  arabicText: {
    textAlign: 'right',
    writingDirection: 'rtl',
    includeFontPadding: true,
    paddingTop: 2,
    paddingBottom: 2,
  },
  endMarker: {
    fontWeight: '400',
    includeFontPadding: true,
  },
  translationContainer: {
    marginTop: 10,
  },
  translationText: {
    textAlign: 'left',
    writingDirection: 'ltr',
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    marginTop: 16,
    marginHorizontal: 4,
  },
});
