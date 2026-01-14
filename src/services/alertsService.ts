/**
 * Alerts service for managing alert data
 * Currently uses mock data - ready for API integration
 */

import type { Alert, AlertType } from '../types';

export const getInitialAlerts = (): Alert[] => {
  return [
    { id: 1, type: 'critical', message: 'Firewall CPU exceeded 65% threshold', source: 'pa-fw-prod-east', time: new Date(Date.now() - 30000), acknowledged: false },
    { id: 2, type: 'warning', message: 'Asymmetric routing detected on db-cluster path', source: 'tgw-prod', time: new Date(Date.now() - 120000), acknowledged: false },
    { id: 3, type: 'info', message: 'New security group rule deployed successfully', source: 'sg-web-prod', time: new Date(Date.now() - 300000), acknowledged: true },
    { id: 4, type: 'warning', message: 'High connection rate from 203.0.113.0/24', source: 'alb-prod', time: new Date(Date.now() - 450000), acknowledged: false },
    { id: 5, type: 'critical', message: 'Black hole route detected for 10.60.0.0/16', source: 'rtb-prod-main', time: new Date(Date.now() - 600000), acknowledged: false },
    { id: 6, type: 'info', message: 'Compliance scan completed - 98.5% score', source: 'atlas-scanner', time: new Date(Date.now() - 900000), acknowledged: true },
    { id: 7, type: 'warning', message: 'SSL certificate expires in 14 days', source: 'cert-manager', time: new Date(Date.now() - 1200000), acknowledged: false },
    { id: 8, type: 'info', message: 'Transit Gateway attachment created', source: 'tgw-attach-analytics', time: new Date(Date.now() - 1500000), acknowledged: true },
  ];
};

interface AlertMessage {
  type: AlertType;
  message: string;
  source: string;
}

export const getRandomAlertMessage = (): AlertMessage => {
  const alertMessages: AlertMessage[] = [
    { type: 'info', message: 'Health check passed for web-servers', source: 'alb-prod' },
    { type: 'warning', message: 'Elevated latency on cross-region traffic', source: 'cloud-router-us' },
    { type: 'info', message: 'Auto-scaling triggered for app-tier', source: 'asg-app-prod' },
    { type: 'warning', message: 'Connection pool nearing capacity', source: 'rds-primary' },
  ];

  return alertMessages[Math.floor(Math.random() * alertMessages.length)];
};

export const createAlert = (alertMessage: AlertMessage): Alert => {
  return {
    id: Date.now(),
    ...alertMessage,
    time: new Date(),
    acknowledged: false,
  };
};

export const acknowledgeAlert = async (alertId: number): Promise<void> => {
  // TODO: Replace with actual API call
  // return apiClient.patch(`/alerts/${alertId}/acknowledge`);
  console.log(`Alert ${alertId} acknowledged`);
};

export const formatAlertTime = (date: Date): string => {
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
};

export const getAlertIcon = (type: AlertType): string => {
  const icons: Record<AlertType, string> = {
    critical: '🔴',
    warning: '🟠',
    info: '🔵',
  };
  return icons[type] || '⚪';
};

export const getAlertCounts = (alerts: Alert[]): { critical: number; warning: number; info: number; unacknowledged: number } => {
  return {
    critical: alerts.filter(a => a.type === 'critical' && !a.acknowledged).length,
    warning: alerts.filter(a => a.type === 'warning' && !a.acknowledged).length,
    info: alerts.filter(a => a.type === 'info' && !a.acknowledged).length,
    unacknowledged: alerts.filter(a => !a.acknowledged).length,
  };
};
