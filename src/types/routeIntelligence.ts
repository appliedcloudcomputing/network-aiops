/**
 * Route Intelligence - AI-Powered Routing Analysis Types
 */

export type RouteStatus = 'optimal' | 'suboptimal' | 'degraded' | 'failing' | 'blackhole';
export type RouteType = 'static' | 'dynamic' | 'bgp' | 'ospf' | 'eigrp' | 'connected' | 'default';
export type OptimizationPotential = 'high' | 'medium' | 'low' | 'none';
export type RouteHealth = 'healthy' | 'warning' | 'critical' | 'unknown';
export type RoutingProtocol = 'BGP' | 'OSPF' | 'EIGRP' | 'Static' | 'Connected' | 'RIP';

export interface RouteMetrics {
  latencyMs: number;
  jitterMs: number;
  packetLoss: number; // percentage
  bandwidth: string;
  utilization: number; // percentage
  throughput: string;
  mtu: number;
  hopCount: number;
}

export interface RoutePathHop {
  sequence: number;
  ipAddress: string;
  hostname: string;
  location: string;
  latencyMs: number;
  asn?: number;
  provider?: string;
}

export interface RouteAlternative {
  id: string;
  path: RoutePathHop[];
  metrics: RouteMetrics;
  estimatedImprovement: {
    latencyReduction: number; // percentage
    costSavings: number; // dollars per month
    reliabilityIncrease: number; // percentage
  };
  implementationComplexity: 'low' | 'medium' | 'high';
  riskLevel: 'low' | 'medium' | 'high';
  recommendationScore: number; // 0-100
}

export interface AIRecommendation {
  id: string;
  type: 'optimize' | 'failover' | 'load-balance' | 'deprecate' | 'replace';
  priority: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  rationale: string[];
  expectedBenefit: string;
  estimatedImpact: {
    performance: number; // percentage improvement
    cost: number; // dollars per month
    reliability: number; // percentage improvement
  };
  implementationSteps: string[];
  automationAvailable: boolean;
  confidenceScore: number; // 0-100
}

export interface RouteAnomaly {
  id: string;
  detectedAt: string;
  type: 'latency_spike' | 'packet_loss' | 'route_flap' | 'asymmetric_routing' | 'black_hole' | 'suboptimal_path';
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  affectedRoutes: string[];
  impact: string;
  rootCause?: string;
  recommendation?: string;
}

export interface RoutePerformanceHistory {
  timestamp: string;
  latencyMs: number;
  packetLoss: number;
  availability: number; // percentage
  throughputMbps: number;
}

export interface NetworkRoute {
  id: string;
  name: string;
  source: string;
  destination: string;
  nextHop: string;
  protocol: RoutingProtocol;
  routeType: RouteType;
  status: RouteStatus;
  health: RouteHealth;
  metrics: RouteMetrics;
  path: RoutePathHop[];
  alternatives: RouteAlternative[];
  aiRecommendations: AIRecommendation[];
  anomalies: RouteAnomaly[];
  performanceHistory: RoutePerformanceHistory[];
  administrativeDistance: number;
  metric: number;
  age: string;
  vrf?: string;
  tags: string[];
  lastUpdated: string;
}

export interface RoutingTableSummary {
  totalRoutes: number;
  optimalRoutes: number;
  suboptimalRoutes: number;
  degradedRoutes: number;
  failingRoutes: number;
  staticRoutes: number;
  dynamicRoutes: number;
  bgpRoutes: number;
  ospfRoutes: number;
  connectedRoutes: number;
}

export interface RouteOptimizationOpportunity {
  id: string;
  title: string;
  description: string;
  affectedRoutes: string[];
  potentialSavings: number; // dollars per month
  performanceGain: number; // percentage
  implementationEffort: 'low' | 'medium' | 'high';
  priority: 'critical' | 'high' | 'medium' | 'low';
  estimatedROI: number; // percentage
}

export interface RouteIntelligenceMetrics {
  averageLatency: number;
  averagePacketLoss: number;
  averageJitter: number;
  routeAvailability: number; // percentage
  optimalRoutesPercentage: number;
  anomaliesDetected24h: number;
  optimizationOpportunities: number;
  estimatedMonthlySavings: number;
  aiConfidenceScore: number; // average across all recommendations
}

export interface RouteIntelligenceData {
  routes: NetworkRoute[];
  summary: RoutingTableSummary;
  metrics: RouteIntelligenceMetrics;
  optimizationOpportunities: RouteOptimizationOpportunity[];
  recentAnomalies: RouteAnomaly[];
  lastAnalyzed: string;
}
