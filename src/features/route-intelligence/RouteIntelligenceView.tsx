/**
 * Route Intelligence - AI-Powered Routing Analysis View
 */

import React, { useState } from 'react';
import { PageContainer, Card, Badge } from '../../components';
import { routeIntelligenceData } from '../../data/routeIntelligenceData';
import type { NetworkRoute, RouteStatus, RouteHealth } from '../../types/routeIntelligence';

export const RouteIntelligenceView: React.FC = () => {
  const { routes, summary, metrics, optimizationOpportunities, recentAnomalies } = routeIntelligenceData;
  const [selectedRoute, setSelectedRoute] = useState<NetworkRoute | null>(null);
  const [filterStatus, setFilterStatus] = useState<RouteStatus | 'all'>('all');
  const [filterHealth, setFilterHealth] = useState<RouteHealth | 'all'>('all');

  const filteredRoutes = routes.filter((route) => {
    if (filterStatus !== 'all' && route.status !== filterStatus) return false;
    if (filterHealth !== 'all' && route.health !== filterHealth) return false;
    return true;
  });

  const getStatusColor = (status: RouteStatus) => {
    switch (status) {
      case 'optimal': return 'bg-emerald-500';
      case 'suboptimal': return 'bg-yellow-500';
      case 'degraded': return 'bg-orange-500';
      case 'failing': return 'bg-red-500';
      case 'blackhole': return 'bg-red-900';
    }
  };

  const getStatusBadge = (status: RouteStatus) => {
    switch (status) {
      case 'optimal': return 'success';
      case 'suboptimal': return 'warning';
      case 'degraded': return 'warning';
      case 'failing': return 'error';
      case 'blackhole': return 'error';
    }
  };

  const getHealthColor = (health: RouteHealth) => {
    switch (health) {
      case 'healthy': return 'text-emerald-400';
      case 'warning': return 'text-yellow-400';
      case 'critical': return 'text-red-400';
      case 'unknown': return 'text-slate-400';
    }
  };

  return (
    <PageContainer>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Route Intelligence</h1>
        <p className="text-slate-400">AI-powered routing analysis and optimization recommendations</p>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-1">{metrics.averageLatency.toFixed(1)}ms</div>
            <div className="text-xs text-slate-400">Avg Latency</div>
          </div>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-400 mb-1">{metrics.routeAvailability.toFixed(2)}%</div>
            <div className="text-xs text-slate-400">Availability</div>
          </div>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <div className="text-center">
            <div className="text-3xl font-bold text-cyan-400 mb-1">{metrics.optimalRoutesPercentage.toFixed(1)}%</div>
            <div className="text-xs text-slate-400">Optimal Routes</div>
          </div>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-400 mb-1">{metrics.optimizationOpportunities}</div>
            <div className="text-xs text-slate-400">Opportunities</div>
          </div>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400 mb-1">${(metrics.estimatedMonthlySavings / 1000).toFixed(1)}K</div>
            <div className="text-xs text-slate-400">Est. Savings/mo</div>
          </div>
        </Card>
      </div>

      {/* Routing Table Summary */}
      <Card className="bg-slate-800/50 border-slate-700 mb-6">
        <h3 className="text-lg font-bold text-white mb-4">Routing Table Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-4">
          <div>
            <div className="text-2xl font-bold text-white mb-1">{summary.totalRoutes}</div>
            <div className="text-xs text-slate-400">Total Routes</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-emerald-400 mb-1">{summary.optimalRoutes}</div>
            <div className="text-xs text-slate-400">Optimal</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-400 mb-1">{summary.suboptimalRoutes}</div>
            <div className="text-xs text-slate-400">Suboptimal</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-400 mb-1">{summary.degradedRoutes}</div>
            <div className="text-xs text-slate-400">Degraded</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-400 mb-1">{summary.failingRoutes}</div>
            <div className="text-xs text-slate-400">Failing</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-400 mb-1">{summary.bgpRoutes}</div>
            <div className="text-xs text-slate-400">BGP</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-400 mb-1">{summary.ospfRoutes}</div>
            <div className="text-xs text-slate-400">OSPF</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-cyan-400 mb-1">{summary.staticRoutes}</div>
            <div className="text-xs text-slate-400">Static</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-400 mb-1">{summary.dynamicRoutes}</div>
            <div className="text-xs text-slate-400">Dynamic</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-indigo-400 mb-1">{summary.connectedRoutes}</div>
            <div className="text-xs text-slate-400">Connected</div>
          </div>
        </div>
      </Card>

      {/* Optimization Opportunities */}
      <Card className="bg-slate-800/50 border-slate-700 mb-6">
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white">🎯 Top Optimization Opportunities</h3>
          <div className="space-y-3">
            {optimizationOpportunities.slice(0, 5).map((opp) => (
              <div key={opp.id} className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-grow">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={opp.priority === 'critical' ? 'error' : opp.priority === 'high' ? 'warning' : 'info'}>
                        {opp.priority.toUpperCase()}
                      </Badge>
                      <span className="font-mono text-xs text-slate-400">{opp.id}</span>
                    </div>
                    <h4 className="text-white font-semibold mb-1">{opp.title}</h4>
                    <p className="text-sm text-slate-300 mb-2">{opp.description}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-slate-400">Savings: </span>
                    <span className={opp.potentialSavings >= 0 ? 'text-green-400' : 'text-red-400'}>
                      {opp.potentialSavings >= 0 ? '+' : ''}{opp.potentialSavings >= 0 ? '$' : '-$'}
                      {Math.abs(opp.potentialSavings).toLocaleString()}/mo
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400">Performance: </span>
                    <span className="text-cyan-400 font-semibold">+{opp.performanceGain}%</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Effort: </span>
                    <span className="text-white">{opp.implementationEffort.toUpperCase()}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">ROI: </span>
                    <span className="text-emerald-400 font-semibold">{opp.estimatedROI}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Recent Anomalies */}
      <Card className="bg-slate-800/50 border-slate-700 mb-6">
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white">⚠️ Recent Anomalies Detected</h3>
          <div className="space-y-3">
            {recentAnomalies.slice(0, 3).map((anomaly) => (
              <div
                key={anomaly.id}
                className={`bg-slate-900/50 rounded-lg p-3 border ${
                  anomaly.severity === 'critical' ? 'border-red-500/50' :
                  anomaly.severity === 'high' ? 'border-orange-500/50' :
                  'border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant={anomaly.severity === 'critical' ? 'error' : anomaly.severity === 'high' ? 'warning' : 'info'}>
                      {anomaly.severity.toUpperCase()}
                    </Badge>
                    <span className="text-xs text-slate-400">{new Date(anomaly.detectedAt).toLocaleString()}</span>
                  </div>
                  <Badge variant="default" className="text-xs">{anomaly.type.replace('_', ' ').toUpperCase()}</Badge>
                </div>
                <p className="text-sm text-slate-200 mb-2">{anomaly.description}</p>
                <div className="space-y-1 text-xs">
                  <div className="text-slate-400">
                    Impact: <span className="text-orange-300">{anomaly.impact}</span>
                  </div>
                  {anomaly.rootCause && (
                    <div className="text-slate-400">
                      Root Cause: <span className="text-slate-300">{anomaly.rootCause}</span>
                    </div>
                  )}
                  {anomaly.recommendation && (
                    <div className="text-slate-400">
                      Recommendation: <span className="text-cyan-300">{anomaly.recommendation}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Filters */}
      <Card className="bg-slate-800/50 border-slate-700 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div>
            <label className="text-sm text-slate-400 mb-2 block">Status Filter</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as RouteStatus | 'all')}
              className="bg-slate-900 text-white px-4 py-2 rounded-lg border border-slate-700 focus:border-cyan-500 focus:outline-none"
            >
              <option value="all">All Status</option>
              <option value="optimal">Optimal</option>
              <option value="suboptimal">Suboptimal</option>
              <option value="degraded">Degraded</option>
              <option value="failing">Failing</option>
              <option value="blackhole">Blackhole</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-slate-400 mb-2 block">Health Filter</label>
            <select
              value={filterHealth}
              onChange={(e) => setFilterHealth(e.target.value as RouteHealth | 'all')}
              className="bg-slate-900 text-white px-4 py-2 rounded-lg border border-slate-700 focus:border-cyan-500 focus:outline-none"
            >
              <option value="all">All Health</option>
              <option value="healthy">Healthy</option>
              <option value="warning">Warning</option>
              <option value="critical">Critical</option>
              <option value="unknown">Unknown</option>
            </select>
          </div>
          <div className="ml-auto">
            <div className="text-sm text-slate-400">
              Showing {filteredRoutes.length} of {routes.length} routes
            </div>
          </div>
        </div>
      </Card>

      {/* Routes List and Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Routes List */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-xl font-bold text-white mb-4">Network Routes</h2>
          {filteredRoutes.map((route) => (
            <Card
              key={route.id}
              className={`bg-slate-800/50 border-slate-700 cursor-pointer transition-all hover:border-cyan-500 ${
                selectedRoute?.id === route.id ? 'border-cyan-500 ring-2 ring-cyan-500/50' : ''
              }`}
              onClick={() => setSelectedRoute(route)}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(route.status)} animate-pulse`} />
                    <span className="text-xs font-mono text-slate-400">{route.id}</span>
                  </div>
                  <Badge variant={getStatusBadge(route.status)}>{route.status.toUpperCase()}</Badge>
                </div>
                <h3 className="text-white font-semibold text-sm leading-tight">{route.name}</h3>
                <div className="text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Protocol:</span>
                    <Badge variant="info" className="text-xs">{route.protocol}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Health:</span>
                    <span className={`font-semibold ${getHealthColor(route.health)}`}>{route.health.toUpperCase()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Latency:</span>
                    <span className={`font-semibold ${route.metrics.latencyMs > 50 ? 'text-orange-400' : 'text-emerald-400'}`}>
                      {route.metrics.latencyMs.toFixed(1)}ms
                    </span>
                  </div>
                </div>
                {route.aiRecommendations.length > 0 && (
                  <div className="pt-2 border-t border-slate-700">
                    <div className="flex items-center gap-1 text-xs">
                      <span className="text-cyan-400">🤖</span>
                      <span className="text-cyan-400">{route.aiRecommendations.length} AI Recommendations</span>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Route Details */}
        <div className="lg:col-span-2">
          {selectedRoute ? (
            <div className="space-y-6">
              {/* Route Header */}
              <Card className={`border-2 ${
                selectedRoute.status === 'optimal' ? 'border-emerald-500/50 bg-emerald-600/10' :
                selectedRoute.status === 'degraded' || selectedRoute.status === 'failing' ? 'border-red-500/50 bg-red-600/10' :
                'border-yellow-500/50 bg-yellow-600/10'
              }`}>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant={getStatusBadge(selectedRoute.status)}>{selectedRoute.status.toUpperCase()}</Badge>
                      <span className="font-mono text-sm text-slate-400">{selectedRoute.id}</span>
                      <Badge variant="info">{selectedRoute.protocol}</Badge>
                      <span className={`text-sm font-semibold ${getHealthColor(selectedRoute.health)}`}>
                        {selectedRoute.health.toUpperCase()}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">{selectedRoute.name}</h2>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-slate-300">
                        <span className="text-slate-400">Source:</span> {selectedRoute.source}
                      </div>
                      <div className="text-slate-300">
                        <span className="text-slate-400">Destination:</span> {selectedRoute.destination}
                      </div>
                      <div className="text-slate-300">
                        <span className="text-slate-400">Next Hop:</span> {selectedRoute.nextHop}
                      </div>
                      <div className="text-slate-300">
                        <span className="text-slate-400">Age:</span> {selectedRoute.age}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-700">
                    <div>
                      <div className="text-xs text-slate-400 mb-1">Latency</div>
                      <div className={`text-xl font-bold ${selectedRoute.metrics.latencyMs > 50 ? 'text-orange-400' : 'text-emerald-400'}`}>
                        {selectedRoute.metrics.latencyMs.toFixed(1)}ms
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 mb-1">Packet Loss</div>
                      <div className={`text-xl font-bold ${selectedRoute.metrics.packetLoss > 0.1 ? 'text-red-400' : 'text-emerald-400'}`}>
                        {selectedRoute.metrics.packetLoss.toFixed(2)}%
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 mb-1">Utilization</div>
                      <div className={`text-xl font-bold ${selectedRoute.metrics.utilization > 80 ? 'text-orange-400' : 'text-cyan-400'}`}>
                        {selectedRoute.metrics.utilization.toFixed(1)}%
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 mb-1">Throughput</div>
                      <div className="text-xl font-bold text-white">{selectedRoute.metrics.throughput}</div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* AI Recommendations */}
              {selectedRoute.aiRecommendations.length > 0 && (
                <Card className="bg-slate-800/50 border-slate-700">
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-white">🤖 AI Recommendations</h3>
                    {selectedRoute.aiRecommendations.map((rec) => (
                      <div key={rec.id} className="bg-slate-900/50 rounded-lg p-4 border border-cyan-500/30">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant={rec.priority === 'critical' ? 'error' : rec.priority === 'high' ? 'warning' : 'info'}>
                                {rec.priority.toUpperCase()}
                              </Badge>
                              <span className="text-xs text-slate-400">Confidence: {rec.confidenceScore}%</span>
                              {rec.automationAvailable && (
                                <Badge variant="success" className="text-xs">AUTO</Badge>
                              )}
                            </div>
                            <h4 className="text-white font-bold mb-1">{rec.title}</h4>
                            <p className="text-sm text-slate-300 mb-3">{rec.description}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 mb-3 text-sm">
                          <div>
                            <span className="text-slate-400">Performance:</span>
                            <span className="text-emerald-400 font-semibold ml-2">+{rec.estimatedImpact.performance}%</span>
                          </div>
                          <div>
                            <span className="text-slate-400">Cost:</span>
                            <span className={`font-semibold ml-2 ${rec.estimatedImpact.cost >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {rec.estimatedImpact.cost >= 0 ? '+$' : '-$'}{Math.abs(rec.estimatedImpact.cost)}/mo
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400">Reliability:</span>
                            <span className="text-cyan-400 font-semibold ml-2">+{rec.estimatedImpact.reliability}%</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div>
                            <h5 className="text-sm font-semibold text-slate-300 mb-1">Rationale:</h5>
                            <ul className="space-y-1">
                              {rec.rationale.map((point, idx) => (
                                <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                                  <span className="text-cyan-400 mt-0.5">▸</span>
                                  <span>{point}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h5 className="text-sm font-semibold text-slate-300 mb-1">Implementation Steps:</h5>
                            <ol className="space-y-1">
                              {rec.implementationSteps.map((step, idx) => (
                                <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                                  <span className="text-cyan-400 mt-0.5">{idx + 1}.</span>
                                  <span>{step}</span>
                                </li>
                              ))}
                            </ol>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Route Path */}
              <Card className="bg-slate-800/50 border-slate-700">
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-white">🛣️ Route Path ({selectedRoute.path.length} hops)</h3>
                  <div className="space-y-2">
                    {selectedRoute.path.map((hop, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {hop.sequence}
                        </div>
                        <div className="flex-grow bg-slate-900/50 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-1">
                            <div>
                              <span className="text-white font-semibold text-sm">{hop.hostname}</span>
                              <span className="text-slate-400 text-xs ml-2">({hop.ipAddress})</span>
                            </div>
                            <span className="text-cyan-400 font-semibold text-sm">{hop.latencyMs.toFixed(1)}ms</span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-slate-400">
                            <span>📍 {hop.location}</span>
                            {hop.asn && <span>AS{hop.asn}</span>}
                            {hop.provider && <span>• {hop.provider}</span>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Alternative Paths */}
              {selectedRoute.alternatives.length > 0 && (
                <Card className="bg-slate-800/50 border-slate-700">
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-white">🔄 Alternative Paths Available</h3>
                    {selectedRoute.alternatives.map((alt) => (
                      <div key={alt.id} className="bg-emerald-900/20 rounded-lg p-4 border border-emerald-500/30">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-white font-semibold">Alternative Path ({alt.path.length} hops)</h4>
                          <Badge variant="success" className="text-sm">Score: {alt.recommendationScore}/100</Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-4 mb-3 text-sm">
                          <div>
                            <span className="text-slate-400">Latency Reduction:</span>
                            <span className="text-emerald-400 font-semibold ml-2">{alt.estimatedImprovement.latencyReduction}%</span>
                          </div>
                          <div>
                            <span className="text-slate-400">Cost Savings:</span>
                            <span className="text-green-400 font-semibold ml-2">${alt.estimatedImprovement.costSavings}/mo</span>
                          </div>
                          <div>
                            <span className="text-slate-400">Reliability:</span>
                            <span className="text-cyan-400 font-semibold ml-2">+{alt.estimatedImprovement.reliabilityIncrease}%</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-xs">
                          <span className="text-slate-400">
                            Complexity: <span className="text-white">{alt.implementationComplexity.toUpperCase()}</span>
                          </span>
                          <span className="text-slate-400">
                            Risk: <span className={alt.riskLevel === 'low' ? 'text-green-400' : alt.riskLevel === 'medium' ? 'text-yellow-400' : 'text-red-400'}>
                              {alt.riskLevel.toUpperCase()}
                            </span>
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Anomalies */}
              {selectedRoute.anomalies.length > 0 && (
                <Card className="bg-slate-800/50 border-slate-700">
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-white">⚠️ Detected Anomalies</h3>
                    {selectedRoute.anomalies.map((anomaly) => (
                      <div key={anomaly.id} className="bg-red-900/20 rounded-lg p-3 border border-red-500/30">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="error">{anomaly.severity.toUpperCase()}</Badge>
                          <span className="text-xs text-slate-400">{new Date(anomaly.detectedAt).toLocaleString()}</span>
                        </div>
                        <p className="text-sm text-slate-200 mb-2">{anomaly.description}</p>
                        <div className="space-y-1 text-xs">
                          <div className="text-slate-400">
                            Impact: <span className="text-orange-300">{anomaly.impact}</span>
                          </div>
                          {anomaly.rootCause && (
                            <div className="text-slate-400">
                              Root Cause: <span className="text-slate-300">{anomaly.rootCause}</span>
                            </div>
                          )}
                          {anomaly.recommendation && (
                            <div className="text-slate-400">
                              Recommendation: <span className="text-cyan-300">{anomaly.recommendation}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          ) : (
            <Card className="bg-slate-800/50 border-slate-700 h-full flex items-center justify-center">
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🛣️</div>
                <h3 className="text-xl font-bold text-white mb-2">Select a Route</h3>
                <p className="text-slate-400">Click on a route from the list to view AI-powered analysis and recommendations</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </PageContainer>
  );
};
