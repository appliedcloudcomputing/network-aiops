/**
 * Reusable StatusIndicator component
 */

import React from 'react';
import type { ActivityStatus, PlatformStatus, AlertType } from '../../types';

type IndicatorSize = 'sm' | 'md' | 'lg';

interface StatusIndicatorProps {
  status: ActivityStatus | PlatformStatus | AlertType | 'success' | 'error' | 'warning' | 'info' | 'default';
  size?: IndicatorSize;
  pulse?: boolean;
  className?: string;
}

const SIZE_CLASSES: Record<IndicatorSize, string> = {
  sm: 'w-2 h-2',
  md: 'w-3 h-3',
  lg: 'w-4 h-4',
};

const STATUS_COLORS: Record<string, string> = {
  success: 'bg-emerald-500',
  error: 'bg-red-500',
  warning: 'bg-amber-500',
  info: 'bg-blue-500',
  default: 'bg-slate-500',
  operational: 'bg-emerald-500',
  degraded: 'bg-amber-500',
  down: 'bg-red-500',
  critical: 'bg-red-500',
};

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  size = 'md',
  pulse = false,
  className = '',
}) => {
  const colorClass = STATUS_COLORS[status] || STATUS_COLORS.default;
  const pulseClass = pulse || status === 'critical' || status === 'degraded' ? 'animate-pulse' : '';

  return (
    <div
      className={`rounded-full ${SIZE_CLASSES[size]} ${colorClass} ${pulseClass} ${className}`}
    />
  );
};

interface LiveIndicatorProps {
  label?: string;
  className?: string;
}

export const LiveIndicator: React.FC<LiveIndicatorProps> = ({ label = 'LIVE', className = '' }) => (
  <div className={`flex items-center gap-2 ${className}`}>
    <StatusIndicator status="success" size="md" pulse />
    <span className="text-emerald-400 font-medium">{label}</span>
  </div>
);

interface PlatformStatusIndicatorProps {
  name: string;
  status: PlatformStatus;
  latency: string;
  icon: string;
}

export const PlatformStatusIndicator: React.FC<PlatformStatusIndicatorProps> = ({
  name,
  status,
  latency,
  icon,
}) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2">
      <span>{icon}</span>
      <span className="text-white text-sm">{name}</span>
    </div>
    <div className="flex items-center gap-3">
      <span className="text-slate-400 text-xs font-mono">{latency}</span>
      <StatusIndicator status={status} pulse={status !== 'operational'} />
    </div>
  </div>
);
