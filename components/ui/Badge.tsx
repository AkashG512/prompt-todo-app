import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/stores/useThemeStore';
import { borderRadius, spacing, typography } from '@/constants/theme';

interface BadgeProps {
  label: string;
  color?: string;
  variant?: 'solid' | 'outline';
  size?: 'small' | 'medium';
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  color,
  variant = 'solid',
  size = 'medium',
}) => {
  const { colors } = useTheme();
  const badgeColor = color || colors.primary;

  return (
    <View
      style={[
        styles.badge,
        size === 'small' && styles.badgeSmall,
        variant === 'solid'
          ? { backgroundColor: badgeColor }
          : { backgroundColor: 'transparent', borderWidth: 1, borderColor: badgeColor },
      ]}
    >
      <Text
        style={[
          styles.text,
          size === 'small' && styles.textSmall,
          { color: variant === 'solid' ? '#FFFFFF' : badgeColor },
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    alignSelf: 'flex-start',
  },
  badgeSmall: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  text: {
    fontSize: typography.caption.fontSize,
    fontWeight: '600',
  },
  textSmall: {
    fontSize: 10,
  },
});
