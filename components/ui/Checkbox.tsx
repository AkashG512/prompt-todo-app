import React from 'react';
import { TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  withSequence,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Check } from 'lucide-react-native';
import { lightColors, darkColors, borderRadius } from '../../constants/theme';
import { triggerLight, triggerSuccess } from '../../utils/haptics';
import { useTodoStore } from '../../store/todoStore';

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
  const systemColorScheme = useColorScheme();
  const settings = useTodoStore((state) => state.settings);
  const theme = settings.theme === 'system' ? systemColorScheme : settings.theme;
  const colors = theme === 'dark' ? darkColors : lightColors;
  const enableHaptics = settings.enableHaptics;
  
  const scale = useSharedValue(1);
  const checkOpacity = useSharedValue(checked ? 1 : 0);
  
  const handleToggle = () => {
    if (enableHaptics) {
      if (!checked) {
        triggerSuccess();
      } else {
        triggerLight();
      }
    }
    
    scale.value = withSequence(
      withSpring(0.8),
      withSpring(1.1),
      withSpring(1)
    );
    
    checkOpacity.value = withTiming(checked ? 0 : 1, { duration: 200 });
    
    onToggle();
  };
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  
  const checkAnimatedStyle = useAnimatedStyle(() => ({
    opacity: checkOpacity.value,
  }));
  
  React.useEffect(() => {
    checkOpacity.value = checked ? 1 : 0;
  }, [checked]);
  
  return (
    <TouchableOpacity onPress={handleToggle} activeOpacity={0.7}>
      <Animated.View
        style={[
          styles.checkbox,
          animatedStyle,
          {
            width: size,
            height: size,
            backgroundColor: checked ? colors.primary : 'transparent',
            borderColor: checked ? colors.primary : colors.border,
            borderRadius: borderRadius.sm / 2,
          },
        ]}
      >
        <Animated.View style={checkAnimatedStyle}>
          <Check size={size * 0.7} color="#FFFFFF" strokeWidth={3} />
        </Animated.View>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  checkbox: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
});
