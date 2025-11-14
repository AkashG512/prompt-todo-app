import { create } from 'zustand';
import { Todo, Category, AppSettings, Stats } from '../types';
import { defaultCategories } from '../constants/categories';
import { saveToStorage, loadFromStorage } from '../utils/storage';
import { isToday, isThisWeek, startOfDay, endOfDay, startOfWeek, endOfWeek } from 'date-fns';

interface TodoStore {
  todos: Todo[];
  categories: Category[];
  settings: AppSettings;
  deletedTodos: { todo: Todo; timestamp: number }[];
  
  addTodo: (todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt' | 'order'>) => void;
  updateTodo: (id: string, updates: Partial<Todo>) => void;
  deleteTodo: (id: string) => void;
  toggleComplete: (id: string) => void;
  reorderTodos: (todos: Todo[]) => void;
  undoDelete: () => void;
  clearDeletedTodos: () => void;
  
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  
  updateSettings: (settings: Partial<AppSettings>) => void;
  
  getStats: () => Stats;
  getTodosByFilter: (filter: 'all' | 'today' | 'upcoming' | 'completed') => Todo[];
  
  hydrate: () => Promise<void>;
  persist: () => Promise<void>;
}

const defaultSettings: AppSettings = {
  theme: 'system',
  defaultView: 'all',
  enableHaptics: true,
  enableNotifications: true,
  autoDeleteCompleted: 0,
};

export const useTodoStore = create<TodoStore>((set, get) => ({
  todos: [],
  categories: defaultCategories,
  settings: defaultSettings,
  deletedTodos: [],
  
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
    const todo = get().todos.find((t) => t.id === id);
    if (todo) {
      set((state) => ({
        todos: state.todos.filter((t) => t.id !== id),
        deletedTodos: [...state.deletedTodos, { todo, timestamp: Date.now() }],
      }));
      
      get().persist();
    }
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
    set({ todos });
    get().persist();
  },
  
  undoDelete: () => {
    const { deletedTodos } = get();
    if (deletedTodos.length > 0) {
      const lastDeleted = deletedTodos[deletedTodos.length - 1];
      set((state) => ({
        todos: [...state.todos, lastDeleted.todo],
        deletedTodos: state.deletedTodos.slice(0, -1),
      }));
      
      get().persist();
    }
  },
  
  clearDeletedTodos: () => {
    set({ deletedTodos: [] });
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
      todos: state.todos.map((todo) =>
        todo.category === id ? { ...todo, category: 'personal' } : todo
      ),
    }));
    
    get().persist();
  },
  
  updateSettings: (updates) => {
    set((state) => ({
      settings: { ...state.settings, ...updates },
    }));
    
    get().persist();
  },
  
  getStats: () => {
    const { todos } = get();
    const now = new Date();
    
    const completedToday = todos.filter(
      (todo) =>
        todo.completed &&
        todo.completedAt &&
        isToday(new Date(todo.completedAt))
    ).length;
    
    const completedThisWeek = todos.filter(
      (todo) =>
        todo.completed &&
        todo.completedAt &&
        isThisWeek(new Date(todo.completedAt))
    ).length;
    
    const totalCompleted = todos.filter((todo) => todo.completed).length;
    const totalTodos = todos.length;
    const completionRate = totalTodos > 0 ? (totalCompleted / totalTodos) * 100 : 0;
    
    const sortedCompletedDates = todos
      .filter((todo) => todo.completed && todo.completedAt)
      .map((todo) => startOfDay(new Date(todo.completedAt!)))
      .sort((a, b) => b.getTime() - a.getTime());
    
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    let lastDate: Date | null = null;
    
    for (const date of sortedCompletedDates) {
      if (!lastDate) {
        tempStreak = 1;
      } else {
        const daysDiff = Math.floor(
          (lastDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
        );
        
        if (daysDiff === 1) {
          tempStreak++;
        } else {
          if (tempStreak > longestStreak) {
            longestStreak = tempStreak;
          }
          tempStreak = 1;
        }
      }
      
      lastDate = date;
    }
    
    if (tempStreak > longestStreak) {
      longestStreak = tempStreak;
    }
    
    currentStreak = tempStreak;
    
    return {
      totalTodos,
      completedToday,
      completedThisWeek,
      completionRate,
      currentStreak,
      longestStreak,
    };
  },
  
  getTodosByFilter: (filter) => {
    const { todos } = get();
    const now = new Date();
    
    switch (filter) {
      case 'today':
        return todos.filter(
          (todo) =>
            !todo.completed &&
            todo.dueDate &&
            isToday(new Date(todo.dueDate))
        );
      
      case 'upcoming':
        return todos.filter(
          (todo) =>
            !todo.completed &&
            todo.dueDate &&
            new Date(todo.dueDate) > endOfDay(now)
        );
      
      case 'completed':
        return todos.filter((todo) => todo.completed);
      
      case 'all':
      default:
        return todos.filter((todo) => !todo.completed);
    }
  },
  
  hydrate: async () => {
    try {
      const todos = await loadFromStorage<Todo[]>('todos');
      const categories = await loadFromStorage<Category[]>('categories');
      const settings = await loadFromStorage<AppSettings>('settings');
      
      set({
        todos: todos || [],
        categories: categories || defaultCategories,
        settings: settings || defaultSettings,
      });
    } catch (error) {
      console.error('Error hydrating store:', error);
    }
  },
  
  persist: async () => {
    try {
      const { todos, categories, settings } = get();
      await saveToStorage('todos', todos);
      await saveToStorage('categories', categories);
      await saveToStorage('settings', settings);
    } catch (error) {
      console.error('Error persisting store:', error);
    }
  },
}));
