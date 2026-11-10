// src/components/AppSplashScreen.tsx
// Premium, Peaceful Light-Theme Startup Loading Animation for Noor-ul-Quran
// Full-Bleed Edge-to-Edge Islamic architectural artwork with enhanced typography

import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
  runOnJS,
  ReduceMotion,
} from 'react-native-reanimated';
import Svg, {
  G,
  Path,
  Circle,
  Defs,
  LinearGradient,
  Stop,
  Rect,
} from 'react-native-svg';
import { typography } from '../theme/typography';

const PROGRESS_TRACK_WIDTH = 236;

interface AppSplashScreenProps {
  onAnimationComplete: () => void;
  isReady: boolean;
}

/**
 * Islamic Shamsa Rosette Medallion
 * 16-lobed gold filigree mandala with concentric beaded rings
 * and pristine white circular badge frame.
 */
const RosetteMedallion: React.FC<{ size: number }> = ({ size }) => {
  const cx = 100;
  const cy = 100;
  const numPoints = 16;

  // Generate 16 ornate petal bursts with fleur-de-lis finials
  const petals = [];
  for (let i = 0; i < numPoints; i++) {
    const angle = (i * 2 * Math.PI) / numPoints;
    const isMajor = i % 2 === 0;
    const rOuter = isMajor ? 97 : 91;
    const rInner = 72;
    const spread = (Math.PI / numPoints) * 0.74;

    const xTip = cx + rOuter * Math.cos(angle);
    const yTip = cy + rOuter * Math.sin(angle);
    const xLeft = cx + rInner * Math.cos(angle - spread);
    const yLeft = cy + rInner * Math.sin(angle - spread);
    const xRight = cx + rInner * Math.cos(angle + spread);
    const yRight = cy + rInner * Math.sin(angle + spread);

    const c1x = cx + rOuter * 0.88 * Math.cos(angle - spread * 0.4);
    const c1y = cy + rOuter * 0.88 * Math.sin(angle - spread * 0.4);
    const c2x = cx + rOuter * 0.88 * Math.cos(angle + spread * 0.4);
    const c2y = cy + rOuter * 0.88 * Math.sin(angle + spread * 0.4);

    petals.push(
      <Path
        key={`petal-${i}`}
        d={`M ${xLeft.toFixed(1)} ${yLeft.toFixed(1)} Q ${c1x.toFixed(1)} ${c1y.toFixed(1)} ${xTip.toFixed(1)} ${yTip.toFixed(1)} Q ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${xRight.toFixed(1)} ${yRight.toFixed(1)} Z`}
        fill="url(#goldGrad)"
        stroke="#8A5A00"
        strokeWidth={0.6}
      />
    );

    // Mini decorative gold bead at each tip
    petals.push(
      <Circle
        key={`bead-${i}`}
        cx={cx + (rOuter + 2.5) * Math.cos(angle)}
        cy={cy + (rOuter + 2.5) * Math.sin(angle)}
        r={isMajor ? 1.8 : 1.2}
        fill="url(#goldGrad)"
      />
    );
  }

  // 32 inner delicate golden beads
  const beads = [];
  for (let j = 0; j < 32; j++) {
    const bAngle = (j * 2 * Math.PI) / 32;
    beads.push(
      <Circle
        key={`inner-bead-${j}`}
        cx={cx + 66.5 * Math.cos(bAngle)}
        cy={cy + 66.5 * Math.sin(bAngle)}
        r={1.3}
        fill="url(#goldGrad)"
      />
    );
  }

  return (
    <Svg width={size} height={size} viewBox="0 0 200 200">
      <Defs>
        <LinearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#FDE68A" />
          <Stop offset="25%" stopColor="#D4AF37" />
          <Stop offset="55%" stopColor="#B38018" />
          <Stop offset="80%" stopColor="#E5B842" />
          <Stop offset="100%" stopColor="#8A5A00" />
        </LinearGradient>
        <LinearGradient id="goldRing" x1="0%" y1="50%" x2="100%" y2="50%">
          <Stop offset="0%" stopColor="#C5A059" />
          <Stop offset="50%" stopColor="#FDF2B8" />
          <Stop offset="100%" stopColor="#C5A059" />
        </LinearGradient>
      </Defs>

      {/* Decorative Radiating Petals */}
      <G>{petals}</G>

      {/* Outer Golden Border Ring */}
      <Circle
        cx={cx}
        cy={cy}
        r={72}
        fill="none"
        stroke="url(#goldGrad)"
        strokeWidth={2}
      />

      {/* Inner Beads Ring */}
      <G>{beads}</G>

      {/* Middle Golden Border Ring */}
      <Circle
        cx={cx}
        cy={cy}
        r={62}
        fill="none"
        stroke="url(#goldRing)"
        strokeWidth={1.5}
      />

      {/* Pristine White Circular Badge */}
      <Circle
        cx={cx}
        cy={cy}
        r={57}
        fill="#FFFFFF"
        stroke="url(#goldGrad)"
        strokeWidth={2.4}
      />
    </Svg>
  );
};

