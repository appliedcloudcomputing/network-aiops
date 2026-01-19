/**
 * Conflict Detection Engine - Firewall Rule Analysis View
 */

import React, { useState } from 'react';
import { PageContainer, Card, Badge } from '../../components';
import { conflictDetectionData } from '../../data/conflictDetectionData';
import type { FirewallRuleConflict, ConflictType, ConflictSeverity, DetectionStatus } from '../../types/conflictDetection';

export const ConflictDetectionView: React.FC = () => {
  const { conflicts, policyViolations, metrics, firewallStats } = conflictDetectionData;
  const [selectedConflict, setSelectedConflict] = useState<FirewallRuleConflict | null>(null);
  const [filterType, setFilterType] = useState<ConflictType | 'all'>('all');
  const [filterSeverity, setFilterSeverity] = useState<ConflictSeverity | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<DetectionStatus | 'all'>('all');

  const filteredConflicts = conflicts.filter((conflict) => {
    if (filterType !== 'all' && conflict.type !== filterType) return false;
    if (filterSeverity !== 'all' && conflict.severity !== filterSeverity) return false;
    if (filterStatus !== 'all' && conflict.status !== filterStatus) return false;
    return true;
  });

  const getSeverityColor = (severity: ConflictSeverity) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      case 'info': return 'bg-slate-500';
    }
  };

  const getSeverityBadge = (severity: ConflictSeverity) => {
    switch (severity) {
      case 'critical': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'warning';
      case 'low': return 'info';
      case 'info': return 'default';
    }
  };

  const getTypeColor = (type: ConflictType) => {
    switch (type) {
      case 'shadowing': return 'text-red-400';
      case 'redundancy': return 'text-yellow-400';
      case 'contradiction': return 'text-red-400';
      case 'generalization': return 'text-orange-400';
      case 'overlap': return 'text-yellow-400';
      case 'correlation': return 'text-blue-400';
      case 'policy_violation': return 'text-purple-400';
    }
  };

  const getStatusColor = (status: DetectionStatus) => {
    switch (status) {
      case 'active': return 'text-red-400';
      case 'resolved': return 'text-green-400';
      case 'ignored': return 'text-slate-400';
      case 'false_positive': return 'text-yellow-400';
    }
  };

  return (
    <PageContainer>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Conflict Detection Engine</h1>
        <p className="text-slate-400">AI-powered firewall rule conflict analysis and policy violation detection</p>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-1">{metrics.totalRulesAnalyzed.toLocaleString()}</div>
            <div className="text-xs text-slate-400">Rules Analyzed</div>
          </div>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-400 mb-1">{metrics.totalConflictsDetected}</div>
            <div className="text-xs text-slate-400">Conflicts Found</div>
          </div>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <div className="text-center">
            <div className="text-3xl font-bold text-red-400 mb-1">{metrics.criticalConflicts}</div>
            <div className="text-xs text-slate-400">Critical</div>
          </div>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-400 mb-1">{metrics.resolvedConflicts}</div>
            <div className="text-xs text-slate-400">Resolved</div>
          </div>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400 mb-1">{metrics.policyViolations}</div>
            <div className="text-xs text-slate-400">Policy Violations</div>
          </div>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <div className="text-center">
            <div className="text-3xl font-bold text-cyan-400 mb-1">{metrics.averageResolutionTime}</div>
            <div className="text-xs text-slate-400">Avg Resolution</div>
          </div>
        </Card>
      </div>

      {/* Conflict Types Breakdown */}
      <Card className="bg-slate-800/50 border-slate-700 mb-6">
        <h3 className="text-lg font-bold text-white mb-4">Conflicts by Type</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {Object.entries(metrics.conflictsByType).map(([type, count]) => (
            <div key={type}>
              <div className="text-2xl font-bold text-white mb-1">{count}</div>
              <div className="text-xs text-slate-400 capitalize">{type.replace('_', ' ')}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Firewall Health Scores */}
      <Card className="bg-slate-800/50 border-slate-700 mb-6">
        <h3 className="text-lg font-bold text-white mb-4">Firewall Health Scores</h3>
        <div className="space-y-3">
          {firewallStats.map((fw) => (
            <div key={fw.firewall} className="bg-slate-900/50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="text-white font-semibold">{fw.firewall}</span>
                  <span className="text-slate-400 text-sm ml-3">{fw.totalRules} rules</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${fw.healthScore >= 90 ? 'text-emerald-400' : fw.healthScore >= 75 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {fw.healthScore}
                    </div>
                    <div className="text-xs text-slate-400">Health Score</div>
                  </div>
                </div>
              </div>
              <div className="flex gap-4 text-xs">
                <span className="text-slate-400">
                  Conflicts: <span className="text-orange-400 font-semibold">{fw.conflictingRules}</span>
                </span>
                <span className="text-slate-400">
                  Shadowed: <span className="text-red-400 font-semibold">{fw.shadowedRules}</span>
                </span>
                <span className="text-slate-400">
                  Redundant: <span className="text-yellow-400 font-semibold">{fw.redundantRules}</span>
                </span>
                <span className="text-slate-400">
                  Unused: <span className="text-slate-500 font-semibold">{fw.unusedRules}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Policy Violations */}
      {policyViolations.length > 0 && (
        <Card className="bg-slate-800/50 border-slate-700 mb-6">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">🚨 Policy Violations</h3>
            <div className="space-y-3">
              {policyViolations.map((violation) => (
                <div key={violation.id} className="bg-purple-900/20 rounded-lg p-4 border border-purple-500/30">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={getSeverityBadge(violation.severity)}>
                          {violation.severity.toUpperCase()}
                        </Badge>
                        <span className="font-mono text-xs text-slate-400">{violation.id}</span>
                        {violation.remediationRequired && (
                          <Badge variant="error" className="text-xs">REMEDIATION REQUIRED</Badge>
                        )}
                      </div>
                      <h4 className="text-white font-semibold mb-1">{violation.policyName}</h4>
                      <p className="text-sm text-slate-300 mb-2">{violation.description}</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="text-slate-400">
                      Violation Type: <span className="text-orange-400">{violation.violationType}</span>
                    </div>
                    <div className="text-slate-400">
                      Policy Requirement: <span className="text-slate-300">{violation.policyRequirement}</span>
                    </div>
                    {violation.complianceFramework && (
                      <div className="text-slate-400">
                        Compliance: {violation.complianceFramework.map((fw, idx) => (
                          <Badge key={idx} variant="info" className="ml-2 text-xs">{fw}</Badge>
                        ))}
                      </div>
                    )}
                    <div className="text-slate-400">
                      Violating Rules: <span className="text-red-400 font-semibold">{violation.violatingRules.length}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Filters */}
      <Card className="bg-slate-800/50 border-slate-700 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div>
            <label className="text-sm text-slate-400 mb-2 block">Type Filter</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as ConflictType | 'all')}
              className="bg-slate-900 text-white px-4 py-2 rounded-lg border border-slate-700 focus:border-cyan-500 focus:outline-none"
            >
              <option value="all">All Types</option>
              <option value="shadowing">Shadowing</option>
              <option value="redundancy">Redundancy</option>
              <option value="contradiction">Contradiction</option>
              <option value="generalization">Generalization</option>
              <option value="overlap">Overlap</option>
              <option value="correlation">Correlation</option>
              <option value="policy_violation">Policy Violation</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-slate-400 mb-2 block">Severity Filter</label>
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value as ConflictSeverity | 'all')}
              className="bg-slate-900 text-white px-4 py-2 rounded-lg border border-slate-700 focus:border-cyan-500 focus:outline-none"
            >
              <option value="all">All Severity</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
              <option value="info">Info</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-slate-400 mb-2 block">Status Filter</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as DetectionStatus | 'all')}
              className="bg-slate-900 text-white px-4 py-2 rounded-lg border border-slate-700 focus:border-cyan-500 focus:outline-none"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="resolved">Resolved</option>
              <option value="ignored">Ignored</option>
              <option value="false_positive">False Positive</option>
            </select>
          </div>
          <div className="ml-auto">
            <div className="text-sm text-slate-400">
              Showing {filteredConflicts.length} of {conflicts.length} conflicts
            </div>
          </div>
        </div>
      </Card>

      {/* Conflicts List and Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conflicts List */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-xl font-bold text-white mb-4">Detected Conflicts</h2>
          {filteredConflicts.map((conflict) => (
            <Card
              key={conflict.id}
              className={`bg-slate-800/50 border-slate-700 cursor-pointer transition-all hover:border-cyan-500 ${
                selectedConflict?.id === conflict.id ? 'border-cyan-500 ring-2 ring-cyan-500/50' : ''
              }`}
              onClick={() => setSelectedConflict(conflict)}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getSeverityColor(conflict.severity)} animate-pulse`} />
                    <span className="text-xs font-mono text-slate-400">{conflict.id}</span>
                  </div>
                  <Badge variant={getSeverityBadge(conflict.severity)}>
                    {conflict.severity.toUpperCase()}
                  </Badge>
                </div>
                <h3 className="text-white font-semibold text-sm leading-tight">{conflict.title}</h3>
                <div className="flex items-center justify-between text-xs">
                  <span className={`font-semibold capitalize ${getTypeColor(conflict.type)}`}>
                    {conflict.type.replace('_', ' ')}
                  </span>
                  <span className={`font-semibold ${getStatusColor(conflict.status)}`}>
                    {conflict.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                <div className="text-xs text-slate-400">
                  {conflict.rule1.firewall} • {conflict.resolutionOptions.length} solutions
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Conflict Details */}
        <div className="lg:col-span-2">
          {selectedConflict ? (
            <div className="space-y-6">
              {/* Conflict Header */}
              <Card className={`border-2 ${
                selectedConflict.severity === 'critical' ? 'border-red-500/50 bg-red-600/10' :
                selectedConflict.severity === 'high' ? 'border-orange-500/50 bg-orange-600/10' :
                'border-yellow-500/50 bg-yellow-600/10'
              }`}>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant={getSeverityBadge(selectedConflict.severity)}>
                        {selectedConflict.severity.toUpperCase()}
                      </Badge>
                      <span className="font-mono text-sm text-slate-400">{selectedConflict.id}</span>
                      <Badge variant="info" className="capitalize">{selectedConflict.type.replace('_', ' ')}</Badge>
                      <span className={`text-sm font-semibold ${getStatusColor(selectedConflict.status)}`}>
                        {selectedConflict.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">{selectedConflict.title}</h2>
                    <p className="text-slate-300">{selectedConflict.description}</p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t border-slate-700">
                    <div>
                      <div className="text-xs text-slate-400 mb-1">Security Risk</div>
                      <div className={`text-lg font-bold ${
                        selectedConflict.impact.securityRisk === 'high' ? 'text-red-400' :
                        selectedConflict.impact.securityRisk === 'medium' ? 'text-yellow-400' :
                        'text-emerald-400'
                      }`}>
                        {selectedConflict.impact.securityRisk.toUpperCase()}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 mb-1">Daily Traffic</div>
                      <div className="text-lg font-bold text-white">
                        {selectedConflict.impact.estimatedHitCount.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 mb-1">Compliance</div>
                      <div className={`text-lg font-bold ${selectedConflict.impact.complianceViolation ? 'text-red-400' : 'text-emerald-400'}`}>
                        {selectedConflict.impact.complianceViolation ? 'VIOLATED' : 'OK'}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Conflicting Rules */}
              <Card className="bg-slate-800/50 border-slate-700">
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-white">🔥 Conflicting Rules</h3>
                  <div className="space-y-4">
                    {/* Rule 1 */}
                    <div className="bg-slate-900/50 rounded-lg p-4 border border-red-500/30">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="error">RULE 1</Badge>
                            <span className="font-mono text-sm text-slate-400">{selectedConflict.rule1.ruleId}</span>
                            <Badge variant={selectedConflict.rule1.action === 'allow' ? 'success' : 'error'} className="text-xs">
                              {selectedConflict.rule1.action.toUpperCase()}
                            </Badge>
                          </div>
                          <h4 className="text-white font-semibold">{selectedConflict.rule1.ruleName}</h4>
                        </div>
                        <div className="text-right">
                          <div className="text-cyan-400 font-semibold">Priority {selectedConflict.rule1.priority}</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-slate-400">Firewall:</span>
                          <span className="text-white ml-2">{selectedConflict.rule1.firewall}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Zone:</span>
                          <span className="text-white ml-2">{selectedConflict.rule1.zone}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Source:</span>
                          <span className="text-cyan-400 ml-2">{selectedConflict.rule1.source}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Destination:</span>
                          <span className="text-cyan-400 ml-2">{selectedConflict.rule1.destination}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Service:</span>
                          <span className="text-cyan-400 ml-2">{selectedConflict.rule1.service}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Owner:</span>
                          <span className="text-white ml-2">{selectedConflict.rule1.owner}</span>
                        </div>
                      </div>
                    </div>

                    {/* Rule 2 */}
                    <div className="bg-slate-900/50 rounded-lg p-4 border border-orange-500/30">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="warning">RULE 2</Badge>
                            <span className="font-mono text-sm text-slate-400">{selectedConflict.rule2.ruleId}</span>
                            <Badge variant={selectedConflict.rule2.action === 'allow' ? 'success' : 'error'} className="text-xs">
                              {selectedConflict.rule2.action.toUpperCase()}
                            </Badge>
                          </div>
                          <h4 className="text-white font-semibold">{selectedConflict.rule2.ruleName}</h4>
                        </div>
                        <div className="text-right">
                          <div className="text-cyan-400 font-semibold">Priority {selectedConflict.rule2.priority}</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-slate-400">Firewall:</span>
                          <span className="text-white ml-2">{selectedConflict.rule2.firewall}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Zone:</span>
                          <span className="text-white ml-2">{selectedConflict.rule2.zone}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Source:</span>
                          <span className="text-cyan-400 ml-2">{selectedConflict.rule2.source}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Destination:</span>
                          <span className="text-cyan-400 ml-2">{selectedConflict.rule2.destination}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Service:</span>
                          <span className="text-cyan-400 ml-2">{selectedConflict.rule2.service}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Owner:</span>
                          <span className="text-white ml-2">{selectedConflict.rule2.owner}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Evidence */}
              <Card className="bg-slate-800/50 border-slate-700">
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-white">🔍 Evidence</h3>
                  {selectedConflict.evidence.map((evidence, idx) => (
                    <div key={idx} className="bg-slate-900/50 rounded-lg p-4 border border-cyan-500/30">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-white font-semibold text-sm">{evidence.description}</h4>
                        <Badge variant="info" className="text-xs">Risk: {evidence.riskScore}/100</Badge>
                      </div>
                      <p className="text-sm text-slate-300 mb-2">{evidence.technicalDetail}</p>
                      {evidence.trafficExample && (
                        <div className="text-xs text-slate-400 bg-slate-950/50 rounded p-2">
                          <span className="text-cyan-400">Example:</span> {evidence.trafficExample}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Card>

              {/* Resolution Options */}
              <Card className="bg-slate-800/50 border-slate-700">
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-white">💡 Resolution Options</h3>
                  {selectedConflict.resolutionOptions.map((option) => (
                    <div key={option.id} className="bg-emerald-900/20 rounded-lg p-4 border border-emerald-500/30">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="success" className="capitalize">{option.strategy}</Badge>
                            <span className="text-xs text-slate-400">Score: {option.recommendationScore}/100</span>
                            {option.automationAvailable && (
                              <Badge variant="info" className="text-xs">AUTO</Badge>
                            )}
                          </div>
                          <h4 className="text-white font-bold mb-1">{option.title}</h4>
                          <p className="text-sm text-slate-300 mb-3">{option.description}</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex gap-4 text-xs">
                          <span className="text-slate-400">
                            Effort: <span className="text-white">{option.estimatedEffort}</span>
                          </span>
                          <span className="text-slate-400">
                            Risk: <span className={option.riskLevel === 'low' ? 'text-green-400' : option.riskLevel === 'medium' ? 'text-yellow-400' : 'text-red-400'}>
                              {option.riskLevel.toUpperCase()}
                            </span>
                          </span>
                          <span className="text-slate-400">
                            Affected Rules: <span className="text-cyan-400">{option.affectedRules.length}</span>
                          </span>
                        </div>
                        <div>
                          <h5 className="text-sm font-semibold text-slate-300 mb-1">Implementation Steps:</h5>
                          <ol className="space-y-1">
                            {option.steps.map((step, idx) => (
                              <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                                <span className="text-cyan-400 mt-0.5">{idx + 1}.</span>
                                <span>{step}</span>
                              </li>
                            ))}
                          </ol>
                        </div>
                        {option.rollbackPlan && (
                          <div className="text-xs text-slate-400 bg-slate-950/50 rounded p-2">
                            <span className="text-yellow-400">Rollback Plan:</span> {option.rollbackPlan}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Impact Details */}
              <Card className="bg-slate-800/50 border-slate-700">
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-white">📊 Impact Analysis</h3>
                  <div className="bg-slate-900/50 rounded-lg p-4">
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Security Risk:</span>
                        <span className={`font-semibold ${
                          selectedConflict.impact.securityRisk === 'high' ? 'text-red-400' :
                          selectedConflict.impact.securityRisk === 'medium' ? 'text-yellow-400' :
                          'text-emerald-400'
                        }`}>
                          {selectedConflict.impact.securityRisk.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Performance Impact:</span>
                        <span className="text-white">{selectedConflict.impact.performanceImpact.toUpperCase()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Compliance Violation:</span>
                        <span className={selectedConflict.impact.complianceViolation ? 'text-red-400' : 'text-emerald-400'}>
                          {selectedConflict.impact.complianceViolation ? 'YES' : 'NO'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Potential Data Exposure:</span>
                        <span className={selectedConflict.impact.potentialDataExposure ? 'text-red-400' : 'text-emerald-400'}>
                          {selectedConflict.impact.potentialDataExposure ? 'YES' : 'NO'}
                        </span>
                      </div>
                      <div className="pt-2 border-t border-slate-700">
                        <span className="text-slate-400">Affected Traffic:</span>
                        <p className="text-white mt-1">{selectedConflict.impact.affectedTraffic}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          ) : (
            <Card className="bg-slate-800/50 border-slate-700 h-full flex items-center justify-center">
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-white mb-2">Select a Conflict</h3>
                <p className="text-slate-400">Click on a conflict from the list to view detailed analysis and resolution options</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </PageContainer>
  );
};
