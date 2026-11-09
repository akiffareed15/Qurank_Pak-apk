// app/reader/[surah].tsx

import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Dimensions,
  ViewToken,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/theme/ThemeProvider';
import { typography } from '../../src/theme/typography';
import { quranRepository } from '../../src/data/quranRepository';
import { useSettingsStore } from '../../src/store/settingsStore';
import { useLastReadStore } from '../../src/store/lastReadStore';
import { useBookmarksStore } from '../../src/store/bookmarksStore';
import { SurahBanner } from '../../src/components/SurahBanner';
import { BismillahHeader } from '../../src/components/BismillahHeader';
import { AyahItem } from '../../src/components/AyahItem';
import { MushafPageView } from '../../src/components/MushafPageView';
import { ThemeToggleButton } from '../../src/components/ThemeToggleButton';
import type { Ayah, Surah } from '../../src/types/quran';

const { width } = Dimensions.get('window');
const ALL_PAGES = Array.from({ length: 604 }, (_, i) => i + 1);

type ListItem =
  | { type: 'banner'; key: string }
  | { type: 'bismillah'; key: string }
  | { type: 'ayah'; ayah: Ayah; key: string };

export default function ReaderScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();

  const params = useLocalSearchParams<{ surah: string; ayah?: string; page?: string }>();
  const initialSurahNumber = parseInt(params.surah || '1', 10);
  const [currentSurahNumber, setCurrentSurahNumber] = useState(initialSurahNumber);
  const targetAyah = params.ayah ? parseInt(params.ayah, 10) : null;
  const targetPage = params.page ? parseInt(params.page, 10) : null;

  // Sync params if they change externally
  useEffect(() => {
    if (params.surah) {
      const s = parseInt(params.surah, 10);
      if (!isNaN(s) && s !== currentSurahNumber) {
        setCurrentSurahNumber(s);
      }
    }
  }, [params.surah]);

  // Stores
  const {
    arabicSize,
    translationSize,
    showTranslation,
    setShowTranslation,
    readingMode,
    setReadingMode,
  } = useSettingsStore();

  const setLastRead = useLastReadStore((s) => s.setLastRead);
  const bookmarks = useBookmarksStore((s) => s.bookmarks);
  const toggleBookmark = useBookmarksStore((s) => s.toggleBookmark);

  // Set of bookmarked ayahs for fast lookup
  const bookmarkedSet = useMemo(() => {
    return new Set(bookmarks.map((b) => `${b.surah}:${b.ayah}`));
  }, [bookmarks]);

  // Surah Data
  const surahMeta = useMemo<Surah | undefined>(
    () => quranRepository.getSurahMeta(currentSurahNumber),
    [currentSurahNumber]
  );

  const surahContent = useMemo(
    () => quranRepository.getSurah(currentSurahNumber),
    [currentSurahNumber]
  );

  // Initial page calculation for 604 Madinah Mushaf Mode
  const initialMushafPage = useMemo(() => {
    if (targetPage && targetPage >= 1 && targetPage <= 604) {
      return targetPage;
    }
    if (targetAyah) {
      return quranRepository.getPageForAyah(initialSurahNumber, targetAyah);
    }
    return quranRepository.getSurahPages(initialSurahNumber).startPage;
  }, [targetPage, targetAyah, initialSurahNumber]);

  const [currentMushafPage, setCurrentMushafPage] = useState(initialMushafPage);

  // Selected ayah in Mushaf mode for viewing translation
  const [selectedAyah, setSelectedAyah] = useState<{ surah: number; ayah: Ayah } | null>(null);

  // Zoom state to disable horizontal page swipe while zoomed in
  const [isPageZoomed, setIsPageZoomed] = useState(false);

  // Prepare list items for List Mode
  const listItems = useMemo<ListItem[]>(() => {
    const items: ListItem[] = [
      { type: 'banner', key: `banner-${currentSurahNumber}` },
    ];
    if (surahContent.bismillahHeader) {
      items.push({ type: 'bismillah', key: `bismillah-${currentSurahNumber}` });
    }
    for (const a of surahContent.ayahs) {
      items.push({ type: 'ayah', ayah: a, key: `ayah-${currentSurahNumber}-${a.n}` });
    }
    return items;
  }, [currentSurahNumber, surahContent]);

  const flatListRef = useRef<FlatList<ListItem>>(null);
  const mushafListRef = useRef<FlatList<number>>(null);

  const [pendingScrollAyah, setPendingScrollAyah] = useState<number | null>(targetAyah);
  const [highlightedAyah, setHighlightedAyah] = useState<number | null>(targetAyah);
  const [hasScrolled, setHasScrolled] = useState(false);

  // Track the topmost visible Ayah in Translation mode for bi-directional sync
  const currentVisibleAyahRef = useRef<{ surah: number; ayah: number }>({
    surah: initialSurahNumber,
    ayah: targetAyah || 1,
  });

  // Scroll to target ayah in Translation Mode
  useEffect(() => {
    if (readingMode === 'list' && pendingScrollAyah !== null) {
      const ayahToScroll = pendingScrollAyah;
      const targetIndex = listItems.findIndex(
        (item) => item.type === 'ayah' && item.ayah.n === ayahToScroll
      );

      if (targetIndex >= 0) {
        const timer = setTimeout(() => {
          try {
            if (targetIndex <= 2 && ayahToScroll === 1) {
              flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
            } else {
              flatListRef.current?.scrollToIndex({
                index: targetIndex,
                animated: true,
                viewPosition: 0.08,
              });
            }
          } catch {
            // Handled by onScrollToIndexFailed
          }
          setPendingScrollAyah(null);
        }, 320);

        // Flash highlight for 1.8 seconds then clear
        const highlightTimer = setTimeout(() => {
          setHighlightedAyah(null);
        }, 1800);

        return () => {
          clearTimeout(timer);
          clearTimeout(highlightTimer);
        };
      }
    }
  }, [pendingScrollAyah, listItems, readingMode]);

  // Debounced last read updater for List Mode
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const firstAyahItem = viewableItems.find(
        (v) => (v.item as ListItem).type === 'ayah'
      );
      if (firstAyahItem) {
        const ayahNumber = (firstAyahItem.item as { ayah: Ayah }).ayah.n;
        currentVisibleAyahRef.current = { surah: currentSurahNumber, ayah: ayahNumber };
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
        }
        debounceTimerRef.current = setTimeout(() => {
          const page = quranRepository.getPageForAyah(currentSurahNumber, ayahNumber);
          setLastRead(currentSurahNumber, ayahNumber, page);
        }, 500);
      }
    },
    [currentSurahNumber, setLastRead]
  );

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 40,
  }).current;

  // Debounced lastRead timer so disk I/O does not trigger during swiping
  const lastReadTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Track page changes in Mushaf Mode
  const onMushafPageChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].item) {
        const pageNum = viewableItems[0].item as number;
        setCurrentMushafPage(pageNum);

        if (lastReadTimeoutRef.current) {
          clearTimeout(lastReadTimeoutRef.current);
        }
        lastReadTimeoutRef.current = setTimeout(() => {
          const pageMeta = quranRepository.getPageMeta(pageNum);
          if (pageMeta) {
            setLastRead(pageMeta.start.surah, pageMeta.start.ayah, pageNum);
          }
        }, 400);
      }
    },
    [setLastRead]
  );

  const handleScroll = useCallback((event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setHasScrolled(offsetY > 20);
  }, []);

  const handleToggleBookmark = useCallback(
    (sNumber: number, aNumber: number) => {
      toggleBookmark(sNumber, aNumber);
    },
    [toggleBookmark]
  );

  const handleSelectAyah = useCallback((surah: number, ayah: any) => {
    setSelectedAyah({ surah, ayah });
  }, []);

  // Jump to next or previous page in Mushaf mode
  const goToPage = useCallback((pageNum: number) => {
    if (pageNum >= 1 && pageNum <= 604) {
      mushafListRef.current?.scrollToOffset({
        offset: width * (pageNum - 1),
        animated: true,
      });
      setCurrentMushafPage(pageNum);
    }
  }, []);

  // Bi-directional switch to 604 Mushaf Mode matching currently viewed Ayah in Translation mode
  const handleSwitchToMushaf = useCallback(() => {
    if (readingMode === 'mushaf') return;

    setSelectedAyah(null);
    const visibleAyah = currentVisibleAyahRef.current?.ayah || targetAyah || 1;
    const targetSurah = currentVisibleAyahRef.current?.surah || currentSurahNumber;
    const targetPageNum = quranRepository.getPageForAyah(targetSurah, visibleAyah);

    setCurrentMushafPage(targetPageNum);
    setReadingMode('mushaf');

    // Smoothly ensure carousel aligns with target page
    setTimeout(() => {
      try {
        mushafListRef.current?.scrollToOffset({
          offset: width * (targetPageNum - 1),
          animated: false,
        });
      } catch {
        // Handled by onScrollToIndexFailed
      }
    }, 60);
  }, [readingMode, targetAyah, currentSurahNumber, setReadingMode]);

  // Bi-directional switch to Translation Mode matching currently viewed Mushaf page (or specific ayah)
  const handleSwitchToTranslation = useCallback(
    (specificAyah?: number, specificSurah?: number) => {
      setSelectedAyah(null);

      const pageMeta = quranRepository.getPageMeta(currentMushafPage);
      const surahToLoad = specificSurah ?? (pageMeta ? pageMeta.start.surah : currentSurahNumber);
      const ayahToScroll = specificAyah ?? (pageMeta ? pageMeta.start.ayah : 1);

      currentVisibleAyahRef.current = { surah: surahToLoad, ayah: ayahToScroll };
      setCurrentSurahNumber(surahToLoad);
      setPendingScrollAyah(ayahToScroll);
      setHighlightedAyah(ayahToScroll);
      setReadingMode('list');
    },
    [currentMushafPage, currentSurahNumber, setReadingMode]
  );

  // List mode item renderer
  const renderListItem = useCallback(
    ({ item }: { item: ListItem }) => {
      if (item.type === 'banner') {
        if (!surahMeta) return null;
        return <SurahBanner surah={surahMeta} />;
      }

      if (item.type === 'bismillah') {
        return <BismillahHeader />;
      }

      const ayah = item.ayah;
      const isBookmarked = bookmarkedSet.has(`${currentSurahNumber}:${ayah.n}`);
      const isHighlighted = highlightedAyah === ayah.n;

      return (
        <AyahItem
          ayah={ayah}
          surahNumber={currentSurahNumber}
          arabicSize={arabicSize}
          translationSize={translationSize}
          showTranslation={true}
          isBookmarked={isBookmarked}
          isHighlighted={isHighlighted}
          onToggleBookmark={handleToggleBookmark}
        />
      );
    },
    [
      surahMeta,
      currentSurahNumber,
      arabicSize,
      translationSize,
      bookmarkedSet,
      highlightedAyah,
      handleToggleBookmark,
    ]
  );

  // Mushaf mode page renderer
  const renderMushafPage = useCallback(
    ({ item: pageNum }: { item: number }) => {
      const content = quranRepository.getPageContent(pageNum);
      return (
        <MushafPageView
          content={content}
          arabicSize={arabicSize}
          translationSize={translationSize}
          showTranslation={showTranslation}
          bookmarkedAyahs={bookmarkedSet}
          onToggleBookmark={handleToggleBookmark}
          selectedAyah={selectedAyah}
          onSelectAyah={handleSelectAyah}
          onZoomChange={setIsPageZoomed}
        />
      );
    },
    [
      arabicSize,
      translationSize,
      showTranslation,
      bookmarkedSet,
      handleToggleBookmark,
      selectedAyah,
      handleSelectAyah,
      setIsPageZoomed,
    ]
  );

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingTop: insets.top,
        },
      ]}
    >
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.background,
            borderBottomColor: colors.border,
            borderBottomWidth: hasScrolled || readingMode === 'mushaf' ? StyleSheet.hairlineWidth : 0,
          },
        ]}
      >
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [
            styles.headerActionButton,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              opacity: pressed ? 0.75 : 1,
              transform: [{ scale: pressed ? 0.94 : 1 }],
            },
          ]}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Back"
        >
          <Ionicons name="arrow-back" size={20} color={colors.text} />
        </Pressable>

        <View style={styles.headerTitleContainer}>
          <Text
            style={[
              styles.headerTitle,
              {
                color: colors.primary,
                fontFamily: typography.fontFamily.surahTitle,
              },
            ]}
            numberOfLines={1}
          >
            {readingMode === 'mushaf'
              ? quranRepository.getPageMeta(currentMushafPage)
                  ? quranRepository.getSurahMeta(
                      quranRepository.getPageMeta(currentMushafPage)!.surahs[0]
                    )?.nameArabic || ''
                  : surahMeta?.nameArabic || ''
              : surahMeta?.nameArabic || ''}
          </Text>
        </View>

        {/* Action icons: Home Button + Theme Toggle + Settings Button (Matching Companion Buttons) */}
        <View style={styles.headerRightActions}>
          {/* Home Button */}
          <Pressable
            onPress={() => router.navigate('/')}
            style={({ pressed }) => [
              styles.headerActionButton,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                opacity: pressed ? 0.75 : 1,
                transform: [{ scale: pressed ? 0.94 : 1 }],
              },
            ]}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Home"
          >
            <Ionicons name="home-outline" size={19} color={colors.text} />
          </Pressable>

          {/* Quick Theme Toggle (Dark / Light) */}
          <ThemeToggleButton variant="header" size={19} />

          {/* Settings Button */}
          <Pressable
            onPress={() => router.push('/settings')}
            style={({ pressed }) => [
              styles.headerActionButton,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                opacity: pressed ? 0.75 : 1,
                transform: [{ scale: pressed ? 0.94 : 1 }],
              },
            ]}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Settings"
          >
            <Ionicons name="settings-outline" size={19} color={colors.text} />
          </Pressable>
        </View>
      </View>

      {/* Prominent & Self-Explanatory Reading Mode Segmented Switcher */}
      <View
        style={[
          styles.modeSwitcherBar,
          {
            backgroundColor: colors.background,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <View
          style={[
            styles.modeSwitcherTrack,
            {
              backgroundColor: isDark ? colors.card : '#EDF4F0',
              borderColor: colors.border,
            },
          ]}
        >
          {/* 604 Madinah Mushaf Page Mode */}
          <Pressable
            onPress={handleSwitchToMushaf}
            style={[
              styles.modeSegment,
              readingMode === 'mushaf' && [
                styles.modeSegmentActive,
                { backgroundColor: colors.primary },
              ],
            ]}
          >
            <Ionicons
              name="book"
              size={15}
              color={readingMode === 'mushaf' ? '#FFFFFF' : colors.textMuted}
              style={{ marginRight: 6 }}
            />
            <Text
              style={[
                styles.modeSegmentText,
                {
                  color: readingMode === 'mushaf' ? '#FFFFFF' : colors.text,
                  fontWeight: readingMode === 'mushaf' ? '700' : '500',
                },
              ]}
            >
              Mushaf Page (604)
            </Text>
          </Pressable>

          {/* Translation Mode */}
          <Pressable
            onPress={() => handleSwitchToTranslation()}
            style={[
              styles.modeSegment,
              readingMode === 'list' && [
                styles.modeSegmentActive,
                { backgroundColor: colors.primary },
              ],
            ]}
          >
            <Ionicons
              name="language"
              size={16}
              color={readingMode === 'list' ? '#FFFFFF' : colors.textMuted}
              style={{ marginRight: 6 }}
            />
            <Text
              style={[
                styles.modeSegmentText,
                {
                  color: readingMode === 'list' ? '#FFFFFF' : colors.text,
                  fontWeight: readingMode === 'list' ? '700' : '500',
                },
              ]}
            >
              Translation
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Content based on Reading Mode */}
      {readingMode === 'mushaf' ? (
        <View style={styles.mushafContainer}>
          {/* Authentic 604 Madinah Mushaf Pages (Horizontal Paging) */}
          <FlatList
            ref={mushafListRef}
            data={ALL_PAGES}
            keyExtractor={(pageNum) => `mushaf-p-${pageNum}`}
            renderItem={renderMushafPage}
            horizontal
            pagingEnabled
            scrollEnabled={!isPageZoomed}
            showsHorizontalScrollIndicator={false}
            initialScrollIndex={Math.max(0, currentMushafPage - 1)}
            getItemLayout={(data, index) => ({
              length: width,
              offset: width * index,
              index,
            })}
            onViewableItemsChanged={onMushafPageChanged}
            viewabilityConfig={viewabilityConfig}
            initialNumToRender={1}
            maxToRenderPerBatch={1}
            windowSize={3}
            removeClippedSubviews={false}
            decelerationRate="fast"
            snapToInterval={width}
            snapToAlignment="start"
            onScrollToIndexFailed={(info) => {
              mushafListRef.current?.scrollToOffset({
                offset: width * info.index,
                animated: false,
              });
            }}
          />

          {/* Bottom Floating Translation Card when an Ayah is tapped */}
          {selectedAyah && (
            <View
              style={[
                styles.translationPopup,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  shadowColor: isDark ? '#000000' : colors.primaryDeep,
                },
              ]}
            >
              <View style={styles.popupTopRow}>
                <View style={styles.popupMeta}>
                  <Text style={[styles.popupSurahName, { color: colors.text }]}>
                    {quranRepository.getSurahMeta(selectedAyah.surah)?.nameEnglish} • Ayah {selectedAyah.ayah.n}
                  </Text>
                </View>
                <View style={styles.popupActions}>
                  <Pressable
                    onPress={() => handleToggleBookmark(selectedAyah.surah, selectedAyah.ayah.n)}
                    style={styles.popupIconBtn}
                    hitSlop={8}
                    accessibilityRole="button"
                    accessibilityLabel="Bookmark Ayah"
                  >
                    <Ionicons
                      name={
                        bookmarkedSet.has(`${selectedAyah.surah}:${selectedAyah.ayah.n}`)
                          ? 'bookmark'
                          : 'bookmark-outline'
                      }
                      size={20}
                      color={colors.primary}
                    />
                  </Pressable>
                  <Pressable
                    onPress={() => setSelectedAyah(null)}
                    style={styles.popupIconBtn}
                    hitSlop={8}
                    accessibilityRole="button"
                    accessibilityLabel="Close"
                  >
                    <Ionicons name="close" size={20} color={colors.textMuted} />
                  </Pressable>
                </View>
              </View>

              <ScrollView
                style={styles.popupScroll}
                showsVerticalScrollIndicator={false}
                bounces={false}
              >
                <Text style={[styles.popupTranslation, { color: colors.text }]}>
                  {selectedAyah.ayah.tr}
                </Text>
              </ScrollView>

              {/* Direct Jump Action Button: Open in Translation mode */}
              <Pressable
                onPress={() => handleSwitchToTranslation(selectedAyah.ayah.n, selectedAyah.surah)}
                style={({ pressed }) => [
                  styles.popupJumpButton,
                  {
                    backgroundColor: isDark ? 'rgba(16, 185, 129, 0.16)' : 'rgba(5, 150, 105, 0.1)',
                    borderColor: colors.primary,
                    opacity: pressed ? 0.75 : 1,
                  },
                ]}
                hitSlop={6}
                accessibilityRole="button"
                accessibilityLabel="Open in Translation"
              >
                <Ionicons
                  name="language"
                  size={15}
                  color={colors.primary}
                  style={{ marginRight: 6 }}
                />
                <Text style={[styles.popupJumpButtonText, { color: colors.primary }]}>
                  Open in Translation
                </Text>
                <Ionicons
                  name="arrow-forward"
                  size={14}
                  color={colors.primary}
                  style={{ marginLeft: 6 }}
                />
              </Pressable>
            </View>
          )}

          {/* Quick Page Flip Navigation Bar */}
          <View style={[styles.pageNavControls, { borderTopColor: colors.border, paddingBottom: insets.bottom + 4 }]}>
            <Pressable
              onPress={() => goToPage(currentMushafPage - 1)}
              disabled={currentMushafPage <= 1}
              style={[styles.navBtn, currentMushafPage <= 1 && styles.navBtnDisabled]}
              hitSlop={12}
            >
              <Ionicons
                name="chevron-back"
                size={22}
                color={currentMushafPage <= 1 ? colors.border : colors.primary}
              />
            </Pressable>

            <Text style={[styles.pageCounterText, { color: colors.text }]}>
              Page {currentMushafPage} <Text style={{ color: colors.textMuted }}>/ 604</Text>
            </Text>

            <Pressable
              onPress={() => goToPage(currentMushafPage + 1)}
              disabled={currentMushafPage >= 604}
              style={[styles.navBtn, currentMushafPage >= 604 && styles.navBtnDisabled]}
              hitSlop={12}
            >
              <Ionicons
                name="chevron-forward"
                size={22}
                color={currentMushafPage >= 604 ? colors.border : colors.primary}
              />
            </Pressable>
          </View>
        </View>
      ) : (
        /* List Mode: Continuous Vertical Scroll */
        <FlatList
          ref={flatListRef}
          data={listItems}
          keyExtractor={(item) => item.key}
          renderItem={renderListItem}
          contentContainerStyle={{
            paddingBottom: insets.bottom + 36,
          }}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          removeClippedSubviews={true}
          onScrollToIndexFailed={(info) => {
            flatListRef.current?.scrollToOffset({
              offset: info.averageItemLength * info.index,
              animated: true,
            });
            setTimeout(() => {
              flatListRef.current?.scrollToIndex({
                index: info.index,
                animated: true,
              });
            }, 150);
          }}
          initialNumToRender={8}
          maxToRenderPerBatch={6}
          updateCellsBatchingPeriod={40}
          windowSize={5}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  headerButton: {
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerActionButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  headerTitle: {
    fontSize: 24,
    lineHeight: 38,
    includeFontPadding: true,
    textAlign: 'center',
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  modeSwitcherBar: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  modeSwitcherTrack: {
    flexDirection: 'row',
    borderRadius: 22,
    borderWidth: 1,
    padding: 3,
    width: '100%',
    maxWidth: 380,
  },
  modeSegment: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    borderRadius: 18,
  },
  modeSegmentActive: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  modeSegmentText: {
    fontSize: 13,
    letterSpacing: 0.2,
  },
  mushafContainer: {
    flex: 1,
  },
  translationPopup: {
    position: 'absolute',
    bottom: 58,
    left: 16,
    right: 16,
    maxHeight: 280,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    elevation: 8,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  popupTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  popupMeta: {
    flex: 1,
  },
  popupSurahName: {
    fontSize: 14,
    fontWeight: '600',
  },
  popupActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  popupIconBtn: {
    padding: 4,
    marginLeft: 8,
  },
  popupScroll: {
    maxHeight: 120,
    marginVertical: 4,
  },
  popupTranslation: {
    fontSize: 14,
    lineHeight: 20,
  },
  popupJumpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
  },
  popupJumpButtonText: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  pageNavControls: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  navBtn: {
    padding: 6,
  },
  navBtnDisabled: {
    opacity: 0.3,
  },
  pageCounterText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