/**
 * 8-Pointed Islamic Star (Rub el Hizb) Divider
 */
const GoldDivider: React.FC = () => (
  <View style={styles.dividerRow}>
    <View style={styles.dividerLine} />
    <Svg width={18} height={18} viewBox="0 0 24 24" style={styles.dividerStar}>
      <Defs>
        <LinearGradient id="starGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#FDE68A" />
          <Stop offset="50%" stopColor="#D4AF37" />
          <Stop offset="100%" stopColor="#9C6B10" />
        </LinearGradient>
      </Defs>
      {/* Overlapping Squares forming the 8-pointed star */}
      <Rect
        x="6"
        y="6"
        width="12"
        height="12"
        fill="url(#starGold)"
        rx={1}
      />
      <Rect
        x="6"
        y="6"
        width="12"
        height="12"
        fill="url(#starGold)"
        rx={1}
        transform="rotate(45 12 12)"
      />
      <Circle cx="12" cy="12" r="2.2" fill="#FDFCF9" />
    </Svg>
    <View style={styles.dividerLine} />
  </View>
);

export const AppSplashScreen: React.FC<AppSplashScreenProps> = ({
  onAnimationComplete,
  isReady,
}) => {
  // Use physical screen dimensions (including navigation bar) for 100% full bleed
  const screenDimensions = Dimensions.get('screen');
  const windowDimensions = Dimensions.get('window');
  const screenWidth = Math.max(screenDimensions.width, windowDimensions.width);
  const screenHeight = Math.max(screenDimensions.height, windowDimensions.height);

  // Animation values
  const bgOpacity = useSharedValue(0);
  const medallionOpacity = useSharedValue(0);
  const medallionScale = useSharedValue(0.92);
  const titlesOpacity = useSharedValue(0);
  const titlesTranslateY = useSharedValue(8);
  const progressPercent = useSharedValue(0);
  const loadingTextOpacity = useSharedValue(0);
  const containerOpacity = useSharedValue(1);

  useEffect(() => {
    // Phase 1: Background image fade-in
    bgOpacity.value = withTiming(1, {
      duration: 350,
      easing: Easing.out(Easing.ease),
      reduceMotion: ReduceMotion.System,
    });

    // Phase 2: Islamic Medallion + Logo appearance
    medallionOpacity.value = withDelay(
      80,
      withTiming(1, {
        duration: 500,
        easing: Easing.out(Easing.cubic),
        reduceMotion: ReduceMotion.System,
      })
    );
    medallionScale.value = withDelay(
      80,
      withTiming(1, {
        duration: 500,
        easing: Easing.out(Easing.cubic),
        reduceMotion: ReduceMotion.System,
      })
    );

    // Phase 3: Typography & branding
    titlesOpacity.value = withDelay(
      180,
      withTiming(1, {
        duration: 550,
        easing: Easing.out(Easing.cubic),
        reduceMotion: ReduceMotion.System,
      })
    );
    titlesTranslateY.value = withDelay(
      180,
      withTiming(0, {
        duration: 550,
        easing: Easing.out(Easing.cubic),
        reduceMotion: ReduceMotion.System,
      })
    );

    // Phase 4: Smooth progress fill from 0 to 100% over 1500ms
    progressPercent.value = withDelay(
      150,
      withTiming(1, {
        duration: 1500,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        reduceMotion: ReduceMotion.System,
      })
    );

    loadingTextOpacity.value = withDelay(
      220,
      withTiming(1, {
        duration: 450,
        easing: Easing.out(Easing.ease),
        reduceMotion: ReduceMotion.System,
      })
    );
  }, []);

  // Phase 5: Handoff completion when isReady becomes true
  useEffect(() => {
    if (isReady) {
      // Ensure the user gets to see the complete peaceful loading animation (~1850ms)
      const timer = setTimeout(() => {
        containerOpacity.value = withTiming(
          0,
          {
            duration: 400,
            easing: Easing.out(Easing.ease),
            reduceMotion: ReduceMotion.System,
          },
          (fadeFinished) => {
            if (fadeFinished) {
              runOnJS(onAnimationComplete)();
            }
          }
        );
      }, 1850);

      return () => clearTimeout(timer);
    }
  }, [isReady]);

  const bgAnimatedStyle = useAnimatedStyle(() => ({
    opacity: bgOpacity.value,
  }));

  const medallionAnimatedStyle = useAnimatedStyle(() => ({
    opacity: medallionOpacity.value,
    transform: [{ scale: medallionScale.value }],
  }));

  const titlesAnimatedStyle = useAnimatedStyle(() => ({
    opacity: titlesOpacity.value,
    transform: [{ translateY: titlesTranslateY.value }],
  }));

  const progressFillAnimatedStyle = useAnimatedStyle(() => ({
    width: progressPercent.value * PROGRESS_TRACK_WIDTH,
  }));

  const loadingAnimatedStyle = useAnimatedStyle(() => ({
    opacity: loadingTextOpacity.value,
  }));

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
  }));

  // Full-bleed proportional placement:
  // Medallion top: ~23% of total screen height (centered between hanging lanterns)
  // Loading section bottom: lifted to ~12% (clearly above the dark green arch)
  const brandSectionTop = Math.max(screenHeight * 0.23, 172);
  const loadingSectionBottom = Math.max(screenHeight * 0.12, 94);

  return (
    <Animated.View style={[styles.container, containerAnimatedStyle]}>
      {/* Full-Bleed Edge-to-Edge Background Artwork covering 100% of physical glass panel */}
      <Animated.View
        style={[
          styles.bgContainer,
          bgAnimatedStyle,
          { width: screenWidth, height: screenHeight },
        ]}
        pointerEvents="none"
      >
        <Image
          source={require('../../../assets/loading.png')}
          style={{ width: screenWidth, height: screenHeight }}
          resizeMode="cover"
        />
      </Animated.View>

      {/* Upper-Middle Brand Section (Enlarged Medallion + Enhanced Typography) */}
      <View
        style={[styles.brandSection, { top: brandSectionTop }]}
        pointerEvents="none"
      >
        {/* Prominent Golden Islamic Rosette Medallion with Enlarged Ultra-HD Logo */}
        <Animated.View style={[styles.medallionWrapper, medallionAnimatedStyle]}>
          <RosetteMedallion size={216} />
          <View style={styles.logoBadgeContainer}>
            <Image
              source={require('../../../assets/logo/logo_app2.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
        </Animated.View>

        {/* Application Branding without redundant Arabic title */}
        <Animated.View style={[styles.titlesContainer, titlesAnimatedStyle]}>
          {/* Upper Gold Ornament Divider */}
          <GoldDivider />

          {/* App English Title */}
          <Text style={styles.englishTitle}>NOOR-UL-QURAN</Text>

          {/* Lower Gold Ornament Divider */}
          <GoldDivider />

          {/* Bismillah Calligraphy */}
          <Text style={styles.bismillahText}>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</Text>
        </Animated.View>
      </View>

      {/* Lower Loading Section (Lifted cleanly above bottom green arch) */}
      <Animated.View
        style={[
          styles.loadingSection,
          { bottom: loadingSectionBottom },
          loadingAnimatedStyle,
        ]}
        pointerEvents="none"
      >
        {/* 3D Capsule-style Progress Bar (Original Dimensions Preserved) */}
        <View style={styles.progressCapsuleTrack}>
          <Animated.View style={[styles.progressCapsuleFill, progressFillAnimatedStyle]}>
            <View style={styles.progressHighlight} />
          </Animated.View>
        </View>

        {/* ─── LOADING... ─── (Lifted cleanly into ivory area with high contrast) */}
        <View style={styles.loadingTextRow}>
          <View style={styles.loadingLine} />
          <Text style={styles.loadingText}>L O A D I N G . . .</Text>
          <View style={styles.loadingLine} />
        </View>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#F6F3EC', // Warm Ivory
    overflow: 'hidden',
    zIndex: 9999,
  },
  bgContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    overflow: 'hidden',
  },
  brandSection: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 2,
  },
  medallionWrapper: {
    width: 216,
    height: 216,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#C5A059',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 6,
  },
  logoBadgeContainer: {
    position: 'absolute',
    width: 124,
    height: 124,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: 110,
    height: 110,
  },
  titlesContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  dividerLine: {
    width: 90,
    height: 1,
    backgroundColor: '#C5A059', // Antique Gold
    opacity: 0.85,
  },
  dividerStar: {
    marginHorizontal: 8,
  },
  englishTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#064E3B',
    letterSpacing: 6,
    textAlign: 'center',
    marginVertical: 4,
  },
  bismillahText: {
    fontSize: 24,
    lineHeight: 38,
    color: '#064E3B',
    fontFamily: typography.fontFamily.scheherazade,
    marginTop: 8,
    textAlign: 'center',
  },
  loadingSection: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 2,
  },
  progressCapsuleTrack: {
    width: PROGRESS_TRACK_WIDTH,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#063A2A', // Deep Dark Emerald Green
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.55)', // Antique Gold Border
    overflow: 'hidden',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.22,
    shadowRadius: 4,
    elevation: 4,
  },
  progressCapsuleFill: {
    height: '100%',
    borderRadius: 6,
    backgroundColor: '#E5B842', // Luminous Gold
    position: 'relative',
  },
  progressHighlight: {
    position: 'absolute',
    top: 1,
    left: 2,
    right: 2,
    height: 2.2,
    borderRadius: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.50)', // 3D cylindrical reflection
  },
  loadingTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  loadingLine: {
    width: 34,
    height: 1,
    backgroundColor: '#C5A059',
    opacity: 0.75,
  },
  loadingText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B58D3D', // Luminous Warm Gold
    letterSpacing: 3.5,
    marginHorizontal: 10,
    textShadowColor: 'rgba(255, 255, 255, 0.90)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});
