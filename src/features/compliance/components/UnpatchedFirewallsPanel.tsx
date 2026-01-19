/**
 * Unpatched Firewalls Panel - Shows firewalls with outdated versions and vulnerabilities
 */

import React, { useState } from 'react';
import { Card } from '../../../components';
import type { UnpatchedFirewall } from '../../../types/complianceEnhanced';

interface UnpatchedFirewallsPanelProps {
  firewalls: UnpatchedFirewall[];
}

const PATCH_STATUS_CONFIG = {
  critical: { color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/30', label: 'Critical', icon: '🚨' },
  high_priority: { color: 'text-orange-400', bg: 'bg-orange-500/20', border: 'border-orange-500/30', label: 'High Priority', icon: '⚠️' },
  normal: { color: 'text-amber-400', bg: 'bg-amber-500/20', border: 'border-amber-500/30', label: 'Normal', icon: '⏰' },
  up_to_date: { color: 'text-emerald-400', bg: 'bg-emerald-500/20', border: 'border-emerald-500/30', label: 'Up to Date', icon: '✓' },
};

const SEVERITY_CONFIG = {
  critical: { color: 'text-red-400', bg: 'bg-red-500/20' },
  high: { color: 'text-orange-400', bg: 'bg-orange-500/20' },
  medium: { color: 'text-amber-400', bg: 'bg-amber-500/20' },
  low: { color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
  info: { color: 'text-blue-400', bg: 'bg-blue-500/20' },
};

export const UnpatchedFirewallsPanel: React.FC<UnpatchedFirewallsPanelProps> = ({ firewalls }) => {
  const [selectedFirewall, setSelectedFirewall] = useState<UnpatchedFirewall | null>(null);

  const criticalFirewalls = firewalls.filter((f) => f.patchStatus === 'critical').length;
  const totalVulnerabilities = firewalls.reduce((acc, f) => acc + f.vulnerabilities.length, 0);
  const autoUpdateSupported = firewalls.filter((f) => f.autoUpdateSupported).length;

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-slate-400 text-sm mb-1">Total Firewalls</p>
          <p className="text-3xl font-bold text-white">{firewalls.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-slate-400 text-sm mb-1">Critical</p>
          <p className="text-3xl font-bold text-red-400">{criticalFirewalls}</p>
        </Card>
        <Card className="p-4">
          <p className="text-slate-400 text-sm mb-1">Vulnerabilities</p>
          <p className="text-3xl font-bold text-orange-400">{totalVulnerabilities}</p>
        </Card>
        <Card className="p-4">
          <p className="text-slate-400 text-sm mb-1">Auto-Update</p>
          <p className="text-3xl font-bold text-cyan-400">{autoUpdateSupported}</p>
        </Card>
      </div>

      {/* Firewalls List */}
      <Card className="p-6">
        <h3 className="text-white font-semibold mb-4">Firewall Patch Status</h3>
        <div className="space-y-3">
          {firewalls.map((firewall) => {
            const statusConfig = PATCH_STATUS_CONFIG[firewall.patchStatus];
            return (
              <div
                key={firewall.id}
                className="p-4 bg-slate-700/30 rounded-lg border border-slate-600 hover:border-cyan-500 cursor-pointer transition-colors"
                onClick={() => setSelectedFirewall(firewall)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{statusConfig.icon}</span>
                      <h4 className="text-white font-semibold">{firewall.firewallName}</h4>
                      <span className="px-2 py-0.5 bg-slate-600 text-slate-300 rounded text-xs">
                        {firewall.vendor.replace('_', ' ').toUpperCase()}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-semibold border ${statusConfig.bg} ${statusConfig.border} ${statusConfig.color}`}>
                        {statusConfig.label}
                      </span>
                      {firewall.autoUpdateSupported && (
                        <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded text-xs">
                          Auto-Update Available
                        </span>
                      )}
                    </div>
                    <p className="text-slate-400 text-sm">Location: {firewall.location}</p>
                  </div>
                  <div className="text-right">
                    {firewall.patchStatus !== 'up_to_date' && (
                      <p className="text-red-400 text-sm font-medium">{firewall.daysOutdated} days outdated</p>
                    )}
                  </div>
                </div>

                {/* Version Info */}
                <div className="grid grid-cols-2 gap-4 mb-3 p-3 bg-slate-800/50 rounded">
                  <div>
                    <p className="text-slate-400 text-xs mb-1">Current Version</p>
                    <p className="text-white font-mono text-sm">{firewall.currentVersion}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs mb-1">Latest Version</p>
                    <p className="text-emerald-400 font-mono text-sm">{firewall.latestVersion}</p>
                  </div>
                </div>

                {/* Vulnerabilities */}
                {firewall.vulnerabilities.length > 0 && (
                  <div className="mb-3">
                    <p className="text-red-400 text-sm font-medium mb-2">⚠️ Known Vulnerabilities ({firewall.vulnerabilities.length}):</p>
                    <div className="space-y-2">
                      {firewall.vulnerabilities.slice(0, 2).map((vuln) => {
                        const sevConfig = SEVERITY_CONFIG[vuln.severity];
                        return (
                          <div key={vuln.cveId} className="p-2 bg-slate-800/50 rounded">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`px-2 py-0.5 rounded text-xs font-semibold ${sevConfig.bg} ${sevConfig.color}`}>
                                {vuln.severity.toUpperCase()}
                              </span>
                              <span className="text-white font-mono text-xs">{vuln.cveId}</span>
                              {vuln.exploitAvailable && (
                                <span className="px-2 py-0.5 bg-red-500/20 text-red-400 rounded text-xs">
                                  Exploit Available
                                </span>
                              )}
                            </div>
                            <p className="text-slate-300 text-xs">{vuln.description}</p>
                          </div>
                        );
                      })}
                      {firewall.vulnerabilities.length > 2 && (
                        <p className="text-slate-400 text-xs text-center">
                          +{firewall.vulnerabilities.length - 2} more vulnerabilities
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Compliance Impact */}
                {firewall.complianceImpact.length > 0 && (
                  <div className="mb-3 pt-3 border-t border-slate-600">
                    <p className="text-amber-400 text-sm mb-2">Compliance Impact:</p>
                    <div className="flex flex-wrap gap-1">
                      {firewall.complianceImpact.map((impact, idx) => (
                        <span key={idx} className="px-2 py-1 bg-amber-500/10 text-amber-400 rounded text-xs">
                          {impact}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Maintenance Window */}
                {firewall.maintenanceWindow && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-cyan-400">📅</span>
                    <span className="text-slate-400">Maintenance Window:</span>
                    <span className="text-white">{new Date(firewall.maintenanceWindow).toLocaleString()}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Firewall Details Modal */}
      {selectedFirewall && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-lg border border-slate-700 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-700">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">{selectedFirewall.firewallName}</h2>
                  <p className="text-slate-400 text-sm">Patch Details & Vulnerability Information</p>
                </div>
                <button
                  onClick={() => setSelectedFirewall(null)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* All Vulnerabilities */}
              <div>
                <h3 className="text-white font-semibold mb-3">All Vulnerabilities</h3>
                <div className="space-y-3">
                  {selectedFirewall.vulnerabilities.map((vuln) => {
                    const sevConfig = SEVERITY_CONFIG[vuln.severity];
                    return (
                      <div key={vuln.cveId} className="p-4 bg-slate-700/30 rounded-lg border border-slate-600">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${sevConfig.bg} ${sevConfig.color}`}>
                            {vuln.severity.toUpperCase()}
                          </span>
                          <span className="text-white font-mono">{vuln.cveId}</span>
                          {vuln.exploitAvailable && (
                            <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs font-semibold">
                              ⚠️ Exploit Available
                            </span>
                          )}
                        </div>
                        <p className="text-white mb-2">{vuln.description}</p>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <p className="text-slate-400 text-xs">Published:</p>
                            <p className="text-white">{new Date(vuln.published).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-slate-400 text-xs">Patched In:</p>
                            <p className="text-emerald-400 font-mono">{vuln.patchedInVersion}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Affected Services */}
              {selectedFirewall.affectedServices.length > 0 && (
                <div>
                  <h3 className="text-white font-semibold mb-3">Affected Services</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedFirewall.affectedServices.map((service, idx) => (
                      <span key={idx} className="px-3 py-2 bg-amber-500/10 text-amber-400 rounded border border-amber-500/30">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Update Risk */}
              <div className="p-4 bg-cyan-500/10 rounded-lg border border-cyan-500/30">
                <h3 className="text-cyan-400 font-semibold mb-2">Update Risk Assessment</h3>
                <p className="text-white text-sm">
                  Update Risk: <span className="font-semibold">{selectedFirewall.updateRisk.toUpperCase()}</span>
                </p>
                {selectedFirewall.autoUpdateSupported && (
                  <p className="text-emerald-400 text-sm mt-2">
                    ✓ Automatic updates supported for this firewall
                  </p>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-slate-700 flex justify-end gap-2">
              <button
                onClick={() => setSelectedFirewall(null)}
                className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-600 transition-colors"
              >
                Close
              </button>
              <button className="px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-500 transition-colors">
                Schedule Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
