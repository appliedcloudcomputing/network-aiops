/**
 * Service and dependency map type definitions
 */

export type ServiceHealth = 'healthy' | 'degraded' | 'critical';

export interface ServiceNode {
  id: string;
  name: string;
  type: string;
  health: ServiceHealth;
  latency: number;
  connections: number;
}

export interface ServiceDependency {
  source: string;
  target: string;
  latency: number;
  throughput: number;
}

export interface ServiceTopologyData {
  nodes: ServiceNode[];
  edges: ServiceDependency[];
}
