import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Trash2 } from 'lucide-react-native';
import { useTodoStore } from '../../store/todoStore';
import { TodoList } from '../../components/todo/TodoList';
import { lightColors, darkColors, spacing, typography } from '../../constants/theme';
import { triggerWarning } from '../../utils/haptics';

export default function CompletedScreen() {
  const router = useRouter();
  const systemColorScheme = useColorScheme();
  const settings = useTodoStore((state) => state.settings);
  const theme = settings.theme === 'system' ? systemColorScheme : settings.theme;
  const colors = theme === 'dark' ? darkColors : lightColors;
  const enableHaptics = settings.enableHaptics;
  
  const getTodosByFilter = useTodoStore((state) => state.getTodosByFilter);
  const todos = getTodosByFilter('completed');
  const deleteTodo = useTodoStore((state) => state.deleteTodo);
  
  const [refreshing, setRefreshing] = useState(false);
  
  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 500);
  };
  
  const handleTodoPress = (todo: any) => {
    router.push({
      pathname: '/modals/add-todo',
      params: { todoId: todo.id },
    });
  };
  
  const handleClearCompleted = () => {
    if (enableHaptics) {
      triggerWarning();
    }
    
    Alert.alert(
      'Clear Completed',
      `Are you sure you want to delete ${todos.length} completed ${todos.length === 1 ? 'task' : 'tasks'}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            todos.forEach((todo) => deleteTodo(todo.id));
          },
        },
      ]
    );
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <View>
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
            Completed
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
            {todos.length} {todos.length === 1 ? 'task' : 'tasks'}
          </Text>
        </View>
        {todos.length > 0 && (
          <TouchableOpacity
            onPress={handleClearCompleted}
            style={[
              styles.clearButton,
              { backgroundColor: colors.surface },
            ]}
          >
            <Trash2 size={20} color={colors.error} />
          </TouchableOpacity>
        )}
      </View>
      
      <TodoList
        todos={todos}
        onTodoPress={handleTodoPress}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        emptyMessage="No completed tasks"
        description="Complete tasks to see them here"
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
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  title: {
    marginBottom: spacing.xs,
  },
  subtitle: {},
  clearButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
