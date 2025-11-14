import React, { useState } from 'react';
import { TextInput, View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { X } from 'lucide-react-native';
import { useTheme } from '@/stores/useThemeStore';
import { borderRadius, spacing, typography } from '@/constants/theme';

interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label?: string;
  multiline?: boolean;
  numberOfLines?: number;
  error?: string;
  editable?: boolean;
  autoFocus?: boolean;
  onClear?: () => void;
}

export const Input: React.FC<InputProps> = ({
  value,
  onChangeText,
  placeholder,
  label,
  multiline = false,
  numberOfLines = 1,
  error,
  editable = true,
  autoFocus = false,
  onClear,
}) => {
  const { colors } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const borderColor = useSharedValue(colors.border);

  const animatedBorderStyle = useAnimatedStyle(() => ({
    borderColor: withTiming(borderColor.value, { duration: 200 }),
  }));

  const handleFocus = () => {
    setIsFocused(true);
    borderColor.value = colors.primary;
  };

  const handleBlur = () => {
    setIsFocused(false);
    borderColor.value = error ? colors.error : colors.border;
  };

  return (
    <View style={styles.container}>
      {label && <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>}
      <Animated.View
        style={[
          styles.inputContainer,
          { backgroundColor: colors.surface, borderColor: colors.border },
          animatedBorderStyle,
          error && { borderColor: colors.error },
        ]}
      >
        <TextInput
          style={[
            styles.input,
            { color: colors.textPrimary },
            multiline && styles.multiline,
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textTertiary}
          multiline={multiline}
          numberOfLines={numberOfLines}
          onFocus={handleFocus}
          onBlur={handleBlur}
          editable={editable}
          autoFocus={autoFocus}
        />
        {value.length > 0 && onClear && (
          <TouchableOpacity onPress={onClear} style={styles.clearButton}>
            <X size={16} color={colors.textTertiary} />
          </TouchableOpacity>
        )}
      </Animated.View>
      {error && <Text style={[styles.error, { color: colors.error }]}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.base,
  },
  label: {
    fontSize: typography.bodySmall.fontSize,
    fontWeight: '500',
    marginBottom: spacing.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.md,
  },
  input: {
    flex: 1,
    fontSize: typography.body.fontSize,
    paddingVertical: spacing.md,
  },
  multiline: {
    minHeight: 80,
    textAlignVertical: 'top',
    paddingTop: spacing.md,
  },
  clearButton: {
    padding: spacing.xs,
  },
  error: {
    fontSize: typography.caption.fontSize,
    marginTop: spacing.xs,
  },
});
