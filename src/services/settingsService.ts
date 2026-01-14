/**
 * Settings service - handles settings-related API operations
 */

import type {
  CloudConnection,
  ServiceNowConfig,
  SIEMConfig,
  APMConfig,
  User,
  NotificationPreferences,
  AuditLogEntry,
  SettingsState,
} from '../types/settings';

// Mock data for cloud connections
const mockCloudConnections: CloudConnection[] = [
  {
    id: 'aws-1',
    provider: 'aws',
    name: 'Production AWS',
    status: 'connected',
    region: 'us-east-1',
    accountId: '123456789012',
    lastSync: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    credentials: { type: 'access_key', configured: true },
  },
  {
    id: 'azure-1',
    provider: 'azure',
    name: 'Azure Enterprise',
    status: 'connected',
    region: 'eastus',
    subscriptionId: 'sub-abc123-def456',
    lastSync: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    credentials: { type: 'service_principal', configured: true },
  },
  {
    id: 'gcp-1',
    provider: 'gcp',
    name: 'GCP Analytics',
    status: 'error',
    region: 'us-central1',
    projectId: 'analytics-prod-12345',
    lastSync: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    credentials: { type: 'service_account', configured: true },
  },
  {
    id: 'onprem-1',
    provider: 'onprem',
    name: 'DC-East Datacenter',
    status: 'connected',
    datacenterName: 'DC-EAST-01',
    lastSync: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    credentials: { type: 'api_key', configured: true },
  },
];

const mockServiceNowConfig: ServiceNowConfig = {
  instanceUrl: 'https://company.service-now.com',
  username: 'api_integration',
  isConfigured: true,
  autoCreateTickets: true,
  defaultAssignmentGroup: 'Network Operations',
  defaultPriority: 'medium',
  syncInterval: 5,
};

const mockSIEMConfig: SIEMConfig = {
  type: 'splunk',
  endpoint: 'https://splunk.company.com:8089',
  isConfigured: true,
  forwardAlerts: true,
  forwardLogs: false,
  alertSeverityThreshold: 'medium',
};

const mockAPMConfig: APMConfig = {
  type: 'datadog',
  apiEndpoint: 'https://api.datadoghq.com',
  isConfigured: true,
  collectMetrics: true,
  collectTraces: true,
  sampleRate: 0.1,
};

const mockUsers: User[] = [
  {
    id: 'user-1',
    email: 'admin@company.com',
    name: 'System Administrator',
    role: 'admin',
    status: 'active',
    lastLogin: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    createdAt: '2024-01-15T10:00:00Z',
    permissions: {
      canViewDashboard: true,
      canManageRules: true,
      canApproveTickets: true,
      canModifySettings: true,
      canViewAuditLogs: true,
      canManageUsers: true,
      canExportData: true,
    },
  },
  {
    id: 'user-2',
    email: 'operator@company.com',
    name: 'Network Operator',
    role: 'operator',
    status: 'active',
    lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    createdAt: '2024-02-20T14:30:00Z',
    permissions: {
      canViewDashboard: true,
      canManageRules: true,
      canApproveTickets: false,
      canModifySettings: false,
      canViewAuditLogs: false,
      canManageUsers: false,
      canExportData: true,
    },
  },
  {
    id: 'user-3',
    email: 'viewer@company.com',
    name: 'Security Viewer',
    role: 'viewer',
    status: 'active',
    lastLogin: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    createdAt: '2024-03-10T09:15:00Z',
    permissions: {
      canViewDashboard: true,
      canManageRules: false,
      canApproveTickets: false,
      canModifySettings: false,
      canViewAuditLogs: false,
      canManageUsers: false,
      canExportData: false,
    },
  },
  {
    id: 'user-4',
    email: 'auditor@company.com',
    name: 'Compliance Auditor',
    role: 'auditor',
    status: 'active',
    lastLogin: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    createdAt: '2024-03-25T11:00:00Z',
    permissions: {
      canViewDashboard: true,
      canManageRules: false,
      canApproveTickets: false,
      canModifySettings: false,
      canViewAuditLogs: true,
      canManageUsers: false,
      canExportData: true,
    },
  },
];

