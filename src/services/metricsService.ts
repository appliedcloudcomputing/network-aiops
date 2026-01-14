/**
 * Metrics service for fetching dashboard and monitoring data
 * Currently uses mock data - ready for API integration
 */

import type {
  DashboardMetric,
  ActivityItem,
  PlatformDistribution,
  RealTimeMetrics,
  SystemStat,
  PlatformHealth,
} from '../types';

export const getDashboardMetrics = async (): Promise<DashboardMetric[]> => {
  // TODO: Replace with actual API call
  // return apiClient.get<DashboardMetric[]>('/metrics/dashboard');

  return [
    { label: 'Active Rules', value: '4,892', change: '+12', trend: 'up', icon: '📜', color: 'cyan' },
    { label: 'Security Groups', value: '247', change: '+3', trend: 'up', icon: '🛡️', color: 'purple' },
    { label: 'Transit Gateways', value: '18', change: '0', trend: 'stable', icon: '🌐', color: 'emerald' },
    { label: 'Open Tickets', value: '23', change: '-5', trend: 'down', icon: '🎫', color: 'amber' },
  ];
};

export const getRecentActivity = async (): Promise<ActivityItem[]> => {
  // TODO: Replace with actual API call
  // return apiClient.get<ActivityItem[]>('/activity/recent');

  return [
    { id: 1, action: 'Rule deployed', target: 'sg-web-prod', user: 'automation', time: '2 min ago', status: 'success' },
    { id: 2, action: 'Policy change approved', target: 'CHG0012347', user: 'j.smith', time: '15 min ago', status: 'success' },
    { id: 3, action: 'Validation failed', target: 'Allow-External-SSH', user: 'system', time: '32 min ago', status: 'error' },
    { id: 4, action: 'Compliance scan completed', target: 'PCI-DSS', user: 'scanner', time: '1 hour ago', status: 'success' },
    { id: 5, action: 'Anomaly detected', target: 'tgw-prod-east', user: 'ai-engine', time: '2 hours ago', status: 'warning' },
  ];
};

export const getPlatformDistribution = async (): Promise<PlatformDistribution[]> => {
  // TODO: Replace with actual API call

  return [
    { name: 'AWS', value: 65, color: 'bg-orange-500' },
    { name: 'Azure', value: 25, color: 'bg-blue-500' },
    { name: 'GCP', value: 10, color: 'bg-red-500' },
  ];
};

export const getRealTimeMetrics = async (): Promise<RealTimeMetrics> => {
  // TODO: Replace with actual API call

  return {
    activeConnections: 49,
    ingress: 24,
    egress: 18,
    firewallCpu: 67,
  };
};

export const getSystemStats = async (): Promise<SystemStat[]> => {
  // TODO: Replace with actual API call

  return [
    { label: 'Blocked Attacks', value: '1,247', unit: '/hr', icon: '🛡️', color: 'red', trend: '↓ -12%' },
    { label: 'Policy Changes', value: '23', unit: 'pending', icon: '📋', color: 'amber', trend: '↑ +5' },
    { label: 'Compliance', value: '98.5', unit: '%', icon: '✅', color: 'emerald', trend: '↑ +0.2%' },
    { label: 'Avg Latency', value: '12', unit: 'ms', icon: '⚡', color: 'cyan', trend: '↓ -2ms' },
    { label: 'Active Rules', value: '4,892', unit: '', icon: '📜', color: 'purple' },
    { label: 'TGW Attachments', value: '18', unit: 'active', icon: '🌐', color: 'cyan' },
  ];
};

export const getPlatformHealth = async (): Promise<PlatformHealth[]> => {
  // TODO: Replace with actual API call

  return [
    { name: 'AWS', status: 'operational', latency: '12ms', icon: '☁️' },
    { name: 'Azure', status: 'operational', latency: '18ms', icon: '☁️' },
    { name: 'GCP', status: 'degraded', latency: '45ms', icon: '☁️' },
    { name: 'Palo Alto', status: 'operational', latency: '3ms', icon: '🔥' },
  ];
};

export const getSummaryStats = async (): Promise<{
  compliance: string;
  uptime: string;
  avgLatency: string;
}> => {
  // TODO: Replace with actual API call

  return {
    compliance: '98.5%',
    uptime: '99.9%',
    avgLatency: '12ms',
  };
};

export interface NetworkStatData {
  packetDropRate: number;
  throughput: {
    ingress: number;
    egress: number;
  };
  connections: {
    active: number;
    blocked: number;
  };
  latency: {
    avg: number;
    p95: number;
    p99: number;
  };
  firewallHealth: {
    cpu: number;
    memory: number;
    sessions: number;
  };
}

export const getNetworkStats = async (): Promise<NetworkStatData> => {
  // TODO: Replace with actual API call

  return {
    packetDropRate: 0.05 + Math.random() * 0.1,
    throughput: {
      ingress: 24.5 + Math.random() * 5,
      egress: 18.2 + Math.random() * 3,
    },
    connections: {
      active: Math.floor(45000 + Math.random() * 10000),
      blocked: Math.floor(1200 + Math.random() * 300),
    },
    latency: {
      avg: 12,
      p95: 28,
      p99: 45,
    },
    firewallHealth: {
      cpu: Math.floor(55 + Math.random() * 20),
      memory: Math.floor(45 + Math.random() * 15),
      sessions: Math.floor(30 + Math.random() * 25),
    },
  };
};
