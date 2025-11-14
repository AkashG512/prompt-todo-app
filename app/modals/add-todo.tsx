import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { X, Calendar, Flag, Tag } from 'lucide-react-native';
import { useTodoStore } from '@/stores/useTodoStore';
import { useTheme } from '@/stores/useThemeStore';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { spacing, typography, priorityColors } from '@/constants/theme';
import { Priority } from '@/types';
import { triggerHaptic } from '@/utils/haptics';
import { formatDueDate } from '@/utils/date';

export default function AddTodoModal() {
  const { colors, isDark } = useTheme();
  const { todoId } = useLocalSearchParams<{ todoId?: string }>();
  const { todos, addTodo, updateTodo, categories } = useTodoStore();

  const existingTodo = todoId ? todos.find((t) => t.id === todoId) : null;

  const [title, setTitle] = useState(existingTodo?.title || '');
  const [description, setDescription] = useState(existingTodo?.description || '');
  const [priority, setPriority] = useState<Priority>(existingTodo?.priority || 'medium');
  const [category, setCategory] = useState(existingTodo?.category || categories[0]?.id || '');
  const [dueDate, setDueDate] = useState<Date | undefined>(
    existingTodo?.dueDate ? new Date(existingTodo.dueDate) : undefined
  );
  const [showDatePicker, setShowDatePicker] = useState(false);

  const priorities: { value: Priority; label: string; color: string }[] = [
    { value: 'low', label: 'Low', color: priorityColors.low[isDark ? 'dark' : 'light'] },
    { value: 'medium', label: 'Medium', color: priorityColors.medium[isDark ? 'dark' : 'light'] },
    { value: 'high', label: 'High', color: priorityColors.high[isDark ? 'dark' : 'light'] },
    { value: 'urgent', label: 'Urgent', color: priorityColors.urgent[isDark ? 'dark' : 'light'] },
  ];

  const handleSave = () => {
    if (!title.trim()) return;

    triggerHaptic.light();

    if (existingTodo) {
      updateTodo(existingTodo.id, {
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        category,
        dueDate,
      });
    } else {
      addTodo({
        title: title.trim(),
        description: description.trim() || undefined,
        completed: false,
        priority,
        category,
        dueDate,
      });
    }

    router.back();
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDueDate(selectedDate);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          {existingTodo ? 'Edit Todo' : 'New Todo'}
        </Text>
        <TouchableOpacity onPress={() => router.back()}>
          <X size={28} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Input
          label="Title"
          value={title}
          onChangeText={setTitle}
          placeholder="What needs to be done?"
          autoFocus={!existingTodo}
        />

        <Input
          label="Description (Optional)"
          value={description}
          onChangeText={setDescription}
          placeholder="Add more details..."
          multiline
          numberOfLines={3}
        />

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Flag size={20} color={colors.textSecondary} />
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Priority</Text>
          </View>
          <View style={styles.optionsGrid}>
            {priorities.map((p) => (
              <TouchableOpacity
                key={p.value}
                style={[
                  styles.optionButton,
                  {
                    backgroundColor: priority === p.value ? p.color + '20' : colors.surface,
                    borderColor: priority === p.value ? p.color : colors.border,
                  },
                ]}
                onPress={() => {
                  triggerHaptic.light();
                  setPriority(p.value);
                }}
              >
                <Text
                  style={[
                    styles.optionText,
                    { color: priority === p.value ? p.color : colors.textPrimary },
                  ]}
                >
                  {p.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Tag size={20} color={colors.textSecondary} />
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Category</Text>
          </View>
          <View style={styles.optionsGrid}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.optionButton,
                  {
                    backgroundColor: category === cat.id ? cat.color + '20' : colors.surface,
                    borderColor: category === cat.id ? cat.color : colors.border,
                  },
                ]}
                onPress={() => {
                  triggerHaptic.light();
                  setCategory(cat.id);
                }}
              >
                <Text
                  style={[
                    styles.optionText,
                    { color: category === cat.id ? cat.color : colors.textPrimary },
                  ]}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Calendar size={20} color={colors.textSecondary} />
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Due Date</Text>
          </View>
          <TouchableOpacity
            style={[styles.dateButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => {
              triggerHaptic.light();
              setShowDatePicker(true);
            }}
          >
            <Text style={[styles.dateButtonText, { color: colors.textPrimary }]}>
              {dueDate ? formatDueDate(dueDate) : 'No due date'}
            </Text>
          </TouchableOpacity>
          {dueDate && (
            <TouchableOpacity
              onPress={() => {
                triggerHaptic.light();
                setDueDate(undefined);
              }}
            >
              <Text style={[styles.clearDateText, { color: colors.error }]}>Clear date</Text>
            </TouchableOpacity>
          )}
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={dueDate || new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
            minimumDate={new Date()}
          />
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={existingTodo ? 'Save Changes' : 'Create Todo'}
          onPress={handleSave}
          disabled={!title.trim()}
          fullWidth
        />
      </View>
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
    fontSize: typography.h2.fontSize,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.base,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.bodySmall.fontSize,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  optionButton: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    borderRadius: 8,
    borderWidth: 1.5,
  },
  optionText: {
    fontSize: typography.bodySmall.fontSize,
    fontWeight: '600',
  },
  dateButton: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.base,
    borderRadius: 8,
    borderWidth: 1,
  },
  dateButtonText: {
    fontSize: typography.body.fontSize,
  },
  clearDateText: {
    fontSize: typography.bodySmall.fontSize,
    fontWeight: '600',
    marginTop: spacing.sm,
  },
  footer: {
    padding: spacing.base,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
});
