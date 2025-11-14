import React from 'react';
import { View, StyleSheet, Text, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { Trash2 } from 'lucide-react-native';
import { useTodoStore } from '@/stores/useTodoStore';
import { useTheme } from '@/stores/useThemeStore';
import { TodoList } from '@/components/todo/TodoList';
import { spacing, typography } from '@/constants/theme';
import { Todo } from '@/types';
import { triggerHaptic } from '@/utils/haptics';

export default function CompletedScreen() {
  const { colors } = useTheme();
  const { todos, clearCompleted } = useTodoStore();

  const completedTodos = todos
    .filter((todo) => todo.completed)
    .sort((a, b) => {
      if (a.completedAt && b.completedAt) {
        return new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime();
      }
      return 0;
    });

  const handleClearCompleted = () => {
    Alert.alert(
      'Clear Completed',
      'Are you sure you want to delete all completed todos? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: () => {
            triggerHaptic.warning();
            clearCompleted();
          },
        },
      ]
    );
  };

  const handleTodoPress = (todo: Todo) => {
    router.push({
      pathname: '/modals/add-todo',
      params: { todoId: todo.id },
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Completed</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {completedTodos.length} {completedTodos.length === 1 ? 'task' : 'tasks'} completed
          </Text>
        </View>
        {completedTodos.length > 0 && (
          <TouchableOpacity onPress={handleClearCompleted} style={styles.clearButton}>
            <Trash2 size={20} color={colors.error} />
            <Text style={[styles.clearButtonText, { color: colors.error }]}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      <TodoList
        todos={completedTodos}
        onTodoPress={handleTodoPress}
        emptyMessage="No completed todos yet. Complete some tasks to see them here!"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    padding: spacing.sm,
  },
  clearButtonText: {
    fontSize: typography.bodySmall.fontSize,
    fontWeight: '600',
  },
});
