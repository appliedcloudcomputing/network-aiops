/**
 * Reusable MetricCard component for dashboard metrics
 */

import React from 'react';
import type { TrendDirection, MetricColor } from '../../types';
import { TrendBadge } from './Badge';
import { Card } from './Card';

interface MetricCardProps {
  label: string;
  value: string;
  change?: string;
  trend?: TrendDirection;
  icon?: string;
  color?: MetricColor;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  change,
  trend = 'stable',
  icon,
  className = '',
}) => {
  return (
    <Card hover className={className}>
      <div className="flex items-center justify-between mb-4">
        {icon && <span className="text-3xl">{icon}</span>}
        {change && <TrendBadge change={change} trend={trend} />}
      </div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm text-slate-400">{label}</div>
    </Card>
  );
};

interface MiniStatCardProps {
  label: string;
  value: string;
  unit?: string;
  icon: string;
  trend?: string;
  colorClass?: string;
}

export const MiniStatCard: React.FC<MiniStatCardProps> = ({
  label,
  value,
  unit = '',
  icon,
  trend,
  colorClass = 'from-cyan-500/20 to-cyan-600/10',
}) => {
  const getTrendColor = (trendValue: string): string => {
    if (trendValue.includes('↑')) return 'text-emerald-400';
    if (trendValue.includes('↓')) return 'text-red-400';
    return 'text-slate-400';
  };

  return (
    <div
      className={`bg-gradient-to-br ${colorClass} backdrop-blur-sm rounded-xl p-3 border border-white/10`}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-slate-400 text-xs">{label}</span>
        <span className="text-lg">{icon}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-xl font-bold text-white">{value}</span>
        <span className="text-slate-400 text-xs">{unit}</span>
      </div>
      {trend && <div className={`text-xs mt-1 ${getTrendColor(trend)}`}>{trend}</div>}
    </div>
  );
};

interface SummaryStatProps {
  label: string;
  value: string;
  valueColor?: string;
}

export const SummaryStat: React.FC<SummaryStatProps> = ({
  label,
  value,
  valueColor = 'text-white',
}) => (
  <div className="text-center">
    <div className={`text-2xl font-bold ${valueColor}`}>{value}</div>
    <div className="text-xs text-slate-400">{label}</div>
  </div>
);
