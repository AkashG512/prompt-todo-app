import React from 'react';
import { TextInput, StyleSheet, View, Text, useColorScheme } from 'react-native';
import { lightColors, darkColors, borderRadius, spacing, typography } from '../../constants/theme';
import { useTodoStore } from '../../store/todoStore';

interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  multiline?: boolean;
  numberOfLines?: number;
  label?: string;
  error?: string;
  autoFocus?: boolean;
}

export const Input: React.FC<InputProps> = ({
  value,
  onChangeText,
  placeholder,
  multiline = false,
  numberOfLines = 1,
  label,
  error,
  autoFocus = false,
}) => {
  const systemColorScheme = useColorScheme();
  const settings = useTodoStore((state) => state.settings);
  const theme = settings.theme === 'system' ? systemColorScheme : settings.theme;
  const colors = theme === 'dark' ? darkColors : lightColors;
  
  return (
    <View style={styles.container}>
      {label && (
        <Text
          style={[
            styles.label,
            {
              color: colors.textPrimary,
              fontSize: typography.bodySmall.fontSize,
              fontWeight: typography.caption.fontWeight,
            },
          ]}
        >
          {label}
        </Text>
      )}
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.surface,
            borderColor: error ? colors.error : colors.border,
            color: colors.textPrimary,
            borderRadius: borderRadius.sm,
            fontSize: typography.body.fontSize,
            minHeight: multiline ? 80 : 48,
          },
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textTertiary}
        multiline={multiline}
        numberOfLines={numberOfLines}
        autoFocus={autoFocus}
      />
      {error && (
        <Text
          style={[
            styles.error,
            {
              color: colors.error,
              fontSize: typography.bodySmall.fontSize,
            },
          ]}
        >
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    marginBottom: spacing.sm,
  },
  input: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderWidth: 1,
    textAlignVertical: 'top',
  },
  error: {
    marginTop: spacing.sm,
  },
});
