/**
 * Dashboard metrics grid component
 */

import React from 'react';
import type { DashboardMetric } from '../../../types';
import { MetricCard } from '../../../components';

interface MetricsGridProps {
  metrics: DashboardMetric[];
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-4 gap-6 mb-6">
      {metrics.map((metric, index) => (
        <MetricCard
          key={index}
          label={metric.label}
          value={metric.value}
          change={metric.change}
          trend={metric.trend}
          icon={metric.icon}
          color={metric.color}
        />
      ))}
    </div>
  );
};
