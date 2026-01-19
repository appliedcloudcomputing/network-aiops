/**
 * Traffic Path Analysis - Network Topology and Flow Analysis Types
 */

export type NodeType = 'router' | 'switch' | 'firewall' | 'load_balancer' | 'server' | 'client' | 'cloud_gateway' | 'vpn_gateway';
export type NodeStatus = 'healthy' | 'warning' | 'critical' | 'offline';
export type LinkStatus = 'active' | 'congested' | 'degraded' | 'down';
export type TrafficDirection = 'inbound' | 'outbound' | 'bidirectional';
export type PathStatus = 'optimal' | 'suboptimal' | 'degraded' | 'broken';
export type AnomalyType = 'latency_spike' | 'packet_loss' | 'bandwidth_saturation' | 'routing_loop' | 'asymmetric_path';

export interface NetworkNode {
  id: string;
  name: string;
  type: NodeType;
  status: NodeStatus;
  ipAddress: string;
  location: string;
  vendor?: string;
  model?: string;
  position: {
    x: number;
    y: number;
  };
  metrics: {
    cpuUsage: number;
    memoryUsage: number;
    bandwidth: number;
    totalConnections: number;
    activeFlows: number;
  };
  uptime: string;
  lastSeen: string;
}

export interface NetworkLink {
  id: string;
  source: string; // node id
  target: string; // node id
  status: LinkStatus;
  bandwidth: string; // e.g., "10 Gbps"
  utilization: number; // percentage
  latency: number; // ms
  packetLoss: number; // percentage
  jitter: number; // ms
  protocol: string;
  vlan?: number;
  cost: number;
}

export interface TrafficFlow {
  id: string;
  source: string;
  destination: string;
  protocol: string;
  port: number;
  direction: TrafficDirection;
  volume: number; // bytes
  packets: number;
  bps: number; // bits per second
  pps: number; // packets per second
  startTime: string;
  duration: number; // seconds
  applicationName?: string;
  tags: string[];
}

export interface TrafficPathHop {
  nodeId: string;
  nodeName: string;
  hopNumber: number;
  latency: number; // ms to reach this hop
  packetLoss: number; // percentage
  interface: string;
  ingressBandwidth: number; // Mbps
  egressBandwidth: number; // Mbps
  queueDepth: number;
  drops: number;
}

export interface NetworkPath {
  id: string;
  name: string;
  source: NetworkNode;
  destination: NetworkNode;
  status: PathStatus;
  hops: TrafficPathHop[];
  totalLatency: number; // ms
  totalPacketLoss: number; // percentage
  bandwidth: number; // Mbps
  mtu: number;
  pathCost: number;
  preferredPath: boolean;
  redundancyAvailable: boolean;
  lastUpdated: string;
}

export interface PathAnomaly {
  id: string;
  type: AnomalyType;
  severity: 'critical' | 'high' | 'medium' | 'low';
  pathId: string;
  affectedHop?: string;
  description: string;
  detectedAt: string;
  duration: number; // seconds
  impact: string;
  baseline: {
    metric: string;
    normalValue: number;
    currentValue: number;
    deviation: number; // percentage
  };
  recommendation?: string;
}

export interface TrafficTopologyMetrics {
  totalNodes: number;
  totalLinks: number;
  activePaths: number;
  totalTrafficVolume: number; // GB
  averageLatency: number; // ms
  averageUtilization: number; // percentage
  healthScore: number; // 0-100
  anomalyCount: number;
  lastUpdated: string;
}

export interface BottleneckAnalysis {
  nodeId: string;
  nodeName: string;
  type: 'bandwidth' | 'cpu' | 'memory' | 'interface';
  severity: 'critical' | 'high' | 'medium' | 'low';
  currentValue: number;
  threshold: number;
  affectedFlows: number;
  estimatedImpact: string;
  recommendation: string;
}

export interface TrafficPathData {
  nodes: NetworkNode[];
  links: NetworkLink[];
  paths: NetworkPath[];
  flows: TrafficFlow[];
  anomalies: PathAnomaly[];
  bottlenecks: BottleneckAnalysis[];
  metrics: TrafficTopologyMetrics;
  lastAnalysis: string;
}
