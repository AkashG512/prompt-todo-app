import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { Flame } from 'lucide-react-native';
import { Card } from '../ui/Card';
import { useTodoStore } from '../../store/todoStore';
import { lightColors, darkColors, spacing, typography } from '../../constants/theme';

interface StreakCounterProps {
  currentStreak: number;
  longestStreak: number;
}

export const StreakCounter: React.FC<StreakCounterProps> = ({
  currentStreak,
  longestStreak,
}) => {
  const systemColorScheme = useColorScheme();
  const settings = useTodoStore((state) => state.settings);
  const theme = settings.theme === 'system' ? systemColorScheme : settings.theme;
  const colors = theme === 'dark' ? darkColors : lightColors;
  
  return (
    <Card elevated padding={spacing.lg}>
      <View style={styles.container}>
        <View style={styles.streakItem}>
          <View style={[styles.iconContainer, { backgroundColor: `${colors.warning}20` }]}>
            <Flame size={24} color={colors.warning} />
          </View>
          <View>
            <Text
              style={[
                styles.label,
                {
                  color: colors.textSecondary,
                  fontSize: typography.bodySmall.fontSize,
                },
              ]}
            >
              Current Streak
            </Text>
            <Text
              style={[
                styles.value,
                {
                  color: colors.textPrimary,
                  fontSize: typography.h2.fontSize,
                  fontWeight: typography.h2.fontWeight,
                },
              ]}
            >
              {currentStreak} {currentStreak === 1 ? 'day' : 'days'}
            </Text>
          </View>
        </View>
        
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        
        <View style={styles.streakItem}>
          <View style={[styles.iconContainer, { backgroundColor: `${colors.success}20` }]}>
            <Flame size={24} color={colors.success} />
          </View>
          <View>
            <Text
              style={[
                styles.label,
                {
                  color: colors.textSecondary,
                  fontSize: typography.bodySmall.fontSize,
                },
              ]}
            >
              Longest Streak
            </Text>
            <Text
              style={[
                styles.value,
                {
                  color: colors.textPrimary,
                  fontSize: typography.h2.fontSize,
                  fontWeight: typography.h2.fontWeight,
                },
              ]}
            >
              {longestStreak} {longestStreak === 1 ? 'day' : 'days'}
            </Text>
          </View>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  streakItem: {
    flex: 1,
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
  label: {
    marginBottom: spacing.xs,
  },
  value: {},
  divider: {
    width: 1,
    height: '80%',
    marginHorizontal: spacing.lg,
  },
});
