import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { X, Moon, Sun, Smartphone, Vibrate, Trash2 } from 'lucide-react-native';
import { useTodoStore } from '../../store/todoStore';
import { Card } from '../../components/ui/Card';
import { lightColors, darkColors, spacing, typography, borderRadius } from '../../constants/theme';
import { Theme } from '../../types';
import { triggerLight, triggerWarning } from '../../utils/haptics';
import { clearStorage } from '../../utils/storage';

export default function SettingsModal() {
  const router = useRouter();
  const systemColorScheme = useColorScheme();
  const settings = useTodoStore((state) => state.settings);
  const theme = settings.theme === 'system' ? systemColorScheme : settings.theme;
  const colors = theme === 'dark' ? darkColors : lightColors;
  
  const updateSettings = useTodoStore((state) => state.updateSettings);
  const todos = useTodoStore((state) => state.todos);
  const persist = useTodoStore((state) => state.persist);
  
  const handleThemeChange = (newTheme: Theme) => {
    if (settings.enableHaptics) {
      triggerLight();
    }
    updateSettings({ theme: newTheme });
  };
  
  const handleHapticsToggle = (value: boolean) => {
    if (value) {
      triggerLight();
    }
    updateSettings({ enableHaptics: value });
  };
  
  const handleResetApp = () => {
    if (settings.enableHaptics) {
      triggerWarning();
    }
    
    Alert.alert(
      'Reset App',
      'This will delete all your todos and reset settings. This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await clearStorage();
            updateSettings({
              theme: 'system',
              defaultView: 'all',
              enableHaptics: true,
              enableNotifications: true,
              autoDeleteCompleted: 0,
            });
            router.back();
          },
        },
      ]
    );
  };
  
  const completedTodos = todos.filter((t) => t.completed);
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text
          style={[
            styles.title,
            {
              color: colors.textPrimary,
              fontSize: typography.h2.fontSize,
              fontWeight: typography.h2.fontWeight,
            },
          ]}
        >
          Settings
        </Text>
        <TouchableOpacity onPress={() => router.back()}>
          <X size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>
      
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: colors.textSecondary,
                fontSize: typography.bodySmall.fontSize,
              },
            ]}
          >
            Appearance
          </Text>
          
          <Card elevated padding={0}>
            <TouchableOpacity
              style={[
                styles.themeOption,
                {
                  backgroundColor: settings.theme === 'light' ? `${colors.primary}20` : 'transparent',
                  borderBottomColor: colors.border,
                },
              ]}
              onPress={() => handleThemeChange('light')}
            >
              <View style={styles.optionLeft}>
                <Sun size={20} color={colors.textPrimary} />
                <Text
                  style={[
                    styles.optionText,
                    {
                      color: colors.textPrimary,
                      fontSize: typography.body.fontSize,
                    },
                  ]}
                >
                  Light
                </Text>
              </View>
              {settings.theme === 'light' && (
                <View
                  style={[
                    styles.checkmark,
                    { backgroundColor: colors.primary, borderRadius: borderRadius.sm },
                  ]}
                />
              )}
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.themeOption,
                {
                  backgroundColor: settings.theme === 'dark' ? `${colors.primary}20` : 'transparent',
                  borderBottomColor: colors.border,
                },
              ]}
              onPress={() => handleThemeChange('dark')}
            >
              <View style={styles.optionLeft}>
                <Moon size={20} color={colors.textPrimary} />
                <Text
                  style={[
                    styles.optionText,
                    {
                      color: colors.textPrimary,
                      fontSize: typography.body.fontSize,
                    },
                  ]}
                >
                  Dark
                </Text>
              </View>
              {settings.theme === 'dark' && (
                <View
                  style={[
                    styles.checkmark,
                    { backgroundColor: colors.primary, borderRadius: borderRadius.sm },
                  ]}
                />
              )}
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.themeOption,
                {
                  backgroundColor: settings.theme === 'system' ? `${colors.primary}20` : 'transparent',
                  borderBottomWidth: 0,
                },
              ]}
              onPress={() => handleThemeChange('system')}
            >
              <View style={styles.optionLeft}>
                <Smartphone size={20} color={colors.textPrimary} />
                <Text
                  style={[
                    styles.optionText,
                    {
                      color: colors.textPrimary,
                      fontSize: typography.body.fontSize,
                    },
                  ]}
                >
                  System
                </Text>
              </View>
              {settings.theme === 'system' && (
                <View
                  style={[
                    styles.checkmark,
                    { backgroundColor: colors.primary, borderRadius: borderRadius.sm },
                  ]}
                />
              )}
            </TouchableOpacity>
          </Card>
        </View>
        
        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: colors.textSecondary,
                fontSize: typography.bodySmall.fontSize,
              },
            ]}
          >
            Preferences
          </Text>
          
          <Card elevated padding={0}>
            <View
              style={[
                styles.settingOption,
                {
                  borderBottomColor: colors.border,
                  borderBottomWidth: 0,
                },
              ]}
            >
              <View style={styles.optionLeft}>
                <Vibrate size={20} color={colors.textPrimary} />
                <View>
                  <Text
                    style={[
                      styles.optionText,
                      {
                        color: colors.textPrimary,
                        fontSize: typography.body.fontSize,
                      },
                    ]}
                  >
                    Haptic Feedback
                  </Text>
                  <Text
                    style={[
                      styles.optionDescription,
                      {
                        color: colors.textSecondary,
                        fontSize: typography.bodySmall.fontSize,
                      },
                    ]}
                  >
                    Vibrate on interactions
                  </Text>
                </View>
              </View>
              <Switch
                value={settings.enableHaptics}
                onValueChange={handleHapticsToggle}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#FFFFFF"
              />
            </View>
          </Card>
        </View>
        
        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: colors.textSecondary,
                fontSize: typography.bodySmall.fontSize,
              },
            ]}
          >
            Data
          </Text>
          
          <Card elevated padding={0}>
            <View style={styles.dataInfo}>
              <Text
                style={[
                  styles.dataText,
                  {
                    color: colors.textPrimary,
                    fontSize: typography.body.fontSize,
                  },
                ]}
              >
                Total Todos: {todos.length}
              </Text>
              <Text
                style={[
                  styles.dataText,
                  {
                    color: colors.textPrimary,
                    fontSize: typography.body.fontSize,
                  },
                ]}
              >
                Completed: {completedTodos.length}
              </Text>
            </View>
          </Card>
        </View>
        
        <View style={styles.section}>
          <TouchableOpacity
            style={[
              styles.dangerButton,
              {
                backgroundColor: colors.surface,
                borderColor: colors.error,
                borderRadius: borderRadius.sm,
              },
            ]}
            onPress={handleResetApp}
          >
            <Trash2 size={20} color={colors.error} />
            <Text
              style={[
                styles.dangerButtonText,
                {
                  color: colors.error,
                  fontSize: typography.body.fontSize,
                  fontWeight: '600',
                },
              ]}
            >
              Reset App
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.footer}>
          <Text
            style={[
              styles.footerText,
              {
                color: colors.textTertiary,
                fontSize: typography.caption.fontSize,
                textAlign: 'center',
              },
            ]}
          >
            Todo App v1.0.0
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  title: {},
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: spacing.md,
    marginLeft: spacing.sm,
    textTransform: 'uppercase',
  },
  themeOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
  },
  settingOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  optionText: {},
  optionDescription: {
    marginTop: spacing.xs,
  },
  checkmark: {
    width: 8,
    height: 8,
  },
  dataInfo: {
    padding: spacing.lg,
    gap: spacing.sm,
  },
  dataText: {},
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    gap: spacing.sm,
    borderWidth: 1,
  },
  dangerButtonText: {},
  footer: {
    marginTop: spacing.xxxl,
    paddingVertical: spacing.xl,
  },
  footerText: {},
});
