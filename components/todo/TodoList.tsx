import React from 'react';
import { FlatList, StyleSheet, RefreshControl, useColorScheme } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { Todo } from '../../types';
import { TodoItem } from './TodoItem';
import { EmptyState } from './EmptyState';
import { useTodoStore } from '../../store/todoStore';
import { lightColors, darkColors, spacing } from '../../constants/theme';

interface TodoListProps {
  todos: Todo[];
  onTodoPress: (todo: Todo) => void;
  onRefresh?: () => void;
  refreshing?: boolean;
  emptyMessage?: string;
  description?: string;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  onTodoPress,
  onRefresh,
  refreshing = false,
  emptyMessage = 'No todos yet',
  description,
}) => {
  const systemColorScheme = useColorScheme();
  const settings = useTodoStore((state) => state.settings);
  const theme = settings.theme === 'system' ? systemColorScheme : settings.theme;
  const colors = theme === 'dark' ? darkColors : lightColors;
  
  const sortedTodos = React.useMemo(() => {
    return [...todos].sort((a, b) => {
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      
      if (a.dueDate && !b.dueDate) return -1;
      if (!a.dueDate && b.dueDate) return 1;
      
      const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;
      
      return b.order - a.order;
    });
  }, [todos]);
  
  if (todos.length === 0) {
    return <EmptyState message={emptyMessage} description={description} />;
  }
  
  return (
    <FlatList
      data={sortedTodos}
      renderItem={({ item, index }) => (
        <Animated.View
          entering={FadeIn.delay(index * 50)}
          exiting={FadeOut}
        >
          <TodoItem todo={item} onPress={() => onTodoPress(item)} />
        </Animated.View>
      )}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContent}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        ) : undefined
      }
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
});
