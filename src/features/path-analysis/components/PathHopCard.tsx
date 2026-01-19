/**
 * Path Hop Card - Visual representation of a single network hop
 * Shows device type, issues, and security rules
 */

import React, { useState } from 'react';
import type { PathHopEnhanced } from '../../../types/pathAnalysis';

interface PathHopCardProps {
  hop: PathHopEnhanced;
  isFirst: boolean;
  isLast: boolean;
}

const HOP_TYPE_CONFIG = {
  source: {
    icon: '🖥️',
    label: 'Source',
    color: 'from-blue-500 to-blue-600',
    borderColor: 'border-blue-500',
  },
  firewall: {
    icon: '🛡️',
    label: 'Firewall',
    color: 'from-red-500 to-red-600',
    borderColor: 'border-red-500',
  },
  cloud_gateway: {
    icon: '☁️',
    label: 'Cloud Gateway',
    color: 'from-cyan-500 to-cyan-600',
    borderColor: 'border-cyan-500',
  },
  nsg: {
    icon: '🔷',
    label: 'Network Security Group',
    color: 'from-blue-500 to-indigo-600',
    borderColor: 'border-blue-500',
  },
  security_group: {
    icon: '🔶',
    label: 'Security Group',
    color: 'from-orange-500 to-orange-600',
    borderColor: 'border-orange-500',
  },
  router: {
    icon: '🔀',
    label: 'Router',
    color: 'from-purple-500 to-purple-600',
    borderColor: 'border-purple-500',
  },
  destination: {
    icon: '🎯',
    label: 'Destination',
    color: 'from-emerald-500 to-emerald-600',
    borderColor: 'border-emerald-500',
  },
  unknown: {
    icon: '❓',
    label: 'Unknown',
    color: 'from-slate-500 to-slate-600',
    borderColor: 'border-slate-500',
  },
};

