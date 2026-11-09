// src/components/HomeTile.tsx
// Refined Luxury Navigation Tile for Surahs & Bookmarks

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeProvider';
import { AnimatedPressable } from './AnimatedPressable';

interface HomeTileProps {
  title: string;
  subtitle: string;
  iconName: keyof typeof Ionicons.glyphMap;
  badge?: string;
  onPress: () => void;
}

export const HomeTile: React.FC<HomeTileProps> = ({
  title,
  subtitle,
  iconName,
  badge,
  onPress,
}) => {
  const { isDark } = useTheme();

  // Dynamic Theme Palette
  const tileBg = isDark ? 'rgba(9, 32, 23, 0.88)' : 'rgba(255, 255, 255, 0.95)';
  const tileBorder = isDark ? 'rgba(218, 165, 32, 0.42)' : 'rgba(13, 102, 70, 0.32)';
  const outerHaloBg = isDark ? 'rgba(61, 184, 138, 0.12)' : 'rgba(13, 102, 70, 0.08)';
  const innerIconBg = isDark ? 'rgba(61, 184, 138, 0.22)' : 'rgba(13, 102, 70, 0.14)';
  const iconColor = isDark ? '#3DB88A' : '#064229';
  const textColor = isDark ? '#FFFFFF' : '#042317';
  const textMutedColor = isDark ? '#A0B9AE' : '#2D4B3E';

  const badgeBg = isDark ? 'rgba(218, 165, 32, 0.18)' : 'rgba(13, 102, 70, 0.12)';
  const badgeBorder = isDark ? 'rgba(218, 165, 32, 0.45)' : 'rgba(13, 102, 70, 0.28)';
  const badgeTextColor = isDark ? '#E5C158' : '#064229';

  const arrowBg = isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(13, 102, 70, 0.08)';
  const arrowBorder = isDark ? 'rgba(218, 165, 32, 0.35)' : 'rgba(13, 102, 70, 0.22)';
  const arrowColor = isDark ? '#E5C158' : '#064229';

  return (
    <AnimatedPressable
      onPress={onPress}
      style={[
        styles.tile,
        {
          backgroundColor: tileBg,
          borderColor: tileBorder,
          shadowColor: isDark ? '#000000' : '#042317',
        },
      ]}
    >
      {/* Top Row: Double-layer icon on left, counter badge or arrow on right */}
      <View style={styles.topRow}>
        <View style={[styles.outerHalo, { backgroundColor: outerHaloBg }]}>
          <View
            style={[
              styles.innerIconBadge,
              {
                backgroundColor: innerIconBg,
                borderColor: tileBorder,
              },
            ]}
          >
            <Ionicons name={iconName} size={20} color={iconColor} />
          </View>
        </View>

        {badge ? (
          <View
            style={[
              styles.counterBadge,
              { backgroundColor: badgeBg, borderColor: badgeBorder },
            ]}
          >
            <Text style={[styles.badgeText, { color: badgeTextColor }]}>
              {badge}
            </Text>
          </View>
        ) : (
          <View
            style={[
              styles.arrowContainer,
              { backgroundColor: arrowBg, borderColor: arrowBorder },
            ]}
          >
            <Ionicons name="arrow-forward" size={13} color={arrowColor} />
          </View>
        )}
      </View>

      {/* Bottom Text Area with Clean Hierarchy */}
      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: textColor }]} numberOfLines={1}>
          {title}
        </Text>
        <Text
          style={[styles.subtitle, { color: textMutedColor }]}
          numberOfLines={1}
        >
          {subtitle}
        </Text>
      </View>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  tile: {
    borderRadius: 22,
    borderWidth: 1.2,
    padding: 15,
    justifyContent: 'space-between',
    minHeight: 122,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 10,
    elevation: 4,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  outerHalo: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 12,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  arrowContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    marginTop: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  subtitle: {
    fontSize: 12.5,
    marginTop: 2,
    fontWeight: '600',
  },
});
