import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CheckCircle2 } from 'lucide-react-native';
import { useTheme } from '@/stores/useThemeStore';
import { spacing, typography } from '@/constants/theme';

interface EmptyStateProps {
  message?: string;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  message = 'No todos yet. Tap + to create one!',
  icon,
}) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      {icon || <CheckCircle2 size={64} color={colors.textTertiary} strokeWidth={1.5} />}
      <Text style={[styles.message, { color: colors.textSecondary }]}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  message: {
    fontSize: typography.body.fontSize,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
});