const ISSUE_SEVERITY_COLORS = {
  low: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
  medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  critical: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const IssueIcon: React.FC<{ type: string }> = ({ type }) => {
  if (type === 'blocked') {
    return (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
      </svg>
    );
  }
  if (type === 'asymmetric_routing') {
    return (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    );
  }
  if (type === 'missing_rule') {
    return (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    );
  }
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
};

export const PathHopCard: React.FC<PathHopCardProps> = ({ hop, isLast }) => {
  const [expanded, setExpanded] = useState(false);
  const config = HOP_TYPE_CONFIG[hop.hopType];
  const hasIssues = hop.issues && hop.issues.length > 0;
  const hasBlockedIssue = hop.issues?.some((i) => i.type === 'blocked');
  const hasAsymmetricIssue = hop.issues?.some((i) => i.type === 'asymmetric_routing');
  const hasMissingRuleIssue = hop.issues?.some((i) => i.type === 'missing_rule');

  return (
    <div className="relative">
      {/* Connection Arrow (not for last hop) */}
      {!isLast && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full w-1 h-12 flex flex-col items-center">
          <div className={`flex-1 w-1 ${hasBlockedIssue ? 'bg-red-500 animate-pulse' : 'bg-slate-600'}`} />
          <svg className={`w-6 h-6 ${hasBlockedIssue ? 'text-red-500' : 'text-slate-600'}`} fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 16l-6-6h12z" />
          </svg>
        </div>
      )}

      {/* Hop Card */}
      <div
        onClick={() => setExpanded(!expanded)}
        className={`relative bg-slate-800 rounded-lg border-2 ${
          hasBlockedIssue ? 'border-red-500 shadow-red-500/50' :
          hasAsymmetricIssue ? 'border-amber-500 shadow-amber-500/50' :
          hasMissingRuleIssue ? 'border-orange-500 shadow-orange-500/50' :
          config.borderColor
        } shadow-lg cursor-pointer transition-all hover:scale-105 ${expanded ? 'ring-2 ring-cyan-500' : ''}`}
      >
        {/* Issue Indicator Badge */}
        {hasIssues && (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-slate-900">
            {hop.issues.length}
          </div>
        )}

        {/* Hop Header */}
        <div className={`bg-gradient-to-r ${config.color} p-4 rounded-t-lg`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-3xl">{config.icon}</div>
              <div>
                <h4 className="text-white font-semibold text-lg">
                  {hop.deviceName || config.label}
                </h4>
                <p className="text-white/80 text-sm font-mono">{hop.ipAddress}</p>
              </div>
            </div>
            <div className="text-white/90 font-mono text-sm">
              #{hop.hopNumber}
            </div>
          </div>
        </div>

        {/* Hop Details */}
        <div className="p-4 space-y-3">
          {/* Latency & Status */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-slate-700/50 p-2 rounded">
              <p className="text-slate-400 text-xs">Latency</p>
              <p className={`font-bold ${
                hop.avgLatency > 100 ? 'text-red-400' :
                hop.avgLatency > 50 ? 'text-amber-400' :
                'text-emerald-400'
              }`}>
                {hop.avgLatency.toFixed(1)} ms
              </p>
            </div>
            <div className="bg-slate-700/50 p-2 rounded">
              <p className="text-slate-400 text-xs">Packet Loss</p>
              <p className={`font-bold ${hop.packetLoss > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                {hop.packetLoss.toFixed(1)}%
              </p>
            </div>
          </div>

          {/* Location & Cloud */}
          {(hop.location || hop.cloudProvider) && (
            <div className="flex gap-2 text-sm">
              {hop.location && (
                <span className="px-2 py-1 bg-slate-700/50 text-slate-300 rounded text-xs">
                  📍 {hop.location}
                </span>
              )}
              {hop.cloudProvider && (
                <span className="px-2 py-1 bg-slate-700/50 text-slate-300 rounded text-xs uppercase">
                  {hop.cloudProvider === 'aws' && '☁️ AWS'}
                  {hop.cloudProvider === 'azure' && '🔷 Azure'}
                  {hop.cloudProvider === 'gcp' && '🔶 GCP'}
                </span>
              )}
            </div>
          )}

          {/* Issues */}
          {hasIssues && (
            <div className="space-y-2">
              {hop.issues.map((issue, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border ${ISSUE_SEVERITY_COLORS[issue.severity]}`}
                >
                  <div className="flex items-start gap-2">
                    <IssueIcon type={issue.type} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h5 className="font-semibold text-sm capitalize">
                          {issue.type.replace(/_/g, ' ')}
                        </h5>
                        <span className="text-xs uppercase font-bold">{issue.severity}</span>
                      </div>
                      <p className="text-sm">{issue.message}</p>
                      {expanded && (
                        <div className="mt-2 pt-2 border-t border-current/20">
                          <p className="text-xs opacity-80">💡 {issue.recommendation}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Security Rules (when expanded) */}
          {expanded && hop.securityRules && hop.securityRules.length > 0 && (
            <div className="pt-3 border-t border-slate-700">
              <h5 className="text-white font-semibold text-sm mb-2 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Security Rules
              </h5>
              <div className="space-y-1">
                {hop.securityRules.map((rule) => (
                  <div
                    key={rule.id}
                    className={`p-2 rounded text-xs font-mono ${
                      rule.matched
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-700/30 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{rule.name}</span>
                      <span className={`uppercase font-bold ${
                        rule.action === 'allow' ? 'text-emerald-400' : 'text-red-400'
                      }`}>
                        {rule.action}
                      </span>
                    </div>
                    <div className="text-xs opacity-70 mt-1">
                      {rule.source} → {rule.destination}:{rule.port}/{rule.protocol}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Return Path Info (for asymmetric routing) */}
          {expanded && hop.returnPath && (
            <div className="pt-3 border-t border-slate-700">
              <h5 className="text-white font-semibold text-sm mb-2">Return Path</h5>
              <div className={`p-2 rounded text-sm ${
                hop.returnPath.isSymmetric
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}>
                {hop.returnPath.isSymmetric ? (
                  <span>✓ Symmetric routing via {hop.returnPath.ipAddress}</span>
                ) : (
                  <div>
                    <p>⚠ Asymmetric routing detected</p>
                    <p className="text-xs mt-1 opacity-80">{hop.returnPath.asymmetryReason}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Expand/Collapse Indicator */}
          <div className="text-center">
            <button className="text-xs text-slate-400 hover:text-cyan-400 flex items-center justify-center gap-1 mx-auto">
              {expanded ? 'Less Details' : 'More Details'}
              <svg className={`w-3 h-3 transition-transform ${expanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
