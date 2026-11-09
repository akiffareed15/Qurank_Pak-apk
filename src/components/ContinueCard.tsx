// src/components/ContinueCard.tsx
// Refined Luxury Glassmorphic Continue Reading Card with Progress Bar & Arabic Calligraphy

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeProvider';
import { AnimatedPressable } from './AnimatedPressable';
import { StarBadge } from './StarBadge';
import { typography } from '../theme/typography';
import { quranRepository } from '../data/quranRepository';

interface ContinueCardProps {
  surahNumber: number | null;
  ayahNumber: number | null;
  onPress: () => void;
}

export const ContinueCard: React.FC<ContinueCardProps> = ({
  surahNumber,
  ayahNumber,
  onPress,
}) => {
  const { isDark } = useTheme();

  const isInitial = !surahNumber || !ayahNumber;
  const surahMeta = surahNumber ? quranRepository.getSurahMeta(surahNumber) : null;
  const totalAyahs = surahMeta?.ayahCount || 1;
  const currentAyah = ayahNumber || 1;
  const pageNumber =
    surahNumber && ayahNumber
      ? quranRepository.getPageForAyah(surahNumber, ayahNumber)
      : null;

  // Reading progress calculation
  const progressRatio = Math.min(1, Math.max(0, currentAyah / totalAyahs));
  const progressPercent = Math.round(progressRatio * 100);

  // Dynamic Theme Palette (High-Contrast & Luxury Glass Finish)
  const cardBg = isDark ? 'rgba(9, 32, 23, 0.90)' : 'rgba(255, 255, 255, 0.95)';
  const cardBorder = isDark ? 'rgba(218, 165, 32, 0.42)' : 'rgba(13, 102, 70, 0.32)';
  const labelColor = isDark ? '#E5C158' : '#053E27';
  const textColor = isDark ? '#FFFFFF' : '#042317';
  const textMutedColor = isDark ? '#A0B9AE' : '#2D4B3E';
  const arabicColor = isDark ? '#E5C158' : '#07482D';

  const actionBg = isDark ? 'rgba(61, 184, 138, 0.18)' : 'rgba(13, 102, 70, 0.12)';
  const actionBorder = isDark ? 'rgba(218, 165, 32, 0.45)' : 'rgba(13, 102, 70, 0.3)';
  const actionColor = isDark ? '#3DB88A' : '#064229';

  const progressTrackBg = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(13, 102, 70, 0.1)';
  const progressFillColor = isDark ? '#3DB88A' : '#0D6646';

  return (
    <AnimatedPressable
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: cardBg,
          borderColor: cardBorder,
          shadowColor: isDark ? '#000000' : '#042317',
        },
      ]}
    >
      {isInitial ? (
        /* Initial State: Prompt to start with Surah Al-Fatihah */
        <View style={styles.initialContent}>
          <View
            style={[
              styles.iconOuterRing,
              { backgroundColor: actionBg, borderColor: actionBorder },
            ]}
          >
            <Ionicons name="book-outline" size={22} color={actionColor} />
          </View>

          <View style={styles.textContainer}>
            <View style={styles.metaLabelRow}>
              <View style={[styles.dot, { backgroundColor: labelColor }]} />
              <Text style={[styles.labelContinue, { color: labelColor }]}>
                START RECITATION
              </Text>
            </View>
            <Text style={[styles.startReadingTitle, { color: textColor }]}>
              Surah Al-Fatihah
            </Text>
            <Text style={[styles.startReadingSub, { color: textMutedColor }]}>
              The Opening · 7 Verses
            </Text>
          </View>

          <View
            style={[
              styles.actionButton,
              { backgroundColor: actionBg, borderColor: actionBorder },
            ]}
          >
            <Ionicons name="play" size={15} color={actionColor} style={{ marginLeft: 2 }} />
          </View>
        </View>
      ) : (
        /* Active State: Full Surah Info + Arabic Name + Progress Bar + Resume */
        <View style={styles.activeContainer}>
          <View style={styles.activeTopRow}>
            {/* Surah Number Star Badge */}
            <StarBadge number={surahNumber!} size={42} />

            {/* Central Information */}
            <View style={styles.textContainer}>
              {/* Category Pill / Tag */}
              <View style={styles.metaLabelRow}>
                <View style={[styles.dot, { backgroundColor: labelColor }]} />
                <Text style={[styles.labelContinue, { color: labelColor }]}>
                  CONTINUE READING
                </Text>
                <Text style={[styles.pctBadge, { color: labelColor }]}>
                  {progressPercent}%
                </Text>
              </View>

              {/* Surah Names (English + Arabic Calligraphy) */}
              <View style={styles.nameRow}>
                <Text
                  style={[styles.surahName, { color: textColor }]}
                  numberOfLines={1}
                >
                  {surahMeta?.nameEnglish || `Surah ${surahNumber}`}
                </Text>

                {surahMeta?.nameArabic && (
                  <Text
                    style={[
                      styles.surahArabicName,
                      {
                        color: arabicColor,
                        fontFamily: typography.fontFamily.surahTitle,
                      },
                    ]}
                    numberOfLines={1}
                  >
                    {surahMeta.nameArabic}
                  </Text>
                )}
              </View>

              {/* Ayah & Page information */}
              <Text style={[styles.ayahInfo, { color: textMutedColor }]} numberOfLines={1}>
                Ayah {currentAyah} of {totalAyahs} {pageNumber ? ` · Page ${pageNumber}` : ''}
              </Text>
            </View>

            {/* Action Play / Resume Button */}
            <View
              style={[
                styles.actionButton,
                { backgroundColor: actionBg, borderColor: actionBorder },
              ]}
            >
              <Ionicons name="play" size={15} color={actionColor} style={{ marginLeft: 2 }} />
            </View>
          </View>

          {/* Thin Progress Track with Rounded Endcaps */}
          <View style={styles.progressSection}>
            <View
              style={[
                styles.progressTrack,
                { backgroundColor: progressTrackBg },
              ]}
            >
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${Math.max(4, progressPercent)}%`,
                    backgroundColor: progressFillColor,
                  },
                ]}
              />
            </View>
          </View>
        </View>
      )}
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 22,
    borderWidth: 1.2,
    paddingHorizontal: 16,
    paddingTop: 15,
    paddingBottom: 14,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 10,
    elevation: 4,
  },
  initialContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconOuterRing: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startReadingTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 2,
  },
  startReadingSub: {
    fontSize: 12.5,
    marginTop: 2,
    fontWeight: '500',
  },
  activeContainer: {
    width: '100%',
  },
  activeTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
    justifyContent: 'center',
  },
  metaLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  labelContinue: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  pctBadge: {
    fontSize: 10,
    fontWeight: '800',
    marginLeft: 'auto',
    letterSpacing: 0.5,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  surahName: {
    fontSize: 15.5,
    fontWeight: '700',
    flexShrink: 1,
  },
  surahArabicName: {
    fontSize: 18,
    lineHeight: 26,
    marginLeft: 8,
    includeFontPadding: true,
  },
  ayahInfo: {
    fontSize: 12,
    marginTop: 2,
    fontWeight: '500',
  },
  actionButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressSection: {
    marginTop: 11,
    paddingHorizontal: 2,
  },
  progressTrack: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
});
