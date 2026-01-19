/**
 * Incident Correlation & Root Cause Analysis - Enhanced View
 */

import React, { useState } from 'react';
import { PageContainer, Card, Badge } from '../../components';
import { incidentCorrelationData } from '../../data/incidentCorrelationData';
import type { NetworkIncident, IncidentStatus, IncidentSeverity } from '../../types/incidentCorrelation';

export const IncidentCorrelationView: React.FC = () => {
  const { incidents, metrics, correlationPatterns } = incidentCorrelationData;
  const [selectedIncident, setSelectedIncident] = useState<NetworkIncident | null>(null);
  const [filterStatus, setFilterStatus] = useState<IncidentStatus | 'all'>('all');
  const [filterSeverity, setFilterSeverity] = useState<IncidentSeverity | 'all'>('all');

  const filteredIncidents = incidents.filter((incident) => {
    if (filterStatus !== 'all' && incident.status !== filterStatus) return false;
    if (filterSeverity !== 'all' && incident.severity !== filterSeverity) return false;
    return true;
  });

  const getSeverityColor = (severity: IncidentSeverity) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
    }
  };

  const getSeverityBadgeVariant = (severity: IncidentSeverity) => {
    switch (severity) {
      case 'critical': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'default';
    }
  };

  const getStatusColor = (status: IncidentStatus) => {
    switch (status) {
      case 'active': return 'text-red-400';
      case 'investigating': return 'text-yellow-400';
      case 'resolved': return 'text-green-400';
      case 'closed': return 'text-slate-400';
    }
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'text-emerald-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-orange-400';
      default: return 'text-slate-400';
    }
  };

  return (
    <PageContainer>
      {/* Header with Metrics */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Incident Correlation & Root Cause Analysis</h1>
        <p className="text-slate-400">AI-powered incident detection, correlation, and automated root cause analysis</p>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-1">{metrics.activeIncidents}</div>
            <div className="text-xs text-slate-400">Active Incidents</div>
          </div>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-400 mb-1">{metrics.resolvedToday}</div>
            <div className="text-xs text-slate-400">Resolved Today</div>
          </div>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <div className="text-center">
            <div className="text-3xl font-bold text-cyan-400 mb-1">{metrics.mttr}</div>
            <div className="text-xs text-slate-400">MTTR</div>
          </div>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400 mb-1">{metrics.mttd}</div>
            <div className="text-xs text-slate-400">MTTD</div>
          </div>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400 mb-1">{metrics.automatedResolution}%</div>
            <div className="text-xs text-slate-400">Automated</div>
          </div>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <div className="text-center">
            <div className="text-3xl font-bold text-red-400 mb-1">{metrics.criticalIncidents}</div>
            <div className="text-xs text-slate-400">Critical</div>
          </div>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-400 mb-1">{metrics.highSeverityIncidents}</div>
            <div className="text-xs text-slate-400">High Severity</div>
          </div>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-400 mb-1">{metrics.falsePositives}</div>
            <div className="text-xs text-slate-400">False Positives</div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-slate-800/50 border-slate-700 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div>
            <label className="text-sm text-slate-400 mb-2 block">Status Filter</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as IncidentStatus | 'all')}
              className="bg-slate-900 text-white px-4 py-2 rounded-lg border border-slate-700 focus:border-cyan-500 focus:outline-none"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="investigating">Investigating</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-slate-400 mb-2 block">Severity Filter</label>
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value as IncidentSeverity | 'all')}
              className="bg-slate-900 text-white px-4 py-2 rounded-lg border border-slate-700 focus:border-cyan-500 focus:outline-none"
            >
              <option value="all">All Severity</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <div className="ml-auto">
            <div className="text-sm text-slate-400">
              Showing {filteredIncidents.length} of {incidents.length} incidents
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Incidents List */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-xl font-bold text-white mb-4">Active Incidents</h2>
          {filteredIncidents.map((incident) => (
            <Card
              key={incident.id}
              className={`bg-slate-800/50 border-slate-700 cursor-pointer transition-all hover:border-cyan-500 ${
                selectedIncident?.id === incident.id ? 'border-cyan-500 ring-2 ring-cyan-500/50' : ''
              }`}
              onClick={() => setSelectedIncident(incident)}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getSeverityColor(incident.severity)} animate-pulse`} />
                    <span className="text-xs font-mono text-slate-400">{incident.id}</span>
                  </div>
                  <Badge variant={getSeverityBadgeVariant(incident.severity)}>
                    {incident.severity.toUpperCase()}
                  </Badge>
                </div>
                <h3 className="text-white font-semibold text-sm leading-tight">{incident.title}</h3>
                <div className="flex items-center justify-between text-xs">
                  <span className={`font-semibold ${getStatusColor(incident.status)}`}>
                    {incident.status.toUpperCase()}
                  </span>
                  <span className="text-slate-400">{incident.detectedAt}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span>👥 {incident.impact.affectedUsers.toLocaleString()} users</span>
                  <span>•</span>
                  <span>⚙️ {incident.impact.affectedServices} services</span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Incident Details */}
        <div className="lg:col-span-2">
          {selectedIncident ? (
            <div className="space-y-6">
              {/* Incident Header */}
              <Card className="bg-gradient-to-br from-red-600/20 to-rose-600/20 border-red-500/50">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant={getSeverityBadgeVariant(selectedIncident.severity)}>
                          {selectedIncident.severity.toUpperCase()}
                        </Badge>
                        <span className="font-mono text-sm text-slate-400">{selectedIncident.id}</span>
                        <span className={`text-sm font-semibold ${getStatusColor(selectedIncident.status)}`}>
                          {selectedIncident.status.toUpperCase()}
                        </span>
                      </div>
                      <h2 className="text-2xl font-bold text-white mb-2">{selectedIncident.title}</h2>
                      <p className="text-slate-300">{selectedIncident.description}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-red-500/30">
                    <div>
                      <div className="text-xs text-slate-400 mb-1">Affected Users</div>
                      <div className="text-xl font-bold text-white">
                        {selectedIncident.impact.affectedUsers.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 mb-1">Affected Services</div>
                      <div className="text-xl font-bold text-white">{selectedIncident.impact.affectedServices}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 mb-1">Revenue Loss</div>
                      <div className="text-xl font-bold text-white">
                        ${(selectedIncident.impact.estimatedRevenueLoss / 1000).toFixed(1)}K
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 mb-1">Downtime</div>
                      <div className="text-xl font-bold text-white">{selectedIncident.impact.downtime}</div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Root Cause Analysis */}
              <Card className="bg-slate-800/50 border-slate-700">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white">🎯 Root Cause Analysis</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">Confidence:</span>
                      <Badge variant="success">
                        <span className={getConfidenceColor(selectedIncident.rootCauseAnalysis.confidence)}>
                          {selectedIncident.rootCauseAnalysis.confidence.toUpperCase()} (
                          {selectedIncident.rootCauseAnalysis.confidenceScore}%)
                        </span>
                      </Badge>
                    </div>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-4 border border-cyan-500/30">
                    <p className="text-slate-200 leading-relaxed">
                      {selectedIncident.rootCauseAnalysis.primaryCause}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-300 mb-2">Contributing Factors:</h4>
                    <ul className="space-y-2">
                      {selectedIncident.rootCauseAnalysis.contributingFactors.map((factor, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                          <span className="text-yellow-400 mt-1">▸</span>
                          <span>{factor}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-300 mb-2">Evidence Points:</h4>
                    <ul className="space-y-2">
                      {selectedIncident.rootCauseAnalysis.evidencePoints.map((evidence, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                          <span className="text-cyan-400 mt-1">✓</span>
                          <span>{evidence}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-300 mb-2">Propagation Path:</h4>
                    <div className="flex items-center gap-2 flex-wrap">
                      {selectedIncident.rootCauseAnalysis.propagationPath.map((component, idx) => (
                        <React.Fragment key={idx}>
                          <Badge variant="info" className="bg-purple-600/20 text-purple-300 border-purple-500/30">
                            {component}
                          </Badge>
                          {idx < selectedIncident.rootCauseAnalysis.propagationPath.length - 1 && (
                            <span className="text-slate-500">→</span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Remediation Plan */}
              <Card className="bg-slate-800/50 border-slate-700">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white">🔧 Remediation Plan</h3>
                    <div className="flex items-center gap-4 text-xs">
                      <span className="text-slate-400">
                        Est. Time: <span className="text-white font-semibold">{selectedIncident.remediationPlan.estimatedTotalTime}</span>
                      </span>
                      <span className="text-slate-400">
                        Automation: <span className="text-cyan-400 font-semibold">{selectedIncident.remediationPlan.automationPotential}%</span>
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {selectedIncident.remediationPlan.recommendedSteps.map((step) => (
                      <div
                        key={step.order}
                        className="bg-slate-900/50 rounded-lg p-4 border border-slate-700 hover:border-cyan-500/50 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {step.order}
                          </div>
                          <div className="flex-grow space-y-2">
                            <div className="flex items-start justify-between">
                              <p className="text-slate-200 font-medium">{step.action}</p>
                              {step.automationAvailable && (
                                <Badge variant="success" className="ml-2 flex-shrink-0">
                                  AUTO
                                </Badge>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-3 text-xs">
                              <span className="text-slate-400">
                                Owner: <span className="text-white">{step.owner}</span>
                              </span>
                              <span className="text-slate-400">
                                Duration: <span className="text-white">{step.estimatedDuration}</span>
                              </span>
                              <span className="text-slate-400">
                                Risk:{' '}
                                <span
                                  className={
                                    step.riskLevel === 'high'
                                      ? 'text-red-400'
                                      : step.riskLevel === 'medium'
                                      ? 'text-yellow-400'
                                      : 'text-green-400'
                                  }
                                >
                                  {step.riskLevel.toUpperCase()}
                                </span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-300 mb-2">Prevention Measures:</h4>
                    <ul className="space-y-2">
                      {selectedIncident.remediationPlan.preventionMeasures.map((measure, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                          <span className="text-emerald-400 mt-1">●</span>
                          <span>{measure}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>

              {/* Correlated Events */}
              <Card className="bg-slate-800/50 border-slate-700">
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-white">🔗 Correlated Events ({selectedIncident.correlatedEvents.length})</h3>
                  <div className="space-y-3">
                    {selectedIncident.correlatedEvents.map((event) => (
                      <div key={event.id} className="bg-slate-900/50 rounded-lg p-3 border border-slate-700">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="info">{event.source}</Badge>
                            <span className="text-xs text-slate-400">{event.timestamp}</span>
                          </div>
                          <div className="text-xs">
                            <span className="text-slate-400">Correlation: </span>
                            <span className="text-cyan-400 font-semibold">{event.correlationScore}%</span>
                          </div>
                        </div>
                        <p className="text-sm text-slate-300 mb-2">{event.message}</p>
                        <div className="flex flex-wrap gap-2">
                          {event.affectedServices.map((service, idx) => (
                            <Badge key={idx} variant="default" className="bg-slate-800 text-slate-300 text-xs">
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Similar Incidents */}
              {selectedIncident.similarIncidents.length > 0 && (
                <Card className="bg-slate-800/50 border-slate-700">
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-white">📊 Similar Past Incidents</h3>
                    <div className="space-y-3">
                      {selectedIncident.similarIncidents.map((similar) => (
                        <div key={similar.id} className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-mono text-xs text-slate-400">{similar.id}</span>
                                <Badge variant="info" className="text-xs">
                                  {similar.similarity}% similar
                                </Badge>
                              </div>
                              <h4 className="text-white font-medium">{similar.title}</h4>
                            </div>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="text-slate-400">
                              Occurred: <span className="text-slate-300">{similar.occurredAt}</span>
                            </div>
                            <div className="text-slate-400">
                              Root Cause: <span className="text-slate-300">{similar.rootCause}</span>
                            </div>
                            <div className="text-slate-400">
                              Resolution: <span className="text-slate-300">{similar.resolution}</span>
                            </div>
                            <div className="text-slate-400">
                              Resolution Time: <span className="text-emerald-400 font-semibold">{similar.resolutionTime}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              )}
            </div>
          ) : (
            <Card className="bg-slate-800/50 border-slate-700 h-full flex items-center justify-center">
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-white mb-2">Select an Incident</h3>
                <p className="text-slate-400">Click on an incident from the list to view detailed analysis</p>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Correlation Patterns */}
      <Card className="bg-slate-800/50 border-slate-700 mt-6">
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white">🧩 Detected Correlation Patterns</h3>
          <p className="text-sm text-slate-400">
            AI-identified patterns of recurring incidents and their common characteristics
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {correlationPatterns.map((pattern) => (
              <div key={pattern.id} className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="text-white font-semibold text-sm">{pattern.name}</h4>
                  <Badge variant="info" className="text-xs">
                    {pattern.confidence}% confidence
                  </Badge>
                </div>
                <p className="text-xs text-slate-400 mb-3">{pattern.description}</p>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Occurrences:</span>
                    <span className="text-white font-semibold">{pattern.occurrences}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Avg Impact:</span>
                    <span className="text-orange-400 font-semibold">{pattern.avgImpact}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Last Seen:</span>
                    <span className="text-slate-300">{new Date(pattern.lastSeen).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </PageContainer>
  );
};
