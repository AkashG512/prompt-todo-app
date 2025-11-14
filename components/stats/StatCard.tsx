import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '@/components/ui/Card';
import { useTheme } from '@/stores/useThemeStore';
import { spacing, typography } from '@/constants/theme';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ icon, label, value, color }) => {
  const { colors } = useTheme();

  return (
    <Card elevated style={styles.card}>
      <View style={[styles.iconContainer, { backgroundColor: color || colors.primary + '20' }]}>
        {icon}
      </View>
      <Text style={[styles.value, { color: colors.textPrimary }]}>{value}</Text>
      <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    alignItems: 'center',
    minWidth: 100,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  value: {
    fontSize: typography.h2.fontSize,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  label: {
    fontSize: typography.caption.fontSize,
    textAlign: 'center',
  },
});
