import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, { useAnimatedProps, withTiming, useSharedValue, Easing } from 'react-native-reanimated';
import { useTodoStore } from '../../store/todoStore';
import { lightColors, darkColors, typography } from '../../constants/theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size = 120,
  strokeWidth = 10,
  color,
}) => {
  const systemColorScheme = useColorScheme();
  const settings = useTodoStore((state) => state.settings);
  const theme = settings.theme === 'system' ? systemColorScheme : settings.theme;
  const colors = theme === 'dark' ? darkColors : lightColors;
  
  const ringColor = color || colors.primary;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  const animatedProgress = useSharedValue(0);
  
  React.useEffect(() => {
    animatedProgress.value = withTiming(progress, {
      duration: 1000,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  }, [progress]);
  
  const animatedProps = useAnimatedProps(() => {
    const strokeDashoffset = circumference - (circumference * animatedProgress.value) / 100;
    return {
      strokeDashoffset,
    };
  });
  
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.border}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={ringColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          animatedProps={animatedProps}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <View style={styles.textContainer}>
        <Text
          style={[
            styles.progressText,
            {
              color: colors.textPrimary,
              fontSize: typography.h2.fontSize,
              fontWeight: typography.h2.fontWeight,
            },
          ]}
        >
          {Math.round(progress)}%
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressText: {},
});
