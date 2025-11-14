import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  Keyboard,
} from 'react-native';
import { Plus } from 'lucide-react-native';
import { useTodoStore } from '../../store/todoStore';
import { lightColors, darkColors, borderRadius, spacing, typography, shadows } from '../../constants/theme';
import { triggerLight } from '../../utils/haptics';

export const TodoInput: React.FC = () => {
  const [text, setText] = useState('');
  const systemColorScheme = useColorScheme();
  const settings = useTodoStore((state) => state.settings);
  const theme = settings.theme === 'system' ? systemColorScheme : settings.theme;
  const colors = theme === 'dark' ? darkColors : lightColors;
  const enableHaptics = settings.enableHaptics;
  
  const addTodo = useTodoStore((state) => state.addTodo);
  
  const handleAdd = () => {
    if (text.trim()) {
      if (enableHaptics) {
        triggerLight();
      }
      
      addTodo({
        title: text.trim(),
        completed: false,
        priority: 'medium',
        category: 'personal',
      });
      
      setText('');
      Keyboard.dismiss();
    }
  };
  
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderRadius: borderRadius.md,
        },
        shadows.small,
      ]}
    >
      <TextInput
        style={[
          styles.input,
          {
            color: colors.textPrimary,
            fontSize: typography.body.fontSize,
          },
        ]}
        value={text}
        onChangeText={setText}
        placeholder="Add a new todo..."
        placeholderTextColor={colors.textTertiary}
        onSubmitEditing={handleAdd}
        returnKeyType="done"
      />
      <TouchableOpacity
        style={[
          styles.addButton,
          {
            backgroundColor: colors.primary,
            borderRadius: borderRadius.sm,
          },
        ]}
        onPress={handleAdd}
        disabled={!text.trim()}
      >
        <Plus size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.md,
  },
  input: {
    flex: 1,
    paddingHorizontal: spacing.sm,
  },
  addButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
