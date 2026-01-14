/**
 * Custom hook for settings data management
 */

import { useState, useEffect, useCallback } from 'react';
import type {
  CloudConnection,
  ServiceNowConfig,
  SIEMConfig,
  APMConfig,
  User,
  NotificationPreferences,
  AuditLogEntry,
  SettingsState,
  SettingsTab,
} from '../../../types/settings';
import { settingsService } from '../../../services/settingsService';

interface UseSettingsReturn {
  // State
  settings: SettingsState | null;
  auditLogs: AuditLogEntry[];
  activeTab: SettingsTab;
  isLoading: boolean;
  error: string | null;
  testingConnection: string | null;
  testResult: { success: boolean; message: string } | null;

  // Actions
  setActiveTab: (tab: SettingsTab) => void;
  testCloudConnection: (connectionId: string) => Promise<void>;
  updateCloudConnection: (connectionId: string, updates: Partial<CloudConnection>) => Promise<void>;
  addCloudConnection: (connection: Omit<CloudConnection, 'id'>) => Promise<void>;
  deleteCloudConnection: (connectionId: string) => Promise<void>;
  updateServiceNowConfig: (config: Partial<ServiceNowConfig>) => Promise<void>;
  testServiceNowConnection: () => Promise<void>;
  updateSIEMConfig: (config: Partial<SIEMConfig>) => Promise<void>;
  updateAPMConfig: (config: Partial<APMConfig>) => Promise<void>;
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => Promise<void>;
  updateUser: (userId: string, updates: Partial<User>) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  updateNotificationPreferences: (prefs: Partial<NotificationPreferences>) => Promise<void>;
  loadAuditLogs: (filters?: { user?: string; action?: string }) => Promise<void>;
  clearTestResult: () => void;
  refreshSettings: () => Promise<void>;
}

export const useSettings = (): UseSettingsReturn => {
  const [settings, setSettings] = useState<SettingsState | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [activeTab, setActiveTab] = useState<SettingsTab>('cloud');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [testingConnection, setTestingConnection] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const loadSettings = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await settingsService.getSettings();
      setSettings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load settings');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const testCloudConnection = useCallback(async (connectionId: string) => {
    setTestingConnection(connectionId);
    setTestResult(null);
    try {
      const result = await settingsService.testCloudConnection(connectionId);
      setTestResult(result);
    } catch (err) {
      setTestResult({ success: false, message: err instanceof Error ? err.message : 'Test failed' });
    } finally {
      setTestingConnection(null);
    }
  }, []);

  const updateCloudConnection = useCallback(async (
    connectionId: string,
    updates: Partial<CloudConnection>
  ) => {
    try {
      const updated = await settingsService.updateCloudConnection(connectionId, updates);
      setSettings(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          cloudConnections: prev.cloudConnections.map(c =>
            c.id === connectionId ? updated : c
          ),
        };
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update connection');
    }
  }, []);

  const addCloudConnection = useCallback(async (connection: Omit<CloudConnection, 'id'>) => {
    try {
      const newConnection = await settingsService.addCloudConnection(connection);
      setSettings(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          cloudConnections: [...prev.cloudConnections, newConnection],
        };
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add connection');
    }
  }, []);

  const deleteCloudConnection = useCallback(async (connectionId: string) => {
    try {
      await settingsService.deleteCloudConnection(connectionId);
      setSettings(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          cloudConnections: prev.cloudConnections.filter(c => c.id !== connectionId),
        };
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete connection');
    }
  }, []);

  const updateServiceNowConfig = useCallback(async (config: Partial<ServiceNowConfig>) => {
    try {
      const updated = await settingsService.updateServiceNowConfig(config);
      setSettings(prev => prev ? { ...prev, serviceNow: updated } : prev);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update ServiceNow config');
    }
  }, []);

  const testServiceNowConnection = useCallback(async () => {
    setTestingConnection('servicenow');
    setTestResult(null);
    try {
      const result = await settingsService.testServiceNowConnection();
      setTestResult(result);
    } catch (err) {
      setTestResult({ success: false, message: err instanceof Error ? err.message : 'Test failed' });
    } finally {
      setTestingConnection(null);
    }
  }, []);

  const updateSIEMConfig = useCallback(async (config: Partial<SIEMConfig>) => {
    try {
      const updated = await settingsService.updateSIEMConfig(config);
      setSettings(prev => prev ? { ...prev, siem: updated } : prev);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update SIEM config');
    }
  }, []);

  const updateAPMConfig = useCallback(async (config: Partial<APMConfig>) => {
    try {
      const updated = await settingsService.updateAPMConfig(config);
      setSettings(prev => prev ? { ...prev, apm: updated } : prev);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update APM config');
    }
  }, []);

  const addUser = useCallback(async (user: Omit<User, 'id' | 'createdAt'>) => {
    try {
      const newUser = await settingsService.addUser(user);
      setSettings(prev => {
        if (!prev) return prev;
        return { ...prev, users: [...prev.users, newUser] };
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add user');
    }
  }, []);

  const updateUser = useCallback(async (userId: string, updates: Partial<User>) => {
    try {
      const updated = await settingsService.updateUser(userId, updates);
      setSettings(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          users: prev.users.map(u => u.id === userId ? updated : u),
        };
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user');
    }
  }, []);

  const deleteUser = useCallback(async (userId: string) => {
    try {
      await settingsService.deleteUser(userId);
      setSettings(prev => {
        if (!prev) return prev;
        return { ...prev, users: prev.users.filter(u => u.id !== userId) };
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user');
    }
  }, []);

  const updateNotificationPreferences = useCallback(async (
    prefs: Partial<NotificationPreferences>
  ) => {
    try {
      const updated = await settingsService.updateNotificationPreferences(prefs);
      setSettings(prev => prev ? { ...prev, notifications: updated } : prev);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update notification preferences');
    }
  }, []);

  const loadAuditLogs = useCallback(async (filters?: { user?: string; action?: string }) => {
    try {
      const logs = await settingsService.getAuditLogs(filters);
      setAuditLogs(logs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load audit logs');
    }
  }, []);

  const clearTestResult = useCallback(() => {
    setTestResult(null);
  }, []);

  return {
    settings,
    auditLogs,
    activeTab,
    isLoading,
    error,
    testingConnection,
    testResult,
    setActiveTab,
    testCloudConnection,
    updateCloudConnection,
    addCloudConnection,
    deleteCloudConnection,
    updateServiceNowConfig,
    testServiceNowConnection,
    updateSIEMConfig,
    updateAPMConfig,
    addUser,
    updateUser,
    deleteUser,
    updateNotificationPreferences,
    loadAuditLogs,
    clearTestResult,
    refreshSettings: loadSettings,
  };
};
