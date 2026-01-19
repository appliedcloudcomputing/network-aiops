/**
 * Enhanced Application Dependency Map - Service Topology Visualization
 * Real-time service health, latency metrics, and dependency tracking
 */

import React, { useState } from 'react';
import { PageContainer, Card, Button } from '../../components';
import { serviceTopology, topologyMetrics } from '../../data/dependencyMapData';
import type { Service, ServiceStatus, ServiceTier } from '../../types/dependencyMap';

export const DependencyMapViewEnhanced: React.FC = () => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [filterStatus, setFilterStatus] = useState<ServiceStatus | 'all'>('all');
  const [filterTier, setFilterTier] = useState<ServiceTier | 'all'>('all');
  const [highlightCritical, setHighlightCritical] = useState(false);

  const filteredServices = serviceTopology.services.filter((service) => {
    if (filterStatus !== 'all' && service.health.status !== filterStatus) return false;
    if (filterTier !== 'all' && service.tier !== filterTier) return false;
    return true;
  });

  const getStatusColor = (status: ServiceStatus) => {
    switch (status) {
      case 'healthy': return 'emerald';
      case 'degraded': return 'amber';
      case 'down': return 'red';
      default: return 'slate';
    }
  };

  const getTierColor = (tier: ServiceTier) => {
    switch (tier) {
      case 'frontend': return 'from-blue-600 to-blue-700';
      case 'backend': return 'from-purple-600 to-purple-700';
      case 'database': return 'from-green-600 to-green-700';
      case 'cache': return 'from-orange-600 to-orange-700';
      case 'queue': return 'from-pink-600 to-pink-700';
      case 'external': return 'from-slate-600 to-slate-700';
      default: return 'from-gray-600 to-gray-700';
    }
  };

  return (
    <PageContainer>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Application Dependency Map</h1>
        <p className="text-slate-400">
          Real-time service topology with health scores and latency monitoring
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        <Card className="p-4">
          <p className="text-slate-400 text-sm mb-1">Total Services</p>
          <p className="text-3xl font-bold text-white">{topologyMetrics.totalServices}</p>
        </Card>
        <Card className="p-4">
          <p className="text-slate-400 text-sm mb-1">Healthy</p>
          <p className="text-3xl font-bold text-emerald-400">{topologyMetrics.healthyServices}</p>
        </Card>
        <Card className="p-4">
          <p className="text-slate-400 text-sm mb-1">Degraded</p>
          <p className="text-3xl font-bold text-amber-400">{topologyMetrics.degradedServices}</p>
        </Card>
        <Card className="p-4">
          <p className="text-slate-400 text-sm mb-1">Avg Latency</p>
          <p className="text-3xl font-bold text-cyan-400">{topologyMetrics.avgLatency.toFixed(0)}ms</p>
        </Card>
        <Card className="p-4">
          <p className="text-slate-400 text-sm mb-1">Active Issues</p>
          <p className="text-3xl font-bold text-red-400">{topologyMetrics.totalIssues}</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex gap-4">
            <div>
              <label className="text-slate-400 text-sm block mb-2">Status Filter</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as ServiceStatus | 'all')}
                className="bg-slate-700 text-white rounded px-3 py-2 text-sm"
              >
                <option value="all">All Statuses</option>
                <option value="healthy">Healthy</option>
                <option value="degraded">Degraded</option>
                <option value="down">Down</option>
              </select>
            </div>
            <div>
              <label className="text-slate-400 text-sm block mb-2">Tier Filter</label>
              <select
                value={filterTier}
                onChange={(e) => setFilterTier(e.target.value as ServiceTier | 'all')}
                className="bg-slate-700 text-white rounded px-3 py-2 text-sm"
              >
                <option value="all">All Tiers</option>
                <option value="frontend">Frontend</option>
                <option value="backend">Backend</option>
                <option value="database">Database</option>
                <option value="cache">Cache</option>
                <option value="queue">Queue</option>
                <option value="external">External</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant={highlightCritical ? 'primary' : 'ghost'}
              onClick={() => setHighlightCritical(!highlightCritical)}
            >
              {highlightCritical ? '✓ ' : ''}Critical Paths
            </Button>
            <Button variant="secondary">Export Topology</Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-3 gap-6">
        {/* Service Grid */}
        <div className="col-span-2">
          <Card className="p-6">
            <h3 className="text-white font-semibold mb-4">Service Topology ({filteredServices.length} services)</h3>
            <div className="grid grid-cols-3 gap-4 max-h-[700px] overflow-y-auto">
              {filteredServices.map((service) => {
                const statusColor = getStatusColor(service.health.status);
                const tierGradient = getTierColor(service.tier);
                const isSelected = selectedService?.id === service.id;
                const hasCriticalDeps = service.dependencies.some(d => d.critical);

                return (
                  <div
                    key={service.id}
                    onClick={() => setSelectedService(service)}
                    className={`p-4 rounded-lg cursor-pointer transition-all ${
                      isSelected
                        ? 'ring-2 ring-cyan-500 scale-105'
                        : 'hover:scale-102'
                    } ${highlightCritical && !hasCriticalDeps ? 'opacity-40' : ''}`}
                    style={{
                      background: `linear-gradient(to br, var(--tw-gradient-stops))`,
                    }}
                  >
                    <div className={`bg-gradient-to-br ${tierGradient} p-4 rounded-lg`}>
                      {/* Status Indicator */}
                      <div className="flex items-start justify-between mb-2">
                        <div className={`w-3 h-3 rounded-full bg-${statusColor}-500 ring-2 ring-${statusColor}-500/30`}></div>
                        {hasCriticalDeps && (
                          <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">
                            Critical
                          </span>
                        )}
                      </div>

                      {/* Service Name */}
                      <h4 className="text-white font-semibold text-sm mb-1 truncate">
                        {service.displayName}
                      </h4>
                      <p className="text-white/60 text-xs mb-3">{service.tier}</p>

                      {/* Metrics */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-white/60">Latency:</span>
                          <span className={`font-semibold ${
                            service.metrics.avgLatencyMs > 100 ? 'text-red-400' : 'text-emerald-400'
                          }`}>
                            {service.metrics.avgLatencyMs}ms
                          </span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-white/60">RPS:</span>
                          <span className="text-white font-semibold">
                            {service.metrics.requestsPerSecond}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-white/60">Error:</span>
                          <span className={`font-semibold ${
                            service.metrics.errorRate > 0.5 ? 'text-red-400' : 'text-emerald-400'
                          }`}>
                            {service.metrics.errorRate.toFixed(2)}%
                          </span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-white/60">Health:</span>
                          <span className="text-white font-semibold">
                            {service.health.healthScore}/100
                          </span>
                        </div>
                      </div>

                      {/* Dependencies Count */}
                      {service.dependencies.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-white/10">
                          <span className="text-xs text-white/60">
                            {service.dependencies.length} dependencies
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Service Details Panel */}
        <div>
          <Card className="p-6 sticky top-6">
            {selectedService ? (
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-white font-semibold text-lg mb-1">
                      {selectedService.displayName}
                    </h3>
                    <p className="text-slate-400 text-sm">{selectedService.description}</p>
                  </div>
                  <button
                    onClick={() => setSelectedService(null)}
                    className="text-slate-400 hover:text-white"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Service Info */}
                <div className="space-y-4 mb-6">
                  <div>
                    <p className="text-slate-400 text-xs mb-1">Version</p>
                    <p className="text-white font-mono text-sm">{selectedService.version}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs mb-1">Team</p>
                    <p className="text-white text-sm">{selectedService.team}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs mb-1">Region</p>
                    <p className="text-white text-sm">{selectedService.region}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs mb-1">Instances</p>
                    <p className="text-white text-sm">{selectedService.instances || 'N/A'}</p>
                  </div>
                </div>

                {/* Health Status */}
                <div className="p-4 bg-slate-700/30 rounded-lg mb-6">
                  <p className="text-slate-400 text-xs mb-2">Health Status</p>
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`w-3 h-3 rounded-full bg-${getStatusColor(selectedService.health.status)}-500`}></div>
                    <span className="text-white font-semibold capitalize">
                      {selectedService.health.status}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Uptime:</span>
                      <span className="text-white">{selectedService.health.uptime}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Health Score:</span>
                      <span className="text-white">{selectedService.health.healthScore}/100</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Incidents:</span>
                      <span className={selectedService.health.incidents > 0 ? 'text-amber-400' : 'text-emerald-400'}>
                        {selectedService.health.incidents}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="p-4 bg-slate-700/30 rounded-lg mb-6">
                  <p className="text-slate-400 text-xs mb-3">Performance Metrics</p>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-400">CPU Usage</span>
                        <span className="text-white">{selectedService.metrics.cpuUsage}%</span>
                      </div>
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            selectedService.metrics.cpuUsage > 80 ? 'bg-red-500' : 'bg-cyan-500'
                          }`}
                          style={{ width: `${selectedService.metrics.cpuUsage}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-400">Memory Usage</span>
                        <span className="text-white">{selectedService.metrics.memoryUsage}%</span>
                      </div>
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            selectedService.metrics.memoryUsage > 80 ? 'bg-red-500' : 'bg-purple-500'
                          }`}
                          style={{ width: `${selectedService.metrics.memoryUsage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dependencies */}
                {selectedService.dependencies.length > 0 && (
                  <div>
                    <p className="text-slate-400 text-xs mb-3">
                      Dependencies ({selectedService.dependencies.length})
                    </p>
                    <div className="space-y-2">
                      {selectedService.dependencies.map((dep, idx) => {
                        const targetService = serviceTopology.services.find(s => s.id === dep.targetServiceId);
                        return (
                          <div
                            key={idx}
                            className="p-3 bg-slate-700/30 rounded border border-slate-600 hover:border-cyan-500 transition-colors"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <p className="text-white text-sm font-semibold">
                                  {targetService?.displayName || dep.targetServiceId}
                                </p>
                                <p className="text-slate-400 text-xs">{dep.type} via {dep.protocol}</p>
                              </div>
                              {dep.critical && (
                                <span className="px-2 py-0.5 bg-red-500/20 text-red-400 rounded text-xs">
                                  Critical
                                </span>
                              )}
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div>
                                <span className="text-slate-400">Latency:</span>
                                <span className={`ml-1 font-semibold ${
                                  dep.latencyMs > 100 ? 'text-red-400' : 'text-emerald-400'
                                }`}>
                                  {dep.latencyMs}ms
                                </span>
                              </div>
                              <div>
                                <span className="text-slate-400">RPS:</span>
                                <span className="ml-1 text-white font-semibold">{dep.requestsPerSecond}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Tags */}
                {selectedService.tags.length > 0 && (
                  <div className="mt-6">
                    <p className="text-slate-400 text-xs mb-2">Tags</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedService.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-slate-700 text-slate-300 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-slate-400 mb-2">Select a service to view details</p>
                <p className="text-slate-500 text-sm">Click on any service card to see metrics and dependencies</p>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Issues Panel */}
      {serviceTopology.issues.length > 0 && (
        <Card className="p-6 mt-6">
          <h3 className="text-white font-semibold mb-4">Active Issues ({serviceTopology.issues.length})</h3>
          <div className="space-y-3">
            {serviceTopology.issues.map((issue) => {
              const affectedService = serviceTopology.services.find(s => s.id === issue.serviceId);
              return (
                <div key={issue.id} className="p-4 bg-slate-700/30 rounded-lg border border-slate-600">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                          issue.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                          issue.severity === 'high' ? 'bg-orange-500/20 text-orange-400' :
                          issue.severity === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                          'bg-blue-500/20 text-blue-400'
                        }`}>
                          {issue.severity.toUpperCase()}
                        </span>
                        <span className="px-2 py-0.5 bg-slate-600 text-slate-300 rounded text-xs">
                          {issue.type.replace('_', ' ')}
                        </span>
                      </div>
                      <h4 className="text-white font-semibold mb-1">{issue.title}</h4>
                      <p className="text-slate-300 text-sm mb-2">{issue.description}</p>
                      <p className="text-slate-400 text-xs">
                        Service: {affectedService?.displayName || issue.serviceId}
                      </p>
                    </div>
                  </div>
                  {issue.rootCause && (
                    <div className="mt-3 p-3 bg-slate-800/50 rounded">
                      <p className="text-amber-400 text-xs font-semibold mb-1">Root Cause:</p>
                      <p className="text-slate-300 text-xs">{issue.rootCause}</p>
                    </div>
                  )}
                  {issue.recommendation && (
                    <div className="mt-2 p-3 bg-cyan-500/10 rounded border border-cyan-500/30">
                      <p className="text-cyan-400 text-xs font-semibold mb-1">Recommendation:</p>
                      <p className="text-slate-300 text-xs">{issue.recommendation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </PageContainer>
  );
};
