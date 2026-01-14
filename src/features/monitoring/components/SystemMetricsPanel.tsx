/**
 * System metrics and platform status panel
 */

import React, { useState, useEffect } from 'react';
import type { SystemStat, PlatformHealth } from '../../../types';
import {
  MiniStatCard,
  PlatformStatusIndicator,
  Card,
} from '../../../components';
import { MonitoringIcon } from '../../../components/icons';
import { getSystemStats, getPlatformHealth } from '../../../services';

export const SystemMetricsPanel: React.FC = () => {
  const [stats, setStats] = useState<SystemStat[]>([]);
  const [platforms, setPlatforms] = useState<PlatformHealth[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [statsData, platformData] = await Promise.all([
        getSystemStats(),
        getPlatformHealth(),
      ]);
      setStats(statsData);
      setPlatforms(platformData);
    };

    fetchData();
  }, []);

  return (
    <div className="col-span-1 space-y-4">
      <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
        <MonitoringIcon className="w-5 h-5 text-cyan-400" />
        System Metrics
      </h3>

      <StatsGrid stats={stats} />
      <PlatformStatusPanel platforms={platforms} />
    </div>
  );
};

interface StatsGridProps {
  stats: SystemStat[];
}

const StatsGrid: React.FC<StatsGridProps> = ({ stats }) => {
  const getColorClass = (color: string): string => {
    const colorMap: Record<string, string> = {
      red: 'from-red-500/20 to-red-600/10',
      amber: 'from-amber-500/20 to-amber-600/10',
      emerald: 'from-emerald-500/20 to-emerald-600/10',
      cyan: 'from-cyan-500/20 to-cyan-600/10',
      purple: 'from-purple-500/20 to-purple-600/10',
    };
    return colorMap[color] || colorMap.cyan;
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map((stat, index) => (
        <MiniStatCard
          key={index}
          label={stat.label}
          value={stat.value}
          unit={stat.unit}
          icon={stat.icon}
          trend={stat.trend}
          colorClass={getColorClass(stat.color)}
        />
      ))}
    </div>
  );
};

interface PlatformStatusPanelProps {
  platforms: PlatformHealth[];
}

const PlatformStatusPanel: React.FC<PlatformStatusPanelProps> = ({ platforms }) => (
  <Card variant="bordered" className="mt-4">
    <h4 className="text-white font-semibold mb-4">Platform Status</h4>
    <div className="space-y-3">
      {platforms.map((platform) => (
        <PlatformStatusIndicator
          key={platform.name}
          name={platform.name}
          status={platform.status}
          latency={platform.latency}
          icon={platform.icon}
        />
      ))}
    </div>
  </Card>
);
