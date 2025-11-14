import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Todo, Category, AppSettings, Stats } from '@/types';

interface TodoStore {
  todos: Todo[];
  categories: Category[];
  settings: AppSettings;
  hydrated: boolean;
  
  addTodo: (todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt' | 'order'>) => void;
  updateTodo: (id: string, updates: Partial<Todo>) => void;
  deleteTodo: (id: string) => void;
  toggleComplete: (id: string) => void;
  reorderTodos: (todos: Todo[]) => void;
  
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  
  updateSettings: (settings: Partial<AppSettings>) => void;
  
  getStats: () => Stats;
  clearCompleted: () => void;
  resetApp: () => void;
  
  hydrate: () => Promise<void>;
  persist: () => Promise<void>;
}

const defaultCategories: Category[] = [
  { id: '1', name: 'Work', color: '#6366F1', icon: 'briefcase' },
  { id: '2', name: 'Personal', color: '#8B5CF6', icon: 'user' },
  { id: '3', name: 'Shopping', color: '#EC4899', icon: 'shopping-cart' },
  { id: '4', name: 'Health', color: '#10B981', icon: 'heart' },
  { id: '5', name: 'Learning', color: '#F59E0B', icon: 'book' },
];

const defaultSettings: AppSettings = {
  theme: 'system',
  defaultView: 'all',
  enableHaptics: true,
  enableNotifications: true,
  autoDeleteCompleted: 0,
};

const STORAGE_KEY = 'todo-app-storage';

export const useTodoStore = create<TodoStore>((set, get) => ({
  todos: [],
  categories: defaultCategories,
  settings: defaultSettings,
  hydrated: false,

  addTodo: (todoData) => {
    const newTodo: Todo = {
      ...todoData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date(),
      order: get().todos.length,
    };
    
    set((state) => ({
      todos: [...state.todos, newTodo],
    }));
    
    get().persist();
  },

  updateTodo: (id, updates) => {
    set((state) => ({
      todos: state.todos.map((todo) =>
        todo.id === id
          ? { ...todo, ...updates, updatedAt: new Date() }
          : todo
      ),
    }));
    
    get().persist();
  },

  deleteTodo: (id) => {
    set((state) => ({
      todos: state.todos.filter((todo) => todo.id !== id),
    }));
    
    get().persist();
  },

  toggleComplete: (id) => {
    set((state) => ({
      todos: state.todos.map((todo) =>
        todo.id === id
          ? {
              ...todo,
              completed: !todo.completed,
              completedAt: !todo.completed ? new Date() : undefined,
              updatedAt: new Date(),
            }
          : todo
      ),
    }));
    
    get().persist();
  },

  reorderTodos: (todos) => {
    set({ todos: todos.map((todo, index) => ({ ...todo, order: index })) });
    get().persist();
  },

  addCategory: (categoryData) => {
    const newCategory: Category = {
      ...categoryData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    };
    
    set((state) => ({
      categories: [...state.categories, newCategory],
    }));
    
    get().persist();
  },

  updateCategory: (id, updates) => {
    set((state) => ({
      categories: state.categories.map((cat) =>
        cat.id === id ? { ...cat, ...updates } : cat
      ),
    }));
    
    get().persist();
  },

  deleteCategory: (id) => {
    set((state) => ({
      categories: state.categories.filter((cat) => cat.id !== id),
    }));
    
    get().persist();
  },

  updateSettings: (newSettings) => {
    set((state) => ({
      settings: { ...state.settings, ...newSettings },
    }));
    
    get().persist();
  },

  getStats: () => {
    const todos = get().todos;
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    const completedToday = todos.filter(
      (todo) =>
        todo.completed &&
        todo.completedAt &&
        new Date(todo.completedAt) >= today
    ).length;

    const completedThisWeek = todos.filter(
      (todo) =>
        todo.completed &&
        todo.completedAt &&
        new Date(todo.completedAt) >= weekAgo
    ).length;

    const totalTodos = todos.length;
    const completedTotal = todos.filter((todo) => todo.completed).length;
    const completionRate = totalTodos > 0 ? (completedTotal / totalTodos) * 100 : 0;

    const streak = calculateStreak(todos);

    return {
      totalTodos,
      completedToday,
      completedThisWeek,
      completionRate,
      currentStreak: streak.current,
      longestStreak: streak.longest,
    };
  },

  clearCompleted: () => {
    set((state) => ({
      todos: state.todos.filter((todo) => !todo.completed),
    }));
    
    get().persist();
  },

  resetApp: () => {
    set({
      todos: [],
      categories: defaultCategories,
      settings: defaultSettings,
    });
    
    get().persist();
  },

  hydrate: async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        set({
          todos: data.todos.map((todo: any) => ({
            ...todo,
            createdAt: new Date(todo.createdAt),
            updatedAt: new Date(todo.updatedAt),
            completedAt: todo.completedAt ? new Date(todo.completedAt) : undefined,
            dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined,
          })),
          categories: data.categories || defaultCategories,
          settings: { ...defaultSettings, ...data.settings },
          hydrated: true,
        });
      } else {
        set({ hydrated: true });
      }
    } catch (error) {
      console.error('Failed to hydrate store:', error);
      set({ hydrated: true });
    }
  },

  persist: async () => {
    try {
      const { todos, categories, settings } = get();
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ todos, categories, settings })
      );
    } catch (error) {
      console.error('Failed to persist store:', error);
    }
  },
}));

function calculateStreak(todos: Todo[]): { current: number; longest: number } {
  const completedDates = todos
    .filter((todo) => todo.completed && todo.completedAt)
    .map((todo) => {
      const date = new Date(todo.completedAt!);
      return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
    })
    .sort((a, b) => b - a);

  if (completedDates.length === 0) {
    return { current: 0, longest: 0 };
  }

  const uniqueDates = [...new Set(completedDates)];
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 1;

  if (uniqueDates[0] === today || uniqueDates[0] === today - 86400000) {
    currentStreak = 1;
    
    for (let i = 1; i < uniqueDates.length; i++) {
      const diff = uniqueDates[i - 1] - uniqueDates[i];
      if (diff === 86400000) {
        currentStreak++;
      } else {
        break;
      }
    }
  }

  for (let i = 1; i < uniqueDates.length; i++) {
    const diff = uniqueDates[i - 1] - uniqueDates[i];
    if (diff === 86400000) {
      tempStreak++;
    } else {
      longestStreak = Math.max(longestStreak, tempStreak);
      tempStreak = 1;
    }
  }
  
  longestStreak = Math.max(longestStreak, tempStreak, currentStreak);

  return { current: currentStreak, longest: longestStreak };
}
