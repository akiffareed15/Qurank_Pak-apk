// app/surahs.tsx

import React, { useState, useMemo, useCallback } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown, ReduceMotion } from 'react-native-reanimated';
import { useTheme } from '../src/theme/ThemeProvider';
import { SearchBar } from '../src/components/SearchBar';
import { SurahRow } from '../src/components/SurahRow';
import { EmptyState } from '../src/components/EmptyState';
import { quranRepository } from '../src/data/quranRepository';
import type { Surah } from '../src/types/quran';

const SurahListItem = React.memo<{
  item: Surah;
  index: number;
  onPress: (num: number) => void;
}>(({ item, index, onPress }) => {
  const isInitialRows = index < 12;
  const handlePress = useCallback(() => onPress(item.number), [item.number, onPress]);
  const content = <SurahRow surah={item} onPress={handlePress} />;

  if (isInitialRows) {
    return (
      <Animated.View
        entering={FadeInDown.delay(index * 40)
          .duration(280)
          .reduceMotion(ReduceMotion.System)}
      >
        {content}
      </Animated.View>
    );
  }

  return content;
});

export default function SurahsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  const [query, setQuery] = useState('');
  const allSurahs = useMemo(() => quranRepository.getSurahs(), []);

  // Filter surahs by English name, transliteration, Arabic name, or number
  const filteredSurahs = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allSurahs;

    return allSurahs.filter((s) => {
      return (
        String(s.number) === q ||
        s.nameEnglish.toLowerCase().includes(q) ||
        s.nameTransliteration.toLowerCase().includes(q) ||
        s.nameArabic.includes(q)
      );
    });
  }, [allSurahs, query]);

  const handleSurahPress = useCallback(
    (surahNumber: number) => {
      router.push({
        pathname: '/reader/[surah]',
        params: { surah: String(surahNumber) },
      });
    },
    [router]
  );

  const renderItem = useCallback(
    ({ item, index }: { item: Surah; index: number }) => (
      <SurahListItem
        item={item}
        index={index}
        onPress={handleSurahPress}
      />
    ),
    [handleSurahPress]
  );

  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: 72,
      offset: 72 * index,
      index,
    }),
    []
  );

  const keyExtractor = useCallback((item: Surah) => String(item.number), []);

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
      <SearchBar
        value={query}
        onChangeText={setQuery}
        onBack={() => router.back()}
      />

      <FlatList
        data={filteredSurahs}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        getItemLayout={getItemLayout}
        removeClippedSubviews={true}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 20,
        }}
        ListEmptyComponent={
          <EmptyState
            iconName="search-outline"
            message={`No Surah found for "${query}"`}
          />
        }
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        initialNumToRender={14}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={40}
        windowSize={5}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