const mockNotificationPreferences: NotificationPreferences = {
  channels: [
    {
      id: 'email-1',
      type: 'email',
      name: 'Operations Team',
      isEnabled: true,
      config: { recipients: 'ops@company.com' },
    },
    {
      id: 'slack-1',
      type: 'slack',
      name: '#network-alerts',
      isEnabled: true,
      config: { channel: '#network-alerts', webhook: 'https://hooks.slack.com/...' },
    },
    {
      id: 'pagerduty-1',
      type: 'pagerduty',
      name: 'Critical Alerts',
      isEnabled: true,
      config: { serviceKey: 'pd-service-key', severity: 'critical' },
    },
    {
      id: 'teams-1',
      type: 'teams',
      name: 'Security Team',
      isEnabled: false,
      config: { webhook: 'https://outlook.office.com/webhook/...' },
    },
  ],
  alertThreshold: 'warning',
  quietHours: {
    enabled: true,
    start: '22:00',
    end: '07:00',
    timezone: 'America/New_York',
  },
  digest: {
    enabled: true,
    frequency: 'daily',
  },
};

const mockAuditLogs: AuditLogEntry[] = [
  {
    id: 'log-1',
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    user: 'admin@company.com',
    action: 'UPDATE_SETTINGS',
    resource: 'ServiceNow Configuration',
    details: 'Updated sync interval from 10 to 5 minutes',
    ipAddress: '10.0.1.50',
    status: 'success',
  },
  {
    id: 'log-2',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    user: 'operator@company.com',
    action: 'CREATE_RULE',
    resource: 'Firewall Rule',
    details: 'Created rule: Allow HTTPS from DMZ to Production',
    ipAddress: '10.0.1.51',
    status: 'success',
  },
  {
    id: 'log-3',
    timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    user: 'admin@company.com',
    action: 'TEST_CONNECTION',
    resource: 'GCP Analytics',
    details: 'Connection test failed: Invalid credentials',
    ipAddress: '10.0.1.50',
    status: 'failure',
  },
  {
    id: 'log-4',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    user: 'admin@company.com',
    action: 'ADD_USER',
    resource: 'User Management',
    details: 'Added new user: viewer@company.com with role: viewer',
    ipAddress: '10.0.1.50',
    status: 'success',
  },
  {
    id: 'log-5',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    user: 'operator@company.com',
    action: 'APPROVE_TICKET',
    resource: 'Ticket CHG0012345',
    details: 'Approved policy change request for web server access',
    ipAddress: '10.0.1.51',
    status: 'success',
  },
  {
    id: 'log-6',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    user: 'auditor@company.com',
    action: 'EXPORT_REPORT',
    resource: 'Compliance Report',
    details: 'Exported PCI-DSS compliance report for Q4 2024',
    ipAddress: '10.0.1.55',
    status: 'success',
  },
  {
    id: 'log-7',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    user: 'admin@company.com',
    action: 'UPDATE_PERMISSIONS',
    resource: 'User Management',
    details: 'Updated permissions for operator@company.com',
    ipAddress: '10.0.1.50',
    status: 'success',
  },
  {
    id: 'log-8',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    user: 'system',
    action: 'SYNC_CLOUD',
    resource: 'AWS Production',
    details: 'Automatic sync completed: 847 resources discovered',
    ipAddress: '127.0.0.1',
    status: 'success',
  },
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const settingsService = {
  async getSettings(): Promise<SettingsState> {
    await delay(500);
    return {
      cloudConnections: mockCloudConnections,
      serviceNow: mockServiceNowConfig,
      siem: mockSIEMConfig,
      apm: mockAPMConfig,
      users: mockUsers,
      notifications: mockNotificationPreferences,
    };
  },

  async getCloudConnections(): Promise<CloudConnection[]> {
    await delay(300);
    return mockCloudConnections;
  },

  async testCloudConnection(connectionId: string): Promise<{ success: boolean; message: string }> {
    await delay(2000);
    const connection = mockCloudConnections.find(c => c.id === connectionId);
    if (!connection) {
      return { success: false, message: 'Connection not found' };
    }
    // Simulate test result based on current status
    if (connection.status === 'error') {
      return { success: false, message: 'Authentication failed. Please verify credentials.' };
    }
    return { success: true, message: 'Connection successful. All services accessible.' };
  },

  async updateCloudConnection(
    connectionId: string,
    updates: Partial<CloudConnection>
  ): Promise<CloudConnection> {
    await delay(500);
    const index = mockCloudConnections.findIndex(c => c.id === connectionId);
    if (index === -1) throw new Error('Connection not found');
    mockCloudConnections[index] = { ...mockCloudConnections[index], ...updates };
    return mockCloudConnections[index];
  },

  async addCloudConnection(connection: Omit<CloudConnection, 'id'>): Promise<CloudConnection> {
    await delay(500);
    const newConnection: CloudConnection = {
      ...connection,
      id: `${connection.provider}-${Date.now()}`,
    };
    mockCloudConnections.push(newConnection);
    return newConnection;
  },

  async deleteCloudConnection(connectionId: string): Promise<void> {
    await delay(300);
    const index = mockCloudConnections.findIndex(c => c.id === connectionId);
    if (index !== -1) {
      mockCloudConnections.splice(index, 1);
    }
  },

  async updateServiceNowConfig(config: Partial<ServiceNowConfig>): Promise<ServiceNowConfig> {
    await delay(500);
    Object.assign(mockServiceNowConfig, config);
    return mockServiceNowConfig;
  },

  async testServiceNowConnection(): Promise<{ success: boolean; message: string }> {
    await delay(1500);
    return { success: true, message: 'ServiceNow connection verified successfully.' };
  },

  async updateSIEMConfig(config: Partial<SIEMConfig>): Promise<SIEMConfig> {
    await delay(500);
    Object.assign(mockSIEMConfig, config);
    return mockSIEMConfig;
  },

  async updateAPMConfig(config: Partial<APMConfig>): Promise<APMConfig> {
    await delay(500);
    Object.assign(mockAPMConfig, config);
    return mockAPMConfig;
  },

  async getUsers(): Promise<User[]> {
    await delay(300);
    return mockUsers;
  },

  async addUser(user: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    await delay(500);
    const newUser: User = {
      ...user,
      id: `user-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    mockUsers.push(newUser);
    return newUser;
  },

  async updateUser(userId: string, updates: Partial<User>): Promise<User> {
    await delay(500);
    const index = mockUsers.findIndex(u => u.id === userId);
    if (index === -1) throw new Error('User not found');
    mockUsers[index] = { ...mockUsers[index], ...updates };
    return mockUsers[index];
  },

  async deleteUser(userId: string): Promise<void> {
    await delay(300);
    const index = mockUsers.findIndex(u => u.id === userId);
    if (index !== -1) {
      mockUsers.splice(index, 1);
    }
  },

  async updateNotificationPreferences(
    prefs: Partial<NotificationPreferences>
  ): Promise<NotificationPreferences> {
    await delay(500);
    Object.assign(mockNotificationPreferences, prefs);
    return mockNotificationPreferences;
  },

  async getAuditLogs(
    filters?: { user?: string; action?: string; startDate?: string; endDate?: string }
  ): Promise<AuditLogEntry[]> {
    await delay(400);
    let logs = [...mockAuditLogs];

    if (filters?.user) {
      logs = logs.filter(l => l.user.toLowerCase().includes(filters.user!.toLowerCase()));
    }
    if (filters?.action) {
      logs = logs.filter(l => l.action === filters.action);
    }
    if (filters?.startDate) {
      logs = logs.filter(l => new Date(l.timestamp) >= new Date(filters.startDate!));
    }
    if (filters?.endDate) {
      logs = logs.filter(l => new Date(l.timestamp) <= new Date(filters.endDate!));
    }

    return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  },

  async exportAuditLogs(format: 'csv' | 'json'): Promise<string> {
    await delay(1000);
    if (format === 'json') {
      return JSON.stringify(mockAuditLogs, null, 2);
    }
    // CSV format
    const headers = ['Timestamp', 'User', 'Action', 'Resource', 'Details', 'IP Address', 'Status'];
    const rows = mockAuditLogs.map(log => [
      log.timestamp,
      log.user,
      log.action,
      log.resource,
      log.details,
      log.ipAddress,
      log.status,
    ]);
    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  },
};
