import React from 'react';
import { View, StyleSheet, Text, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { isToday } from 'date-fns';
import { useTodoStore } from '@/stores/useTodoStore';
import { useTheme } from '@/stores/useThemeStore';
import { TodoList } from '@/components/todo/TodoList';
import { TodoInput } from '@/components/todo/TodoInput';
import { spacing, typography } from '@/constants/theme';
import { Todo } from '@/types';

export default function TodayScreen() {
  const { colors } = useTheme();
  const { todos, addTodo } = useTodoStore();

  const todaysTodos = todos
    .filter((todo) => !todo.completed)
    .filter((todo) => {
      if (!todo.dueDate) return false;
      return isToday(new Date(todo.dueDate));
    })
    .sort((a, b) => {
      const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

  const handleAddTodo = (title: string) => {
    addTodo({
      title,
      completed: false,
      priority: 'medium',
      category: '2',
      dueDate: new Date(),
    });
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
        <Text style={[styles.title, { color: colors.textPrimary }]}>Today</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
          })}
        </Text>
      </View>

      <View style={styles.quickAdd}>
        <TodoInput onAdd={handleAddTodo} placeholder="Add a todo for today..." />
      </View>

      <TodoList
        todos={todaysTodos}
        onTodoPress={handleTodoPress}
        emptyMessage="No todos for today. Enjoy your free time! 🎉"
      />
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
  quickAdd: {
    paddingHorizontal: spacing.base,
    marginBottom: spacing.md,
  },
});
