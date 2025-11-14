import React from 'react';
import { View, StyleSheet, Text, SafeAreaView, ScrollView } from 'react-native';
import { CheckCircle2, Clock, ListTodo, TrendingUp } from 'lucide-react-native';
import { useTodoStore } from '@/stores/useTodoStore';
import { useTheme } from '@/stores/useThemeStore';
import { ProgressRing } from '@/components/stats/ProgressRing';
import { StatCard } from '@/components/stats/StatCard';
import { StreakCounter } from '@/components/stats/StreakCounter';
import { spacing, typography } from '@/constants/theme';

export default function StatsScreen() {
  const { colors } = useTheme();
  const getStats = useTodoStore((state) => state.getStats);
  const stats = getStats();

  const motivationalMessage = (() => {
    if (stats.completionRate >= 80) {
      return "Outstanding work! You're crushing it! 🎉";
    } else if (stats.completionRate >= 60) {
      return "Great progress! Keep it up! 💪";
    } else if (stats.completionRate >= 40) {
      return "You're doing well! Stay focused! 🎯";
    } else if (stats.completionRate >= 20) {
      return "Good start! Keep pushing forward! 🚀";
    } else {
      return "Every journey starts with a single step! 🌟";
    }
  })();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Statistics</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {motivationalMessage}
          </Text>
        </View>

        <View style={styles.progressSection}>
          <ProgressRing progress={stats.completionRate} label="Completion Rate" />
        </View>

        <View style={styles.statsGrid}>
          <StatCard
            icon={<ListTodo size={24} color={colors.primary} />}
            label="Total Todos"
            value={stats.totalTodos}
            color={colors.primary + '20'}
          />
          <StatCard
            icon={<CheckCircle2 size={24} color={colors.success} />}
            label="Completed Today"
            value={stats.completedToday}
            color={colors.success + '20'}
          />
        </View>

        <View style={styles.statsGrid}>
          <StatCard
            icon={<TrendingUp size={24} color={colors.secondary} />}
            label="This Week"
            value={stats.completedThisWeek}
            color={colors.secondary + '20'}
          />
          <StatCard
            icon={<Clock size={24} color={colors.warning} />}
            label="Active"
            value={stats.totalTodos - (stats.completedThisWeek || 0)}
            color={colors.warning + '20'}
          />
        </View>

        <View style={styles.streakSection}>
          <StreakCounter
            currentStreak={stats.currentStreak}
            longestStreak={stats.longestStreak}
          />
        </View>

        <View style={styles.tipSection}>
          <Text style={[styles.tipTitle, { color: colors.textPrimary }]}>💡 Pro Tip</Text>
          <Text style={[styles.tipText, { color: colors.textSecondary }]}>
            Set due dates for your todos to stay organized and build a daily completion streak!
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
  },
  title: {
    fontSize: typography.h1.fontSize,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.bodySmall.fontSize,
  },
  progressSection: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: spacing.base,
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  streakSection: {
    paddingHorizontal: spacing.base,
    marginBottom: spacing.md,
  },
  tipSection: {
    marginHorizontal: spacing.base,
    padding: spacing.base,
    backgroundColor: '#6366F120',
    borderRadius: 12,
    marginBottom: spacing.xxxl,
  },
  tipTitle: {
    fontSize: typography.body.fontSize,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  tipText: {
    fontSize: typography.bodySmall.fontSize,
    lineHeight: 20,
  },
});
