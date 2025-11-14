import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Flame } from 'lucide-react-native';
import { Card } from '@/components/ui/Card';
import { useTheme } from '@/stores/useThemeStore';
import { spacing, typography } from '@/constants/theme';

interface StreakCounterProps {
  currentStreak: number;
  longestStreak: number;
}

export const StreakCounter: React.FC<StreakCounterProps> = ({
  currentStreak,
  longestStreak,
}) => {
  const { colors } = useTheme();

  return (
    <Card elevated>
      <View style={styles.container}>
        <View style={styles.streakItem}>
          <Flame size={32} color={colors.warning} fill={colors.warning} />
          <Text style={[styles.value, { color: colors.textPrimary }]}>{currentStreak}</Text>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Current Streak</Text>
        </View>
        
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        
        <View style={styles.streakItem}>
          <Flame size={32} color={colors.secondary} fill={colors.secondary} />
          <Text style={[styles.value, { color: colors.textPrimary }]}>{longestStreak}</Text>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Longest Streak</Text>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  streakItem: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.base,
  },
  divider: {
    width: 1,
    height: 60,
  },
  value: {
    fontSize: typography.h1.fontSize,
    fontWeight: '700',
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  label: {
    fontSize: typography.caption.fontSize,
    textAlign: 'center',
  },
});
