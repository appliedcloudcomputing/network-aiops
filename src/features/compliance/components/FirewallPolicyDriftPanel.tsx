/**
 * Firewall Policy Drift Panel - Shows drift from baseline configurations
 */

import React, { useState } from 'react';
import { Card } from '../../../components';
import type { FirewallPolicyDrift } from '../../../types/complianceEnhanced';

interface FirewallPolicyDriftPanelProps {
  drifts: FirewallPolicyDrift[];
}

const STATUS_CONFIG = {
  compliant: { color: 'text-emerald-400', bg: 'bg-emerald-500/20', border: 'border-emerald-500/30', label: 'Compliant' },
  drift_detected: { color: 'text-amber-400', bg: 'bg-amber-500/20', border: 'border-amber-500/30', label: 'Drift Detected' },
  critical_drift: { color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/30', label: 'Critical Drift' },
  unknown: { color: 'text-slate-400', bg: 'bg-slate-500/20', border: 'border-slate-500/30', label: 'Unknown' },
};

const SEVERITY_CONFIG = {
  critical: { color: 'text-red-400', bg: 'bg-red-500/20' },
  high: { color: 'text-orange-400', bg: 'bg-orange-500/20' },
  medium: { color: 'text-amber-400', bg: 'bg-amber-500/20' },
  low: { color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
  info: { color: 'text-blue-400', bg: 'bg-blue-500/20' },
};

export const FirewallPolicyDriftPanel: React.FC<FirewallPolicyDriftPanelProps> = ({ drifts }) => {
  const [selectedDrift, setSelectedDrift] = useState<FirewallPolicyDrift | null>(null);

  const criticalDrifts = drifts.filter((d) => d.status === 'critical_drift').length;
  const driftDetected = drifts.filter((d) => d.status === 'drift_detected').length;
  const autoRemediationAvailable = drifts.filter((d) => d.aiAnalysis.autoRemediationPossible).length;

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-slate-400 text-sm mb-1">Total Firewalls</p>
          <p className="text-3xl font-bold text-white">{drifts.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-slate-400 text-sm mb-1">Critical Drift</p>
          <p className="text-3xl font-bold text-red-400">{criticalDrifts}</p>
        </Card>
        <Card className="p-4">
          <p className="text-slate-400 text-sm mb-1">Drift Detected</p>
          <p className="text-3xl font-bold text-amber-400">{driftDetected}</p>
        </Card>
        <Card className="p-4">
          <p className="text-slate-400 text-sm mb-1">Auto-Remediation</p>
          <p className="text-3xl font-bold text-cyan-400">{autoRemediationAvailable}</p>
        </Card>
      </div>

      {/* Drift List */}
      <Card className="p-6">
        <h3 className="text-white font-semibold mb-4">Policy Drift Detection</h3>
        <div className="space-y-3">
          {drifts.map((drift) => {
            const statusConfig = STATUS_CONFIG[drift.status];
            return (
              <div
                key={drift.id}
                className="p-4 bg-slate-700/30 rounded-lg border border-slate-600 hover:border-cyan-500 cursor-pointer transition-colors"
                onClick={() => setSelectedDrift(drift)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-white font-semibold">{drift.firewallName}</h4>
                      <span className="px-2 py-0.5 bg-slate-600 text-slate-300 rounded text-xs">
                        {drift.vendor.replace('_', ' ').toUpperCase()}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-semibold border ${statusConfig.bg} ${statusConfig.border} ${statusConfig.color}`}>
                        {statusConfig.label}
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm mb-1">Baseline: {drift.baselineName} v{drift.baselineVersion}</p>
                    <p className="text-slate-500 text-xs">Location: {drift.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-400 text-xs mb-1">Drift Items</p>
                    <p className="text-2xl font-bold text-white">{drift.driftItems.length}</p>
                  </div>
                </div>

                {/* AI Analysis Summary */}
                {drift.aiAnalysis.violatesBaseline.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-600">
                    <div className="flex items-start gap-2 mb-2">
                      <span className="text-red-400 text-sm">⚠️</span>
                      <div className="flex-1">
                        <p className="text-red-400 text-sm font-medium mb-1">Baseline Violations:</p>
                        <div className="flex flex-wrap gap-1">
                          {drift.aiAnalysis.violatesBaseline.map((violation, idx) => (
                            <span key={idx} className="px-2 py-1 bg-red-500/10 text-red-400 rounded text-xs">
                              {violation}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      {drift.aiAnalysis.autoRemediationPossible ? (
                        <>
                          <span className="text-emerald-400 text-sm">✓</span>
                          <span className="text-emerald-400 text-sm font-medium">Auto-remediation: Available</span>
                        </>
                      ) : (
                        <>
                          <span className="text-amber-400 text-sm">⚠️</span>
                          <span className="text-amber-400 text-sm font-medium">Auto-remediation: Manual Required</span>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Drift Details Modal */}
      {selectedDrift && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-lg border border-slate-700 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-slate-700">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">{selectedDrift.firewallName}</h2>
                  <p className="text-slate-400 text-sm">Drift Details & Remediation Plan</p>
                </div>
                <button
                  onClick={() => setSelectedDrift(null)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Drift Items */}
              <div>
                <h3 className="text-white font-semibold mb-3">Configuration Drift Items</h3>
                <div className="space-y-3">
                  {selectedDrift.driftItems.map((item) => {
                    const severityConfig = SEVERITY_CONFIG[item.severity];
                    return (
                      <div key={item.id} className="p-4 bg-slate-700/30 rounded-lg border border-slate-600">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${severityConfig.bg} ${severityConfig.color}`}>
                              {item.severity.toUpperCase()}
                            </span>
                            <span className="px-2 py-1 bg-slate-600 text-slate-300 rounded text-xs">
                              {item.type.replace('_', ' ').toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <p className="text-white font-medium mb-2">{item.description}</p>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <p className="text-slate-400 mb-1">Baseline:</p>
                            <p className="text-slate-300 font-mono text-xs">{item.baseline}</p>
                          </div>
                          <div>
                            <p className="text-slate-400 mb-1">Current:</p>
                            <p className="text-amber-400 font-mono text-xs">{item.current}</p>
                          </div>
                        </div>
                        <div className="mt-2 pt-2 border-t border-slate-600">
                          <p className="text-red-400 text-xs">Impact: {item.impact}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* AI Analysis */}
              <div className="p-4 bg-cyan-500/10 rounded-lg border border-cyan-500/30">
                <h3 className="text-cyan-400 font-semibold mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  AI Analysis
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-slate-400 text-sm mb-1">Reasoning:</p>
                    <p className="text-white text-sm">{selectedDrift.aiAnalysis.reasoning}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm mb-1">Confidence Level:</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500"
                          style={{ width: `${selectedDrift.aiAnalysis.confidence * 100}%` }}
                        />
                      </div>
                      <span className="text-white text-sm font-semibold">
                        {(selectedDrift.aiAnalysis.confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                  {selectedDrift.aiAnalysis.autoRemediationPossible && selectedDrift.aiAnalysis.remediationSteps && (
                    <div>
                      <p className="text-emerald-400 text-sm font-medium mb-2">✓ Auto-Remediation Steps:</p>
                      <ol className="space-y-1 ml-4">
                        {selectedDrift.aiAnalysis.remediationSteps.map((step, idx) => (
                          <li key={idx} className="text-slate-300 text-sm">
                            {idx + 1}. {step}
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-slate-700 flex justify-between">
              <button className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-600 transition-colors">
                Export Report
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedDrift(null)}
                  className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-600 transition-colors"
                >
                  Close
                </button>
                {selectedDrift.aiAnalysis.autoRemediationPossible && (
                  <button className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-500 transition-colors">
                    Execute Auto-Remediation
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
