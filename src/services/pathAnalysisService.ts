/**
 * Path Analysis Service - Network path tracing and analysis
 * Uses real path analysis data from set8a_path_analyzer.json
 */

import type {
  PathAnalysisRequest,
  PathAnalysisResult,
  PathHop,
  PathAnalysisHistory,
  SavedPath,
  PathHealth,
} from '../types/pathAnalysis';

// Import real path analysis data
import pathAnalysisDataset from '../../data/set8a_path_analyzer.json';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Transform JSON path data to PathAnalysisResult
type PathAnalysisJson = typeof pathAnalysisDataset.path_analyses[0];

const transformPathAnalysis = (analysis: PathAnalysisJson): PathAnalysisResult => {
  const hops: PathHop[] = analysis.hops.map(hop => {
    const componentId = hop.component_id ?? hop.component;
    const latencyMs = hop.latency_ms ?? 0;
    const hopType = hop.type.toLowerCase();
    return {
      hopNumber: hop.hop_number,
      ipAddress: componentId,
      hostname: hop.component,
      location: hop.type,
      asn: null,
      asnOrg: null,
      latency: [latencyMs],
      avgLatency: latencyMs,
      minLatency: latencyMs,
      maxLatency: latencyMs,
      jitter: 0,
      packetLoss: hop.decision === 'BLOCKED' || hop.decision === 'DROPPED' ? 100 : 0,
      status: hop.decision === 'BLOCKED' || hop.decision === 'DROPPED' ? 'unreachable' as const :
              hop.decision === 'REACHED' ? 'reachable' as const : 'reachable' as const,
      deviceType: hopType.includes('firewall') ? 'firewall' as const :
                  hopType.includes('gateway') || hopType.includes('load') ? 'router' as const :
                  hopType.includes('server') ? 'server' as const : 'router' as const,
      cloudProvider: componentId.includes('aws') || componentId.startsWith('sg-') || componentId.startsWith('acl-') ? 'aws' as const :
                     componentId.includes('azure') || componentId.startsWith('nsg-') ? 'azure' as const :
                     componentId.includes('gcp') || componentId.startsWith('fw-') ? 'gcp' as const : null,
      region: undefined,
    };
  });

  const totalLatency = analysis.summary.path_latency_ms ?? 0;
  const avgLatency = totalLatency / (hops.length || 1);

  let health: PathHealth = 'healthy';
  if (analysis.result === 'BLOCKED' || analysis.result === 'FAILED') {
    health = 'critical';
  } else if (analysis.summary.bottlenecks && analysis.summary.bottlenecks.length > 0) {
    health = 'degraded';
  }

  return {
    id: analysis.analysis_id,
    source: analysis.input.source,
    destination: analysis.input.destination,
    protocol: analysis.input.protocol.toLowerCase() as 'icmp' | 'tcp' | 'udp',
    port: analysis.input.port ?? undefined,
    hops,
    totalHops: analysis.summary.total_hops,
    totalLatency,
    avgLatency,
    packetLoss: analysis.result === 'SUCCESS' ? 0 : 100,
    health,
    status: analysis.status.toLowerCase() as 'completed' | 'running' | 'failed',
    startTime: analysis.analysis_timestamp,
    endTime: analysis.analysis_timestamp,
    duration: totalLatency,
    mtu: 1500,
    ttl: 30,
  };
};

// Get pre-analyzed paths from dataset
export const getPreAnalyzedPaths = (): PathAnalysisResult[] => {
  return pathAnalysisDataset.path_analyses.map(transformPathAnalysis);
};

// Generate random latency with some variation
const generateLatency = (base: number, variation: number = 10): number[] => {
  return Array.from({ length: 3 }, () =>
    Math.max(1, base + (Math.random() - 0.5) * variation * 2)
  );
};

