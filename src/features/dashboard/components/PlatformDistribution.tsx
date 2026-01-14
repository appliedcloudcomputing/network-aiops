/**
 * Platform distribution component
 */

import React from 'react';
import type { PlatformDistribution as PlatformDistributionType } from '../../../types';
import { Card, CardHeader, LabeledProgress, SummaryStat } from '../../../components';

interface PlatformDistributionProps {
  platforms: PlatformDistributionType[];
  summaryStats: {
    compliance: string;
    uptime: string;
    avgLatency: string;
  };
}

export const PlatformDistribution: React.FC<PlatformDistributionProps> = ({
  platforms,
  summaryStats,
}) => {
  return (
    <Card padding="none" className="overflow-hidden">
      <div className="p-4 border-b border-slate-700">
        <CardHeader title="Platform Distribution" />
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {platforms.map((platform, index) => (
            <LabeledProgress
              key={index}
              label={platform.name}
              value={platform.value}
              color={platform.color}
            />
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-slate-700 grid grid-cols-3 gap-4">
          <SummaryStat
            label="Compliance"
            value={summaryStats.compliance}
            valueColor="text-emerald-400"
          />
          <SummaryStat
            label="Uptime"
            value={summaryStats.uptime}
            valueColor="text-cyan-400"
          />
          <SummaryStat
            label="Avg Latency"
            value={summaryStats.avgLatency}
            valueColor="text-purple-400"
          />
        </div>
      </div>
    </Card>
  );
};
