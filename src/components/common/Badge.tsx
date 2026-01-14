/**
 * Reusable Badge component for status indicators and labels
 */

import React from 'react';
import type { AlertType, ViolationSeverity, ActivityStatus } from '../../types';

type BadgeVariant = 'success' | 'error' | 'warning' | 'info' | 'default';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
  pill?: boolean;
}

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  success: 'bg-emerald-500/20 text-emerald-400',
  error: 'bg-red-500/20 text-red-400',
  warning: 'bg-amber-500/20 text-amber-400',
  info: 'bg-blue-500/20 text-blue-400',
  default: 'bg-slate-500/20 text-slate-400',
};

const SIZE_CLASSES: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1.5 text-sm',
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  pill = true,
}) => {
  const roundedClass = pill ? 'rounded-full' : 'rounded';

  return (
    <span
      className={`inline-flex items-center font-medium ${roundedClass} ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`}
    >
      {children}
    </span>
  );
};

export const alertTypeToVariant = (type: AlertType): BadgeVariant => {
  const map: Record<AlertType, BadgeVariant> = {
    critical: 'error',
    warning: 'warning',
    info: 'info',
  };
  return map[type] || 'default';
};

export const severityToVariant = (severity: ViolationSeverity): BadgeVariant => {
  const map: Record<ViolationSeverity, BadgeVariant> = {
    critical: 'error',
    high: 'error',
    medium: 'warning',
    low: 'info',
  };
  return map[severity] || 'default';
};

export const statusToVariant = (status: ActivityStatus): BadgeVariant => {
  const map: Record<ActivityStatus, BadgeVariant> = {
    success: 'success',
    error: 'error',
    warning: 'warning',
  };
  return map[status] || 'default';
};

interface TrendBadgeProps {
  change: string;
  trend: 'up' | 'down' | 'stable';
}

export const TrendBadge: React.FC<TrendBadgeProps> = ({ change, trend }) => {
  const variant: BadgeVariant =
    trend === 'up' ? 'success' :
    trend === 'down' ? 'error' :
    'default';

  return <Badge variant={variant} size="sm">{change}</Badge>;
};
