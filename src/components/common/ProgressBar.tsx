/**
 * Reusable ProgressBar component
 */

import React from 'react';

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: string;
  label?: string;
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZE_CLASSES = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  color = 'bg-cyan-500',
  label,
  showValue = false,
  size = 'md',
  className = '',
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={className}>
      {(label || showValue) && (
        <div className="flex items-center justify-between mb-2">
          {label && <span className="text-white font-medium">{label}</span>}
          {showValue && <span className="text-slate-400">{percentage.toFixed(0)}%</span>}
        </div>
      )}
      <div className={`${SIZE_CLASSES[size]} bg-slate-700 rounded-full overflow-hidden`}>
        <div
          className={`h-full ${color} rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

interface LabeledProgressProps {
  label: string;
  value: number;
  color: string;
}

export const LabeledProgress: React.FC<LabeledProgressProps> = ({ label, value, color }) => (
  <div>
    <div className="flex items-center justify-between mb-2">
      <span className="text-white font-medium">{label}</span>
      <span className="text-slate-400">{value}%</span>
    </div>
    <ProgressBar value={value} color={color} size="md" />
  </div>
);
