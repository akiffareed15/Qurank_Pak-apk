// src/components/EmptyState.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeProvider';

interface EmptyStateProps {
  iconName?: keyof typeof Ionicons.glyphMap;
  message: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  iconName = 'bookmark-outline',
  message,
}) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Ionicons name={iconName} size={48} color={colors.textMuted} style={{ opacity: 0.4 }} />
      <Text style={[styles.message, { color: colors.textMuted }]}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    minHeight: 250,
  },
  message: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
  },
});

