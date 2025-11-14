import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@todo_app_state';

export const saveToStorage = async (key: string, value: any): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(`${STORAGE_KEY}_${key}`, jsonValue);
  } catch (error) {
    console.error('Error saving to storage:', error);
  }
};

export const loadFromStorage = async <T>(key: string): Promise<T | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(`${STORAGE_KEY}_${key}`);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Error loading from storage:', error);
    return null;
  }
};

export const removeFromStorage = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(`${STORAGE_KEY}_${key}`);
  } catch (error) {
    console.error('Error removing from storage:', error);
  }
};

export const clearStorage = async (): Promise<void> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const appKeys = keys.filter(key => key.startsWith(STORAGE_KEY));
    await AsyncStorage.multiRemove(appKeys);
  } catch (error) {
    console.error('Error clearing storage:', error);
  }
};
