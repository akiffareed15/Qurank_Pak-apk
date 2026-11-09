// src/components/AppSplashScreen.tsx
// Animated Starting / App Loading Page for Noor-ul-Quran

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withRepeat,
  withSequence,
  Easing,
  runOnJS,
  ReduceMotion,
} from 'react-native-reanimated';
import Svg, { Rect, Circle, G } from 'react-native-svg';
import { GeometricPattern } from './GeometricPattern';
import { typography } from '../theme/typography';

interface AppSplashScreenProps {
  onAnimationComplete: () => void;
  isReady: boolean;
}

export const AppSplashScreen: React.FC<AppSplashScreenProps> = ({
  onAnimationComplete,
  isReady,
}) => {
  // Shared animation values
  const logoScale = useSharedValue(0.7);
  const logoOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(20);
  const contentOpacity = useSharedValue(0);
  const pulseScale = useSharedValue(1);
  const containerOpacity = useSharedValue(1);
  const containerScale = useSharedValue(1);

  // Decorative background rosette rotation
  const rosetteRotation = useSharedValue(0);

  useEffect(() => {
    // 1. Entrance animation for logo
    logoScale.value = withSpring(1, {
      damping: 12,
      stiffness: 90,
      reduceMotion: ReduceMotion.System,
    });
    logoOpacity.value = withTiming(1, {
      duration: 650,
      reduceMotion: ReduceMotion.System,
    });

    // 2. Entrance for text & Bismillah
    contentTranslateY.value = withTiming(0, {
      duration: 700,
      easing: Easing.out(Easing.cubic),
      reduceMotion: ReduceMotion.System,
    });
    contentOpacity.value = withTiming(1, {
      duration: 750,
      reduceMotion: ReduceMotion.System,
    });

    // 3. Gentle rosette rotation
    rosetteRotation.value = withRepeat(
      withTiming(360, {
        duration: 24000,
        easing: Easing.linear,
        reduceMotion: ReduceMotion.System,
      }),
      -1,
      false
    );

    // 4. Subtle breathing pulse on the logo
    const pulseTimer = setTimeout(() => {
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1.05, {
            duration: 1800,
            easing: Easing.inOut(Easing.ease),
            reduceMotion: ReduceMotion.System,
          }),
          withTiming(1, {
            duration: 1800,
            easing: Easing.inOut(Easing.ease),
            reduceMotion: ReduceMotion.System,
          })
        ),
        -1,
        true
      );
    }, 450);

    return () => clearTimeout(pulseTimer);
  }, []);

  // When app is ready (fonts + stores), smoothly fade out after minimum smooth display time
  useEffect(() => {
    if (isReady) {
      const exitTimer = setTimeout(() => {
        containerOpacity.value = withTiming(0, {
          duration: 550,
          easing: Easing.inOut(Easing.ease),
          reduceMotion: ReduceMotion.System,
        });
        containerScale.value = withTiming(
          1.04,
          {
            duration: 550,
            easing: Easing.out(Easing.ease),
            reduceMotion: ReduceMotion.System,
          },
          (finished) => {
            if (finished) {
              runOnJS(onAnimationComplete)();
            }
          }
        );
      }, 2000); // 2 seconds display for a premium, calm first impression

      return () => clearTimeout(exitTimer);
    }
  }, [isReady]);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value * pulseScale.value }],
  }));

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: contentTranslateY.value }],
  }));

  const rosetteAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rosetteRotation.value}deg` }],
  }));

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
    transform: [{ scale: containerScale.value }],
  }));

  return (
    <Animated.View style={[styles.container, containerAnimatedStyle]}>
      {/* Background Islamic Geometric Pattern */}
      <GeometricPattern opacity={0.08} />

      {/* Rotating Background Sacred Rosette */}
      <View style={styles.rosetteContainer} pointerEvents="none">
        <Animated.View style={rosetteAnimatedStyle}>
          <Svg width={320} height={320} viewBox="0 0 320 320">
            <G stroke="rgba(255, 255, 255, 0.08)" strokeWidth="1.2" fill="none">
              <Circle cx="160" cy="160" r="145" strokeDasharray="5, 5" />
              <Circle cx="160" cy="160" r="130" strokeWidth="1" />
              <Rect x="60" y="60" width="200" height="200" rx="20" />
              <Rect x="60" y="60" width="200" height="200" rx="20" origin="160, 160" rotation={45} />
              <Rect x="80" y="80" width="160" height="160" rx="14" stroke="rgba(255, 255, 255, 0.05)" origin="160, 160" rotation={22.5} />
              <Rect x="80" y="80" width="160" height="160" rx="14" stroke="rgba(255, 255, 255, 0.05)" origin="160, 160" rotation={67.5} />
            </G>
          </Svg>
        </Animated.View>
      </View>

      {/* Center Content: Logo + Branding */}
      <View style={styles.centerContent}>
        {/* Animated App Logo with Soft White Shade & Halo */}
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

        {/* Animated Titles */}
        <Animated.View style={[styles.titlesContainer, contentAnimatedStyle]}>
          <Text style={styles.arabicTitle}>القرآن الكريم</Text>
          <Text style={styles.englishTitle}>NOOR-UL-QURAN</Text>
          <Text style={styles.bismillahText}>بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ</Text>
        </Animated.View>
      </View>

      {/* Bottom Subtle Shimmer Indicator */}
      <View style={styles.bottomContainer}>
        <View style={styles.loadingTrack}>
          <View style={styles.loadingDot} />
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#084F38', // Deep Emerald
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  rosetteContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    paddingHorizontal: 24,
  },
  logoWrapper: {
    marginBottom: 20,
  },
  logoHalo: {
    padding: 8,
    borderRadius: 82,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.55,
    shadowRadius: 24,
    elevation: 10,
  },
  logoContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderWidth: 2.5,
    borderColor: 'rgba(255, 255, 255, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  logoImage: {
    width: 118,
    height: 118,
  },
  titlesContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  arabicTitle: {
    fontSize: 42,
    lineHeight: 66,
    color: '#FFFFFF',
    fontFamily: typography.fontFamily.amiri,
    textAlign: 'center',
    paddingVertical: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.35)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  englishTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#E8F5EE',
    letterSpacing: 4.5,
    marginTop: 4,
    textAlign: 'center',
  },
  bismillahText: {
    fontSize: 19,
    lineHeight: 34,
    color: 'rgba(255, 255, 255, 0.85)',
    fontFamily: typography.fontFamily.amiri,
    marginTop: 10,
    paddingVertical: 2,
    textAlign: 'center',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingTrack: {
    width: 60,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  loadingDot: {
    width: 24,
    height: '100%',
    backgroundColor: '#3DB88A',
    borderRadius: 2,
  },
});

