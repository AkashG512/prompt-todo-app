import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { lightColors, darkColors, borderRadius, spacing, typography } from '../../constants/theme';
import { useTodoStore } from '../../store/todoStore';

interface BadgeProps {
  label: string;
  color?: string;
  variant?: 'filled' | 'outlined';
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  color,
  variant = 'filled',
}) => {
  const systemColorScheme = useColorScheme();
  const settings = useTodoStore((state) => state.settings);
  const theme = settings.theme === 'system' ? systemColorScheme : settings.theme;
  const colors = theme === 'dark' ? darkColors : lightColors;
  
  const badgeColor = color || colors.primary;
  
  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: variant === 'filled' ? badgeColor : 'transparent',
          borderColor: badgeColor,
          borderWidth: variant === 'outlined' ? 1 : 0,
          borderRadius: borderRadius.sm,
        },
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color: variant === 'filled' ? '#FFFFFF' : badgeColor,
            fontSize: typography.caption.fontSize,
            fontWeight: typography.caption.fontWeight,
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    alignSelf: 'flex-start',
  },
  text: {
    textTransform: 'uppercase',
  },
});
