/**
 * Path Graph Visualization - Graph-based visualization of network path
 * Shows: Source → Firewall → Cloud GW → NSG → Destination
 * Highlights: Blocked hops, Asymmetric routing, Missing rules
 */

import React from 'react';
import { Card, CardHeader } from '../../../components';
import type { PathGraphVisualization } from '../../../types/pathAnalysis';
import { PathHopCard } from './PathHopCard';

interface PathGraphVisualizationProps {
  pathData: PathGraphVisualization;
}

export const PathGraphVisualizationComponent: React.FC<PathGraphVisualizationProps> = ({ pathData }) => {
  return (
    <Card>
      <CardHeader
        title="Network Path Graph"
        subtitle={`${pathData.source} → ${pathData.destination}`}
      />

      <div className="p-6">
        {/* Issues Summary */}
        <div className="mb-6 grid grid-cols-4 gap-4">
          <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Total Hops</span>
              <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-white">{pathData.hops.length}</div>
          </div>

          <div className={`p-4 rounded-lg border ${
            pathData.issues.blocked > 0
              ? 'bg-red-500/10 border-red-500/30'
              : 'bg-emerald-500/10 border-emerald-500/30'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Blocked Hops</span>
              <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            </div>
            <div className={`text-3xl font-bold ${
              pathData.issues.blocked > 0 ? 'text-red-400' : 'text-emerald-400'
            }`}>
              {pathData.issues.blocked}
            </div>
          </div>

          <div className={`p-4 rounded-lg border ${
            pathData.issues.asymmetricRouting > 0
              ? 'bg-amber-500/10 border-amber-500/30'
              : 'bg-emerald-500/10 border-emerald-500/30'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Asymmetric Routes</span>
              <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <div className={`text-3xl font-bold ${
              pathData.issues.asymmetricRouting > 0 ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              {pathData.issues.asymmetricRouting}
            </div>
          </div>

          <div className={`p-4 rounded-lg border ${
            pathData.issues.missingRules > 0
              ? 'bg-orange-500/10 border-orange-500/30'
              : 'bg-emerald-500/10 border-emerald-500/30'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Missing Rules</span>
              <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className={`text-3xl font-bold ${
              pathData.issues.missingRules > 0 ? 'text-orange-400' : 'text-emerald-400'
            }`}>
              {pathData.issues.missingRules}
            </div>
          </div>
        </div>

        {/* Path Health Indicator */}
        <div className="mb-6">
          <div className={`p-4 rounded-lg border-2 ${
            pathData.health === 'healthy' ? 'bg-emerald-500/10 border-emerald-500/30' :
            pathData.health === 'degraded' ? 'bg-amber-500/10 border-amber-500/30' :
            pathData.health === 'critical' ? 'bg-red-500/10 border-red-500/30' :
            'bg-slate-500/10 border-slate-500/30'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-white font-semibold mb-1">Overall Path Health</h4>
                <p className="text-sm text-slate-400">
                  {pathData.health === 'healthy' && 'All hops are operational with no issues detected'}
                  {pathData.health === 'degraded' && 'Some issues detected - path is functional but may have performance impacts'}
                  {pathData.health === 'critical' && 'Critical issues detected - path may be blocked or severely degraded'}
                  {pathData.health === 'unknown' && 'Unable to determine path health'}
                </p>
              </div>
              <div className={`px-6 py-3 rounded-lg text-lg font-bold uppercase ${
                pathData.health === 'healthy' ? 'bg-emerald-500 text-white' :
                pathData.health === 'degraded' ? 'bg-amber-500 text-white' :
                pathData.health === 'critical' ? 'bg-red-500 text-white' :
                'bg-slate-500 text-white'
              }`}>
                {pathData.health}
              </div>
            </div>
          </div>
        </div>

        {/* Graph Visualization */}
        <div className="relative">
          <div className="grid grid-cols-1 gap-12 max-w-4xl mx-auto">
            {pathData.hops.map((hop, index) => (
              <PathHopCard
                key={hop.hopNumber}
                hop={hop}
                isFirst={index === 0}
                isLast={index === pathData.hops.length - 1}
              />
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-8 pt-6 border-t border-slate-700">
          <h4 className="text-white font-semibold mb-4">Legend</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded animate-pulse" />
              <span className="text-slate-300">Blocked Traffic</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-amber-500 rounded" />
              <span className="text-slate-300">Asymmetric Routing</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-500 rounded" />
              <span className="text-slate-300">Missing Rule</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-emerald-500 rounded" />
              <span className="text-slate-300">Healthy</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
