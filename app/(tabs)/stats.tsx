import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { CheckCircle2, Clock, TrendingUp, Target } from 'lucide-react-native';
import { useTodoStore } from '../../store/todoStore';
import { StatCard } from '../../components/stats/StatCard';
import { ProgressRing } from '../../components/stats/ProgressRing';
import { StreakCounter } from '../../components/stats/StreakCounter';
import { lightColors, darkColors, spacing, typography } from '../../constants/theme';

export default function StatsScreen() {
  const systemColorScheme = useColorScheme();
  const settings = useTodoStore((state) => state.settings);
  const theme = settings.theme === 'system' ? systemColorScheme : settings.theme;
  const colors = theme === 'dark' ? darkColors : lightColors;
  
  const getStats = useTodoStore((state) => state.getStats);
  const stats = getStats();
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text
            style={[
              styles.title,
              {
                color: colors.textPrimary,
                fontSize: typography.h1.fontSize,
                fontWeight: typography.h1.fontWeight,
              },
            ]}
          >
            Statistics
          </Text>
          <Text
            style={[
              styles.subtitle,
              {
                color: colors.textSecondary,
                fontSize: typography.body.fontSize,
              },
            ]}
          >
            Your productivity insights
          </Text>
        </View>
        
        <View style={styles.progressContainer}>
          <ProgressRing
            progress={stats.completionRate}
            size={160}
            strokeWidth={12}
            color={colors.primary}
          />
          <Text
            style={[
              styles.progressLabel,
              {
                color: colors.textSecondary,
                fontSize: typography.body.fontSize,
              },
            ]}
          >
            Completion Rate
          </Text>
        </View>
        
        <View style={styles.statsGrid}>
          <View style={styles.statRow}>
            <StatCard
              title="Total Tasks"
              value={stats.totalTodos}
              icon={<Target size={24} color={colors.primary} />}
              color={colors.primary}
            />
          </View>
          
          <View style={styles.statRow}>
            <StatCard
              title="Completed Today"
              value={stats.completedToday}
              icon={<CheckCircle2 size={24} color={colors.success} />}
              color={colors.success}
            />
          </View>
          
          <View style={styles.statRow}>
            <StatCard
              title="This Week"
              value={stats.completedThisWeek}
              icon={<Clock size={24} color={colors.secondary} />}
              color={colors.secondary}
            />
          </View>
        </View>
        
        <View style={styles.streakContainer}>
          <StreakCounter
            currentStreak={stats.currentStreak}
            longestStreak={stats.longestStreak}
          />
        </View>
        
        <View style={styles.motivationContainer}>
          <Text
            style={[
              styles.motivationText,
              {
                color: colors.textSecondary,
                fontSize: typography.body.fontSize,
                textAlign: 'center',
              },
            ]}
          >
            {getMotivationalMessage(stats.completionRate)}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function getMotivationalMessage(completionRate: number): string {
  if (completionRate >= 90) {
    return '🎉 Amazing! You\'re crushing it!';
  } else if (completionRate >= 70) {
    return '💪 Great work! Keep it up!';
  } else if (completionRate >= 50) {
    return '👍 You\'re making progress!';
  } else if (completionRate > 0) {
    return '🌱 Every task completed is a step forward!';
  } else {
    return '✨ Start your journey by completing a task!';
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  header: {
    marginBottom: spacing.xl,
  },
  title: {
    marginBottom: spacing.xs,
  },
  subtitle: {},
  progressContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  progressLabel: {
    marginTop: spacing.lg,
  },
  statsGrid: {
    marginBottom: spacing.xl,
  },
  statRow: {
    marginBottom: spacing.md,
  },
  streakContainer: {
    marginBottom: spacing.xl,
  },
  motivationContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  motivationText: {},
});
