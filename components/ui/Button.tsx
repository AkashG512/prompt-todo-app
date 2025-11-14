import React from 'react';
import { TouchableOpacity, Text, StyleSheet, useColorScheme, ActivityIndicator } from 'react-native';
import { lightColors, darkColors, borderRadius, spacing, typography } from '../../constants/theme';
import { triggerLight } from '../../utils/haptics';
import { useTodoStore } from '../../store/todoStore';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
}) => {
  const systemColorScheme = useColorScheme();
  const settings = useTodoStore((state) => state.settings);
  const theme = settings.theme === 'system' ? systemColorScheme : settings.theme;
  const colors = theme === 'dark' ? darkColors : lightColors;
  const enableHaptics = settings.enableHaptics;
  
  const handlePress = () => {
    if (!disabled && !loading) {
      if (enableHaptics) {
        triggerLight();
      }
      onPress();
    }
  };
  
  const getBackgroundColor = () => {
    if (disabled) return colors.border;
    
    switch (variant) {
      case 'primary':
        return colors.primary;
      case 'secondary':
        return colors.secondary;
      case 'outline':
      case 'ghost':
        return 'transparent';
      default:
        return colors.primary;
    }
  };
  
  const getTextColor = () => {
    if (disabled) return colors.textTertiary;
    
    switch (variant) {
      case 'primary':
      case 'secondary':
        return '#FFFFFF';
      case 'outline':
      case 'ghost':
        return colors.primary;
      default:
        return '#FFFFFF';
    }
  };
  
  const getPadding = () => {
    switch (size) {
      case 'small':
        return { paddingVertical: spacing.sm, paddingHorizontal: spacing.lg };
      case 'large':
        return { paddingVertical: spacing.lg, paddingHorizontal: spacing.xl };
      case 'medium':
      default:
        return { paddingVertical: spacing.md, paddingHorizontal: spacing.xl };
    }
  };
  
  const getFontSize = () => {
    switch (size) {
      case 'small':
        return typography.bodySmall.fontSize;
      case 'large':
        return typography.body.fontSize;
      case 'medium':
      default:
        return typography.body.fontSize;
    }
  };
  
  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: variant === 'outline' ? colors.primary : 'transparent',
          borderWidth: variant === 'outline' ? 1 : 0,
          borderRadius: borderRadius.sm,
          opacity: disabled ? 0.5 : 1,
          ...getPadding(),
          width: fullWidth ? '100%' : 'auto',
        },
      ]}
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <Text
          style={[
            styles.text,
            {
              color: getTextColor(),
              fontSize: getFontSize(),
              fontWeight: typography.body.fontWeight,
            },
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  text: {
    textAlign: 'center',
  },
});
