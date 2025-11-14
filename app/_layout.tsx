import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { useTodoStore } from '../store/todoStore';
import '../global.css';

export default function RootLayout() {
  const systemColorScheme = useColorScheme();
  const settings = useTodoStore((state) => state.settings);
  const hydrate = useTodoStore((state) => state.hydrate);
  
  const theme = settings.theme === 'system' ? systemColorScheme : settings.theme;
  
  useEffect(() => {
    hydrate();
  }, []);
  
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="modals/add-todo"
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen
          name="modals/settings"
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}
