import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Modal, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { Plus, Settings as SettingsIcon, Search, SlidersHorizontal } from 'lucide-react-native';
import { useTodoStore } from '@/stores/useTodoStore';
import { useTheme } from '@/stores/useThemeStore';
import { TodoList } from '@/components/todo/TodoList';
import { TodoInput } from '@/components/todo/TodoInput';
import { spacing, typography } from '@/constants/theme';
import { Todo, Priority } from '@/types';

export default function AllTodosScreen() {
  const { colors } = useTheme();
  const { todos, addTodo } = useTodoStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<Priority | 'all'>('all');
  const [filterCategory, setFilterCategory] = useState<string | 'all'>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredTodos = todos
    .filter((todo) => !todo.completed)
    .filter((todo) => {
      if (searchQuery) {
        return (
          todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          todo.description?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      return true;
    })
    .filter((todo) => {
      if (filterPriority !== 'all') {
        return todo.priority === filterPriority;
      }
      return true;
    })
    .filter((todo) => {
      if (filterCategory !== 'all') {
        return todo.category === filterCategory;
      }
      return true;
    })
    .sort((a, b) => {
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      if (a.dueDate) return -1;
      if (b.dueDate) return 1;
      return b.order - a.order;
    });

  const handleAddTodo = (title: string) => {
    addTodo({
      title,
      completed: false,
      priority: 'medium',
      category: '2',
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
        <Text style={[styles.title, { color: colors.textPrimary }]}>All Todos</Text>
        <TouchableOpacity onPress={() => router.push('/modals/settings')} style={styles.iconButton}>
          <SettingsIcon size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <View style={styles.quickAdd}>
        <TodoInput onAdd={handleAddTodo} />
      </View>

      <TodoList
        todos={filteredTodos}
        onTodoPress={handleTodoPress}
        emptyMessage="No todos yet. Add one above to get started!"
      />

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={() => setShowAddModal(true)}
      >
        <Plus size={28} color="#FFFFFF" />
      </TouchableOpacity>

      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowAddModal(false)}
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Add Todo</Text>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <Text style={[styles.closeButton, { color: colors.primary }]}>Done</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.modalContent}>
            <TodoInput onAdd={(title) => {
              handleAddTodo(title);
              setShowAddModal(false);
            }} />
          </View>
        </SafeAreaView>
      </Modal>
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
  },
  iconButton: {
    padding: spacing.sm,
  },
  quickAdd: {
    paddingHorizontal: spacing.base,
    marginBottom: spacing.md,
  },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.xxxl + 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: typography.h2.fontSize,
    fontWeight: '600',
  },
  closeButton: {
    fontSize: typography.body.fontSize,
    fontWeight: '600',
  },
  modalContent: {
    padding: spacing.base,
  },
});
