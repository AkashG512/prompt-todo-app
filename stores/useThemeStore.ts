import { create } from 'zustand';
import { useColorScheme } from 'react-native';
import { colors } from '@/constants/theme';

type ThemeMode = 'light' | 'dark';

interface ThemeStore {
  mode: ThemeMode;
  colors: typeof colors.light;
  setMode: (mode: ThemeMode) => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  mode: 'light',
  colors: colors.light,
  setMode: (mode) => set({ mode, colors: colors[mode] }),
}));

export const useTheme = () => {
  const systemColorScheme = useColorScheme();
  const { mode, colors: themeColors, setMode } = useThemeStore();
  
  const effectiveMode = mode === 'light' || mode === 'dark' ? mode : (systemColorScheme || 'light') as ThemeMode;
  const effectiveColors = colors[effectiveMode];

  return {
    mode: effectiveMode,
    colors: effectiveColors,
    isDark: effectiveMode === 'dark',
    setMode,
  };
};
