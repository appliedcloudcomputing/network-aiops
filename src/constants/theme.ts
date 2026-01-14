/**
 * Theme and styling constants
 */

export const COLORS = {
  score: {
    excellent: {
      text: 'text-emerald-400',
      bg: 'bg-emerald-500',
      bgLight: 'bg-emerald-500/20',
      ring: 'ring-emerald-500',
      stroke: '#10b981',
    },
    good: {
      text: 'text-cyan-400',
      bg: 'bg-cyan-500',
      bgLight: 'bg-cyan-500/20',
      ring: 'ring-cyan-500',
      stroke: '#06b6d4',
    },
    warning: {
      text: 'text-amber-400',
      bg: 'bg-amber-500',
      bgLight: 'bg-amber-500/20',
      ring: 'ring-amber-500',
      stroke: '#f59e0b',
    },
    critical: {
      text: 'text-red-400',
      bg: 'bg-red-500',
      bgLight: 'bg-red-500/20',
      ring: 'ring-red-500',
      stroke: '#ef4444',
    },
  },
  framework: {
    emerald: {
      bg: 'bg-emerald-500',
      bgLight: 'bg-emerald-500/10',
      border: 'border-emerald-500/30',
      text: 'text-emerald-400',
      gradient: 'from-emerald-500 to-emerald-600',
    },
    blue: {
      bg: 'bg-blue-500',
      bgLight: 'bg-blue-500/10',
      border: 'border-blue-500/30',
      text: 'text-blue-400',
      gradient: 'from-blue-500 to-blue-600',
    },
    purple: {
      bg: 'bg-purple-500',
      bgLight: 'bg-purple-500/10',
      border: 'border-purple-500/30',
      text: 'text-purple-400',
      gradient: 'from-purple-500 to-purple-600',
    },
    amber: {
      bg: 'bg-amber-500',
      bgLight: 'bg-amber-500/10',
      border: 'border-amber-500/30',
      text: 'text-amber-400',
      gradient: 'from-amber-500 to-amber-600',
    },
  },
  severity: {
    critical: {
      bg: 'bg-red-500/20',
      text: 'text-red-400',
      border: 'border-red-500/30',
    },
    high: {
      bg: 'bg-orange-500/20',
      text: 'text-orange-400',
      border: 'border-orange-500/30',
    },
    medium: {
      bg: 'bg-amber-500/20',
      text: 'text-amber-400',
      border: 'border-amber-500/30',
    },
    low: {
      bg: 'bg-blue-500/20',
      text: 'text-blue-400',
      border: 'border-blue-500/30',
    },
  },
  alert: {
    critical: {
      bg: 'bg-red-500/10',
      border: 'border-red-500/30',
      borderLeft: 'border-l-red-500',
      hover: 'hover:bg-red-500/20',
    },
    warning: {
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30',
      borderLeft: 'border-l-amber-500',
      hover: 'hover:bg-amber-500/20',
    },
    info: {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
      borderLeft: 'border-l-blue-500',
      hover: 'hover:bg-blue-500/20',
    },
  },
  status: {
    success: 'bg-emerald-500',
    error: 'bg-red-500',
    warning: 'bg-amber-500',
    info: 'bg-blue-500',
  },
} as const;

export const SCORE_THRESHOLDS = {
  EXCELLENT: 98,
  GOOD: 95,
  WARNING: 90,
} as const;

export const GAUGE_CONFIG = {
  radius: 45,
  strokeWidth: 10,
  arcRatio: 0.75,
} as const;
