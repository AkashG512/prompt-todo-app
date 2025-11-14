import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { Card } from '../ui/Card';
import { useTodoStore } from '../../store/todoStore';
import { lightColors, darkColors, spacing, typography } from '../../constants/theme';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  color?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color,
}) => {
  const systemColorScheme = useColorScheme();
  const settings = useTodoStore((state) => state.settings);
  const theme = settings.theme === 'system' ? systemColorScheme : settings.theme;
  const colors = theme === 'dark' ? darkColors : lightColors;
  
  const accentColor = color || colors.primary;
  
  return (
    <Card elevated padding={spacing.lg}>
      <View style={styles.container}>
        {icon && (
          <View style={[styles.iconContainer, { backgroundColor: `${accentColor}20` }]}>
            {icon}
          </View>
        )}
        <View style={styles.content}>
          <Text
            style={[
              styles.title,
              {
                color: colors.textSecondary,
                fontSize: typography.bodySmall.fontSize,
              },
            ]}
          >
            {title}
          </Text>
          <Text
            style={[
              styles.value,
              {
                color: accentColor,
                fontSize: typography.h2.fontSize,
                fontWeight: typography.h2.fontWeight,
              },
            ]}
          >
            {value}
          </Text>
          {subtitle && (
            <Text
              style={[
                styles.subtitle,
                {
                  color: colors.textTertiary,
                  fontSize: typography.caption.fontSize,
                },
              ]}
            >
              {subtitle}
            </Text>
          )}
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  content: {
    flex: 1,
  },
  title: {
    marginBottom: spacing.xs,
  },
  value: {
    marginBottom: spacing.xs,
  },
  subtitle: {},
});
