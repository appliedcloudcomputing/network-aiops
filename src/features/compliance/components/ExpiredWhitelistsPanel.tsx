/**
 * Expired Whitelists Panel - Shows expired and expiring firewall rules
 */

import React from 'react';
import { Card } from '../../../components';
import type { ExpiredWhitelist } from '../../../types/complianceEnhanced';

interface ExpiredWhitelistsPanelProps {
  whitelists: ExpiredWhitelist[];
}

const STATUS_CONFIG = {
  expired: { color: 'text-red-400', bg: 'bg-red-500/20', label: 'Expired', icon: '⚠️' },
  expiring_soon: { color: 'text-amber-400', bg: 'bg-amber-500/20', label: 'Expiring Soon', icon: '⏰' },
  active: { color: 'text-emerald-400', bg: 'bg-emerald-500/20', label: 'Active', icon: '✓' },
  removed: { color: 'text-slate-400', bg: 'bg-slate-500/20', label: 'Removed', icon: '●' },
};

const RISK_CONFIG = {
  low: { color: 'text-emerald-400', label: 'Low Risk' },
  medium: { color: 'text-amber-400', label: 'Medium Risk' },
  high: { color: 'text-red-400', label: 'High Risk' },
};

export const ExpiredWhitelistsPanel: React.FC<ExpiredWhitelistsPanelProps> = ({ whitelists }) => {
  const expiredRules = whitelists.filter((w) => w.status === 'expired');
  const expiringSoon = whitelists.filter((w) => w.status === 'expiring_soon');
  const autoRemovable = whitelists.filter((w) => w.autoRemovalPossible && w.status === 'expired').length;

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-slate-400 text-sm mb-1">Total Whitelists</p>
          <p className="text-3xl font-bold text-white">{whitelists.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-slate-400 text-sm mb-1">Expired</p>
          <p className="text-3xl font-bold text-red-400">{expiredRules.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-slate-400 text-sm mb-1">Expiring Soon</p>
          <p className="text-3xl font-bold text-amber-400">{expiringSoon.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-slate-400 text-sm mb-1">Auto-Removable</p>
          <p className="text-3xl font-bold text-emerald-400">{autoRemovable}</p>
        </Card>
      </div>

      {/* Whitelists Table */}
      <Card className="p-6">
        <h3 className="text-white font-semibold mb-4">Expired & Expiring Whitelist Rules</h3>
        <div className="space-y-3">
          {whitelists.map((whitelist) => {
            const statusConfig = STATUS_CONFIG[whitelist.status];
            const riskConfig = RISK_CONFIG[whitelist.removalRisk];
            return (
              <div
                key={whitelist.id}
                className="p-4 bg-slate-700/30 rounded-lg border border-slate-600"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{statusConfig.icon}</span>
                      <h4 className="text-white font-semibold">{whitelist.ruleName}</h4>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${statusConfig.bg} ${statusConfig.color}`}>
                        {statusConfig.label}
                      </span>
                      {whitelist.status === 'expired' && (
                        <span className="px-2 py-1 bg-red-500/10 text-red-400 rounded text-xs">
                          {whitelist.daysOverdue} days overdue
                        </span>
                      )}
                      {whitelist.autoRemovalPossible && whitelist.status === 'expired' && (
                        <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-xs">
                          Auto-Removable
                        </span>
                      )}
                    </div>
                    <p className="text-slate-400 text-sm mb-1">Firewall: {whitelist.firewallName}</p>
                    <p className="text-slate-400 text-sm">Ticket: {whitelist.ticketId} | Requested by: {whitelist.requestedBy}</p>
                  </div>
                  <div className="text-right">
                    <p className={`${riskConfig.color} text-sm font-medium`}>
                      {riskConfig.label}
                    </p>
                  </div>
                </div>

                {/* Rule Details */}
                <div className="grid grid-cols-4 gap-3 mb-3 p-3 bg-slate-800/50 rounded">
                  <div>
                    <p className="text-slate-400 text-xs mb-1">Source IP</p>
                    <p className="text-white font-mono text-sm">{whitelist.sourceIp}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs mb-1">Destination IP</p>
                    <p className="text-white font-mono text-sm">{whitelist.destinationIp}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs mb-1">Port</p>
                    <p className="text-white font-mono text-sm">{whitelist.port}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs mb-1">Protocol</p>
                    <p className="text-white font-mono text-sm">{whitelist.protocol.toUpperCase()}</p>
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                  <div>
                    <p className="text-slate-400 mb-1">Created:</p>
                    <p className="text-white">{new Date(whitelist.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 mb-1">Expires:</p>
                    <p className="text-white">{new Date(whitelist.expiresAt).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Justification */}
                <div className="mb-3 p-3 bg-slate-800/50 rounded">
                  <p className="text-slate-400 text-xs mb-1">Business Justification:</p>
                  <p className="text-slate-300 text-sm">{whitelist.businessJustification}</p>
                </div>

                {/* AI Analysis */}
                <div className="pt-3 border-t border-slate-600">
                  <div className="flex items-start gap-2 mb-2">
                    <span className="text-cyan-400">🤖</span>
                    <div className="flex-1">
                      <p className="text-cyan-400 text-sm font-medium mb-1">AI Analysis:</p>
                      <div className="grid grid-cols-3 gap-3 text-xs">
                        <div>
                          <p className="text-slate-400">Still in Use:</p>
                          <p className={whitelist.aiAnalysis.stillInUse ? 'text-amber-400 font-medium' : 'text-emerald-400 font-medium'}>
                            {whitelist.aiAnalysis.stillInUse ? 'Yes' : 'No'}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-400">Usage Count:</p>
                          <p className="text-white font-medium">{whitelist.aiAnalysis.usageCount}</p>
                        </div>
                        <div>
                          <p className="text-slate-400">Last Used:</p>
                          <p className="text-white font-medium">
                            {whitelist.aiAnalysis.lastUsed ? new Date(whitelist.aiAnalysis.lastUsed).toLocaleDateString() : 'Never'}
                          </p>
                        </div>
                      </div>
                      <p className="text-slate-300 text-sm mt-2">{whitelist.aiAnalysis.removalImpact}</p>
                      <p className="text-emerald-400 text-sm mt-1">💡 {whitelist.aiAnalysis.recommendation}</p>
                    </div>
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
