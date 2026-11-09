// src/components/StarBadge.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import { useTheme } from '../theme/ThemeProvider';

interface StarBadgeProps {
  number: number | string;
  size?: number;
  color?: string;
  textColor?: string;
}

export const StarBadge: React.FC<StarBadgeProps> = ({
  number,
  size = 36,
  color,
  textColor,
}) => {
  const { colors } = useTheme();
  const strokeColor = color || colors.primary;
  const labelColor = textColor || colors.primary;

  const innerSquare = size * 0.72;
  const offset = (size - innerSquare) / 2;
  const radius = innerSquare * 0.12;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={StyleSheet.absoluteFill}>
        {/* First square */}
        <Rect
          x={offset}
          y={offset}
          width={innerSquare}
          height={innerSquare}
          rx={radius}
          ry={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth="1.5"
        />
        {/* Second square rotated 45 degrees */}
        <Rect
          x={offset}
          y={offset}
          width={innerSquare}
          height={innerSquare}
          rx={radius}
          ry={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth="1.5"
          origin={`${size / 2}, ${size / 2}`}
          rotation={45}
        />
      </Svg>
      <Text
        style={[
          styles.text,
          {
            color: labelColor,
            fontSize: size * 0.36,
          },
        ]}
        numberOfLines={1}
      >
        {number}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
    includeFontPadding: false,
  },
});

