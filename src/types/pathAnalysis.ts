/**
 * Path Analysis Types - Network path tracing and analysis
 */

export type PathAnalysisStatus = 'idle' | 'running' | 'completed' | 'failed' | 'timeout';
export type HopStatus = 'reachable' | 'unreachable' | 'timeout' | 'unknown';
export type PathHealth = 'healthy' | 'degraded' | 'critical' | 'unknown';

export interface PathHop {
  hopNumber: number;
  ipAddress: string;
  hostname: string | null;
  location: string | null;
  asn: string | null;
  asnOrg: string | null;
  latency: number[];       // RTT measurements in ms
  avgLatency: number;
  minLatency: number;
  maxLatency: number;
  jitter: number;
  packetLoss: number;      // Percentage 0-100
  status: HopStatus;
  deviceType?: 'router' | 'switch' | 'firewall' | 'server' | 'unknown';
  cloudProvider?: 'aws' | 'azure' | 'gcp' | null;
  region?: string;
}

export interface PathAnalysisResult {
  id: string;
  source: string;
  destination: string;
  protocol: 'icmp' | 'tcp' | 'udp';
  port?: number;
  hops: PathHop[];
  totalHops: number;
  totalLatency: number;
  avgLatency: number;
  packetLoss: number;
  health: PathHealth;
  status: PathAnalysisStatus;
  startTime: string;
  endTime: string | null;
  duration: number;        // in ms
  mtu: number;
  ttl: number;
}

export interface PathAnalysisRequest {
  source: string;
  destination: string;
  protocol: 'icmp' | 'tcp' | 'udp';
  port?: number;
  maxHops?: number;
  timeout?: number;        // Per-hop timeout in ms
  probesPerHop?: number;
  resolveHostnames?: boolean;
}

export interface PathAnalysisHistory {
  id: string;
  source: string;
  destination: string;
  timestamp: string;
  totalHops: number;
  avgLatency: number;
  health: PathHealth;
  status: PathAnalysisStatus;
}

export interface SavedPath {
  id: string;
  name: string;
  source: string;
  destination: string;
  protocol: 'icmp' | 'tcp' | 'udp';
  port?: number;
  createdAt: string;
  lastRun: string | null;
  runCount: number;
}

export interface PathComparison {
  current: PathAnalysisResult;
  previous: PathAnalysisResult | null;
  latencyChange: number;   // Percentage change
  hopCountChange: number;
  healthChange: 'improved' | 'degraded' | 'unchanged';
}

export interface NetworkTopology {
  nodes: TopologyNode[];
  edges: TopologyEdge[];
}

export interface TopologyNode {
  id: string;
  label: string;
  type: 'source' | 'destination' | 'hop';
  ipAddress: string;
  status: HopStatus;
  latency?: number;
}

export interface TopologyEdge {
  source: string;
  target: string;
  latency: number;
  packetLoss: number;
  status: 'healthy' | 'degraded' | 'critical';
}

// Common destinations for quick access
export const COMMON_DESTINATIONS = [
  { name: 'Google DNS', ip: '8.8.8.8' },
  { name: 'Cloudflare DNS', ip: '1.1.1.1' },
  { name: 'AWS us-east-1', ip: '52.94.76.1' },
  { name: 'Azure East US', ip: '13.82.0.1' },
  { name: 'GCP us-central1', ip: '35.192.0.1' },
];
