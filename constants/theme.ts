export const lightColors = {
  background: '#FAFAFA',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  primary: '#6366F1',
  primaryHover: '#4F46E5',
  secondary: '#8B5CF6',
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  textPrimary: '#1F2937',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  border: '#E5E7EB',
  borderHover: '#D1D5DB',
};

export const darkColors = {
  background: '#0F0F0F',
  surface: '#1A1A1A',
  surfaceElevated: '#242424',
  primary: '#818CF8',
  primaryHover: '#6366F1',
  secondary: '#A78BFA',
  success: '#34D399',
  error: '#F87171',
  warning: '#FBBF24',
  textPrimary: '#F9FAFB',
  textSecondary: '#D1D5DB',
  textTertiary: '#9CA3AF',
  border: '#2D2D2D',
  borderHover: '#3D3D3D',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
  xxxxl: 64,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
};

export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: '700' as const,
  },
  h2: {
    fontSize: 24,
    fontWeight: '600' as const,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600' as const,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400' as const,
  },
  caption: {
    fontSize: 12,
    fontWeight: '500' as const,
  },
};

export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 5,
  },
};

export const priorityColors = {
  urgent: '#EF4444',
  high: '#F59E0B',
  medium: '#F59E0B',
  low: '#9CA3AF',
};

export const priorityColorsDark = {
  urgent: '#F87171',
  high: '#FBBF24',
  medium: '#FBBF24',
  low: '#9CA3AF',
};

export const categoryColors = [
  '#6366F1', // indigo
  '#8B5CF6', // violet
  '#EC4899', // pink
  '#10B981', // emerald
  '#F59E0B', // amber
  '#3B82F6', // blue
  '#EF4444', // red
  '#14B8A6', // teal
];
