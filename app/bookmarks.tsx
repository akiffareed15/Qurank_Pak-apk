// app/bookmarks.tsx

import React, { useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  FadeInDown,
  FadeOutLeft,
  Layout,
  ReduceMotion,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../src/theme/ThemeProvider';
import { typography } from '../src/theme/typography';
import { StarBadge } from '../src/components/StarBadge';
import { EmptyState } from '../src/components/EmptyState';
import { ThemeToggleButton } from '../src/components/ThemeToggleButton';
import { useBookmarksStore } from '../src/store/bookmarksStore';
import { quranRepository } from '../src/data/quranRepository';
import type { Bookmark } from '../src/types/quran';

export default function BookmarksScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  const bookmarks = useBookmarksStore((s) => s.bookmarks);
  const removeBookmark = useBookmarksStore((s) => s.removeBookmark);

  const handleOpenBookmark = useCallback(
    (surah: number, ayah: number) => {
      router.push({
        pathname: '/reader/[surah]',
        params: { surah: String(surah), ayah: String(ayah) },
      });
    },
    [router]
  );

  const renderItem = useCallback(
    ({ item }: { item: Bookmark }) => {
      const meta = quranRepository.getSurahMeta(item.surah);
      let arabicSnippet = '';
      try {
        const surahData = quranRepository.getSurah(item.surah);
        const ayahData = surahData.ayahs.find((a) => a.n === item.ayah);
        arabicSnippet = ayahData?.ar || '';
      } catch {
        arabicSnippet = '';
      }

      return (
        <Animated.View
          entering={FadeInDown.duration(250).reduceMotion(ReduceMotion.System)}
          exiting={FadeOutLeft.duration(200).reduceMotion(ReduceMotion.System)}
          layout={Layout.springify().damping(18)}
        >
          <Pressable
            onPress={() => handleOpenBookmark(item.surah, item.ayah)}
            style={({ pressed }) => [
              styles.row,
              {
                backgroundColor: pressed ? colors.primarySoft : colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <StarBadge number={item.ayah} size={36} />

            <View style={styles.textContainer}>
              <Text
                style={[styles.surahName, { color: colors.text }]}
                numberOfLines={1}
              >
                {meta?.nameEnglish || `Surah ${item.surah}`}
              </Text>
              <Text
                style={[
                  styles.arabicPreview,
                  {
                    color: colors.primary,
                    fontFamily: typography.fontFamily.quran,
                  },
                ]}
                numberOfLines={1}
              >
                {arabicSnippet}
              </Text>
            </View>

            <Pressable
              onPress={() => removeBookmark(item.surah, item.ayah)}
              style={styles.trashBtn}
              hitSlop={12}
            >
              <Ionicons
                name="trash-outline"
                size={18}
                color={colors.danger}
              />
            </Pressable>
          </Pressable>
        </Animated.View>
      );
    },
    [colors, handleOpenBookmark, removeBookmark]
  );

  const keyExtractor = useCallback(
    (item: Bookmark) => `${item.surah}-${item.ayah}`,
    []
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

        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Bookmarks
        </Text>

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

          {/* Theme Toggle Button */}
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

      {/* Bookmarks List */}
      <FlatList
        data={bookmarks}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + 24 },
        ]}
        ListEmptyComponent={<EmptyState message="No bookmarks yet" />}
      />
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
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backButton: {
    padding: 6,
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
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerBtn: {
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 10,
  },
  textContainer: {
    flex: 1,
    marginHorizontal: 12,
  },
  surahName: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 2,
  },
  arabicPreview: {
    fontSize: 18,
    textAlign: 'right',
  },
  trashBtn: {
    padding: 6,
  },
});

