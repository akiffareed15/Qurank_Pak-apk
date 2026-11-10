// src/components/ThemeToggleButton.tsx
// Unified Dark / Light mode toggle button supporting both Homepage glass style and Header bar style

import React from 'react';
import { Pressable, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeProvider';

interface ThemeToggleButtonProps {
  color?: string;
  size?: number;
  variant?: 'glass' | 'header';
  style?: StyleProp<ViewStyle>;
}

export const ThemeToggleButton: React.FC<ThemeToggleButtonProps> = ({
  color,
  size = 19,
  variant = 'glass',
  style,
}) => {
  const { isDark, toggleTheme, colors } = useTheme();

  // Glass variant for Homepage (over Islamic background)
  if (variant === 'glass') {
    const buttonBg = isDark ? 'rgba(10, 36, 26, 0.78)' : 'rgba(255, 255, 255, 0.94)';
    const buttonBorder = isDark ? 'rgba(218, 165, 32, 0.45)' : 'rgba(13, 102, 70, 0.32)';
    const buttonIcon = color || (isDark ? '#E5C158' : '#07482D');

    return (
      <Pressable
        onPress={toggleTheme}
        style={({ pressed }) => [
          styles.glassButton,
          {
            backgroundColor: buttonBg,
            borderColor: buttonBorder,
            opacity: pressed ? 0.75 : 1,
            transform: [{ scale: pressed ? 0.94 : 1 }],
          },
          style,
        ]}
        hitSlop={10}
        accessibilityRole="button"
        accessibilityLabel={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        <Ionicons
          name={isDark ? 'sunny-outline' : 'moon-outline'}
          size={size}
          color={buttonIcon}
        />
      </Pressable>
    );
  }

  // Header variant for inside app screens (Reader, Bookmarks, Surahs, Settings)
  const headerBtnBg = colors.card;
  const headerBtnBorder = colors.border;
  const headerIconColor = color || (isDark ? '#E5C158' : colors.text);

  return (
    <Pressable
      onPress={toggleTheme}
      style={({ pressed }) => [
        styles.headerButton,
        {
          backgroundColor: headerBtnBg,
          borderColor: headerBtnBorder,
          opacity: pressed ? 0.75 : 1,
          transform: [{ scale: pressed ? 0.94 : 1 }],
        },
        style,
      ]}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <Ionicons
        name={isDark ? 'sunny-outline' : 'moon-outline'}
        size={size}
        color={headerIconColor}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  glassButton: {
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
  headerButton: {
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
});
