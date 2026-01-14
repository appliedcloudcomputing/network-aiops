/**
 * Metrics and monitoring type definitions
 */

export type TrendDirection = 'up' | 'down' | 'stable';

export type MetricColor = 'cyan' | 'purple' | 'emerald' | 'amber' | 'red' | 'blue' | 'orange';

export interface DashboardMetric {
  label: string;
  value: string;
  change: string;
  trend: TrendDirection;
  icon: string;
  color: MetricColor;
}

export type ActivityStatus = 'success' | 'error' | 'warning';

export interface ActivityItem {
  id: number;
  action: string;
  target: string;
  user: string;
  time: string;
  status: ActivityStatus;
}

export interface PlatformDistribution {
  name: string;
  value: number;
  color: string;
}

export interface RealTimeMetrics {
  activeConnections: number;
  ingress: number;
  egress: number;
  firewallCpu: number;
}

export type GaugeStatus = 'critical' | 'warning' | 'good' | 'normal';

export interface GaugeProps {
  value: number;
  label: string;
  sublabel?: string;
  status: GaugeStatus;
  icon?: string;
}

export interface SystemStat {
  label: string;
  value: string;
  unit: string;
  icon: string;
  color: MetricColor;
  trend?: string;
}

export type PlatformStatus = 'operational' | 'degraded' | 'down';

export interface PlatformHealth {
  name: string;
  status: PlatformStatus;
  latency: string;
  icon: string;
}
