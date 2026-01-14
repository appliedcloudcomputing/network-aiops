/**
 * Monitoring header with live indicator and time display
 */

import React from 'react';
import { LiveIndicator, TimeDisplayBackdrop } from '../../../components';

interface MonitoringHeaderProps {
  currentTime: Date;
  refreshInterval?: number;
}

export const MonitoringHeader: React.FC<MonitoringHeaderProps> = ({
  currentTime,
  refreshInterval = 2,
}) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <LiveIndicator />
        <span className="text-slate-400">Auto-refresh: {refreshInterval}s</span>
      </div>
      <TimeDisplayBackdrop time={currentTime} />
    </div>
  );
};
