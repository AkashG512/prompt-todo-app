import * as Haptics from 'expo-haptics';
import { useTodoStore } from '@/stores/useTodoStore';

export const triggerHaptic = {
  light: () => {
    const enabled = useTodoStore.getState().settings.enableHaptics;
    if (enabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  },
  
  medium: () => {
    const enabled = useTodoStore.getState().settings.enableHaptics;
    if (enabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  },
  
  heavy: () => {
    const enabled = useTodoStore.getState().settings.enableHaptics;
    if (enabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
  },
  
  success: () => {
    const enabled = useTodoStore.getState().settings.enableHaptics;
    if (enabled) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  },
  
  warning: () => {
    const enabled = useTodoStore.getState().settings.enableHaptics;
    if (enabled) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
  },
  
  error: () => {
    const enabled = useTodoStore.getState().settings.enableHaptics;
    if (enabled) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  },
};
