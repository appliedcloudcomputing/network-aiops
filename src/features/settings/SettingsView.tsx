/**
 * Settings & Configuration - Main view component
 */

import React from 'react';
import { PageContainer } from '../../components';
import { useSettings } from './hooks/useSettings';
import {
  SettingsTabs,
  NavigationSettingsPanel,
  CloudConnectionsPanel,
  ServiceNowPanel,
  SIEMPanel,
  APMPanel,
  UserManagementPanel,
  NotificationsPanel,
  AuditLogsPanel,
} from './components';

export const SettingsView: React.FC = () => {
  const {
    settings,
    auditLogs,
    activeTab,
    isLoading,
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
  } = useSettings();

  if (isLoading || !settings) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-3 text-slate-400">
            <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Loading settings...
          </div>
        </div>
      </PageContainer>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'navigation':
        return <NavigationSettingsPanel />;
      case 'cloud':
        return (
          <CloudConnectionsPanel
            connections={settings.cloudConnections}
            testingConnection={testingConnection}
            testResult={testResult}
            onTestConnection={testCloudConnection}
            onUpdateConnection={updateCloudConnection}
            onAddConnection={addCloudConnection}
            onDeleteConnection={deleteCloudConnection}
            onClearTestResult={clearTestResult}
          />
        );
      case 'servicenow':
        return (
          <ServiceNowPanel
            config={settings.serviceNow}
            testingConnection={testingConnection}
            testResult={testResult}
            onUpdate={updateServiceNowConfig}
            onTestConnection={testServiceNowConnection}
            onClearTestResult={clearTestResult}
          />
        );
      case 'siem':
        return <SIEMPanel config={settings.siem} onUpdate={updateSIEMConfig} />;
      case 'apm':
        return <APMPanel config={settings.apm} onUpdate={updateAPMConfig} />;
      case 'users':
        return (
          <UserManagementPanel
            users={settings.users}
            onAddUser={addUser}
            onUpdateUser={updateUser}
            onDeleteUser={deleteUser}
          />
        );
      case 'notifications':
        return (
          <NotificationsPanel
            preferences={settings.notifications}
            onUpdate={updateNotificationPreferences}
          />
        );
      case 'audit':
        return <AuditLogsPanel logs={auditLogs} onLoadLogs={loadAuditLogs} />;
      default:
        return null;
    }
  };

  return (
    <PageContainer>
      <div className="flex gap-6">
        <div className="w-64 flex-shrink-0">
          <SettingsTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
        <div className="flex-1 min-w-0">{renderContent()}</div>
      </div>
    </PageContainer>
  );
};
