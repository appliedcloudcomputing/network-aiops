/**
 * Traffic Path Analysis - Network Topology and Flow Visualization
 */

import React, { useState } from 'react';
import { PageContainer, Card } from '../../components';
import { trafficPathData } from '../../data/trafficPathData';
import type { NetworkNode, NetworkPath, PathAnomaly, BottleneckAnalysis, NodeType, NodeStatus } from '../../types/trafficPath';

type ViewMode = 'graph' | 'list';

export const TrafficPathView: React.FC = () => {
  const { nodes, links, paths, flows, anomalies, bottlenecks, metrics } = trafficPathData;
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedPath, setSelectedPath] = useState<NetworkPath | null>(null);
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);

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

  return (
    <PageContainer>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Traffic Path Analysis</h1>
        <p className="text-slate-400">Network topology visualization and traffic flow analysis</p>
      </div>

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
            onClick={() => setViewMode('graph')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'graph'
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
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'list'
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

      {viewMode === 'graph' ? (
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
    </PageContainer>
  );
};

// Path List Item Component
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

// Node Details Card Component
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

// Anomaly Card Component
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

// Bottleneck Card Component
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
