import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  Pressable,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Calendar, Tag, Trash2, Edit } from 'lucide-react-native';
import { Todo } from '../../types';
import { Checkbox } from '../ui/Checkbox';
import { Badge } from '../ui/Badge';
import { useTodoStore } from '../../store/todoStore';
import {
  lightColors,
  darkColors,
  borderRadius,
  spacing,
  typography,
  shadows,
  priorityColors,
  priorityColorsDark,
} from '../../constants/theme';
import { formatDueDate, isOverdue } from '../../utils/dateUtils';
import { triggerMedium } from '../../utils/haptics';

interface TodoItemProps {
  todo: Todo;
  onPress: () => void;
}

const SWIPE_THRESHOLD = 80;

export const TodoItem: React.FC<TodoItemProps> = ({ todo, onPress }) => {
  const systemColorScheme = useColorScheme();
  const settings = useTodoStore((state) => state.settings);
  const theme = settings.theme === 'system' ? systemColorScheme : settings.theme;
  const colors = theme === 'dark' ? darkColors : lightColors;
  const priorityColorMap = theme === 'dark' ? priorityColorsDark : priorityColors;
  const enableHaptics = settings.enableHaptics;
  
  const toggleComplete = useTodoStore((state) => state.toggleComplete);
  const deleteTodo = useTodoStore((state) => state.deleteTodo);
  const categories = useTodoStore((state) => state.categories);
  
  const translateX = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  
  const category = categories.find((cat) => cat.id === todo.category);
  const priorityColor = priorityColorMap[todo.priority];
  const isTaskOverdue = todo.dueDate && !todo.completed && isOverdue(new Date(todo.dueDate));
  
  const handleDelete = () => {
    if (enableHaptics) {
      triggerMedium();
    }
    
    opacity.value = withTiming(0, { duration: 200 });
    scale.value = withSpring(0.8, {}, () => {
      runOnJS(deleteTodo)(todo.id);
    });
  };
  
  const handleComplete = () => {
    toggleComplete(todo.id);
  };
  
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationX < 0) {
        translateX.value = Math.max(event.translationX, -SWIPE_THRESHOLD * 2);
      } else {
        translateX.value = Math.min(event.translationX, SWIPE_THRESHOLD * 2);
      }
    })
    .onEnd((event) => {
      if (event.translationX < -SWIPE_THRESHOLD) {
        translateX.value = withSpring(-SWIPE_THRESHOLD * 1.5);
      } else if (event.translationX > SWIPE_THRESHOLD) {
        translateX.value = withSpring(0, {}, () => {
          runOnJS(handleComplete)();
        });
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
  
  const deleteButtonStyle = useAnimatedStyle(() => ({
    opacity: translateX.value < -20 ? 1 : 0,
  }));
  
  return (
    <View style={styles.container}>
      <Animated.View style={[styles.deleteButton, deleteButtonStyle]}>
        <TouchableOpacity
          style={[
            styles.deleteButtonInner,
            { backgroundColor: colors.error },
          ]}
          onPress={handleDelete}
        >
          <Trash2 size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </Animated.View>
      
      <GestureDetector gesture={panGesture}>
        <Animated.View style={animatedStyle}>
          <Pressable
            onPress={onPress}
            style={({ pressed }) => [
              styles.todoItem,
              {
                backgroundColor: colors.surface,
                borderRadius: borderRadius.md,
                opacity: pressed ? 0.7 : 1,
              },
              shadows.small,
            ]}
          >
            <View
              style={[
                styles.priorityIndicator,
                {
                  backgroundColor: priorityColor,
                  borderTopLeftRadius: borderRadius.md,
                  borderBottomLeftRadius: borderRadius.md,
                },
              ]}
            />
            
            <View style={styles.content}>
              <View style={styles.mainContent}>
                <Checkbox checked={todo.completed} onToggle={handleComplete} />
                
                <View style={styles.textContent}>
                  <Text
                    style={[
                      styles.title,
                      {
                        color: todo.completed ? colors.textTertiary : colors.textPrimary,
                        fontSize: typography.body.fontSize,
                        fontWeight: typography.body.fontWeight,
                        textDecorationLine: todo.completed ? 'line-through' : 'none',
                      },
                    ]}
                    numberOfLines={2}
                  >
                    {todo.title}
                  </Text>
                  
                  {todo.description && (
                    <Text
                      style={[
                        styles.description,
                        {
                          color: colors.textSecondary,
                          fontSize: typography.bodySmall.fontSize,
                        },
                      ]}
                      numberOfLines={1}
                    >
                      {todo.description}
                    </Text>
                  )}
                  
                  <View style={styles.metadata}>
                    {category && (
                      <View style={styles.metadataItem}>
                        <Tag size={12} color={category.color} />
                        <Text
                          style={[
                            styles.metadataText,
                            {
                              color: category.color,
                              fontSize: typography.caption.fontSize,
                            },
                          ]}
                        >
                          {category.name}
                        </Text>
                      </View>
                    )}
                    
                    {todo.dueDate && (
                      <View style={styles.metadataItem}>
                        <Calendar
                          size={12}
                          color={isTaskOverdue ? colors.error : colors.textSecondary}
                        />
                        <Text
                          style={[
                            styles.metadataText,
                            {
                              color: isTaskOverdue ? colors.error : colors.textSecondary,
                              fontSize: typography.caption.fontSize,
                            },
                          ]}
                        >
                          {formatDueDate(new Date(todo.dueDate))}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
              
              {todo.priority !== 'low' && (
                <Badge
                  label={todo.priority}
                  color={priorityColor}
                  variant="outlined"
                />
              )}
            </View>
          </Pressable>
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
  deleteButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    paddingRight: spacing.lg,
  },
  deleteButtonInner: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  todoItem: {
    flexDirection: 'row',
    padding: spacing.lg,
    overflow: 'hidden',
  },
  priorityIndicator: {
    width: 4,
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  mainContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  textContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  title: {
    marginBottom: spacing.xs,
  },
  description: {
    marginBottom: spacing.sm,
  },
  metadata: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  metadataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  metadataText: {
    fontWeight: '500',
  },
});
