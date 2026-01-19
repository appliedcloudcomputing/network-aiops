/**
 * Cloud NSG Violations Panel - Shows security group and NSG violations
 */

import React, { useState } from 'react';
import { Card } from '../../../components';
import type { CloudNSGViolation } from '../../../types/complianceEnhanced';

interface CloudNSGViolationsPanelProps {
  violations: CloudNSGViolation[];
}

const SEVERITY_CONFIG = {
  critical: { color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/30' },
  high: { color: 'text-orange-400', bg: 'bg-orange-500/20', border: 'border-orange-500/30' },
  medium: { color: 'text-amber-400', bg: 'bg-amber-500/20', border: 'border-amber-500/30' },
  low: { color: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500/30' },
  info: { color: 'text-blue-400', bg: 'bg-blue-500/20', border: 'border-blue-500/30' },
};

const PROVIDER_COLORS = {
  aws: 'bg-orange-500/20 text-orange-400',
  azure: 'bg-blue-500/20 text-blue-400',
  gcp: 'bg-red-500/20 text-red-400',
  oci: 'bg-orange-600/20 text-orange-500',
};

export const CloudNSGViolationsPanel: React.FC<CloudNSGViolationsPanelProps> = ({ violations }) => {
  const [selectedViolation, setSelectedViolation] = useState<CloudNSGViolation | null>(null);

  const criticalViolations = violations.filter((v) => v.severity === 'critical').length;
  const highViolations = violations.filter((v) => v.severity === 'high').length;
  const autoRemediationAvailable = violations.filter((v) => v.aiRemediation.autoRemediationPossible).length;

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-slate-400 text-sm mb-1">Total Violations</p>
          <p className="text-3xl font-bold text-white">{violations.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-slate-400 text-sm mb-1">Critical</p>
          <p className="text-3xl font-bold text-red-400">{criticalViolations}</p>
        </Card>
        <Card className="p-4">
          <p className="text-slate-400 text-sm mb-1">High Severity</p>
          <p className="text-3xl font-bold text-orange-400">{highViolations}</p>
        </Card>
        <Card className="p-4">
          <p className="text-slate-400 text-sm mb-1">Auto-Fixable</p>
          <p className="text-3xl font-bold text-emerald-400">{autoRemediationAvailable}</p>
        </Card>
      </div>

      {/* Violations List */}
      <Card className="p-6">
        <h3 className="text-white font-semibold mb-4">Cloud NSG/Security Group Violations</h3>
        <div className="space-y-3">
          {violations.map((violation) => {
            const severityConfig = SEVERITY_CONFIG[violation.severity];
            const providerColor = PROVIDER_COLORS[violation.provider];
            return (
              <div
                key={violation.id}
                className="p-4 bg-slate-700/30 rounded-lg border border-slate-600 hover:border-cyan-500 cursor-pointer transition-colors"
                onClick={() => setSelectedViolation(violation)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded text-xs font-semibold border ${severityConfig.bg} ${severityConfig.border} ${severityConfig.color}`}>
                        {violation.severity.toUpperCase()}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${providerColor}`}>
                        {violation.provider.toUpperCase()}
                      </span>
                      <span className="px-2 py-0.5 bg-slate-600 text-slate-300 rounded text-xs">
                        {violation.resourceType.replace('_', ' ')}
                      </span>
                    </div>
                    <h4 className="text-white font-semibold mb-1">{violation.resourceName}</h4>
                    <p className="text-slate-400 text-sm mb-2">{violation.description}</p>
                    <p className="text-slate-500 text-xs">Region: {violation.region} | Account: {violation.accountId}</p>
                  </div>
                </div>

                {violation.baselineViolation && (
                  <div className="mt-3 pt-3 border-t border-slate-600">
                    <div className="flex items-start gap-2">
                      <span className="text-red-400">⚠️</span>
                      <div className="flex-1">
                        <p className="text-red-400 text-sm font-medium mb-1">
                          Violates: {violation.baselineViolation.baselineName}
                        </p>
                        <p className="text-slate-400 text-xs mb-1">{violation.baselineViolation.requirement}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {violation.baselineViolation.complianceFramework.map((framework, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-red-500/10 text-red-400 rounded text-xs">
                              {framework}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-3 pt-3 border-t border-slate-600">
                  {violation.aiRemediation.autoRemediationPossible ? (
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-400">✓</span>
                      <span className="text-emerald-400 text-sm font-medium">
                        Auto-remediation available ({violation.aiRemediation.estimatedTime})
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-amber-400">⚠️</span>
                      <span className="text-amber-400 text-sm font-medium">Manual remediation required</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Violation Details Modal */}
      {selectedViolation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-lg border border-slate-700 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-700">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">{selectedViolation.resourceName}</h2>
                  <p className="text-slate-400 text-sm">{selectedViolation.description}</p>
                </div>
                <button
                  onClick={() => setSelectedViolation(null)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Affected Rules */}
              <div>
                <h3 className="text-white font-semibold mb-3">Affected Rules</h3>
                <div className="space-y-2">
                  {selectedViolation.affectedRules.map((rule) => (
                    <div key={rule.ruleId} className="p-3 bg-slate-700/30 rounded border border-slate-600">
                      <p className="text-white font-medium mb-2">{rule.ruleName}</p>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-slate-400 text-xs">Protocol:</p>
                          <p className="text-white font-mono">{rule.protocol}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 text-xs">Port Range:</p>
                          <p className="text-white font-mono">{rule.portRange}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 text-xs">Source:</p>
                          <p className="text-white font-mono text-xs">{rule.sourceRange}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 text-xs">Destination:</p>
                          <p className="text-white font-mono text-xs">{rule.destinationRange}</p>
                        </div>
                      </div>
                      <p className="text-red-400 text-xs mt-2">⚠️ {rule.issue}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Remediation */}
              <div className="p-4 bg-cyan-500/10 rounded-lg border border-cyan-500/30">
                <h3 className="text-cyan-400 font-semibold mb-3">AI Remediation Plan</h3>
                <p className="text-slate-300 text-sm mb-3">{selectedViolation.aiRemediation.reasoning}</p>
                {selectedViolation.aiRemediation.autoRemediationPossible && selectedViolation.aiRemediation.remediationPlan ? (
                  <div>
                    <p className="text-emerald-400 text-sm font-medium mb-2">Automated Steps:</p>
                    <ol className="space-y-1 ml-4">
                      {selectedViolation.aiRemediation.remediationPlan.map((step, idx) => (
                        <li key={idx} className="text-slate-300 text-sm">
                          {idx + 1}. {step}
                        </li>
                      ))}
                    </ol>
                    <p className="text-slate-400 text-xs mt-3">
                      Estimated Time: {selectedViolation.aiRemediation.estimatedTime} | Risk: {selectedViolation.aiRemediation.riskLevel}
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-amber-400 text-sm font-medium mb-2">Manual Steps Required:</p>
                    <ol className="space-y-1 ml-4">
                      {selectedViolation.aiRemediation.manualSteps?.map((step, idx) => (
                        <li key={idx} className="text-slate-300 text-sm">
                          {idx + 1}. {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-slate-700 flex justify-end gap-2">
              <button
                onClick={() => setSelectedViolation(null)}
                className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-600 transition-colors"
              >
                Close
              </button>
              {selectedViolation.aiRemediation.autoRemediationPossible && (
                <button className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-500 transition-colors">
                  Execute Remediation
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
