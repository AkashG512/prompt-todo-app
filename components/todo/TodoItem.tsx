import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Clock, Trash2, CheckCircle2 } from 'lucide-react-native';
import { useTheme } from '@/stores/useThemeStore';
import { useTodoStore } from '@/stores/useTodoStore';
import { Todo } from '@/types';
import { formatDueDate, isOverdue } from '@/utils/date';
import { triggerHaptic } from '@/utils/haptics';
import { borderRadius, spacing, typography, priorityColors } from '@/constants/theme';
import { Checkbox } from '@/components/ui/Checkbox';
import { Badge } from '@/components/ui/Badge';

interface TodoItemProps {
  todo: Todo;
  onPress: () => void;
}

const SWIPE_THRESHOLD = 80;

export const TodoItem: React.FC<TodoItemProps> = ({ todo, onPress }) => {
  const { colors, isDark } = useTheme();
  const { toggleComplete, deleteTodo } = useTodoStore();
  const [isDeleting, setIsDeleting] = useState(false);
  
  const translateX = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const category = useTodoStore((state) =>
    state.categories.find((cat) => cat.id === todo.category)
  );

  const priorityColor = priorityColors[todo.priority][isDark ? 'dark' : 'light'];

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = e.translationX;
    })
    .onEnd((e) => {
      if (e.translationX < -SWIPE_THRESHOLD) {
        translateX.value = withSpring(-100);
        runOnJS(handleDelete)();
      } else if (e.translationX > SWIPE_THRESHOLD) {
        translateX.value = withSpring(100);
        runOnJS(handleComplete)();
      } else {
        translateX.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  const deleteBackgroundStyle = useAnimatedStyle(() => ({
    opacity: translateX.value < 0 ? Math.min(-translateX.value / SWIPE_THRESHOLD, 1) : 0,
  }));

  const completeBackgroundStyle = useAnimatedStyle(() => ({
    opacity: translateX.value > 0 ? Math.min(translateX.value / SWIPE_THRESHOLD, 1) : 0,
  }));

  const handleComplete = () => {
    triggerHaptic.success();
    toggleComplete(todo.id);
    translateX.value = withSpring(0);
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Todo',
      'Are you sure you want to delete this todo?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => {
            translateX.value = withSpring(0);
          },
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            triggerHaptic.warning();
            setIsDeleting(true);
            scale.value = withTiming(0.8, { duration: 200 });
            opacity.value = withTiming(0, { duration: 200 }, () => {
              runOnJS(deleteTodo)(todo.id);
            });
          },
        },
      ]
    );
  };

  const handlePress = () => {
    triggerHaptic.light();
    scale.value = withSpring(0.98, { damping: 15 }, () => {
      scale.value = withSpring(1);
    });
    onPress();
  };

  if (isDeleting) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.deleteBackground, deleteBackgroundStyle]}>
        <Trash2 size={24} color="#FFFFFF" />
      </Animated.View>
      
      <Animated.View style={[styles.completeBackground, completeBackgroundStyle]}>
        <CheckCircle2 size={24} color="#FFFFFF" />
      </Animated.View>

      <GestureDetector gesture={panGesture}>
        <Animated.View style={animatedStyle}>
          <TouchableOpacity
            onPress={handlePress}
            activeOpacity={0.9}
            style={[
              styles.todoItem,
              { backgroundColor: colors.surface },
            ]}
          >
            <View style={[styles.priorityBar, { backgroundColor: priorityColor }]} />
            
            <View style={styles.content}>
              <View style={styles.header}>
                <Checkbox
                  checked={todo.completed}
                  onToggle={() => toggleComplete(todo.id)}
                />
                
                <View style={styles.textContainer}>
                  <Text
                    style={[
                      styles.title,
                      { color: colors.textPrimary },
                      todo.completed && styles.completedText,
                    ]}
                    numberOfLines={2}
                  >
                    {todo.title}
                  </Text>
                  
                  {todo.description && (
                    <Text
                      style={[
                        styles.description,
                        { color: colors.textSecondary },
                        todo.completed && styles.completedText,
                      ]}
                      numberOfLines={1}
                    >
                      {todo.description}
                    </Text>
                  )}
                </View>
              </View>

              <View style={styles.footer}>
                {category && (
                  <Badge
                    label={category.name}
                    color={category.color}
                    size="small"
                  />
                )}
                
                {todo.dueDate && (
                  <View style={styles.dueDate}>
                    <Clock
                      size={12}
                      color={isOverdue(new Date(todo.dueDate)) ? colors.error : colors.textTertiary}
                    />
                    <Text
                      style={[
                        styles.dueDateText,
                        {
                          color: isOverdue(new Date(todo.dueDate))
                            ? colors.error
                            : colors.textTertiary,
                        },
                      ]}
                    >
                      {formatDueDate(new Date(todo.dueDate))}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
    position: 'relative',
  },
  deleteBackground: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 100,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: borderRadius.md,
  },
  completeBackground: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 100,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: borderRadius.md,
  },
  todoItem: {
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  priorityBar: {
    width: 4,
  },
  content: {
    flex: 1,
    padding: spacing.base,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: typography.body.fontSize,
    fontWeight: '500',
    marginBottom: spacing.xs,
  },
  description: {
    fontSize: typography.bodySmall.fontSize,
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  dueDate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dueDateText: {
    fontSize: typography.caption.fontSize,
    fontWeight: '500',
  },
});
