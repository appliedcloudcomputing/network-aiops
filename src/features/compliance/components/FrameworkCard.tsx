/**
 * Individual framework card component
 */

import React from 'react';
import type { ComplianceFramework } from '../../../types';
import { getFrameworkColorConfig } from '../../../services';

interface FrameworkCardProps {
  framework: ComplianceFramework;
  isSelected: boolean;
  onClick: () => void;
}

export const FrameworkCard: React.FC<FrameworkCardProps> = ({
  framework,
  isSelected,
  onClick,
}) => {
  const colorConfig = getFrameworkColorConfig(framework.color);

  return (
    <div
      onClick={onClick}
      className={`bg-slate-800 rounded-xl border-2 overflow-hidden cursor-pointer transition-all hover:scale-[1.02] ${
        isSelected
          ? `${colorConfig.border} shadow-lg`
          : 'border-slate-700 hover:border-slate-600'
      }`}
    >
      <FrameworkCardHeader
        name={framework.name}
        fullName={framework.fullName}
        icon={framework.icon}
        gradient={colorConfig.gradient}
      />
      <FrameworkCardBody
        score={framework.score}
        passedControls={framework.passedControls}
        totalControls={framework.totalControls}
        failedControls={framework.failedControls}
        violationsCount={framework.violations.length}
      />
    </div>
  );
};

interface FrameworkCardHeaderProps {
  name: string;
  fullName: string;
  icon: string;
  gradient: string;
}

const FrameworkCardHeader: React.FC<FrameworkCardHeaderProps> = ({
  name,
  fullName,
  icon,
  gradient,
}) => (
  <div className={`p-4 bg-gradient-to-r ${gradient}`}>
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="text-3xl">{icon}</span>
        <div>
          <h3 className="text-xl font-bold text-white">{name}</h3>
          <p className="text-xs text-white/70 truncate max-w-[150px]">{fullName}</p>
        </div>
      </div>
    </div>
  </div>
);

interface FrameworkCardBodyProps {
  score: number;
  passedControls: number;
  totalControls: number;
  failedControls: number;
  violationsCount: number;
}

const FrameworkCardBody: React.FC<FrameworkCardBodyProps> = ({
  score,
  passedControls,
  totalControls,
  failedControls,
  violationsCount,
}) => {
  const strokeColor = score >= 98 ? '#10b981' : score >= 95 ? '#06b6d4' : '#f59e0b';

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="relative w-20 h-20">
          <svg className="w-20 h-20 -rotate-90">
            <circle
              cx="40"
              cy="40"
              r="35"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="6"
            />
            <circle
              cx="40"
              cy="40"
              r="35"
              fill="none"
              stroke={strokeColor}
              strokeWidth="6"
              strokeDasharray={`${(score / 100) * 220} 220`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-white">{score}%</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-400 mb-1">Controls</div>
          <div className="text-lg font-bold text-white">
            {passedControls}/{totalControls}
          </div>
          <div
            className={`text-xs ${
              failedControls > 0 ? 'text-red-400' : 'text-emerald-400'
            }`}
          >
            {failedControls > 0 ? `${failedControls} failed` : 'All passed'}
          </div>
        </div>
      </div>

      <ViolationsBadge count={violationsCount} />
    </div>
  );
};

interface ViolationsBadgeProps {
  count: number;
}

const ViolationsBadge: React.FC<ViolationsBadgeProps> = ({ count }) => (
  <div
    className={`flex items-center justify-between p-3 rounded-lg ${
      count > 0 ? 'bg-red-500/10' : 'bg-emerald-500/10'
    }`}
  >
    <span
      className={`text-sm font-medium ${
        count > 0 ? 'text-red-400' : 'text-emerald-400'
      }`}
    >
      {count > 0 ? '⚠️ Violations' : '✓ No Violations'}
    </span>
    <span
      className={`text-lg font-bold ${
        count > 0 ? 'text-red-400' : 'text-emerald-400'
      }`}
    >
      {count}
    </span>
  </div>
);
