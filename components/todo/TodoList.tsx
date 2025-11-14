import React from 'react';
import { FlatList, StyleSheet, RefreshControl } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Todo } from '@/types';
import { TodoItem } from './TodoItem';
import { EmptyState } from './EmptyState';
import { useTheme } from '@/stores/useThemeStore';
import { spacing } from '@/constants/theme';

interface TodoListProps {
  todos: Todo[];
  onTodoPress: (todo: Todo) => void;
  onRefresh?: () => void;
  refreshing?: boolean;
  emptyMessage?: string;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  onTodoPress,
  onRefresh,
  refreshing = false,
  emptyMessage,
}) => {
  const { colors } = useTheme();

  const renderItem = ({ item, index }: { item: Todo; index: number }) => (
    <Animated.View entering={FadeInDown.delay(index * 50).springify()}>
      <TodoItem todo={item} onPress={() => onTodoPress(item)} />
    </Animated.View>
  );

  if (todos.length === 0) {
    return <EmptyState message={emptyMessage} />;
  }

  return (
    <FlatList
      data={todos}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        ) : undefined
      }
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    padding: spacing.base,
    paddingBottom: spacing.xxxl,
  },
});
