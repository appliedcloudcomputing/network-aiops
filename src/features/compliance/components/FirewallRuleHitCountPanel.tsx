/**
 * Firewall Rule Hit Count Panel - Shows unused and low-usage rules
 */

import React from 'react';
import { Card } from '../../../components';
import type { FirewallRuleHitCount } from '../../../types/complianceEnhanced';

interface FirewallRuleHitCountPanelProps {
  hitCounts: FirewallRuleHitCount[];
}

const STATUS_CONFIG = {
  unused: { color: 'text-red-400', bg: 'bg-red-500/20', label: 'Unused', icon: '⚠️' },
  low_usage: { color: 'text-amber-400', bg: 'bg-amber-500/20', label: 'Low Usage', icon: '⚡' },
  high_usage: { color: 'text-emerald-400', bg: 'bg-emerald-500/20', label: 'High Usage', icon: '✓' },
  active: { color: 'text-cyan-400', bg: 'bg-cyan-500/20', label: 'Active', icon: '●' },
};

export const FirewallRuleHitCountPanel: React.FC<FirewallRuleHitCountPanelProps> = ({ hitCounts }) => {
  const unusedRules = hitCounts.filter((r) => r.status === 'unused');
  const lowUsageRules = hitCounts.filter((r) => r.status === 'low_usage');
  const autoRemediationAvailable = hitCounts.filter((r) => r.autoRemediationPossible).length;

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-slate-400 text-sm mb-1">Total Rules</p>
          <p className="text-3xl font-bold text-white">{hitCounts.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-slate-400 text-sm mb-1">Unused Rules</p>
          <p className="text-3xl font-bold text-red-400">{unusedRules.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-slate-400 text-sm mb-1">Low Usage</p>
          <p className="text-3xl font-bold text-amber-400">{lowUsageRules.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-slate-400 text-sm mb-1">Auto-Removable</p>
          <p className="text-3xl font-bold text-cyan-400">{autoRemediationAvailable}</p>
        </Card>
      </div>

      {/* Rules Table */}
      <Card className="p-6">
        <h3 className="text-white font-semibold mb-4">Firewall Rule Hit Count Analysis</h3>
        <div className="space-y-2">
          {hitCounts.map((rule) => {
            const statusConfig = STATUS_CONFIG[rule.status];
            return (
              <div
                key={rule.id}
                className="p-4 bg-slate-700/30 rounded-lg border border-slate-600 hover:border-cyan-500 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xl">{statusConfig.icon}</span>
                      <h4 className="text-white font-semibold">{rule.ruleName}</h4>
                      <span className="px-2 py-0.5 bg-slate-600 text-slate-300 rounded text-xs">
                        {rule.vendor.replace('_', ' ').toUpperCase()}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${statusConfig.bg} ${statusConfig.color}`}>
                        {statusConfig.label}
                      </span>
                      {rule.autoRemediationPossible && (
                        <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-xs">
                          Auto-Removable
                        </span>
                      )}
                    </div>
                    <p className="text-slate-400 text-sm mb-1">Firewall: {rule.firewallName}</p>
                    <p className="text-slate-500 text-xs">Rule ID: {rule.ruleId}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-400 text-xs mb-1">Hit Count</p>
                    <p className="text-2xl font-bold text-white">{rule.hitCount.toLocaleString()}</p>
                    <p className="text-slate-500 text-xs mt-1">{rule.daysActive} days active</p>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-600">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-slate-400 mb-1">Last Hit:</p>
                      <p className="text-white">
                        {rule.lastHit ? new Date(rule.lastHit).toLocaleString() : 'Never'}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400 mb-1">Created:</p>
                      <p className="text-white">{new Date(rule.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-cyan-400 text-sm">💡 Recommendation: {rule.recommendation}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};
