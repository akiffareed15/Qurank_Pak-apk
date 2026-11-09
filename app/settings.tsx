// app/settings.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../src/theme/ThemeProvider';
import { typography } from '../src/theme/typography';
import { useSettingsStore } from '../src/store/settingsStore';
import type { ThemeMode, ReadingMode } from '../src/types/quran';

const PREVIEW_BISMILLAH = 'بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ';
const PREVIEW_TRANSLATION =
  'In the name of Allah, the Entirely Merciful, the Especially Merciful.';

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, themeMode, setThemeMode } = useTheme();

  const {
    arabicSize,
    translationSize,
    setArabicSize,
    setTranslationSize,
    readingMode,
    setReadingMode,
  } = useSettingsStore();

  // Local state for smooth 60fps dragging without layout shifts or disk lag
  const [localArabicSize, setLocalArabicSize] = useState(arabicSize);
  const [localTranslationSize, setLocalTranslationSize] = useState(translationSize);

  useEffect(() => {
    setLocalArabicSize(arabicSize);
  }, [arabicSize]);

  useEffect(() => {
    setLocalTranslationSize(translationSize);
  }, [translationSize]);

  const themeOptions: { mode: ThemeMode; icon: keyof typeof Ionicons.glyphMap; label: string }[] = [
    { mode: 'light', icon: 'sunny-outline', label: 'Light' },
    { mode: 'dark', icon: 'moon-outline', label: 'Dark' },
    { mode: 'system', icon: 'phone-portrait-outline', label: 'System' },
  ];

  const readingOptions: { mode: ReadingMode; icon: keyof typeof Ionicons.glyphMap; label: string }[] = [
    { mode: 'mushaf', icon: 'book-outline', label: 'Mushaf (604 Pages)' },
    { mode: 'list', icon: 'language-outline', label: 'Translation' },
  ];

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

        <Text style={[styles.headerTitle, { color: colors.text }]}>Settings</Text>

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
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 32 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Live Preview Card with Fixed/Stable Height to Prevent Layout Jitter */}
        <View
          style={[
            styles.previewCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <Text
            style={[
              styles.previewArabic,
              {
                fontSize: localArabicSize,
                lineHeight: Math.round(localArabicSize * 1.95),
                color: colors.text,
                fontFamily: typography.fontFamily.quran,
              },
            ]}
          >
            {PREVIEW_BISMILLAH}
          </Text>
          <Text
            style={[
              styles.previewTranslation,
              {
                fontSize: localTranslationSize,
                lineHeight: Math.round(localTranslationSize * 1.55),
                color: colors.textMuted,
              },
            ]}
          >
            {PREVIEW_TRANSLATION}
          </Text>
        </View>

        {/* Section: Reading Mode */}
        <View
          style={[
            styles.settingGroup,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.groupLabel, { color: colors.text, marginBottom: 12 }]}>
            Reading Mode
          </Text>
          <View style={styles.segmentContainer}>
            {readingOptions.map((opt) => {
              const isSelected = readingMode === opt.mode;
              return (
                <Pressable
                  key={opt.mode}
                  onPress={() => setReadingMode(opt.mode)}
                  style={[
                    styles.segmentOption,
                    {
                      backgroundColor: isSelected
                        ? colors.primary
                        : colors.background,
                      borderColor: isSelected ? colors.primary : colors.border,
                    },
                  ]}
                >
                  <Ionicons
                    name={opt.icon}
                    size={18}
                    color={isSelected ? colors.onPrimary : colors.textMuted}
                  />
                  <Text
                    style={[
                      styles.segmentLabel,
                      {
                        color: isSelected ? colors.onPrimary : colors.textMuted,
                      },
                    ]}
                  >
                    {opt.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Section: Arabic Size */}
        <View
          style={[
            styles.settingGroup,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <View style={styles.groupHeader}>
            <Text style={[styles.groupLabel, { color: colors.text }]}>
              Arabic Text Size
            </Text>
            <Text style={[styles.valueLabel, { color: colors.primary }]}>
              {Math.round(localArabicSize)}
            </Text>
          </View>
          <View style={styles.sliderRow}>
            <Pressable
              onPress={() => {
                const next = Math.max(typography.limits.arabicMin, Math.round(localArabicSize) - 1);
                setLocalArabicSize(next);
                setArabicSize(next);
              }}
              style={({ pressed }) => [
                styles.stepBtn,
                {
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                  opacity: pressed ? 0.65 : 1,
                },
              ]}
              hitSlop={8}
              accessibilityLabel="Decrease Arabic size"
            >
              <Ionicons name="remove" size={18} color={colors.text} />
            </Pressable>

            <Slider
              style={styles.slider}
              minimumValue={typography.limits.arabicMin}
              maximumValue={typography.limits.arabicMax}
              step={1}
              value={localArabicSize}
              onValueChange={(val) => setLocalArabicSize(Math.round(val))}
              onSlidingComplete={(val) => {
                const rounded = Math.round(val);
                setLocalArabicSize(rounded);
                setArabicSize(rounded);
              }}
              minimumTrackTintColor={colors.primary}
              maximumTrackTintColor={colors.border}
              thumbTintColor={colors.primary}
            />

            <Pressable
              onPress={() => {
                const next = Math.min(typography.limits.arabicMax, Math.round(localArabicSize) + 1);
                setLocalArabicSize(next);
                setArabicSize(next);
              }}
              style={({ pressed }) => [
                styles.stepBtn,
                {
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                  opacity: pressed ? 0.65 : 1,
                },
              ]}
              hitSlop={8}
              accessibilityLabel="Increase Arabic size"
            >
              <Ionicons name="add" size={18} color={colors.text} />
            </Pressable>
          </View>
        </View>

        {/* Section: Translation Size */}
        <View
          style={[
            styles.settingGroup,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <View style={styles.groupHeader}>
            <Text style={[styles.groupLabel, { color: colors.text }]}>
              Translation Size
            </Text>
            <Text style={[styles.valueLabel, { color: colors.primary }]}>
              {Math.round(localTranslationSize)}
            </Text>
          </View>
          <View style={styles.sliderRow}>
            <Pressable
              onPress={() => {
                const next = Math.max(typography.limits.translationMin, Math.round(localTranslationSize) - 1);
                setLocalTranslationSize(next);
                setTranslationSize(next);
              }}
              style={({ pressed }) => [
                styles.stepBtn,
                {
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                  opacity: pressed ? 0.65 : 1,
                },
              ]}
              hitSlop={8}
              accessibilityLabel="Decrease Translation size"
            >
              <Ionicons name="remove" size={18} color={colors.text} />
            </Pressable>

            <Slider
              style={styles.slider}
              minimumValue={typography.limits.translationMin}
              maximumValue={typography.limits.translationMax}
              step={1}
              value={localTranslationSize}
              onValueChange={(val) => setLocalTranslationSize(Math.round(val))}
              onSlidingComplete={(val) => {
                const rounded = Math.round(val);
                setLocalTranslationSize(rounded);
                setTranslationSize(rounded);
              }}
              minimumTrackTintColor={colors.primary}
              maximumTrackTintColor={colors.border}
              thumbTintColor={colors.primary}
            />

            <Pressable
              onPress={() => {
                const next = Math.min(typography.limits.translationMax, Math.round(localTranslationSize) + 1);
                setLocalTranslationSize(next);
                setTranslationSize(next);
              }}
              style={({ pressed }) => [
                styles.stepBtn,
                {
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                  opacity: pressed ? 0.65 : 1,
                },
              ]}
              hitSlop={8}
              accessibilityLabel="Increase Translation size"
            >
              <Ionicons name="add" size={18} color={colors.text} />
            </Pressable>
          </View>
        </View>

        {/* Section: Theme */}
        <View
          style={[
            styles.settingGroup,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.groupLabel, { color: colors.text, marginBottom: 12 }]}>
            Theme
          </Text>
          <View style={styles.segmentContainer}>
            {themeOptions.map((opt) => {
              const isSelected = themeMode === opt.mode;
              return (
                <Pressable
                  key={opt.mode}
                  onPress={() => setThemeMode(opt.mode)}
                  style={[
                    styles.segmentOption,
                    {
                      backgroundColor: isSelected
                        ? colors.primary
                        : colors.background,
                      borderColor: isSelected ? colors.primary : colors.border,
                    },
                  ]}
                >
                  <Ionicons
                    name={opt.icon}
                    size={20}
                    color={isSelected ? colors.onPrimary : colors.textMuted}
                  />
                  <Text
                    style={[
                      styles.segmentLabel,
                      {
                        color: isSelected ? colors.onPrimary : colors.textMuted,
                      },
                    ]}
                  >
                    {opt.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* App Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textMuted }]}>
            Noor-ul-Quran • Offline Quran Reader
          </Text>
        </View>
      </ScrollView>
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
  backButton: {
    padding: 6,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  content: {
    padding: 18,
  },
  previewCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
    minHeight: 180,
    justifyContent: 'center',
    marginBottom: 18,
  },
  previewArabic: {
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  previewTranslation: {
    textAlign: 'center',
    marginTop: 10,
  },
  settingGroup: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  groupLabel: {
    fontSize: 15,
    fontWeight: '500',
  },
  valueLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    gap: 10,
  },
  stepBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slider: {
    flex: 1,
    height: 40,
  },
  segmentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  segmentOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    marginHorizontal: 4,
  },
  segmentLabel: {
    fontSize: 13,
    fontWeight: '500',
    marginLeft: 6,
  },
  footer: {
    alignItems: 'center',
    marginTop: 18,
    paddingVertical: 8,
  },
  footerText: {
    fontSize: 12,
    letterSpacing: 0.3,
  },
});
