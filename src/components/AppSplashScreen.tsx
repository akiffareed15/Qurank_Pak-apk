// src/components/AppSplashScreen.tsx
// Premium, Peaceful Light-Theme Startup Loading Animation for Noor-ul-Quran

import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withDelay,
  Easing,
  runOnJS,
  ReduceMotion,
} from 'react-native-reanimated';
import { typography } from '../theme/typography';

// Dimensions of the original portrait artwork (704 x 1520)
const ORIGINAL_IMAGE_WIDTH = 704;
const ORIGINAL_IMAGE_HEIGHT = 1520;
const IMAGE_ASPECT_RATIO = ORIGINAL_IMAGE_WIDTH / ORIGINAL_IMAGE_HEIGHT;

const TRACK_WIDTH = 140;
const BAR_WIDTH = 48;

interface AppSplashScreenProps {
  onAnimationComplete: () => void;
  isReady: boolean;
}

export const AppSplashScreen: React.FC<AppSplashScreenProps> = ({
  onAnimationComplete,
  isReady,
}) => {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  // Strict aspect-ratio containment (preserves full arch, lanterns, and bottom mosque)
  let bgWidth = windowWidth;
  let bgHeight = windowHeight;

  const windowAspectRatio = windowWidth / windowHeight;
  if (windowAspectRatio < IMAGE_ASPECT_RATIO) {
    bgWidth = windowWidth;
    bgHeight = windowWidth / IMAGE_ASPECT_RATIO;
  } else {
    bgHeight = windowHeight;
    bgWidth = windowHeight * IMAGE_ASPECT_RATIO;
  }

  // Animation values
  const bgOpacity = useSharedValue(0);
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.92);
  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(12);
  const progressTranslateX = useSharedValue(-BAR_WIDTH);
  const containerOpacity = useSharedValue(1);

  useEffect(() => {
    // Phase 1: Background appearance (smooth, gentle fade-in)
    bgOpacity.value = withTiming(1, {
      duration: 450,
      easing: Easing.out(Easing.ease),
      reduceMotion: ReduceMotion.System,
    });

    // Phase 2: Original logo appearance (gentle opacity & subtle scale)
    logoOpacity.value = withDelay(
      150,
      withTiming(1, {
        duration: 600,
        easing: Easing.out(Easing.cubic),
        reduceMotion: ReduceMotion.System,
      })
    );
    logoScale.value = withDelay(
      150,
      withTiming(1, {
        duration: 600,
        easing: Easing.out(Easing.cubic),
        reduceMotion: ReduceMotion.System,
      })
    );

    // Phase 3: Application branding (Arabic title, English title, Bismillah)
    contentOpacity.value = withDelay(
      300,
      withTiming(1, {
        duration: 650,
        easing: Easing.out(Easing.cubic),
        reduceMotion: ReduceMotion.System,
      })
    );
    contentTranslateY.value = withDelay(
      300,
      withTiming(0, {
        duration: 650,
        easing: Easing.out(Easing.cubic),
        reduceMotion: ReduceMotion.System,
      })
    );

    // Phase 4: Antique-gold indeterminate loading indicator
    progressTranslateX.value = withRepeat(
      withTiming(TRACK_WIDTH, {
        duration: 1300,
        easing: Easing.inOut(Easing.sin),
        reduceMotion: ReduceMotion.System,
      }),
      -1,
      false
    );
  }, []);

  // Phase 5: Smooth exit transition when initialization completes
  useEffect(() => {
    if (isReady) {
      // Ensure a minimum peaceful display time (~850ms) for visual harmony
      const timer = setTimeout(() => {
        containerOpacity.value = withTiming(
          0,
          {
            duration: 450,
            easing: Easing.out(Easing.ease),
            reduceMotion: ReduceMotion.System,
          },
          (finished) => {
            if (finished) {
              runOnJS(onAnimationComplete)();
            }
          }
        );
      }, 850);

      return () => clearTimeout(timer);
    }
  }, [isReady]);

  const bgAnimatedStyle = useAnimatedStyle(() => ({
    opacity: bgOpacity.value,
  }));

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: contentTranslateY.value }],
  }));

  const progressBarAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: progressTranslateX.value }],
  }));

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
  }));

  return (
    <Animated.View style={[styles.container, containerAnimatedStyle]}>
      {/* Background Container holding the original portrait artwork */}
      <Animated.View style={[styles.bgContainer, bgAnimatedStyle]} pointerEvents="none">
        <Image
          source={require('../../assets/loading.png')}
          style={{
            width: bgWidth,
            height: bgHeight,
          }}
          resizeMode="contain"
        />
      </Animated.View>

      {/* Central Content: Logo + Branding + Loading Indicator */}
      <View style={styles.centerContent} pointerEvents="none">
        {/* Original Noor-ul-Quran Logo */}
        <Animated.View style={[styles.logoWrapper, logoAnimatedStyle]}>
          <View style={styles.logoHalo}>
            <View style={styles.logoContainer}>
              <Image
                source={require('../../assets/logo/logo_app.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
          </View>
        </Animated.View>

        {/* Application Branding */}
        <Animated.View style={[styles.titlesContainer, contentAnimatedStyle]}>
          <Text style={styles.arabicTitle}>القرآن الكريم</Text>
          <Text style={styles.englishTitle}>NOOR-UL-QURAN</Text>
          <Text style={styles.bismillahText}>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</Text>

          {/* Antique-Gold Loading Indicator */}
          <View style={styles.loadingTrack}>
            <Animated.View style={[styles.loadingBar, progressBarAnimatedStyle]} />
          </View>
        </Animated.View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#F6F3EC', // Warm Ivory & Cream
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  bgContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    paddingHorizontal: 24,
  },
  logoWrapper: {
    marginBottom: 16,
  },
  logoHalo: {
    padding: 6,
    borderRadius: 56,
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    shadowColor: '#053E27',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
  logoContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderWidth: 1.5,
    borderColor: 'rgba(13, 102, 70, 0.28)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  logoImage: {
    width: 76,
    height: 76,
  },
  titlesContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  arabicTitle: {
    fontSize: 38,
    lineHeight: 58,
    color: '#053E27',
    fontFamily: typography.fontFamily.amiri,
    textAlign: 'center',
    paddingVertical: 2,
    textShadowColor: 'rgba(255, 255, 255, 0.92)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
  englishTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#0D6646',
    letterSpacing: 4.5,
    marginTop: 2,
    textAlign: 'center',
  },
  bismillahText: {
    fontSize: 18,
    lineHeight: 32,
    color: '#2D5E4E',
    fontFamily: typography.fontFamily.amiri,
    marginTop: 8,
    paddingVertical: 2,
    textAlign: 'center',
  },
  loadingTrack: {
    width: TRACK_WIDTH,
    height: 3.5,
    backgroundColor: 'rgba(212, 175, 55, 0.22)', // Antique Gold Track
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: 24,
  },
  loadingBar: {
    width: BAR_WIDTH,
    height: '100%',
    backgroundColor: '#C5A059', // Rich Antique Gold
    borderRadius: 2,
  },
});
