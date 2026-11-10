// src/components/MushafPageView.tsx
// Authentic Madinah Mushaf Page View (Standard 604 Pages)
// Formatted to look exactly like a real printed Quran page (No vertical scrolling, ornate double border)

import React, { useMemo, useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../shared/theme/ThemeProvider';
import { typography } from '../../../shared/theme/typography';
import { toArabicNumber } from '../utils/arabicNumber';
import { GeometricPattern } from '../../../shared/components/GeometricPattern';
import type { PageContent, Surah, Ayah } from '../../quran';

interface MushafPageViewProps {
  content: PageContent;
  arabicSize: number;
  translationSize: number;
  showTranslation: boolean;
  bookmarkedAyahs: Set<string>;
  onToggleBookmark: (surah: number, ayah: number) => void;
  selectedAyah: { surah: number; ayah: Ayah } | null;
  onSelectAyah: (surah: number, ayah: Ayah) => void;
  onZoomChange?: (isZoomed: boolean) => void;
}

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

// Juz names in Arabic for authentic header
const JUZ_NAMES_ARABIC: Record<number, string> = {
  1: 'الجُزْءُ الأَوَّلُ',
  2: 'الجُزْءُ الثَّانِي',
  3: 'الجُزْءُ الثَّالِثُ',
  4: 'الجُزْءُ الرَّابِعُ',
  5: 'الجُزْءُ الخَامِسُ',
  6: 'الجُزْءُ السَّادِسُ',
  7: 'الجُزْءُ السَّابِعُ',
  8: 'الجُزْءُ الثَّامِنُ',
  9: 'الجُزْءُ التَّاسِعُ',
  10: 'الجُزْءُ العَاشِرُ',
  11: 'الجُزْءُ الحَادِي عَشَرَ',
  12: 'الجُزْءُ الثَّانِي عَشَرَ',
  13: 'الجُزْءُ الثَّالِثَ عَشَرَ',
  14: 'الجُزْءُ الرَّابِعَ عَشَرَ',
  15: 'الجُزْءُ الخَامِسَ عَشَرَ',
  16: 'الجُزْءُ السَّادِسَ عَشَرَ',
  17: 'الجُزْءُ السَّابِعَ عَشَرَ',
  18: 'الجُزْءُ الثَّامِنَ عَشَرَ',
  19: 'الجُزْءُ التَّاسِعَ عَشَرَ',
  20: 'الجُزْءُ العِشْرُونَ',
  21: 'الجُزْءُ الحَادِي وَالعِشْرُونَ',
  22: 'الجُزْءُ الثَّانِي وَالعِشْرُونَ',
  23: 'الجُزْءُ الثَّالِثُ وَالعِشْرُونَ',
  24: 'الجُزْءُ الرَّابِعُ وَالعِشْرُونَ',
  25: 'الجُزْءُ الخَامِسُ وَالعِشْرُونَ',
  26: 'الجُزْءُ السَّادِسُ وَالعِشْرُونَ',
  27: 'الجُزْءُ السَّابِعُ وَالعِشْرُونَ',
  28: 'الجُزْءُ الثَّامِنُ وَالعِشْرُونَ',
  29: 'الجُزْءُ التَّاسِعُ وَالعِشْرُونَ',
  30: 'الجُزْءُ الثَّلَاثُونَ',
};

const MushafPageViewComponent: React.FC<MushafPageViewProps> = ({
  content,
  arabicSize: userArabicSize,
  bookmarkedAyahs,
  selectedAyah,
  onSelectAyah,
  onZoomChange,
}) => {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  const isPage1Or2 = content.pageNumber === 1 || content.pageNumber === 2;

  // Option 1: True Pinch-to-Zoom (2-Finger Zoom, Pan & Double-Tap to Reset)
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);
  const [isZoomedState, setIsZoomedState] = useState(false);

  const notifyZoom = useCallback(
    (zoomed: boolean) => {
      setIsZoomedState(zoomed);
      onZoomChange?.(zoomed);
    },
    [onZoomChange]
  );

  const resetZoom = useCallback(() => {
    scale.value = withTiming(1, { duration: 250 });
    translateX.value = withTiming(0, { duration: 250 });
    translateY.value = withTiming(0, { duration: 250 });
    savedScale.value = 1;
    savedTranslateX.value = 0;
    savedTranslateY.value = 0;
    notifyZoom(false);
  }, [notifyZoom, scale, translateX, translateY, savedScale, savedTranslateX, savedTranslateY]);

  const doubleTapGesture = useMemo(() => {
    return Gesture.Tap()
      .numberOfTaps(2)
      .maxDelay(250)
      .onEnd((e) => {
        'worklet';
        if (scale.value > 1.08) {
          // Reset back to 1.0x
          scale.value = withTiming(1, { duration: 250 });
          translateX.value = withTiming(0, { duration: 250 });
          translateY.value = withTiming(0, { duration: 250 });
          savedScale.value = 1;
          savedTranslateX.value = 0;
          savedTranslateY.value = 0;
          runOnJS(notifyZoom)(false);
        } else {
          // Zoom in to 1.9x centered near tap
          const targetScale = 1.9;
          scale.value = withTiming(targetScale, { duration: 250 });
          savedScale.value = targetScale;

          const maxTx = (windowWidth * (targetScale - 1)) / 2;
          const maxTy = (windowHeight * (targetScale - 1)) / 2;
          const focalX = e.x - windowWidth / 2;
          const focalY = e.y - windowHeight / 2;
          const targetTx = Math.min(maxTx, Math.max(-maxTx, -focalX * (targetScale - 1) * 0.5));
          const targetTy = Math.min(maxTy, Math.max(-maxTy, -focalY * (targetScale - 1) * 0.5));

          translateX.value = withTiming(targetTx, { duration: 250 });
          translateY.value = withTiming(targetTy, { duration: 250 });
          savedTranslateX.value = targetTx;
          savedTranslateY.value = targetTy;

          runOnJS(notifyZoom)(true);
        }
      });
  }, [notifyZoom, scale, savedScale, translateX, translateY, savedTranslateX, savedTranslateY, windowWidth, windowHeight]);

  const pinchGesture = useMemo(() => {
    return Gesture.Pinch()
      .onStart(() => {
        'worklet';
        savedScale.value = scale.value;
      })
      .onUpdate((e) => {
        'worklet';
        const newScale = savedScale.value * e.scale;
        scale.value = Math.min(3.2, Math.max(0.92, newScale));
        if (scale.value > 1.08) {
          runOnJS(notifyZoom)(true);
        }
      })
      .onEnd(() => {
        'worklet';
        if (scale.value < 1.08) {
          scale.value = withTiming(1, { duration: 200 });
          translateX.value = withTiming(0, { duration: 200 });
          translateY.value = withTiming(0, { duration: 200 });
          savedScale.value = 1;
          savedTranslateX.value = 0;
          savedTranslateY.value = 0;
          runOnJS(notifyZoom)(false);
        } else {
          savedScale.value = scale.value;
          const maxTx = (windowWidth * (scale.value - 1)) / 2;
          const maxTy = (windowHeight * (scale.value - 1)) / 2;
          if (Math.abs(translateX.value) > maxTx) {
            const clampedX = Math.sign(translateX.value) * maxTx;
            translateX.value = withTiming(clampedX, { duration: 150 });
            savedTranslateX.value = clampedX;
          }
          if (Math.abs(translateY.value) > maxTy) {
            const clampedY = Math.sign(translateY.value) * maxTy;
            translateY.value = withTiming(clampedY, { duration: 150 });
            savedTranslateY.value = clampedY;
          }
        }
      });
  }, [notifyZoom, scale, savedScale, translateX, translateY, savedTranslateX, savedTranslateY, windowWidth, windowHeight]);

  const panGesture = useMemo(() => {
    return Gesture.Pan()
      .averageTouches(true)
      .minPointers(1)
      .maxPointers(2)
      .onStart(() => {
        'worklet';
        savedTranslateX.value = translateX.value;
        savedTranslateY.value = translateY.value;
      })
      .onUpdate((e) => {
        'worklet';
        if (scale.value > 1.05) {
          const maxTx = (windowWidth * (scale.value - 1)) / 2;
          const maxTy = (windowHeight * (scale.value - 1)) / 2;
          const newX = savedTranslateX.value + e.translationX;
          const newY = savedTranslateY.value + e.translationY;
          translateX.value = Math.min(maxTx, Math.max(-maxTx, newX));
          translateY.value = Math.min(maxTy, Math.max(-maxTy, newY));
        }
      })
      .onEnd(() => {
        'worklet';
        if (scale.value > 1.05) {
          savedTranslateX.value = translateX.value;
          savedTranslateY.value = translateY.value;
        } else {
          translateX.value = withTiming(0, { duration: 150 });
          translateY.value = withTiming(0, { duration: 150 });
          savedTranslateX.value = 0;
          savedTranslateY.value = 0;
        }
      });
  }, [scale, savedTranslateX, savedTranslateY, translateX, translateY, windowWidth, windowHeight]);

  // When not zoomed, do NOT include panGesture!
  // This allows single-finger horizontal swiping to pass directly to FlatList without being intercepted.
  const composedGesture = useMemo(() => {
    if (isZoomedState) {
      return Gesture.Simultaneous(pinchGesture, panGesture, doubleTapGesture);
    }
    return Gesture.Simultaneous(pinchGesture, doubleTapGesture);
  }, [isZoomedState, pinchGesture, panGesture, doubleTapGesture]);

  const zoomAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  // Calculate responsive font size & line height so the entire page fits without scrolling
  const { calculatedArabicSize, calculatedLineHeight } = useMemo(() => {
    // Total vertical space available for the page frame
    const topBarHeight = 52 + insets.top;
    const bottomBarHeight = 56 + insets.bottom;
    const pageChromeHeight = topBarHeight + bottomBarHeight + 16; // Margins
    const availableFrameHeight = windowHeight - pageChromeHeight;

    // Header (38) + Footer (38) + Frame borders (16) = ~92px
    const textZoneHeight = availableFrameHeight - 92;

    if (isPage1Or2) {
      // Opening pages have only 7 (Al-Fatiha) or 5 (Al-Baqarah) ayahs + banner
      const lh = Math.min(50, Math.max(36, Math.floor(textZoneHeight / 9)));
      const fs = Math.round(lh * 0.50); // Generous ~2.0x line height ratio to guarantee zero diacritic clipping
      return { calculatedArabicSize: fs, calculatedLineHeight: lh };
    }

    // Standard 15-line Madinah Mushaf page
    // Count how many surah banners and bismillahs are on this page
    let extraHeaderLines = 0;
    for (const item of content.items) {
      if (item.type === 'surah_banner') extraHeaderLines += 2.2;
      if (item.type === 'bismillah') extraHeaderLines += 1.8;
    }

    const estimatedTotalLines = 15 + extraHeaderLines;
    const availableForLines = textZoneHeight - (extraHeaderLines > 0 ? 14 : 8);
    const lh = Math.min(
      38,
      Math.max(26, Math.floor(availableForLines / estimatedTotalLines))
    );
    // User font preference scaling: if user explicitly adjusted slider, allow small proportional nudge
    const scaleFactor = userArabicSize ? userArabicSize / 26 : 1;
    const finalLh = Math.round(lh * Math.min(1.15, Math.max(0.9, scaleFactor)));
    const fs = Math.round(finalLh * 0.50); // 2.0x line-height ratio ensures all upper/lower diacritics fit comfortably

    return { calculatedArabicSize: fs, calculatedLineHeight: finalLh };
  }, [content.pageNumber, content.items, insets.top, insets.bottom, isPage1Or2, userArabicSize]);

  // Group items into segments (banners, bismillah, or group of flowing ayahs)
  type Segment =
    | { type: 'banner'; surah: Surah; key: string }
    | { type: 'bismillah'; surahNumber: number; key: string }
    | { type: 'ayah_flow'; items: { surahNumber: number; ayah: Ayah; key: string }[]; key: string };

  const segments = useMemo<Segment[]>(() => {
    const segs: Segment[] = [];
    let currentAyahGroup: { surahNumber: number; ayah: Ayah; key: string }[] = [];

    for (const item of content.items) {
      if (item.type === 'surah_banner') {
        if (currentAyahGroup.length > 0) {
          segs.push({
            type: 'ayah_flow',
            items: [...currentAyahGroup],
            key: `flow-${currentAyahGroup[0].key}`,
          });
          currentAyahGroup = [];
        }
        segs.push({ type: 'banner', surah: item.surah, key: item.key });
      } else if (item.type === 'bismillah') {
        if (currentAyahGroup.length > 0) {
          segs.push({
            type: 'ayah_flow',
            items: [...currentAyahGroup],
            key: `flow-${currentAyahGroup[0].key}`,
          });
          currentAyahGroup = [];
        }
        segs.push({ type: 'bismillah', surahNumber: item.surahNumber, key: item.key });
      } else if (item.type === 'ayah') {
        currentAyahGroup.push(item);
      }
    }

    if (currentAyahGroup.length > 0) {
      segs.push({
        type: 'ayah_flow',
        items: currentAyahGroup,
        key: `flow-${currentAyahGroup[0].key}`,
      });
    }

    return segs;
  }, [content.items]);

  const primarySurahName = content.primarySurah?.nameArabic || '';
  const juzArabic = JUZ_NAMES_ARABIC[content.juzNumber] || `الجُزْءُ ${toArabicNumber(content.juzNumber)}`;

  return (
    <View style={[styles.outerPage, { width: windowWidth, backgroundColor: colors.background }]}>
      {/* Floating Zoom Indicator & One-Tap Reset Button */}
      {isZoomedState && (
        <Pressable
          onPress={resetZoom}
          style={[
            styles.resetZoomPill,
            {
              backgroundColor: isDark ? '#084F38' : '#0B6B4C',
              borderColor: isDark ? '#3DB88A' : '#084F38',
            },
          ]}
          hitSlop={8}
          accessibilityLabel="Reset zoom to 100%"
        >
          <Ionicons name="refresh-outline" size={13} color="#FFFFFF" style={{ marginRight: 4 }} />
          <Text style={styles.resetZoomText}>Reset Zoom (1.0x)</Text>
        </Pressable>
      )}

      <GestureDetector gesture={composedGesture}>
        <Animated.View style={[styles.zoomContainer, zoomAnimatedStyle]}>
          {/* Authentic Mushaf Ornamental Double Frame */}
          <View
            style={[
              styles.mushafOuterFrame,
              {
                borderColor: colors.primary,
                backgroundColor: isDark ? colors.card : '#FCFDFB',
              },
            ]}
          >
        {/* Inner Border (Golden/Emerald traditional border line) */}
        <View style={[styles.mushafInnerFrame, { borderColor: isDark ? '#2D6A4F' : '#2D6A4F' }]}>
          {/* Top Header Bar of the Page */}
          <View style={[styles.pageHeader, { borderBottomColor: isDark ? '#2D6A4F' : '#B7D5C4' }]}>
            {/* Juz Name on Left */}
            <Text
              style={[
                styles.headerJuz,
                {
                  color: isDark ? colors.primary : '#0D6646',
                  fontFamily: typography.fontFamily.surahTitle,
                },
              ]}
              numberOfLines={1}
            >
              {juzArabic}
            </Text>

            {/* Central Ornate Motif */}
            <Text style={[styles.headerMotif, { color: isDark ? colors.primary : '#0D6646' }]}>۞</Text>

            {/* Surah Name on Right */}
            <Text
              style={[
                styles.headerSurah,
                {
                  color: isDark ? colors.primary : '#0D6646',
                  fontFamily: typography.fontFamily.surahTitle,
                },
              ]}
              numberOfLines={1}
            >
              سُورَةُ {primarySurahName.replace(/^سورة\s*/i, '')}
            </Text>
          </View>

          {/* Authentic Page Content: Static full-page container (ZERO vertical scrolling) */}
          <View
            style={[
              styles.pageBody,
              isPage1Or2 && styles.pageBodyCentered,
            ]}
          >
            {segments.map((seg) => {
              if (seg.type === 'banner') {
                return (
                  <View
                    key={seg.key}
                    style={[
                      styles.surahHeaderPlate,
                      {
                        borderColor: colors.primary,
                        backgroundColor: isDark ? '#1B4332' : '#E8F5E9',
                      },
                    ]}
                  >
                    <GeometricPattern color={colors.primary} opacity={0.12} />
                    <Text
                      style={[
                        styles.surahHeaderTitle,
                        {
                          color: colors.primary,
                          fontFamily: typography.fontFamily.surahTitle,
                        },
                      ]}
                    >
                      سُورَةُ {seg.surah.nameArabic.replace(/^سورة\s*/i, '')}
                    </Text>
                    <Text
                      style={[
                        styles.surahHeaderMeta,
                        {
                          color: isDark ? '#95D5B2' : '#2D6A4F',
                          fontFamily: typography.fontFamily.surahTitle,
                        },
                      ]}
                    >
                      آيَاتُهَا {toArabicNumber(seg.surah.ayahCount)} • {seg.surah.type === 'Makki' ? 'مَكِّيَّةٌ' : 'مَدَنِيَّةٌ'}
                    </Text>
                  </View>
                );
              }

              if (seg.type === 'bismillah') {
                const bismillahFontSize = isPage1Or2
                  ? Math.min(26, Math.max(20, Math.round(calculatedArabicSize * 1.1)))
                  : Math.min(22, Math.max(16, Math.round(calculatedArabicSize * 1.05)));
                const bismillahLineHeight = Math.round(bismillahFontSize * 2.15);

                return (
                  <View key={seg.key} style={styles.bismillahBox}>
                    <Text
                      style={[
                        styles.bismillahText,
                        {
                          fontSize: bismillahFontSize,
                          lineHeight: bismillahLineHeight,
                          color: colors.primary,
                          fontFamily: typography.fontFamily.quran,
                        },
                      ]}
                    >
                      بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
                    </Text>
                  </View>
                );
              }

              // Flowing Continuous Arabic Quran Text (Paragraph style matching printed page)
              return (
                <View key={seg.key} style={styles.paragraphContainer}>
                  <Text
                    style={[
                      styles.flowingArabicText,
                      {
                        fontSize: calculatedArabicSize,
                        lineHeight: calculatedLineHeight,
                        color: isDark ? colors.text : '#06150E', // Ultra-high contrast deep black-emerald for crisp legibility
                        fontFamily: typography.fontFamily.quran,
                        textAlign: isPage1Or2 ? 'center' : 'right',
                      },
                    ]}
                  >
                    {seg.items.map((it) => {
                      const isSelected =
                        selectedAyah?.surah === it.surahNumber &&
                        selectedAyah?.ayah.n === it.ayah.n;
                      const isBookmarked = bookmarkedAyahs.has(`${it.surahNumber}:${it.ayah.n}`);

                      return (
                        <Text
                          key={it.key}
                          onPress={() => onSelectAyah(it.surahNumber, it.ayah)}
                          suppressHighlighting
                          style={styles.ayahTextSpan}
                        >
                          {it.ayah.ar}{' '}
                          {!it.ayah.ar.includes('۝') && (
                            <Text
                              style={[
                                styles.ayahNumberMarker,
                                {
                                  color: isSelected
                                    ? colors.primaryDeep
                                    : isBookmarked
                                    ? '#D90429'
                                    : isDark
                                    ? colors.primary
                                    : '#0D6646',
                                  fontSize: Math.round(calculatedArabicSize * 0.92),
                                },
                              ]}
                            >
                              {`﴿${toArabicNumber(it.ayah.n)}﴾ `}
                            </Text>
                          )}
                        </Text>
                      );
                    })}
                  </Text>
                </View>
              );
            })}
          </View>

          {/* Bottom Footer of the Page: Authentic Star Badge with Page Number */}
          <View style={[styles.pageFooter, { borderTopColor: isDark ? '#2D6A4F' : '#B7D5C4' }]}>
            <View style={styles.pageFooterBadgeContainer}>
              <Text
                style={[
                  styles.pageNumberArabic,
                  {
                    color: isDark ? colors.primary : '#0D6646',
                    fontFamily: typography.fontFamily.quran,
                    fontWeight: 'bold',
                  },
                ]}
              >
                ۞ {toArabicNumber(content.pageNumber)} ۞
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Animated.View>
  </GestureDetector>
</View>
  );
};

