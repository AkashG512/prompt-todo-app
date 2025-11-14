import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { X, Moon, Sun, Vibrate, Trash2, Download, Upload } from 'lucide-react-native';
import { useTodoStore } from '@/stores/useTodoStore';
import { useTheme } from '@/stores/useThemeStore';
import { Card } from '@/components/ui/Card';
import { spacing, typography } from '@/constants/theme';
import { triggerHaptic } from '@/utils/haptics';

export default function SettingsModal() {
  const { colors, isDark, setMode } = useTheme();
  const { settings, updateSettings, resetApp } = useTodoStore();

  const handleThemeToggle = () => {
    triggerHaptic.light();
    setMode(isDark ? 'light' : 'dark');
  };

  const handleHapticsToggle = () => {
    triggerHaptic.light();
    updateSettings({ enableHaptics: !settings.enableHaptics });
  };

  const handleResetApp = () => {
    Alert.alert(
      'Reset App',
      'Are you sure you want to reset the app? This will delete all todos, categories, and settings. This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            triggerHaptic.warning();
            resetApp();
            router.back();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Settings</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <X size={28} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Appearance</Text>
          <Card>
            <TouchableOpacity style={styles.settingRow} onPress={handleThemeToggle}>
              <View style={styles.settingLeft}>
                {isDark ? (
                  <Moon size={20} color={colors.textPrimary} />
                ) : (
                  <Sun size={20} color={colors.textPrimary} />
                )}
                <View>
                  <Text style={[styles.settingLabel, { color: colors.textPrimary }]}>
                    Dark Mode
                  </Text>
                  <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                    {isDark ? 'Enabled' : 'Disabled'}
                  </Text>
                </View>
              </View>
              <Switch
                value={isDark}
                onValueChange={handleThemeToggle}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#FFFFFF"
              />
            </TouchableOpacity>
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Preferences</Text>
          <Card>
            <TouchableOpacity style={styles.settingRow} onPress={handleHapticsToggle}>
              <View style={styles.settingLeft}>
                <Vibrate size={20} color={colors.textPrimary} />
                <View>
                  <Text style={[styles.settingLabel, { color: colors.textPrimary }]}>
                    Haptic Feedback
                  </Text>
                  <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                    Feel vibrations for interactions
                  </Text>
                </View>
              </View>
              <Switch
                value={settings.enableHaptics}
                onValueChange={handleHapticsToggle}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#FFFFFF"
              />
            </TouchableOpacity>
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Data</Text>
          <Card>
            <TouchableOpacity
              style={styles.settingRow}
              onPress={() => {
                triggerHaptic.light();
                Alert.alert('Export Data', 'Export functionality coming soon!');
              }}
            >
              <View style={styles.settingLeft}>
                <Download size={20} color={colors.textPrimary} />
                <View>
                  <Text style={[styles.settingLabel, { color: colors.textPrimary }]}>
                    Export Data
                  </Text>
                  <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                    Download your todos as JSON
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            <TouchableOpacity
              style={styles.settingRow}
              onPress={() => {
                triggerHaptic.light();
                Alert.alert('Import Data', 'Import functionality coming soon!');
              }}
            >
              <View style={styles.settingLeft}>
                <Upload size={20} color={colors.textPrimary} />
                <View>
                  <Text style={[styles.settingLabel, { color: colors.textPrimary }]}>
                    Import Data
                  </Text>
                  <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                    Restore from JSON backup
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Danger Zone</Text>
          <Card>
            <TouchableOpacity style={styles.settingRow} onPress={handleResetApp}>
              <View style={styles.settingLeft}>
                <Trash2 size={20} color={colors.error} />
                <View>
                  <Text style={[styles.settingLabel, { color: colors.error }]}>Reset App</Text>
                  <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                    Delete all data and start over
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </Card>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.version, { color: colors.textTertiary }]}>Version 1.0.0</Text>
          <Text style={[styles.copyright, { color: colors.textTertiary }]}>
            Made with ❤️ by Todo App
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
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
  },
  title: {
    fontSize: typography.h2.fontSize,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.base,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.caption.fontSize,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: spacing.md,
    paddingHorizontal: spacing.xs,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  settingLabel: {
    fontSize: typography.body.fontSize,
    fontWeight: '500',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: typography.caption.fontSize,
  },
  divider: {
    height: 1,
    marginVertical: spacing.sm,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  version: {
    fontSize: typography.caption.fontSize,
    marginBottom: spacing.xs,
  },
  copyright: {
    fontSize: typography.caption.fontSize,
  },
});
