import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Check } from 'lucide-react-native';
import { useTheme } from '@/stores/useThemeStore';
import { borderRadius } from '@/constants/theme';
import { triggerHaptic } from '@/utils/haptics';

interface CheckboxProps {
  checked: boolean;
  onToggle: () => void;
  size?: number;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onToggle,
  size = 24,
}) => {
  const { colors } = useTheme();
  const scale = useSharedValue(checked ? 1 : 0);
  const checkScale = useSharedValue(checked ? 1 : 0);

  React.useEffect(() => {
    scale.value = withSpring(checked ? 1 : 0, {
      damping: 15,
      stiffness: 300,
    });
    checkScale.value = withTiming(checked ? 1 : 0, {
      duration: 200,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  }, [checked]);

  const animatedContainerStyle = useAnimatedStyle(() => ({
    backgroundColor: checked ? colors.primary : 'transparent',
    transform: [{ scale: scale.value * 0.1 + 0.9 }],
  }));

  const animatedCheckStyle = useAnimatedStyle(() => ({
    opacity: checkScale.value,
    transform: [{ scale: checkScale.value }],
  }));

  const handleToggle = () => {
    triggerHaptic.light();
    onToggle();
  };

  return (
    <TouchableOpacity onPress={handleToggle} activeOpacity={0.7}>
      <Animated.View
        style={[
          styles.checkbox,
          {
            width: size,
            height: size,
            borderColor: checked ? colors.primary : colors.border,
          },
          animatedContainerStyle,
        ]}
      >
        <Animated.View style={animatedCheckStyle}>
          <Check size={size * 0.6} color="#FFFFFF" strokeWidth={3} />
        </Animated.View>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  checkbox: {
    borderWidth: 2,
    borderRadius: borderRadius.sm - 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
