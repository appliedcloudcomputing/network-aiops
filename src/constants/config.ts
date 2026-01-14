/**
 * Application configuration constants
 */

export const APP_CONFIG = {
  name: 'Atlas AIOps',
  tagline: 'Multi-Cloud Manager',
  version: '1.0.0',
} as const;

export const REFRESH_INTERVALS = {
  REAL_TIME: 2000,
  ALERTS: 5000,
  METRICS: 1000,
} as const;

export const LIMITS = {
  MAX_ALERTS: 15,
  MAX_RECENT_ACTIVITY: 10,
  TRAFFIC_GRAPH_POINTS: 60,
} as const;

export const METRIC_RANGES = {
  activeConnections: { min: 30, max: 70 },
  ingress: { min: 10, max: 40 },
  egress: { min: 8, max: 35 },
  firewallCpu: { min: 50, max: 85 },
} as const;

export const CPU_THRESHOLDS = {
  WARNING: 60,
  CRITICAL: 75,
} as const;

export const TICKET_COLUMNS = [
  'Awaiting',
  'Approved',
  'Implementing',
  'Completed',
] as const;
