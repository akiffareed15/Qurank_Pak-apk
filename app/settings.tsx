// app/settings.tsx

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../src/shared/theme/ThemeProvider';
import { typography } from '../src/shared/theme/typography';
import { useSettingsStore } from '../src/shared/store/settingsStore';
import type { ThemeMode } from '../src/shared/types';

const PREVIEW_BISMILLAH = 'بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ';
const PREVIEW_TRANSLATION =
  'In the name of Allah, the Entirely Merciful, the Especially Merciful.';

// Discrete Kindle/Safari style steps (7 steps each, with defaults in the middle)
const ARABIC_STEPS = [20, 24, 28, 32, 36, 40, 44];
const TRANSLATION_STEPS = [12, 14, 16, 18, 20, 22, 26];

function getClosestStepIndex(value: number, steps: number[]): number {
  let closestIdx = 0;
  let minDiff = Math.abs(steps[0] - value);
  for (let i = 1; i < steps.length; i++) {
    const diff = Math.abs(steps[i] - value);
    if (diff < minDiff) {
      minDiff = diff;
      closestIdx = i;
    }
  }
  return closestIdx;
}

interface StepControlProps {
  label: string;
  value: number;
  steps: number[];
  onChange: (value: number) => void;
  colors: ReturnType<typeof useTheme>['colors'];
}

