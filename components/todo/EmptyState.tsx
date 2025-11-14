import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { CheckCircle2 } from 'lucide-react-native';
import { useTodoStore } from '../../store/todoStore';
import { lightColors, darkColors, spacing, typography } from '../../constants/theme';

interface EmptyStateProps {
  message?: string;
  description?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  message = 'No todos yet',
  description = 'Add a new todo to get started',
}) => {
  const systemColorScheme = useColorScheme();
  const settings = useTodoStore((state) => state.settings);
  const theme = settings.theme === 'system' ? systemColorScheme : settings.theme;
  const colors = theme === 'dark' ? darkColors : lightColors;
  
  return (
    <View style={styles.container}>
      <CheckCircle2 size={64} color={colors.textTertiary} strokeWidth={1.5} />
      <Text
        style={[
          styles.message,
          {
            color: colors.textPrimary,
            fontSize: typography.h3.fontSize,
            fontWeight: typography.h3.fontWeight,
          },
        ]}
      >
        {message}
      </Text>
      <Text
        style={[
          styles.description,
          {
            color: colors.textSecondary,
            fontSize: typography.body.fontSize,
          },
        ]}
      >
        {description}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxxl,
  },
  message: {
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
  },
});
