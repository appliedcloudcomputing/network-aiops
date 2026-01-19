/**
 * Application Dependency Map - Service Topology Types
 */

export type ServiceStatus = 'healthy' | 'degraded' | 'down' | 'unknown';
export type ServiceTier = 'frontend' | 'backend' | 'database' | 'cache' | 'queue' | 'external';
export type DependencyType = 'api' | 'database' | 'messaging' | 'cache' | 'storage' | 'external';
export type NetworkProtocol = 'http' | 'https' | 'tcp' | 'grpc' | 'amqp' | 'redis' | 'sql';

export interface TopologyServiceMetrics {
  requestsPerSecond: number;
  avgLatencyMs: number;
  errorRate: number;
  cpuUsage: number;
  memoryUsage: number;
  activeConnections: number;
}

export interface ServiceEndpoint {
  protocol: NetworkProtocol;
  host: string;
  port: number;
  path?: string;
}

export interface TopologyServiceHealth {
  status: ServiceStatus;
  uptime: number; // percentage
  lastCheck: string;
  healthScore: number; // 0-100
  incidents: number;
}

export interface TopologyServiceDependency {
  targetServiceId: string;
  type: DependencyType;
  protocol: NetworkProtocol;
  latencyMs: number;
  requestsPerSecond: number;
  errorRate: number;
  critical: boolean;
}

export interface Service {
  id: string;
  name: string;
  displayName: string;
  tier: ServiceTier;
  version: string;
  description: string;
  owner: string;
  team: string;
  repository?: string;
  endpoint: ServiceEndpoint;
  health: TopologyServiceHealth;
  metrics: TopologyServiceMetrics;
  dependencies: TopologyServiceDependency[];
  tags: string[];
  environment: 'production' | 'staging' | 'development';
  region: string;
  instances: number;
  containerImage?: string;
}

export interface ServiceConnection {
  from: string;
  to: string;
  type: DependencyType;
  protocol: NetworkProtocol;
  latencyMs: number;
  requestsPerSecond: number;
  errorRate: number;
  bandwidth: string;
  critical: boolean;
}

export interface ServiceIssue {
  id: string;
  serviceId: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  type: 'latency' | 'error_rate' | 'availability' | 'capacity' | 'dependency';
  title: string;
  description: string;
  detectedAt: string;
  affectedServices: string[];
  rootCause?: string;
  recommendation?: string;
}

export interface TopologyLayout {
  serviceId: string;
  x: number;
  y: number;
  tier: number;
}

export interface ServiceTopology {
  services: Service[];
  connections: ServiceConnection[];
  issues: ServiceIssue[];
  layout: TopologyLayout[];
  lastUpdated: string;
}

export interface TopologyFilters {
  status?: ServiceStatus[];
  tier?: ServiceTier[];
  team?: string[];
  showHealthy?: boolean;
  showDegraded?: boolean;
  showDown?: boolean;
  highlightCriticalPaths?: boolean;
}

export interface TopologyMetrics {
  totalServices: number;
  healthyServices: number;
  degradedServices: number;
  downServices: number;
  totalConnections: number;
  criticalConnections: number;
  avgLatency: number;
  avgErrorRate: number;
  totalIssues: number;
  criticalIssues: number;
}
