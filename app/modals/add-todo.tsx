import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { X, Calendar, Tag, AlertCircle } from 'lucide-react-native';
import { useTodoStore } from '../../store/todoStore';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { lightColors, darkColors, spacing, typography, borderRadius } from '../../constants/theme';
import { Priority } from '../../types';
import { triggerLight } from '../../utils/haptics';

export default function AddTodoModal() {
  const router = useRouter();
  const { todoId } = useLocalSearchParams();
  const systemColorScheme = useColorScheme();
  const settings = useTodoStore((state) => state.settings);
  const theme = settings.theme === 'system' ? systemColorScheme : settings.theme;
  const colors = theme === 'dark' ? darkColors : lightColors;
  const enableHaptics = settings.enableHaptics;
  
  const todos = useTodoStore((state) => state.todos);
  const categories = useTodoStore((state) => state.categories);
  const addTodo = useTodoStore((state) => state.addTodo);
  const updateTodo = useTodoStore((state) => state.updateTodo);
  const deleteTodo = useTodoStore((state) => state.deleteTodo);
  
  const existingTodo = todoId ? todos.find((t) => t.id === todoId) : null;
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [category, setCategory] = useState('personal');
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  useEffect(() => {
    if (existingTodo) {
      setTitle(existingTodo.title);
      setDescription(existingTodo.description || '');
      setPriority(existingTodo.priority);
      setCategory(existingTodo.category);
      setDueDate(existingTodo.dueDate ? new Date(existingTodo.dueDate) : undefined);
    }
  }, [existingTodo]);
  
  const handleSave = () => {
    if (!title.trim()) return;
    
    if (enableHaptics) {
      triggerLight();
    }
    
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
  
  const handleDelete = () => {
    if (existingTodo && enableHaptics) {
      triggerLight();
      deleteTodo(existingTodo.id);
      router.back();
    }
  };
  
  const priorities: Priority[] = ['low', 'medium', 'high', 'urgent'];
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text
          style={[
            styles.title,
            {
              color: colors.textPrimary,
              fontSize: typography.h2.fontSize,
              fontWeight: typography.h2.fontWeight,
            },
          ]}
        >
          {existingTodo ? 'Edit Todo' : 'New Todo'}
        </Text>
        <TouchableOpacity onPress={() => router.back()}>
          <X size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>
      
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
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
          numberOfLines={4}
        />
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <AlertCircle size={20} color={colors.textSecondary} />
            <Text
              style={[
                styles.sectionTitle,
                {
                  color: colors.textSecondary,
                  fontSize: typography.bodySmall.fontSize,
                },
              ]}
            >
              Priority
            </Text>
          </View>
          <View style={styles.priorityContainer}>
            {priorities.map((p) => (
              <TouchableOpacity
                key={p}
                style={[
                  styles.priorityButton,
                  {
                    backgroundColor: priority === p ? colors.primary : colors.surface,
                    borderColor: priority === p ? colors.primary : colors.border,
                    borderRadius: borderRadius.sm,
                  },
                ]}
                onPress={() => setPriority(p)}
              >
                <Text
                  style={[
                    styles.priorityText,
                    {
                      color: priority === p ? '#FFFFFF' : colors.textPrimary,
                      fontSize: typography.body.fontSize,
                    },
                  ]}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Tag size={20} color={colors.textSecondary} />
            <Text
              style={[
                styles.sectionTitle,
                {
                  color: colors.textSecondary,
                  fontSize: typography.bodySmall.fontSize,
                },
              ]}
            >
              Category
            </Text>
          </View>
          <View style={styles.categoryContainer}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryButton,
                  {
                    backgroundColor: category === cat.id ? cat.color : colors.surface,
                    borderColor: category === cat.id ? cat.color : colors.border,
                    borderRadius: borderRadius.sm,
                  },
                ]}
                onPress={() => setCategory(cat.id)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    {
                      color: category === cat.id ? '#FFFFFF' : colors.textPrimary,
                      fontSize: typography.body.fontSize,
                    },
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
            <Text
              style={[
                styles.sectionTitle,
                {
                  color: colors.textSecondary,
                  fontSize: typography.bodySmall.fontSize,
                },
              ]}
            >
              Due Date
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.dateButton,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderRadius: borderRadius.sm,
              },
            ]}
            onPress={() => setShowDatePicker(true)}
          >
            <Text
              style={[
                styles.dateText,
                {
                  color: dueDate ? colors.textPrimary : colors.textTertiary,
                  fontSize: typography.body.fontSize,
                },
              ]}
            >
              {dueDate ? dueDate.toLocaleDateString() : 'Set due date'}
            </Text>
          </TouchableOpacity>
          {dueDate && (
            <Button
              title="Clear Date"
              onPress={() => setDueDate(undefined)}
              variant="ghost"
              size="small"
            />
          )}
        </View>
        
        {showDatePicker && (
          <DateTimePicker
            value={dueDate || new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event, selectedDate) => {
              setShowDatePicker(Platform.OS === 'ios');
              if (selectedDate) {
                setDueDate(selectedDate);
              }
            }}
          />
        )}
        
        <View style={styles.actions}>
          <Button
            title={existingTodo ? 'Update' : 'Create'}
            onPress={handleSave}
            disabled={!title.trim()}
            fullWidth
          />
          
          {existingTodo && (
            <Button
              title="Delete Todo"
              onPress={handleDelete}
              variant="outline"
              fullWidth
            />
          )}
        </View>
      </ScrollView>
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
    paddingVertical: spacing.lg,
  },
  title: {},
  content: {
    padding: spacing.lg,
    gap: spacing.xl,
  },
  section: {
    gap: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  sectionTitle: {
    fontWeight: '500',
  },
  priorityContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  priorityButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
  },
  priorityText: {},
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  categoryButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
  },
  categoryText: {},
  dateButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
  },
  dateText: {},
  actions: {
    gap: spacing.md,
    marginTop: spacing.lg,
  },
});