function StepControl({ label, value, steps, onChange, colors }: StepControlProps) {
  const currentIndex = getClosestStepIndex(value, steps);
  const isMin = currentIndex === 0;
  const isMax = currentIndex === steps.length - 1;

  const handlePrev = () => {
    if (!isMin) {
      onChange(steps[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (!isMax) {
      onChange(steps[currentIndex + 1]);
    }
  };

  return (
    <View
      style={[
        styles.settingGroup,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <View style={styles.groupHeader}>
        <Text style={[styles.groupLabel, { color: colors.text }]}>{label}</Text>
        <Text style={[styles.valueLabel, { color: colors.primary }]}>
          {steps[currentIndex]} pt
        </Text>
      </View>

      <View style={styles.stepControlRow}>
        {/* A- Button */}
        <Pressable
          onPress={handlePrev}
          disabled={isMin}
          style={({ pressed }) => [
            styles.stepActionButton,
            {
              backgroundColor: colors.background,
              borderColor: colors.border,
              opacity: isMin ? 0.35 : pressed ? 0.7 : 1,
              transform: [{ scale: pressed && !isMin ? 0.94 : 1 }],
            },
          ]}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={`Decrease ${label}`}
        >
          <Text style={[styles.stepActionTextSmall, { color: colors.text }]}>A-</Text>
        </Pressable>

        {/* Step Track & Dots */}
        <View style={styles.dotsTrackContainer}>
          {/* Continuous Connecting Line */}
          <View
            style={[
              styles.dotsConnectingLine,
              { backgroundColor: colors.border },
            ]}
          />

          {/* Dots */}
          <View style={styles.dotsRow}>
            {steps.map((step, index) => {
              const isSelected = index === currentIndex;
              return (
                <Pressable
                  key={step}
                  onPress={() => onChange(step)}
                  hitSlop={10}
                  style={styles.dotTouchTarget}
                  accessibilityRole="button"
                  accessibilityLabel={`${label} ${step} pt`}
                >
                  {isSelected ? (
                    <View
                      style={[
                        styles.activeDotOuter,
                        {
                          backgroundColor: colors.primary,
                        },
                      ]}
                    >
                      <View
                        style={[
                          styles.activeDotInner,
                          { backgroundColor: colors.onPrimary },
                        ]}
                      />
                    </View>
                  ) : (
                    <View
                      style={[
                        styles.inactiveDot,
                        {
                          backgroundColor: colors.border,
                        },
                      ]}
                    />
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* A+ Button */}
        <Pressable
          onPress={handleNext}
          disabled={isMax}
          style={({ pressed }) => [
            styles.stepActionButton,
            {
              backgroundColor: colors.background,
              borderColor: colors.border,
              opacity: isMax ? 0.35 : pressed ? 0.7 : 1,
              transform: [{ scale: pressed && !isMax ? 0.94 : 1 }],
            },
          ]}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={`Increase ${label}`}
        >
          <Text style={[styles.stepActionTextLarge, { color: colors.text }]}>A+</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, themeMode, setThemeMode } = useTheme();

  const {
    arabicSize,
    translationSize,
    setArabicSize,
    setTranslationSize,
  } = useSettingsStore();

  const themeOptions: { mode: ThemeMode; icon: keyof typeof Ionicons.glyphMap; label: string }[] = [
    { mode: 'light', icon: 'sunny-outline', label: 'Light' },
    { mode: 'dark', icon: 'moon-outline', label: 'Dark' },
    { mode: 'system', icon: 'phone-portrait-outline', label: 'System' },
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
        {/* Live Preview Card with Fixed/Stable Dimensions to Eliminate Any Layout Jitter */}
        <View
          style={[
            styles.previewCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          {/* Dedicated Arabic Zone (Independent centering, zero impact on Translation) */}
          <View style={styles.previewArabicContainer}>
            <Text
              style={[
                styles.previewArabic,
                {
                  fontSize: arabicSize,
                  lineHeight: Math.round(arabicSize * 1.85),
                  color: colors.text,
                  fontFamily: typography.fontFamily.quran,
                },
              ]}
              numberOfLines={1}
            >
              {PREVIEW_BISMILLAH}
            </Text>
          </View>

          {/* Hairline Divider Anchoring Both Zones */}
          <View style={[styles.previewDivider, { backgroundColor: colors.border }]} />

          {/* Dedicated Translation Zone (Independent centering, zero impact on Arabic) */}
          <View style={styles.previewTranslationContainer}>
            <Text
              style={[
                styles.previewTranslation,
                {
                  fontSize: translationSize,
                  lineHeight: Math.round(translationSize * 1.45),
                  color: colors.textMuted,
                },
              ]}
            >
              {PREVIEW_TRANSLATION}
            </Text>
          </View>
        </View>

        {/* Section: Arabic Size (Discrete Kindle / Safari Steps) */}
        <StepControl
          label="Arabic Text Size"
          value={arabicSize}
          steps={ARABIC_STEPS}
          onChange={setArabicSize}
          colors={colors}
        />

        {/* Section: Translation Size (Discrete Kindle / Safari Steps) */}
        <StepControl
          label="Translation Size"
          value={translationSize}
          steps={TRANSLATION_STEPS}
          onChange={setTranslationSize}
          colors={colors}
        />

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
    paddingHorizontal: 16,
    paddingVertical: 12,
    height: 200,
    justifyContent: 'space-between',
    marginBottom: 18,
    overflow: 'hidden',
  },
  previewArabicContainer: {
    flex: 1.15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewArabic: {
    textAlign: 'center',
    writingDirection: 'rtl',
    includeFontPadding: false,
    paddingVertical: 2,
  },
  previewDivider: {
    height: StyleSheet.hairlineWidth,
    width: '80%',
    alignSelf: 'center',
    marginVertical: 4,
    opacity: 0.5,
  },
  previewTranslationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewTranslation: {
    textAlign: 'center',
    includeFontPadding: false,
    paddingVertical: 2,
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
    marginBottom: 14,
  },
  groupLabel: {
    fontSize: 15,
    fontWeight: '500',
  },
  valueLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  stepControlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  stepActionButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepActionTextSmall: {
    fontSize: 13,
    fontWeight: '700',
  },
  stepActionTextLarge: {
    fontSize: 17,
    fontWeight: '800',
  },
  dotsTrackContainer: {
    flex: 1,
    height: 42,
    justifyContent: 'center',
    marginHorizontal: 12,
    position: 'relative',
  },
  dotsConnectingLine: {
    position: 'absolute',
    left: 12,
    right: 12,
    height: 2,
    borderRadius: 1,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  dotTouchTarget: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeDotOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  activeDotInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  inactiveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
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
