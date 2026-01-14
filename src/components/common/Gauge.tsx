/**
 * Reusable Gauge component for metric visualization
 */

import React, { useState, useEffect } from 'react';
import type { GaugeStatus } from '../../types';
import { GAUGE_CONFIG, COLORS } from '../../constants';

interface GaugeProps {
  value: number;
  label: string;
  sublabel?: string;
  status: GaugeStatus;
  icon?: string;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

const SIZE_CONFIG = {
  sm: { width: 80, radius: 30, strokeWidth: 6 },
  md: { width: 128, radius: 45, strokeWidth: 10 },
  lg: { width: 160, radius: 55, strokeWidth: 12 },
};

const getStatusColor = (status: GaugeStatus) => {
  switch (status) {
    case 'critical':
      return {
        stroke: COLORS.score.critical.stroke,
        bg: 'from-red-500/20 to-red-600/10',
        text: 'text-red-400',
        dot: 'bg-red-500 animate-pulse',
      };
    case 'warning':
      return {
        stroke: COLORS.score.warning.stroke,
        bg: 'from-amber-500/20 to-amber-600/10',
        text: 'text-amber-400',
        dot: 'bg-amber-500 animate-pulse',
      };
    case 'good':
      return {
        stroke: COLORS.score.excellent.stroke,
        bg: 'from-emerald-500/20 to-emerald-600/10',
        text: 'text-emerald-400',
        dot: 'bg-emerald-500',
      };
    default:
      return {
        stroke: COLORS.score.good.stroke,
        bg: 'from-cyan-500/20 to-cyan-600/10',
        text: 'text-cyan-400',
        dot: 'bg-cyan-500',
      };
  }
};

const getStatusLabel = (status: GaugeStatus): string => {
  switch (status) {
    case 'critical':
      return 'Critical';
    case 'warning':
      return 'Warning';
    case 'good':
    case 'normal':
      return 'Normal';
    default:
      return 'Unknown';
  }
};

export const Gauge: React.FC<GaugeProps> = ({
  value,
  label,
  sublabel,
  status,
  icon,
  size = 'md',
  animated = true,
}) => {
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => setAnimatedValue(value), 100);
      return () => clearTimeout(timer);
    } else {
      setAnimatedValue(value);
    }
  }, [value, animated]);

  const config = SIZE_CONFIG[size];
  const circumference = 2 * Math.PI * config.radius;
  const arcRatio = GAUGE_CONFIG.arcRatio;
  const strokeDashoffset = circumference - (animatedValue / 100) * circumference * arcRatio;
  const colors = getStatusColor(status);

  return (
    <div
      className={`bg-gradient-to-br ${colors.bg} backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all`}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-white font-semibold text-lg">{label}</h3>
          {sublabel && <p className="text-slate-400 text-sm">{sublabel}</p>}
        </div>
        {icon && <div className="text-2xl">{icon}</div>}
      </div>

      <div className="flex items-center gap-6">
        <div className="relative">
          <svg
            className="transform -rotate-135"
            width={config.width}
            height={config.width}
          >
            <circle
              cx={config.width / 2}
              cy={config.width / 2}
              r={config.radius}
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth={config.strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - arcRatio)}
              strokeLinecap="round"
            />
            <circle
              cx={config.width / 2}
              cy={config.width / 2}
              r={config.radius}
              fill="none"
              stroke={colors.stroke}
              strokeWidth={config.strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
              style={{ filter: `drop-shadow(0 0 8px ${colors.stroke})` }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <span className="text-3xl font-bold text-white">
                {Math.round(animatedValue)}
              </span>
              <span className="text-lg text-slate-400">%</span>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-3 h-3 rounded-full ${colors.dot}`} />
            <span className={`text-sm font-medium ${colors.text}`}>
              {getStatusLabel(status)}
            </span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Current</span>
              <span className="text-white font-mono">{Math.round(animatedValue)}%</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Max</span>
              <span className="text-white font-mono">100%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ComplianceGaugeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
}

export const ComplianceGauge: React.FC<ComplianceGaugeProps> = ({ score, size = 'lg' }) => {
  const config = SIZE_CONFIG[size];
  const circumference = 2 * Math.PI * (config.radius + 5);
  const strokeColor = score >= 98 ? '#10b981' : score >= 95 ? '#06b6d4' : '#f59e0b';

  return (
    <div className="relative" style={{ width: config.width, height: config.width }}>
      <svg className="-rotate-90" width={config.width} height={config.width}>
        <circle
          cx={config.width / 2}
          cy={config.width / 2}
          r={config.radius + 5}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={config.strokeWidth + 2}
        />
        <circle
          cx={config.width / 2}
          cy={config.width / 2}
          r={config.radius + 5}
          fill="none"
          stroke={strokeColor}
          strokeWidth={config.strokeWidth + 2}
          strokeDasharray={`${(score / 100) * circumference} ${circumference}`}
          strokeLinecap="round"
          className="transition-all duration-1000"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-5xl font-bold text-white">{score}</span>
        <span className="text-lg text-slate-400">%</span>
      </div>
    </div>
  );
};
