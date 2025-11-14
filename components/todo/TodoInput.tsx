import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Plus } from 'lucide-react-native';
import { useTheme } from '@/stores/useThemeStore';
import { borderRadius, spacing, typography } from '@/constants/theme';
import { triggerHaptic } from '@/utils/haptics';

interface TodoInputProps {
  onAdd: (title: string) => void;
  placeholder?: string;
}

export const TodoInput: React.FC<TodoInputProps> = ({
  onAdd,
  placeholder = 'Add a new todo...',
}) => {
  const { colors } = useTheme();
  const [text, setText] = useState('');

  const handleAdd = () => {
    if (text.trim()) {
      triggerHaptic.light();
      onAdd(text.trim());
      setText('');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <TextInput
        style={[styles.input, { color: colors.textPrimary }]}
        value={text}
        onChangeText={setText}
        placeholder={placeholder}
        placeholderTextColor={colors.textTertiary}
        onSubmitEditing={handleAdd}
        returnKeyType="done"
        blurOnSubmit={false}
      />
      <TouchableOpacity
        onPress={handleAdd}
        style={[styles.addButton, { backgroundColor: colors.primary }]}
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
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: typography.body.fontSize,
    paddingVertical: spacing.sm,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
