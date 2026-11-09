// src/components/FadeInView.tsx

import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Animated, { FadeInDown, ReduceMotion } from 'react-native-reanimated';

interface FadeInViewProps {
  delay?: number;
  duration?: number;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

export const FadeInView: React.FC<FadeInViewProps> = ({
  delay = 0,
  duration = 350,
  style,
  children,
}) => {
  return (
    <Animated.View
      entering={FadeInDown.delay(delay)
        .duration(duration)
        .reduceMotion(ReduceMotion.System)}
      style={style}
    >
      {children}
    </Animated.View>
  );
};
