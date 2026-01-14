/**
 * Route Intelligence Service - Route anomaly detection and analysis
 * Uses real data from set8b_route_anomalies.json
 */

// Import real route anomaly data
import routeAnomalyDataset from '../../data/set8b_route_anomalies.json';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Types for route anomalies
export type AnomalyType =
  | 'MISSING_ROUTE'
  | 'ASYMMETRIC_ROUTING'
  | 'BLACK_HOLE_ROUTE'
  | 'SUBOPTIMAL_PATH'
  | 'ROUTE_CONFLICT'
  | 'MTU_MISMATCH'
  | 'EXPIRED_ROUTE'
  | 'ORPHANED_ROUTE'
  | 'OVERLAPPING_CIDR'
  | 'NEXT_HOP_UNREACHABLE';

export type AnomalySeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
export type AnomalyStatus = 'OPEN' | 'ACKNOWLEDGED' | 'RESOLVED' | 'FALSE_POSITIVE';

export interface RouteAnomaly {
  anomaly_id: string;
  severity: AnomalySeverity;
  type: AnomalyType;
  status: AnomalyStatus;
  detected_at: string;
  source: string;
  source_name: string;
  destination: string;
  destination_name: string;
  platform: string;
  affected_route_table?: string;
  forward_path?: string[];
  return_path?: string[];
  deleted_resource?: string;
  issue_summary: string;
  impact: string;
  affected_services: string[];
  first_detected: string;
  last_validated: string;
}

export interface AnomalySummary {
  total: number;
  by_severity: Record<string, number>;
  by_type: Record<string, number>;
  by_platform: Record<string, number>;
}

// Transform anomaly data
const transformAnomaly = (anomaly: typeof routeAnomalyDataset.anomalies[0]): RouteAnomaly => {
  return {
    anomaly_id: anomaly.anomaly_id,
    severity: anomaly.severity as AnomalySeverity,
    type: anomaly.type as AnomalyType,
    status: (anomaly.status || 'OPEN') as AnomalyStatus,
    detected_at: anomaly.detected_at,
    source: anomaly.source,
    source_name: anomaly.source_name,
    destination: anomaly.destination,
    destination_name: anomaly.destination_name,
    platform: anomaly.platform,
    affected_route_table: anomaly.affected_route_table,
    forward_path: anomaly.forward_path,
    return_path: anomaly.return_path,
    deleted_resource: anomaly.deleted_resource ?? undefined,
    issue_summary: anomaly.issue_summary,
    impact: anomaly.impact,
    affected_services: anomaly.affected_services || [],
    first_detected: anomaly.first_detected,
    last_validated: anomaly.last_validated,
  };
};

export const routeIntelligenceService = {
  // Get all route anomalies
  async getAnomalies(filter?: {
    severity?: AnomalySeverity;
    type?: AnomalyType;
    platform?: string;
    status?: AnomalyStatus;
  }): Promise<RouteAnomaly[]> {
    await delay(500);
    let anomalies = routeAnomalyDataset.anomalies.map(transformAnomaly);

    if (filter?.severity) {
      anomalies = anomalies.filter(a => a.severity === filter.severity);
    }
    if (filter?.type) {
      anomalies = anomalies.filter(a => a.type === filter.type);
    }
    if (filter?.platform) {
      anomalies = anomalies.filter(a => a.platform === filter.platform);
    }
    if (filter?.status) {
      anomalies = anomalies.filter(a => a.status === filter.status);
    }

    return anomalies;
  },

  // Get anomaly summary
  async getSummary(): Promise<AnomalySummary> {
    await delay(200);
    return routeAnomalyDataset.anomaly_summary;
  },

  // Get critical and high severity anomalies
  async getCriticalAnomalies(): Promise<RouteAnomaly[]> {
    await delay(300);
    return routeAnomalyDataset.anomalies
      .filter(a => a.severity === 'CRITICAL' || a.severity === 'HIGH')
      .map(transformAnomaly);
  },

  // Get anomaly by ID
  async getAnomalyById(id: string): Promise<RouteAnomaly | null> {
    await delay(200);
    const anomaly = routeAnomalyDataset.anomalies.find(a => a.anomaly_id === id);
    return anomaly ? transformAnomaly(anomaly) : null;
  },

  // Get anomalies by affected service
  async getAnomaliesByService(serviceName: string): Promise<RouteAnomaly[]> {
    await delay(300);
    return routeAnomalyDataset.anomalies
      .filter(a => a.affected_services?.includes(serviceName))
      .map(transformAnomaly);
  },

  // Get open anomalies count by severity
  async getOpenAnomalyCounts(): Promise<Record<AnomalySeverity, number>> {
    await delay(200);
    const counts: Record<AnomalySeverity, number> = {
      CRITICAL: 0,
      HIGH: 0,
      MEDIUM: 0,
      LOW: 0,
      INFO: 0,
    };

    routeAnomalyDataset.anomalies.forEach(a => {
      if (a.status === 'OPEN') {
        counts[a.severity as AnomalySeverity]++;
      }
    });

    return counts;
  },

  // Get anomalies by type
  async getAnomaliesByType(): Promise<Record<AnomalyType, RouteAnomaly[]>> {
    await delay(400);
    const byType: Record<string, RouteAnomaly[]> = {};

    routeAnomalyDataset.anomalies.forEach(a => {
      if (!byType[a.type]) {
        byType[a.type] = [];
      }
      byType[a.type].push(transformAnomaly(a));
    });

    return byType as Record<AnomalyType, RouteAnomaly[]>;
  },

  // Get anomalies by platform
  async getAnomaliesByPlatform(): Promise<Record<string, RouteAnomaly[]>> {
    await delay(400);
    const byPlatform: Record<string, RouteAnomaly[]> = {};

    routeAnomalyDataset.anomalies.forEach(a => {
      if (!byPlatform[a.platform]) {
        byPlatform[a.platform] = [];
      }
      byPlatform[a.platform].push(transformAnomaly(a));
    });

    return byPlatform;
  },

  // Acknowledge an anomaly
  async acknowledgeAnomaly(id: string): Promise<RouteAnomaly | null> {
    await delay(300);
    const anomaly = routeAnomalyDataset.anomalies.find(a => a.anomaly_id === id);
    if (anomaly) {
      // In a real implementation, this would update the status
      return { ...transformAnomaly(anomaly), status: 'ACKNOWLEDGED' };
    }
    return null;
  },

  // Resolve an anomaly
  async resolveAnomaly(id: string): Promise<RouteAnomaly | null> {
    await delay(300);
    const anomaly = routeAnomalyDataset.anomalies.find(a => a.anomaly_id === id);
    if (anomaly) {
      // In a real implementation, this would update the status
      return { ...transformAnomaly(anomaly), status: 'RESOLVED' };
    }
    return null;
  },
};
