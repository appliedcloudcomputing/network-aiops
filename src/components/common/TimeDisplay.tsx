/**
 * Reusable TimeDisplay component
 */

import React from 'react';

interface TimeDisplayProps {
  time: Date;
  label?: string;
  format?: '12h' | '24h';
  className?: string;
}

export const TimeDisplay: React.FC<TimeDisplayProps> = ({
  time,
  label = 'Current Time (UTC)',
  format = '24h',
  className = '',
}) => {
  const timeString = time.toLocaleTimeString('en-US', {
    hour12: format === '12h',
  });

  return (
    <div className={`bg-slate-800 rounded-xl px-6 py-3 border border-slate-700 ${className}`}>
      <div className="text-xs text-slate-400 mb-1">{label}</div>
      <div className="text-2xl font-mono text-cyan-400 tracking-wider">{timeString}</div>
    </div>
  );
};

interface TimeDisplayBackdropProps extends TimeDisplayProps {}

export const TimeDisplayBackdrop: React.FC<TimeDisplayBackdropProps> = ({
  time,
  label = 'Current Time (UTC)',
  format = '24h',
  className = '',
}) => {
  const timeString = time.toLocaleTimeString('en-US', {
    hour12: format === '12h',
  });

  return (
    <div
      className={`bg-slate-800/50 backdrop-blur-sm rounded-xl px-6 py-3 border border-slate-700 ${className}`}
    >
      <div className="text-xs text-slate-400 mb-1">{label}</div>
      <div className="text-2xl font-mono text-cyan-400 tracking-wider">{timeString}</div>
    </div>
  );
};
