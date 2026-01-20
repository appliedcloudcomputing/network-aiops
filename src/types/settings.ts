/**
 * Settings-related type definitions
 */

export type CloudConnectionStatus = 'connected' | 'disconnected' | 'error' | 'pending';

export interface CloudConnection {
  id: string;
  provider: 'aws' | 'azure' | 'gcp' | 'onprem';
  name: string;
  status: CloudConnectionStatus;
  region?: string;
  accountId?: string;
  subscriptionId?: string;
  projectId?: string;
  datacenterName?: string;
  lastSync?: string;
  credentials: {
    type: 'access_key' | 'service_principal' | 'service_account' | 'api_key';
    configured: boolean;
  };
}

export interface ServiceNowConfig {
  instanceUrl: string;
  username: string;
  isConfigured: boolean;
  autoCreateTickets: boolean;
  defaultAssignmentGroup: string;
  defaultPriority: 'low' | 'medium' | 'high' | 'critical';
  syncInterval: number;
}

export interface SIEMConfig {
  type: 'splunk' | 'qradar' | 'sentinel' | 'elastic' | 'none';
  endpoint: string;
  isConfigured: boolean;
  forwardAlerts: boolean;
  forwardLogs: boolean;
  alertSeverityThreshold: 'low' | 'medium' | 'high' | 'critical';
}

export interface APMConfig {
  type: 'datadog' | 'newrelic' | 'dynatrace' | 'appdynamics' | 'none';
  apiEndpoint: string;
  isConfigured: boolean;
  collectMetrics: boolean;
  collectTraces: boolean;
  sampleRate: number;
}

export type UserRole = 'admin' | 'operator' | 'viewer' | 'auditor';

export interface UserPermissions {
  canViewDashboard: boolean;
  canManageRules: boolean;
  canApproveTickets: boolean;
  canModifySettings: boolean;
  canViewAuditLogs: boolean;
  canManageUsers: boolean;
  canExportData: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: 'active' | 'inactive' | 'pending';
  lastLogin?: string;
  createdAt: string;
  permissions: UserPermissions;
}

export interface NotificationChannel {
  id: string;
  type: 'email' | 'slack' | 'pagerduty' | 'webhook' | 'teams';
  name: string;
  isEnabled: boolean;
  config: Record<string, string>;
}

export interface NotificationPreferences {
  channels: NotificationChannel[];
  alertThreshold: 'all' | 'warning' | 'critical';
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
    timezone: string;
  };
  digest: {
    enabled: boolean;
    frequency: 'hourly' | 'daily' | 'weekly';
  };
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  details: string;
  ipAddress: string;
  status: 'success' | 'failure';
}

export interface SettingsState {
  cloudConnections: CloudConnection[];
  serviceNow: ServiceNowConfig;
  siem: SIEMConfig;
  apm: APMConfig;
  users: User[];
  notifications: NotificationPreferences;
  pageVisibility: PageVisibilitySettings;
}

export type SettingsTab =
  | 'cloud'
  | 'servicenow'
  | 'siem'
  | 'apm'
  | 'users'
  | 'notifications'
  | 'audit'
  | 'navigation';

export interface PageVisibilitySettings {
  [key: string]: boolean;
}

export interface PageVisibilityItem {
  id: import('./navigation').ViewId;
  label: string;
  description: string;
  visible: boolean;
  category: 'core' | 'analysis' | 'operations' | 'cloud' | 'system';
  isRequired?: boolean; // Some pages like Dashboard and Settings cannot be hidden
}
