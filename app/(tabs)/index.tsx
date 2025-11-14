import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Settings } from 'lucide-react-native';
import { useTodoStore } from '../../store/todoStore';
import { TodoList } from '../../components/todo/TodoList';
import { TodoInput } from '../../components/todo/TodoInput';
import { lightColors, darkColors, spacing, typography } from '../../constants/theme';

export default function AllTodosScreen() {
  const router = useRouter();
  const systemColorScheme = useColorScheme();
  const settings = useTodoStore((state) => state.settings);
  const theme = settings.theme === 'system' ? systemColorScheme : settings.theme;
  const colors = theme === 'dark' ? darkColors : lightColors;
  
  const getTodosByFilter = useTodoStore((state) => state.getTodosByFilter);
  const todos = getTodosByFilter('all');
  
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
            All Todos
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
            {todos.length} active {todos.length === 1 ? 'task' : 'tasks'}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push('/modals/settings')}
          style={[
            styles.settingsButton,
            { backgroundColor: colors.surface },
          ]}
        >
          <Settings size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>
      
      <TodoInput />
      
      <TodoList
        todos={todos}
        onTodoPress={handleTodoPress}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        emptyMessage="No active todos"
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
  settingsButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
