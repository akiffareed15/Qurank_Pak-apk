// src/components/GeometricPattern.tsx

import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Defs, Pattern, Rect, Path, G } from 'react-native-svg';

interface GeometricPatternProps {
  color?: string;
  opacity?: number;
}

const GeometricPatternComponent: React.FC<GeometricPatternProps> = ({
  color = '#FFFFFF',
  opacity = 0.09,
}) => {
  return (
    <View style={[StyleSheet.absoluteFill, styles.container]} pointerEvents="none">
      <Svg width="100%" height="100%">
        <Defs>
          <Pattern
            id="islamic-star-pattern"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <G stroke={color} strokeWidth="1" fill="none">
              {/* Central small 8-point star */}
              <Rect x="14" y="14" width="12" height="12" />
              <Rect x="14" y="14" width="12" height="12" origin="20, 20" rotation="45" />
              {/* Connecting diagonal lines */}
              <Path d="M 0 0 L 14 14" />
              <Path d="M 40 0 L 26 14" />
              <Path d="M 0 40 L 14 26" />
              <Path d="M 40 40 L 26 26" />
              {/* Mid horizontal/vertical lines */}
              <Path d="M 0 20 L 12 20" />
              <Path d="M 28 20 L 40 20" />
              <Path d="M 20 0 L 20 12" />
              <Path d="M 20 28 L 20 40" />
            </G>
          </Pattern>
        </Defs>
        <Rect
          width="100%"
          height="100%"
          fill="url(#islamic-star-pattern)"
          opacity={opacity}
        />
      </Svg>
    </View>
  );
};

export const GeometricPattern = React.memo(GeometricPatternComponent);

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
});

