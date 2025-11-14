import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { format } from 'date-fns';
import { useTodoStore } from '../../store/todoStore';
import { TodoList } from '../../components/todo/TodoList';
import { TodoInput } from '../../components/todo/TodoInput';
import { lightColors, darkColors, spacing, typography } from '../../constants/theme';

export default function TodayScreen() {
  const router = useRouter();
  const systemColorScheme = useColorScheme();
  const settings = useTodoStore((state) => state.settings);
  const theme = settings.theme === 'system' ? systemColorScheme : settings.theme;
  const colors = theme === 'dark' ? darkColors : lightColors;
  
  const getTodosByFilter = useTodoStore((state) => state.getTodosByFilter);
  const todos = getTodosByFilter('today');
  
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
  
  const today = format(new Date(), 'EEEE, MMMM d');
  
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
            Today
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
            {today}
          </Text>
        </View>
      </View>
      
      <TodoInput />
      
      <TodoList
        todos={todos}
        onTodoPress={handleTodoPress}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        emptyMessage="No tasks due today"
        description="Add due dates to see tasks here"
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
});