const styles = StyleSheet.create({
  outerPage: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    overflow: 'hidden',
  },
  zoomContainer: {
    flex: 1,
  },
  resetZoomPill: {
    position: 'absolute',
    top: 10,
    right: 18,
    zIndex: 9999,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 8,
  },
  resetZoomText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  mushafOuterFrame: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 2.5,
    padding: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  mushafInnerFrame: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1.2,
    overflow: 'hidden',
    justifyContent: 'space-between',
  },
  pageHeader: {
    height: 38,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    borderBottomWidth: 1,
  },
  headerJuz: {
    fontSize: 15,
    lineHeight: 26,
    includeFontPadding: true,
    textAlign: 'left',
  },
  headerMotif: {
    fontSize: 16,
    opacity: 0.8,
  },
  headerSurah: {
    fontSize: 15,
    lineHeight: 26,
    includeFontPadding: true,
    textAlign: 'right',
  },
  pageBody: {
    flex: 1,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 8,
    justifyContent: 'flex-start',
  },
  pageBodyCentered: {
    justifyContent: 'center',
    paddingVertical: 14,
  },
  surahHeaderPlate: {
    borderRadius: 10,
    borderWidth: 1.5,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    marginBottom: 6,
    overflow: 'hidden',
    position: 'relative',
  },
  surahHeaderTitle: {
    fontSize: 22,
    lineHeight: 36,
    textAlign: 'center',
    includeFontPadding: true,
    marginBottom: 2,
  },
  surahHeaderMeta: {
    fontSize: 13,
    lineHeight: 22,
    textAlign: 'center',
    includeFontPadding: true,
  },
  bismillahBox: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    marginBottom: 8,
  },
  bismillahText: {
    textAlign: 'center',
    writingDirection: 'rtl',
    includeFontPadding: true,
    paddingVertical: 2,
  },
  paragraphContainer: {
    width: '100%',
    paddingVertical: 2,
    paddingHorizontal: 2,
  },
  flowingArabicText: {
    writingDirection: 'rtl',
    includeFontPadding: true,
    paddingTop: 4,
    paddingBottom: 2,
  },
  ayahTextSpan: {
    // Pure inline span without individual background colors so HarfBuzz shaping is never fragmented
  },
  ayahNumberMarker: {
    fontWeight: 'normal',
    includeFontPadding: true,
  },
  pageFooter: {
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
  },
  pageFooterBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageNumberArabic: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export const MushafPageView = React.memo(MushafPageViewComponent);
