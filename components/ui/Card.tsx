import React from 'react';
import { View, StyleSheet, useColorScheme } from 'react-native';
import { lightColors, darkColors, borderRadius, spacing, shadows } from '../../constants/theme';
import { useTodoStore } from '../../store/todoStore';

interface CardProps {
  children: React.ReactNode;
  elevated?: boolean;
  padding?: number;
}

export const Card: React.FC<CardProps> = ({
  children,
  elevated = false,
  padding = spacing.lg,
}) => {
  const systemColorScheme = useColorScheme();
  const settings = useTodoStore((state) => state.settings);
  const theme = settings.theme === 'system' ? systemColorScheme : settings.theme;
  const colors = theme === 'dark' ? darkColors : lightColors;
  
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: elevated ? colors.surfaceElevated : colors.surface,
          borderRadius: borderRadius.md,
          padding,
        },
        elevated && shadows.small,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
  },
});
