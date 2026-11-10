// app/index.tsx
// Professionally Redesigned Home Screen with Islamic Backgrounds & Glassmorphism

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  ScrollView,
  useWindowDimensions,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  FadeInDown,
  FadeIn,
  ReduceMotion,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../src/shared/theme/ThemeProvider';
import { useLastReadStore } from '../src/store/lastReadStore';
import { useBookmarksStore } from '../src/store/bookmarksStore';
import { ContinueCard } from '../src/components/ContinueCard';
import { HomeTile } from '../src/components/HomeTile';
import { ThemeToggleButton } from '../src/shared/components/ThemeToggleButton';
import { typography } from '../src/shared/theme/typography';

// Official App Name
export const APP_NAME = 'NOOR-UL-QURAN';

// Original image dimensions (704 x 1520) for strict aspect-ratio containment
const ORIGINAL_IMAGE_WIDTH = 704;
const ORIGINAL_IMAGE_HEIGHT = 1520;
const IMAGE_ASPECT_RATIO = ORIGINAL_IMAGE_WIDTH / ORIGINAL_IMAGE_HEIGHT;

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const screenDimensions = Dimensions.get('screen');
  const windowDimensions = Dimensions.get('window');
  const screenWidth = Math.max(screenDimensions.width, windowDimensions.width);
  const screenHeight = Math.max(screenDimensions.height, windowDimensions.height);

  const lastSurah = useLastReadStore((s) => s.surah);
  const lastAyah = useLastReadStore((s) => s.ayah);
  const bookmarksCount = useBookmarksStore((s) => s.bookmarks.length);

  // Background image based on active theme
  const bgImage = isDark
    ? require('../assets/Home/dark.jpeg')
    : require('../assets/Home/light.jpeg');

  // Dynamic Theme Palette
  const textColor = isDark ? '#FFFFFF' : '#042317';
  const appNameColor = isDark ? '#E2ECE7' : '#053E27';

  // Glass Button Styling (Exact match for Theme Toggle & Settings)
  const buttonBg = isDark ? 'rgba(10, 36, 26, 0.78)' : 'rgba(255, 255, 255, 0.94)';
  const buttonBorder = isDark ? 'rgba(218, 165, 32, 0.45)' : 'rgba(13, 102, 70, 0.32)';
  const buttonIcon = isDark ? '#E5C158' : '#07482D';

  const heroCardBg = isDark ? 'rgba(7, 26, 18, 0.68)' : 'rgba(255, 255, 255, 0.88)';
  const heroCardBorder = isDark ? 'rgba(218, 165, 32, 0.38)' : 'rgba(13, 102, 70, 0.28)';
  const heroCardShadow = isDark ? '#000000' : '#042317';

  const pillBg = isDark ? 'rgba(10, 36, 26, 0.85)' : 'rgba(255, 255, 255, 0.94)';
  const pillBorder = isDark ? 'rgba(218, 165, 32, 0.42)' : 'rgba(13, 102, 70, 0.32)';
  const pillText = isDark ? '#E2ECE7' : '#04281A';
  const pillDotColor = isDark ? '#E5C158' : '#0D6646';

  const handleContinuePress = () => {
    if (lastSurah && lastAyah) {
      router.push({
        pathname: '/reader/[surah]',
        params: { surah: String(lastSurah), ayah: String(lastAyah) },
      });
    } else {
      router.push({
        pathname: '/reader/[surah]',
        params: { surah: '1' },
      });
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#061610' : '#F6F3EC' }]}>
      {/* Full-Bleed Edge-to-Edge Islamic Background Artwork (Zero Gaps, Zero Letterboxing) */}
      <View
        style={[
          styles.bgContainer,
          { backgroundColor: isDark ? '#061610' : '#F6F3EC' },
        ]}
        pointerEvents="none"
      >
        <Image
          key={isDark ? 'dark-bg' : 'light-bg'}
          source={bgImage}
          style={{ width: screenWidth, height: screenHeight }}
          resizeMode="cover"
        />
      </View>

      {/* Responsive Content Scroll View */}
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: Math.max(insets.top, 16) + 4,
            paddingBottom: Math.max(insets.bottom, 16) + 20,
          },
        ]}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Top Header Bar: Theme Toggle & Settings (Matching Companion Buttons) */}
        <Animated.View
          entering={FadeIn.duration(400).reduceMotion(ReduceMotion.System)}
          style={styles.topBar}
        >
          {/* Quick Theme Toggle Button */}
          <ThemeToggleButton variant="glass" size={20} />

          {/* Settings Icon Button with Identical Luxury Glass Design */}
          <Pressable
            onPress={() => router.push('/settings')}
            style={({ pressed }) => [
              styles.settingsButton,
              {
                backgroundColor: buttonBg,
                borderColor: buttonBorder,
                opacity: pressed ? 0.75 : 1,
                transform: [{ scale: pressed ? 0.94 : 1 }],
              },
            ]}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="Settings"
          >
            <Ionicons name="settings-outline" size={20} color={buttonIcon} />
          </Pressable>
        </Animated.View>

        {/* Main Content Body */}
        <View style={styles.mainBody}>
          {/* Central Branding Section (Framed within Luxury Translucent Glass Card) */}
          <Animated.View
            entering={FadeInDown.duration(600).springify().damping(18).reduceMotion(ReduceMotion.System)}
            style={[
              styles.heroBranding,
              {
                backgroundColor: heroCardBg,
                borderColor: heroCardBorder,
                shadowColor: heroCardShadow,
              },
            ]}
          >
            {/* App Logo with Radiant Ambient Halo Backdrop */}
            <View
              style={[
                styles.heroLogoGlow,
                {
                  backgroundColor: isDark
                    ? 'rgba(61, 184, 138, 0.16)'
                    : 'rgba(13, 102, 70, 0.12)',
                  shadowColor: isDark ? '#3DB88A' : '#0D6646',
                },
              ]}
            >
              <View
                style={[
                  styles.heroLogoContainer,
                  {
                    borderColor: isDark
                      ? 'rgba(218, 165, 32, 0.45)'
                      : 'rgba(13, 102, 70, 0.28)',
                    backgroundColor: isDark
                      ? 'rgba(9, 32, 23, 0.95)'
                      : 'rgba(255, 255, 255, 0.98)',
                  },
                ]}
              >
                <Image
                  source={require('../assets/logo/logo_app.png')}
                  style={styles.heroLogo}
                  resizeMode="contain"
                />
              </View>
            </View>

            {/* Arabic Title with High-Visibility Halo Shadow */}
            <Text
              style={[
                styles.heroTitle,
                {
                  color: textColor,
                  fontFamily: typography.fontFamily.amiri,
                  textShadowColor: isDark ? 'rgba(0, 0, 0, 0.75)' : 'rgba(255, 255, 255, 0.98)',
                  textShadowOffset: isDark ? { width: 0, height: 2 } : { width: 0, height: 1 },
                  textShadowRadius: isDark ? 8 : 10,
                },
              ]}
            >
              القرآن الكريم
            </Text>

            {/* English Subtitle with Subtle Text Shadow */}
            <Text
              style={[
                styles.appName,
                {
                  color: appNameColor,
                  textShadowColor: isDark ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.92)',
                  textShadowOffset: isDark ? { width: 0, height: 1 } : { width: 0, height: 1 },
                  textShadowRadius: isDark ? 4 : 6,
                },
              ]}
            >
              {APP_NAME}
            </Text>

            {/* Unified Quran Stats Pill (Zero Wrapping, Perfect Centering) */}
            <View
              style={[
                styles.statsPill,
                {
                  backgroundColor: pillBg,
                  borderColor: pillBorder,
                },
              ]}
            >
              <Text style={[styles.statsItem, { color: pillText }]}>114 Surahs</Text>
              <Text style={[styles.statsSeparator, { color: pillDotColor }]}>•</Text>
              <Text style={[styles.statsItem, { color: pillText }]}>604 Pages</Text>
              <Text style={[styles.statsSeparator, { color: pillDotColor }]}>•</Text>
              <Text style={[styles.statsItem, { color: pillText }]}>30 Juz</Text>
            </View>
          </Animated.View>

          {/* Action Cards Container */}
          <View style={styles.cardsContainer}>
            {/* Continue Reading Card with Progress Bar */}
            <Animated.View
              entering={FadeInDown.delay(180)
                .duration(500)
                .springify()
                .damping(16)
                .reduceMotion(ReduceMotion.System)}
              style={styles.cardItem}
            >
              <ContinueCard
                surahNumber={lastSurah}
                ayahNumber={lastAyah}
                onPress={handleContinuePress}
              />
            </Animated.View>

            {/* Navigation Tiles: Surahs & Bookmarks (Equal Width, Symmetrical) */}
            <View style={styles.tilesRow}>
              {/* Surahs Tile */}
              <Animated.View
                style={styles.tileWrapper}
                entering={FadeInDown.delay(280)
                  .duration(500)
                  .springify()
                  .damping(16)
                  .reduceMotion(ReduceMotion.System)}
              >
                <HomeTile
                  title="Surahs"
                  subtitle="114 Chapters"
                  iconName="book-outline"
                  onPress={() => router.push('/surahs')}
                />
              </Animated.View>

              {/* Bookmarks Tile */}
              <Animated.View
                style={styles.tileWrapper}
                entering={FadeInDown.delay(360)
                  .duration(500)
                  .springify()
                  .damping(16)
                  .reduceMotion(ReduceMotion.System)}
              >
                <HomeTile
                  title="Bookmarks"
                  subtitle={bookmarksCount > 0 ? `${bookmarksCount} Saved` : 'Saved Verses'}
                  iconName="bookmark-outline"
                  badge={bookmarksCount > 0 ? `${bookmarksCount}` : undefined}
                  onPress={() => router.push('/bookmarks')}
                />
              </Animated.View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A1612',
  },
  bgContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 18,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  mainBody: {
    flex: 1,
    justifyContent: 'space-evenly',
    paddingBottom: 12,
  },
  settingsButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  heroBranding: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderRadius: 26,
    borderWidth: 1.2,
    marginVertical: 4,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 10,
    elevation: 4,
  },
  heroLogoGlow: {
    padding: 5,
    borderRadius: 48,
    marginBottom: 6,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.45,
    shadowRadius: 14,
    elevation: 5,
  },
  heroLogoContainer: {
    width: 74,
    height: 74,
    borderRadius: 37,
    borderWidth: 1.5,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  heroLogo: {
    width: 58,
    height: 58,
  },
  heroTitle: {
    fontSize: 38,
    lineHeight: 58,
    textAlign: 'center',
    paddingVertical: 2,
    fontWeight: '700',
  },
  appName: {
    fontSize: 12.5,
    letterSpacing: 3.5,
    marginTop: 4,
    fontWeight: '800',
  },
  statsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    marginTop: 13,
    borderWidth: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  statsItem: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  statsSeparator: {
    marginHorizontal: 8,
    fontSize: 11,
    fontWeight: '800',
  },
  cardsContainer: {
    width: '100%',
    marginTop: 8,
    marginBottom: 12,
  },
  cardItem: {
    marginBottom: 12,
  },
  tilesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  tileWrapper: {
    flex: 1,
    marginHorizontal: 4,
  },
});
