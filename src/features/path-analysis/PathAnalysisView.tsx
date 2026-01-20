/**
 * Unified Path Analysis View - Consolidates Classic, Graph, and Traffic Analysis
 * MERGE #1: Path Analysis Consolidation (3 views → 1 with tabs)
 */

import React, { useState } from 'react';
import { PageContainer, Card, Button, Input, Select, Badge, Modal } from '../../components';
import { usePathAnalysis } from './hooks/usePathAnalysis';
import { COMMON_DESTINATIONS, type PathHop, type PathHealth } from '../../types/pathAnalysis';
import { PathGraphVisualizationComponent } from './components';
import { mockPathScenarios } from '../../data/pathAnalysisData';
import type { PathGraphVisualization } from '../../types/pathAnalysis';
import { trafficPathData } from '../../data/trafficPathData';
import type { NetworkNode, NetworkPath, PathAnomaly, BottleneckAnalysis, NodeType, NodeStatus } from '../../types/trafficPath';

type TabView = 'classic' | 'graph' | 'traffic';
type GraphScenario = 'healthy' | 'blocked' | 'asymmetric' | 'missingRule' | 'custom';
type TrafficViewMode = 'graph' | 'list';

// Health badge component
const HealthBadge: React.FC<{ health: PathHealth }> = ({ health }) => {
  const variants: Record<PathHealth, 'success' | 'warning' | 'error' | 'default'> = {
    healthy: 'success',
    degraded: 'warning',
    critical: 'error',
    unknown: 'default',
  };
  return <Badge variant={variants[health]}>{health}</Badge>;
};

// Hop status indicator
const HopStatusIndicator: React.FC<{ status: string; latency: number }> = ({ status, latency }) => {
  const getColor = () => {
    if (status === 'timeout') return 'bg-gray-400';
    if (status === 'unreachable') return 'bg-red-500';
    if (latency > 100) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className={`w-3 h-3 rounded-full ${getColor()}`} title={status} />
  );
};