// Mock hop data generators
const generateHops = (destination: string): PathHop[] => {
  const hopCount = Math.floor(Math.random() * 8) + 8; // 8-15 hops
  const hops: PathHop[] = [];

  const mockHosts = [
    { ip: '192.168.1.1', hostname: 'gateway.local', location: 'Local Network', deviceType: 'router' as const },
    { ip: '10.0.0.1', hostname: 'core-rtr-01.example.com', location: 'Data Center', asn: 'AS12345', asnOrg: 'Example Corp', deviceType: 'router' as const },
    { ip: '72.14.194.1', hostname: 'edge-rtr-02.isp.net', location: 'Chicago, IL', asn: 'AS15169', asnOrg: 'ISP Networks', deviceType: 'router' as const },
    { ip: '142.250.80.1', hostname: 'core-bb-01.transit.net', location: 'Denver, CO', asn: 'AS174', asnOrg: 'Cogent', deviceType: 'router' as const },
    { ip: '209.85.248.1', hostname: 'ae-12.cr1.sjc.transit.net', location: 'San Jose, CA', asn: 'AS3356', asnOrg: 'Level 3', deviceType: 'router' as const },
    { ip: '72.14.232.1', hostname: 'be-102.pr1.lax.cloud.net', location: 'Los Angeles, CA', asn: 'AS15169', asnOrg: 'Google Cloud', deviceType: 'router' as const, cloudProvider: 'gcp' as const },
    { ip: '52.93.127.1', hostname: 'aws-edge-01.us-east-1', location: 'Virginia, US', asn: 'AS16509', asnOrg: 'Amazon', deviceType: 'firewall' as const, cloudProvider: 'aws' as const },
    { ip: '13.107.4.1', hostname: 'azure-gw-01.eastus', location: 'Virginia, US', asn: 'AS8075', asnOrg: 'Microsoft', deviceType: 'router' as const, cloudProvider: 'azure' as const },
  ];

  let baseLatency = 1;

  for (let i = 0; i < hopCount; i++) {
    const isLastHop = i === hopCount - 1;
    const mockIndex = Math.min(i, mockHosts.length - 1);
    const mockData = mockHosts[mockIndex];

    // Increase latency as we go further
    baseLatency += Math.random() * 15 + 5;

    // Random chance of timeout or packet loss
    const hasIssue = Math.random() < 0.1;
    const isTimeout = hasIssue && Math.random() < 0.3;
    const packetLoss = hasIssue ? Math.random() * 20 : Math.random() * 2;

    const latencies = isTimeout ? [] : generateLatency(baseLatency, baseLatency * 0.2);
    const avgLatency = latencies.length > 0 ? latencies.reduce((a, b) => a + b, 0) / latencies.length : 0;

    hops.push({
      hopNumber: i + 1,
      ipAddress: isLastHop ? destination : mockData.ip.replace(/\d+$/, String(i + 1)),
      hostname: isLastHop ? `target-${destination.replace(/\./g, '-')}` : mockData.hostname,
      location: mockData.location,
      asn: mockData.asn || null,
      asnOrg: mockData.asnOrg || null,
      latency: latencies,
      avgLatency: parseFloat(avgLatency.toFixed(2)),
      minLatency: latencies.length > 0 ? parseFloat(Math.min(...latencies).toFixed(2)) : 0,
      maxLatency: latencies.length > 0 ? parseFloat(Math.max(...latencies).toFixed(2)) : 0,
      jitter: latencies.length > 0 ? parseFloat((Math.max(...latencies) - Math.min(...latencies)).toFixed(2)) : 0,
      packetLoss: parseFloat(packetLoss.toFixed(1)),
      status: isTimeout ? 'timeout' : (packetLoss > 10 ? 'unreachable' : 'reachable'),
      deviceType: mockData.deviceType,
      cloudProvider: mockData.cloudProvider || null,
      region: mockData.cloudProvider ? 'us-east-1' : undefined,
    });
  }

  return hops;
};

// Determine path health based on hops
const calculateHealth = (hops: PathHop[]): PathHealth => {
  const avgPacketLoss = hops.reduce((sum, h) => sum + h.packetLoss, 0) / hops.length;
  const timeoutCount = hops.filter(h => h.status === 'timeout').length;
  const unreachableCount = hops.filter(h => h.status === 'unreachable').length;

  if (timeoutCount > 2 || unreachableCount > 1 || avgPacketLoss > 10) {
    return 'critical';
  }
  if (timeoutCount > 0 || avgPacketLoss > 5) {
    return 'degraded';
  }
  return 'healthy';
};

// Build history from real path analysis data
const buildHistoryFromRealData = (): PathAnalysisHistory[] => {
  return pathAnalysisDataset.path_analyses.slice(0, 20).map((analysis: PathAnalysisJson) => {
    let health: PathHealth = 'healthy';
    if (analysis.result === 'BLOCKED' || analysis.result === 'FAILED') {
      health = 'critical';
    } else if (analysis.summary.bottlenecks && analysis.summary.bottlenecks.length > 0) {
      health = 'degraded';
    }

    return {
      id: analysis.analysis_id,
      source: analysis.input.source,
      destination: analysis.input.destination,
      timestamp: analysis.analysis_timestamp,
      totalHops: analysis.summary.total_hops,
      avgLatency: analysis.summary.path_latency_ms ?? 0,
      health,
      status: 'completed' as const,
    };
  });
};

