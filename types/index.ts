export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export type ViewType = 'all' | 'today' | 'upcoming' | 'completed';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  dueDate?: Date;
  priority: Priority;
  category: string;
  tags?: string[];
  order: number;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon?: string;
}

export interface AppSettings {
  theme: ThemeMode;
  defaultView: ViewType;
  enableHaptics: boolean;
  enableNotifications: boolean;
  autoDeleteCompleted: number;
}

export interface Stats {
  totalTodos: number;
  completedToday: number;
  completedThisWeek: number;
  completionRate: number;
  currentStreak: number;
  longestStreak: number;
}