// Hop row component
const HopRow: React.FC<{ hop: PathHop; isLast: boolean }> = ({ hop, isLast }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="relative">
      {/* Connection line */}
      {!isLast && (
        <div className="absolute left-[18px] top-10 w-0.5 h-8 bg-gray-300" />
      )}

      <div
        className={`border rounded-lg p-3 mb-2 cursor-pointer transition-all ${
          expanded ? 'bg-gray-50 border-blue-300' : 'bg-white hover:bg-gray-50'
        }`}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-4">
          {/* Hop number with status */}
          <div className="flex items-center gap-2 w-16">
            <HopStatusIndicator status={hop.status} latency={hop.avgLatency} />
            <span className="text-sm font-medium text-gray-600">#{hop.hopNumber}</span>
          </div>

          {/* IP and hostname */}
          <div className="flex-1 min-w-0">
            <div className="font-mono text-sm text-gray-900">{hop.ipAddress}</div>
            {hop.hostname && (
              <div className="text-xs text-gray-500 truncate">{hop.hostname}</div>
            )}
          </div>

          {/* Location */}
          <div className="hidden md:block w-32 text-sm text-gray-600">
            {hop.location || '-'}
          </div>

          {/* Latency */}
          <div className="w-24 text-right">
            {hop.status === 'timeout' ? (
              <span className="text-gray-400">* * *</span>
            ) : (
              <span className={`font-medium ${
                hop.avgLatency > 100 ? 'text-yellow-600' :
                hop.avgLatency > 50 ? 'text-blue-600' : 'text-green-600'
              }`}>
                {hop.avgLatency.toFixed(1)} ms
              </span>
            )}
          </div>

          {/* Packet loss */}
          <div className="w-20 text-right">
            <span className={`text-sm ${hop.packetLoss > 5 ? 'text-red-600' : 'text-gray-500'}`}>
              {hop.packetLoss.toFixed(1)}% loss
            </span>
          </div>

          {/* Cloud provider badge */}
          <div className="w-20">
            {hop.cloudProvider && (
              <Badge variant="default" className="text-xs">
                {hop.cloudProvider.toUpperCase()}
              </Badge>
            )}
          </div>

          {/* Expand icon */}
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* Expanded details */}
        {expanded && (
          <div className="mt-3 pt-3 border-t grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-gray-500">Min Latency</div>
              <div className="font-medium">{hop.minLatency.toFixed(2)} ms</div>
            </div>
            <div>
              <div className="text-gray-500">Max Latency</div>
              <div className="font-medium">{hop.maxLatency.toFixed(2)} ms</div>
            </div>
            <div>
              <div className="text-gray-500">Jitter</div>
              <div className="font-medium">{hop.jitter.toFixed(2)} ms</div>
            </div>
            <div>
              <div className="text-gray-500">Device Type</div>
              <div className="font-medium capitalize">{hop.deviceType || 'Unknown'}</div>
            </div>
            {hop.asn && (
              <>
                <div>
                  <div className="text-gray-500">ASN</div>
                  <div className="font-medium">{hop.asn}</div>
                </div>
                <div>
                  <div className="text-gray-500">Organization</div>
                  <div className="font-medium">{hop.asnOrg || '-'}</div>
                </div>
              </>
            )}
            {hop.region && (
              <div>
                <div className="text-gray-500">Region</div>
                <div className="font-medium">{hop.region}</div>
              </div>
            )}
            <div>
              <div className="text-gray-500">RTT Samples</div>
              <div className="font-mono text-xs">
                {hop.latency.length > 0
                  ? hop.latency.map(l => l.toFixed(1)).join(' / ')
                  : '* / * / *'
                }
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Traffic Analysis Components
const getNodeTypeColor = (type: NodeType): string => {
  const colors: Record<NodeType, string> = {
    router: 'bg-blue-100 text-blue-700',
    switch: 'bg-purple-100 text-purple-700',
    firewall: 'bg-red-100 text-red-700',
    load_balancer: 'bg-green-100 text-green-700',
    server: 'bg-gray-100 text-gray-700',
    client: 'bg-yellow-100 text-yellow-700',
    cloud_gateway: 'bg-cyan-100 text-cyan-700',
    vpn_gateway: 'bg-indigo-100 text-indigo-700',
  };
  return colors[type];
};

const getStatusColor = (status: NodeStatus | string): string => {
  const colors: Record<string, string> = {
    healthy: 'text-green-500',
    warning: 'text-amber-500',
    critical: 'text-red-500',
    offline: 'text-gray-500',
    optimal: 'text-green-500',
    suboptimal: 'text-yellow-500',
    degraded: 'text-amber-500',
    broken: 'text-red-500',
  };
  return colors[status] || 'text-gray-500';
};

const PathListItem: React.FC<{ path: NetworkPath; isSelected: boolean; onClick: () => void }> = ({ path, isSelected, onClick }) => {
  const statusColors = {
    optimal: 'border-green-200 bg-green-50',
    suboptimal: 'border-yellow-200 bg-yellow-50',
    degraded: 'border-amber-200 bg-amber-50',
    broken: 'border-red-200 bg-red-50',
  };

  const statusBadge = {
    optimal: 'bg-green-100 text-green-700',
    suboptimal: 'bg-yellow-100 text-yellow-700',
    degraded: 'bg-amber-100 text-amber-700',
    broken: 'bg-red-100 text-red-700',
  };

  return (
    <div
      className={`border rounded-lg p-4 cursor-pointer transition-all ${
        isSelected ? statusColors[path.status] : 'bg-white hover:bg-slate-50'
      }`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h4 className="font-semibold text-slate-800 mb-1">{path.name}</h4>
          <div className="text-xs text-slate-600 font-mono">
            {path.source.ipAddress} → {path.destination.ipAddress}
          </div>
        </div>
        <span className={`text-xs px-2 py-1 rounded ${statusBadge[path.status]}`}>
          {path.status}
        </span>
      </div>

      <div className="grid grid-cols-4 gap-3 mt-3">
        <div>
          <div className="text-xs text-slate-500">Latency</div>
          <div className="text-sm font-semibold text-slate-800">{path.totalLatency.toFixed(1)} ms</div>
        </div>
        <div>
          <div className="text-xs text-slate-500">Hops</div>
          <div className="text-sm font-semibold text-slate-800">{path.hops.length}</div>
        </div>
        <div>
          <div className="text-xs text-slate-500">Loss</div>
          <div className={`text-sm font-semibold ${path.totalPacketLoss > 0.1 ? 'text-red-600' : 'text-green-600'}`}>
            {path.totalPacketLoss.toFixed(2)}%
          </div>
        </div>
        <div>
          <div className="text-xs text-slate-500">Bandwidth</div>
          <div className="text-sm font-semibold text-slate-800">{(path.bandwidth / 1000).toFixed(1)} Gbps</div>
        </div>
      </div>

      {isSelected && (
        <div className="mt-4 pt-4 border-t border-slate-200">
          <h5 className="text-xs font-semibold text-slate-700 mb-2">Path Hops:</h5>
          <div className="space-y-2">
            {path.hops.map((hop) => (
              <div key={hop.nodeId} className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-2 w-12">
                  <div className={`w-2 h-2 rounded-full ${hop.packetLoss > 0.1 ? 'bg-red-500' : 'bg-green-500'}`}></div>
                  <span className="text-slate-600">#{hop.hopNumber}</span>
                </div>
                <div className="flex-1 font-mono text-slate-700">{hop.nodeName}</div>
                <div className="text-slate-600">{hop.latency.toFixed(1)} ms</div>
                {hop.packetLoss > 0 && (
                  <div className="text-red-600">{hop.packetLoss.toFixed(2)}% loss</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const NodeDetailsCard: React.FC<{ node: NetworkNode }> = ({ node }) => {
  return (
    <div className="space-y-4">
      <div>
        <div className="text-xs text-slate-500 mb-1">Status</div>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${node.status === 'healthy' ? 'bg-green-500' : node.status === 'warning' ? 'bg-amber-500' : 'bg-red-500'}`}></div>
          <span className="text-sm font-medium capitalize">{node.status}</span>
        </div>
      </div>
      <div>
        <div className="text-xs text-slate-500 mb-1">Type</div>
        <div className="text-sm font-medium">{node.type.replace('_', ' ')}</div>
      </div>
      <div>
        <div className="text-xs text-slate-500 mb-1">IP Address</div>
        <div className="text-sm font-mono">{node.ipAddress}</div>
      </div>
      <div>
        <div className="text-xs text-slate-500 mb-1">Location</div>
        <div className="text-sm">{node.location}</div>
      </div>
      {node.vendor && (
        <div>
          <div className="text-xs text-slate-500 mb-1">Vendor / Model</div>
          <div className="text-sm">{node.vendor} {node.model}</div>
        </div>
      )}
      <div>
        <div className="text-xs text-slate-500 mb-1">Uptime</div>
        <div className="text-sm">{node.uptime}</div>
      </div>
      <div className="pt-4 border-t border-slate-200">
        <div className="text-xs font-semibold text-slate-700 mb-3">Metrics</div>
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-600">CPU Usage</span>
              <span className="font-medium">{node.metrics.cpuUsage}%</span>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full">
              <div
                className={`h-full rounded-full ${node.metrics.cpuUsage > 80 ? 'bg-red-500' : node.metrics.cpuUsage > 60 ? 'bg-amber-500' : 'bg-green-500'}`}
                style={{ width: `${node.metrics.cpuUsage}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-600">Memory Usage</span>
              <span className="font-medium">{node.metrics.memoryUsage}%</span>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full">
              <div
                className={`h-full rounded-full ${node.metrics.memoryUsage > 80 ? 'bg-red-500' : node.metrics.memoryUsage > 60 ? 'bg-amber-500' : 'bg-green-500'}`}
                style={{ width: `${node.metrics.memoryUsage}%` }}
              />
            </div>
          </div>
          <div className="text-xs text-slate-600">
            <div className="flex justify-between py-1">
              <span>Active Flows:</span>
              <span className="font-medium">{node.metrics.activeFlows.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-1">
              <span>Connections:</span>
              <span className="font-medium">{node.metrics.totalConnections.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AnomalyCard: React.FC<{ anomaly: PathAnomaly }> = ({ anomaly }) => {
  const severityColors = {
    critical: 'bg-red-50 border-red-200 text-red-700',
    high: 'bg-orange-50 border-orange-200 text-orange-700',
    medium: 'bg-amber-50 border-amber-200 text-amber-700',
    low: 'bg-yellow-50 border-yellow-200 text-yellow-700',
  };

  return (
    <div className={`border rounded-lg p-3 ${severityColors[anomaly.severity]}`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs px-2 py-0.5 bg-white bg-opacity-60 rounded font-medium">
              {anomaly.type.replace('_', ' ')}
            </span>
            <span className="text-xs">
              {Math.floor(anomaly.duration / 60)}m {anomaly.duration % 60}s
            </span>
          </div>
          <p className="text-sm font-medium">{anomaly.description}</p>
        </div>
      </div>
      <div className="mt-2 text-xs">
        <div className="flex items-center justify-between py-1">
          <span>Normal:</span>
          <span className="font-mono">{anomaly.baseline.normalValue}</span>
        </div>
        <div className="flex items-center justify-between py-1">
          <span>Current:</span>
          <span className="font-mono font-medium">{anomaly.baseline.currentValue}</span>
        </div>
        <div className="flex items-center justify-between py-1">
          <span>Deviation:</span>
          <span className="font-semibold">+{anomaly.baseline.deviation}%</span>
        </div>
      </div>
      {anomaly.recommendation && (
        <div className="mt-2 pt-2 border-t border-current border-opacity-20">
          <p className="text-xs"><span className="font-semibold">Recommendation:</span> {anomaly.recommendation}</p>
        </div>
      )}
    </div>
  );
};

const BottleneckCard: React.FC<{ bottleneck: BottleneckAnalysis }> = ({ bottleneck }) => {
  const severityColors = {
    critical: 'bg-red-50 border-red-200',
    high: 'bg-orange-50 border-orange-200',
    medium: 'bg-amber-50 border-amber-200',
    low: 'bg-yellow-50 border-yellow-200',
  };

  return (
    <div className={`border rounded-lg p-3 ${severityColors[bottleneck.severity]}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-semibold text-slate-800">{bottleneck.nodeName}</div>
        <span className="text-xs px-2 py-0.5 bg-white bg-opacity-60 rounded text-slate-700 font-medium">
          {bottleneck.type}
        </span>
      </div>
      <div className="text-xs text-slate-700 mb-2">
        {bottleneck.currentValue}% (threshold: {bottleneck.threshold}%)
      </div>
      <div className="w-full h-2 bg-white bg-opacity-40 rounded-full mb-2">
        <div
          className="h-full bg-red-500 rounded-full"
          style={{ width: `${Math.min(bottleneck.currentValue, 100)}%` }}
        />
      </div>
      <p className="text-xs text-slate-600">{bottleneck.estimatedImpact}</p>
    </div>
  );
};

export const PathAnalysisView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabView>('classic');

  // Classic View State
  const {
    source,
    destination,
    protocol,
    port,
    result,
    history,
    savedPaths,
    isRunning,
    isLoadingHistory,
    isLoadingSaved,
    error,
    setSource,
    setDestination,
    setProtocol,
    setPort,
    runAnalysis,
    runSavedPath,
    savePath,
    deleteSavedPath,
    clearHistory,
    clearResult,
    clearError,
  } = usePathAnalysis();

  const [showSaveModal, setShowSaveModal] = useState(false);
  const [pathName, setPathName] = useState('');
  const [classicActiveTab, setClassicActiveTab] = useState<'results' | 'saved' | 'history'>('results');

  // Graph View State
  const [selectedScenario, setSelectedScenario] = useState<GraphScenario>('healthy');
  const [pathData, setPathData] = useState<PathGraphVisualization>(mockPathScenarios.healthy);

  // Traffic View State
  const { nodes, links, paths, flows, anomalies, bottlenecks, metrics } = trafficPathData;
  const [trafficViewMode, setTrafficViewMode] = useState<TrafficViewMode>('list');
  const [selectedPath, setSelectedPath] = useState<NetworkPath | null>(null);
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);

  const handleSave = async () => {
    await savePath(pathName);
    setShowSaveModal(false);
    setPathName('');
  };

  const formatTimestamp = (ts: string) => {
    const date = new Date(ts);
    return date.toLocaleString();
  };

  const handleScenarioChange = (scenario: GraphScenario) => {
    setSelectedScenario(scenario);
    if (scenario !== 'custom') {
      setPathData(mockPathScenarios[scenario]);
    }
  };

  const scenarios = [
    {
      id: 'healthy' as GraphScenario,
      name: 'Healthy Path',
      description: 'Production to AWS - No issues',
      icon: '✅',
      color: 'from-emerald-500 to-emerald-600',
    },
    {
      id: 'blocked' as GraphScenario,
      name: 'Blocked Traffic',
      description: 'Firewall blocking UAT to Prod',
      icon: '🚫',
      color: 'from-red-500 to-red-600',
    },
    {
      id: 'asymmetric' as GraphScenario,
      name: 'Asymmetric Routing',
      description: 'Different forward/return paths',
      icon: '🔄',
      color: 'from-amber-500 to-amber-600',
    },
    {
      id: 'missingRule' as GraphScenario,
      name: 'Missing Rule',
      description: 'Fallback to default policy',
      icon: '⚠️',
      color: 'from-orange-500 to-orange-600',
    },
  ];

  return (
    <PageContainer>
      {/* Main Tab Navigation */}
      <div className="mb-6">
        <div className="flex gap-2 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('classic')}
            className={`px-6 py-3 font-semibold transition-colors relative ${
              activeTab === 'classic'
                ? 'text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Classic View
            {activeTab === 'classic' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('graph')}
            className={`px-6 py-3 font-semibold transition-colors relative ${
              activeTab === 'graph'
                ? 'text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Graph View
            {activeTab === 'graph' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('traffic')}
            className={`px-6 py-3 font-semibold transition-colors relative ${
              activeTab === 'traffic'
                ? 'text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Traffic Analysis
            {activeTab === 'traffic' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
            )}
          </button>
        </div>
      </div>

      {/* Classic View Tab Content */}
      {activeTab === 'classic' && (
        <>
          {/* Error Alert */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
              <span className="text-red-700">{error}</span>
              <button onClick={clearError} className="text-red-500 hover:text-red-700">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          {/* Input Section */}
          <Card className="bg-white shadow-lg mb-6">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Network Path Analysis</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
                {/* Source */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Source IP</label>
                  <Input
                    value={source}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSource(e.target.value)}
                    placeholder="e.g., 192.168.1.100"
                  />
                </div>

                {/* Destination */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
                  <Input
                    value={destination}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDestination(e.target.value)}
                    placeholder="e.g., 8.8.8.8"
                  />
                </div>

                {/* Protocol */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Protocol</label>
                  <Select
                    value={protocol}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setProtocol(e.target.value as 'icmp' | 'tcp' | 'udp')}
                  >
                    <option value="icmp">ICMP</option>
                    <option value="tcp">TCP</option>
                    <option value="udp">UDP</option>
                  </Select>
                </div>

                {/* Port (for TCP/UDP) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Port</label>
                  <Input
                    type="number"
                    value={port}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPort(e.target.value)}
                    placeholder="e.g., 443"
                    disabled={protocol === 'icmp'}
                  />
                </div>

                {/* Run button */}
                <div className="flex items-end">
                  <Button
                    onClick={runAnalysis}
                    disabled={isRunning}
                    className="w-full"
                  >
                    {isRunning ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Tracing...
                      </>
                    ) : (
                      'Run Traceroute'
                    )}
                  </Button>
                </div>
              </div>

              {/* Quick destinations */}
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-gray-500 mr-2">Quick targets:</span>
                {COMMON_DESTINATIONS.map((dest) => (
                  <button
                    key={dest.ip}
                    onClick={() => setDestination(dest.ip)}
                    className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded text-gray-700"
                  >
                    {dest.name}
                  </button>
                ))}
              </div>
            </div>
          </Card>

          {/* Tabs */}
          <div className="flex gap-2 mb-4">
            {(['results', 'saved', 'history'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setClassicActiveTab(tab)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  classicActiveTab === tab
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab === 'results' && 'Results'}
                {tab === 'saved' && `Saved Paths (${savedPaths.length})`}
                {tab === 'history' && `History (${history.length})`}
              </button>
            ))}
          </div>

          {/* Results Tab */}
          {classicActiveTab === 'results' && (
            <>
              {result ? (
                <Card className="bg-white shadow-lg">
                  <div className="p-6">
                    {/* Result summary */}
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Path: {result.source} &rarr; {result.destination}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {result.protocol.toUpperCase()}{result.port ? `:${result.port}` : ''} |
                          Completed at {formatTimestamp(result.endTime || result.startTime)}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <HealthBadge health={result.health} />
                        <Button
                          variant="secondary"
                          onClick={() => setShowSaveModal(true)}
                        >
                          Save Path
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={clearResult}
                        >
                          Clear
                        </Button>
                      </div>
                    </div>

                    {/* Summary stats */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">{result.totalHops}</div>
                        <div className="text-sm text-gray-500">Total Hops</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{result.avgLatency.toFixed(1)} ms</div>
                        <div className="text-sm text-gray-500">Avg Latency</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">{result.totalLatency.toFixed(1)} ms</div>
                        <div className="text-sm text-gray-500">Total RTT</div>
                      </div>
                      <div className="text-center">
                        <div className={`text-2xl font-bold ${result.packetLoss > 5 ? 'text-red-600' : 'text-green-600'}`}>
                          {result.packetLoss.toFixed(1)}%
                        </div>
                        <div className="text-sm text-gray-500">Packet Loss</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">{result.mtu}</div>
                        <div className="text-sm text-gray-500">MTU</div>
                      </div>
                    </div>

                    {/* Hop-by-hop results */}
                    <div>
                      <h4 className="text-md font-semibold text-gray-900 mb-4">Hop-by-Hop Path</h4>

                      {/* Legend */}
                      <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 rounded-full bg-green-500" />
                          <span>Healthy (&lt;50ms)</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 rounded-full bg-blue-500" />
                          <span>Normal (50-100ms)</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 rounded-full bg-yellow-500" />
                          <span>High Latency (&gt;100ms)</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 rounded-full bg-red-500" />
                          <span>Unreachable</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 rounded-full bg-gray-400" />
                          <span>Timeout</span>
                        </div>
                      </div>

                      {/* Hops list */}
                      <div className="space-y-0">
                        {result.hops.map((hop, index) => (
                          <HopRow
                            key={hop.hopNumber}
                            hop={hop}
                            isLast={index === result.hops.length - 1}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              ) : (
                <Card className="bg-white shadow-lg">
                  <div className="text-center py-16 text-gray-400">
                    {isRunning ? (
                      <div>
                        <svg className="animate-spin mx-auto h-12 w-12 text-blue-500 mb-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        <p className="text-gray-600">Running path analysis...</p>
                        <p className="text-sm text-gray-400 mt-2">Discovering network hops to {destination}</p>
                      </div>
                    ) : (
                      <div>
                        <svg className="mx-auto h-12 w-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                        <p>Enter a destination and click "Run Traceroute" to analyze the network path</p>
                      </div>
                    )}
                  </div>
                </Card>
              )}
            </>
          )}

          {/* Saved Paths Tab */}
          {classicActiveTab === 'saved' && (
            <Card className="bg-white shadow-lg">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Saved Paths</h3>

                {isLoadingSaved ? (
                  <div className="text-center py-8 text-gray-400">Loading saved paths...</div>
                ) : savedPaths.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    No saved paths. Run an analysis and save it for quick access.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {savedPaths.map((path) => (
                      <div
                        key={path.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{path.name}</div>
                          <div className="text-sm text-gray-500">
                            {path.source} &rarr; {path.destination}
                            <span className="mx-2">|</span>
                            {path.protocol.toUpperCase()}{path.port ? `:${path.port}` : ''}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            {path.runCount} runs | Last: {path.lastRun ? formatTimestamp(path.lastRun) : 'Never'}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="primary"
                            onClick={() => runSavedPath(path)}
                            disabled={isRunning}
                          >
                            Run
                          </Button>
                          <Button
                            variant="secondary"
                            onClick={() => deleteSavedPath(path.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* History Tab */}
          {classicActiveTab === 'history' && (
            <Card className="bg-white shadow-lg">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Analysis History</h3>
                  {history.length > 0 && (
                    <Button variant="secondary" onClick={clearHistory}>
                      Clear History
                    </Button>
                  )}
                </div>

                {isLoadingHistory ? (
                  <div className="text-center py-8 text-gray-400">Loading history...</div>
                ) : history.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">No analysis history yet.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 px-3 text-sm font-medium text-gray-500">Time</th>
                          <th className="text-left py-2 px-3 text-sm font-medium text-gray-500">Source</th>
                          <th className="text-left py-2 px-3 text-sm font-medium text-gray-500">Destination</th>
                          <th className="text-center py-2 px-3 text-sm font-medium text-gray-500">Hops</th>
                          <th className="text-center py-2 px-3 text-sm font-medium text-gray-500">Avg Latency</th>
                          <th className="text-center py-2 px-3 text-sm font-medium text-gray-500">Health</th>
                          <th className="text-center py-2 px-3 text-sm font-medium text-gray-500">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {history.map((item) => (
                          <tr key={item.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-3 text-sm text-gray-600">
                              {formatTimestamp(item.timestamp)}
                            </td>
                            <td className="py-3 px-3 text-sm font-mono text-gray-900">{item.source}</td>
                            <td className="py-3 px-3 text-sm font-mono text-gray-900">{item.destination}</td>
                            <td className="py-3 px-3 text-sm text-center text-gray-600">{item.totalHops}</td>
                            <td className="py-3 px-3 text-sm text-center text-gray-600">
                              {item.avgLatency.toFixed(1)} ms
                            </td>
                            <td className="py-3 px-3 text-center">
                              <HealthBadge health={item.health} />
                            </td>
                            <td className="py-3 px-3 text-center">
                              <Badge variant={item.status === 'completed' ? 'success' : 'error'}>
                                {item.status}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Save Path Modal */}
          {showSaveModal && (
            <Modal
              isOpen={showSaveModal}
              onClose={() => setShowSaveModal(false)}
              title="Save Path"
            >
              <div className="p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Path Name
                </label>
                <Input
                  value={pathName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPathName(e.target.value)}
                  placeholder="e.g., Production to AWS"
                  className="mb-4"
                />
                <div className="text-sm text-gray-500 mb-4">
                  {source} &rarr; {destination} ({protocol.toUpperCase()}{port ? `:${port}` : ''})
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="secondary" onClick={() => setShowSaveModal(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>
                    Save
                  </Button>
                </div>
              </div>
            </Modal>
          )}
        </>
      )}

      {/* Graph View Tab Content */}
      {activeTab === 'graph' && (
        <>
          {/* View Mode Toggle & Scenario Selector */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Path Info */}
            <Card className="p-4 col-span-3">
              <h3 className="text-white font-semibold mb-3">Current Path</h3>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-slate-400 mb-1">Source</p>
                  <p className="text-white font-mono">{pathData.source}</p>
                </div>
                <div>
                  <p className="text-slate-400 mb-1">Destination</p>
                  <p className="text-white font-mono">{pathData.destination}</p>
                </div>
                <div>
                  <p className="text-slate-400 mb-1">Total Hops</p>
                  <p className="text-white font-semibold">{pathData.hops.length}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Scenario Selector */}
          <div className="mb-6">
            <Card className="p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
                Sample Scenarios
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {scenarios.map((scenario) => (
                  <button
                    key={scenario.id}
                    onClick={() => handleScenarioChange(scenario.id)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      selectedScenario === scenario.id
                        ? 'border-cyan-500 bg-cyan-500/10 scale-105'
                        : 'border-slate-600 bg-slate-800 hover:border-slate-500'
                    }`}
                  >
                    <div className={`w-12 h-12 bg-gradient-to-br ${scenario.color} rounded-lg flex items-center justify-center text-2xl mb-3`}>
                      {scenario.icon}
                    </div>
                    <h4 className="text-white font-semibold mb-1">{scenario.name}</h4>
                    <p className="text-slate-400 text-xs">{scenario.description}</p>
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Main Visualization */}
          <PathGraphVisualizationComponent pathData={pathData} />
        </>
      )}

      {/* Traffic Analysis Tab Content */}
      {activeTab === 'traffic' && (
        <>
          {/* Metrics Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <div className="text-sm opacity-90 mb-1">Network Health</div>
              <div className="text-3xl font-bold">{metrics.healthScore}%</div>
              <div className="text-xs opacity-75 mt-1">
                {metrics.totalNodes} nodes, {metrics.totalLinks} links
              </div>
            </Card>
            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
              <div className="text-sm opacity-90 mb-1">Traffic Volume</div>
              <div className="text-3xl font-bold">{metrics.totalTrafficVolume} GB</div>
              <div className="text-xs opacity-75 mt-1">
                {metrics.activePaths} active paths
              </div>
            </Card>
            <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white">
              <div className="text-sm opacity-90 mb-1">Avg Latency</div>
              <div className="text-3xl font-bold">{metrics.averageLatency.toFixed(1)} ms</div>
              <div className="text-xs opacity-75 mt-1">
                {metrics.averageUtilization.toFixed(1)}% utilization
              </div>
            </Card>
            <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
              <div className="text-sm opacity-90 mb-1">Anomalies</div>
              <div className="text-3xl font-bold">{metrics.anomalyCount}</div>
              <div className="text-xs opacity-75 mt-1">
                {bottlenecks.length} bottlenecks detected
              </div>
            </Card>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex gap-2">
              <button
                onClick={() => setTrafficViewMode('graph')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  trafficViewMode === 'graph'
                    ? 'bg-cyan-500 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  Graph View
                </div>
              </button>
              <button
                onClick={() => setTrafficViewMode('list')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  trafficViewMode === 'list'
                    ? 'bg-cyan-500 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                  List View
                </div>
              </button>
            </div>
          </div>

          {trafficViewMode === 'graph' ? (
            /* Graph View */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Network Topology Graph */}
              <div className="lg:col-span-2">
                <Card className="bg-white shadow-lg">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">Network Topology</h3>
                  <div className="bg-slate-50 rounded-lg p-8 min-h-[600px] flex items-center justify-center border-2 border-dashed border-slate-300">
                    <div className="text-center">
                      <svg className="w-24 h-24 mx-auto text-slate-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                      <p className="text-lg text-slate-600 mb-2">Interactive Network Graph</p>
                      <p className="text-sm text-slate-500 max-w-md mx-auto">
                        This would display an interactive force-directed graph showing {nodes.length} nodes and {links.length} links.
                        Click nodes to see details, hover over links to see bandwidth and latency metrics.
                      </p>
                      <div className="mt-6 grid grid-cols-4 gap-3 max-w-lg mx-auto">
                        {nodes.slice(0, 8).map((node) => (
                          <button
                            key={node.id}
                            onClick={() => setSelectedNode(node)}
                            className="p-2 bg-white border border-slate-200 rounded-lg hover:border-cyan-500 transition-colors"
                          >
                            <div className={`w-3 h-3 rounded-full mx-auto mb-1 ${getStatusColor(node.status).replace('text-', 'bg-')}`}></div>
                            <div className="text-xs text-slate-600 truncate">{node.name}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Node Details Panel */}
              <div>
                {selectedNode ? (
                  <Card className="bg-white shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-slate-800">Node Details</h3>
                      <button
                        onClick={() => setSelectedNode(null)}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <NodeDetailsCard node={selectedNode} />
                  </Card>
                ) : (
                  <Card className="bg-white shadow-lg">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Network Nodes</h3>
                    <div className="space-y-2 max-h-[600px] overflow-y-auto">
                      {nodes.map((node) => (
                        <button
                          key={node.id}
                          onClick={() => setSelectedNode(node)}
                          className="w-full text-left p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-slate-800 text-sm">{node.name}</span>
                            <div className={`w-2 h-2 rounded-full ${getStatusColor(node.status).replace('text-', 'bg-')}`}></div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs px-2 py-0.5 rounded ${getNodeTypeColor(node.type)}`}>
                              {node.type.replace('_', ' ')}
                            </span>
                            <span className="text-xs text-slate-500">{node.ipAddress}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </Card>
                )}
              </div>
            </div>
          ) : (
            /* List View */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* Network Paths */}
                <Card className="bg-white shadow-lg">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">Network Paths</h3>
                  <div className="space-y-3">
                    {paths.map((path) => (
                      <PathListItem
                        key={path.id}
                        path={path}
                        isSelected={selectedPath?.id === path.id}
                        onClick={() => setSelectedPath(selectedPath?.id === path.id ? null : path)}
                      />
                    ))}
                  </div>
                </Card>

                {/* Anomalies */}
                {anomalies.length > 0 && (
                  <Card className="bg-white shadow-lg">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Path Anomalies</h3>
                    <div className="space-y-2">
                      {anomalies.map((anomaly) => (
                        <AnomalyCard key={anomaly.id} anomaly={anomaly} />
                      ))}
                    </div>
                  </Card>
                )}
              </div>

              {/* Right Panel */}
              <div className="space-y-6">
                {/* Bottlenecks */}
                <Card className="bg-white shadow-lg">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">Bottlenecks</h3>
                  <div className="space-y-2">
                    {bottlenecks.map((bottleneck) => (
                      <BottleneckCard key={bottleneck.nodeId} bottleneck={bottleneck} />
                    ))}
                  </div>
                </Card>

                {/* Traffic Flows */}
                <Card className="bg-white shadow-lg">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">Top Traffic Flows</h3>
                  <div className="space-y-2">
                    {flows.slice(0, 5).map((flow) => (
                      <div key={flow.id} className="p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-slate-700">{flow.protocol}</span>
                          <span className="text-xs text-slate-500">{(flow.volume / 1e9).toFixed(2)} GB</span>
                        </div>
                        <div className="text-xs text-slate-600 font-mono">
                          {flow.source} → {flow.destination}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          {flow.tags.map((tag) => (
                            <span key={tag} className="text-xs px-1.5 py-0.5 bg-slate-200 text-slate-600 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          )}
        </>
      )}
    </PageContainer>
  );
};