// Mock history data - populated from real dataset
let mockHistory: PathAnalysisHistory[] = buildHistoryFromRealData();

// Build saved paths from unique source-destination pairs in real data
const buildSavedPathsFromRealData = (): SavedPath[] => {
  const uniquePaths = new Map<string, typeof pathAnalysisDataset.path_analyses[0]>();

  pathAnalysisDataset.path_analyses.forEach((analysis: PathAnalysisJson) => {
    const key = `${analysis.input.source}-${analysis.input.destination}`;
    if (!uniquePaths.has(key)) {
      uniquePaths.set(key, analysis);
    }
  });

  return Array.from(uniquePaths.values()).slice(0, 10).map((analysis, idx) => ({
    id: `sp-${idx + 1}`,
    name: `${analysis.input.source} to ${analysis.input.destination}`,
    source: analysis.input.source_ip || analysis.input.source,
    destination: analysis.input.destination_ip || analysis.input.destination,
    protocol: analysis.input.protocol.toLowerCase() as 'icmp' | 'tcp' | 'udp',
    port: analysis.input.port || undefined,
    createdAt: analysis.analysis_timestamp,
    lastRun: analysis.analysis_timestamp,
    runCount: Math.floor(Math.random() * 50) + 1,
  }));
};

// Mock saved paths - populated from real dataset
let mockSavedPaths: SavedPath[] = buildSavedPathsFromRealData();

export const pathAnalysisService = {
  // Run path analysis (traceroute)
  async runAnalysis(request: PathAnalysisRequest): Promise<PathAnalysisResult> {
    await delay(2000 + Math.random() * 2000); // Simulate varying response time

    const startTime = new Date().toISOString();
    const hops = generateHops(request.destination);
    const endTime = new Date().toISOString();

    const totalLatency = hops.reduce((sum, h) => sum + h.avgLatency, 0);
    const avgLatency = totalLatency / hops.length;
    const packetLoss = hops.reduce((sum, h) => sum + h.packetLoss, 0) / hops.length;

    const result: PathAnalysisResult = {
      id: `pa-${Date.now()}`,
      source: request.source,
      destination: request.destination,
      protocol: request.protocol,
      port: request.port,
      hops,
      totalHops: hops.length,
      totalLatency: parseFloat(totalLatency.toFixed(2)),
      avgLatency: parseFloat(avgLatency.toFixed(2)),
      packetLoss: parseFloat(packetLoss.toFixed(1)),
      health: calculateHealth(hops),
      status: 'completed',
      startTime,
      endTime,
      duration: 2000 + Math.random() * 2000,
      mtu: 1500,
      ttl: request.maxHops || 30,
    };

    // Add to history
    mockHistory.unshift({
      id: result.id,
      source: result.source,
      destination: result.destination,
      timestamp: result.startTime,
      totalHops: result.totalHops,
      avgLatency: result.avgLatency,
      health: result.health,
      status: result.status,
    });

    // Limit history to 20 items
    if (mockHistory.length > 20) {
      mockHistory = mockHistory.slice(0, 20);
    }

    return result;
  },

  // Get analysis history
  async getHistory(): Promise<PathAnalysisHistory[]> {
    await delay(300);
    return mockHistory;
  },

  // Clear history
  async clearHistory(): Promise<void> {
    await delay(200);
    mockHistory = [];
  },

  // Get saved paths
  async getSavedPaths(): Promise<SavedPath[]> {
    await delay(300);
    return mockSavedPaths;
  },

  // Save a path
  async savePath(path: Omit<SavedPath, 'id' | 'createdAt' | 'lastRun' | 'runCount'>): Promise<SavedPath> {
    await delay(300);
    const newPath: SavedPath = {
      ...path,
      id: `sp-${Date.now()}`,
      createdAt: new Date().toISOString(),
      lastRun: null,
      runCount: 0,
    };
    mockSavedPaths.unshift(newPath);
    return newPath;
  },

  // Delete a saved path
  async deleteSavedPath(id: string): Promise<void> {
    await delay(200);
    mockSavedPaths = mockSavedPaths.filter(p => p.id !== id);
  },

  // Update saved path run info
  async updateSavedPathRun(id: string): Promise<void> {
    await delay(100);
    const path = mockSavedPaths.find(p => p.id === id);
    if (path) {
      path.lastRun = new Date().toISOString();
      path.runCount += 1;
    }
  },
};
