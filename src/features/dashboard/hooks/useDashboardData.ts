/**
 * Custom hook for dashboard data management
 */

import { useState, useEffect } from 'react';
import type { DashboardMetric, ActivityItem, PlatformDistribution } from '../../../types';
import {
  getDashboardMetrics,
  getRecentActivity,
  getPlatformDistribution,
  getSummaryStats,
  getNetworkStats,
  type NetworkStatData,
} from '../../../services';

interface DashboardData {
  metrics: DashboardMetric[];
  recentActivity: ActivityItem[];
  platformDistribution: PlatformDistribution[];
  summaryStats: {
    compliance: string;
    uptime: string;
    avgLatency: string;
  };
  networkStats: NetworkStatData | null;
  isLoading: boolean;
  error: Error | null;
}

export function useDashboardData(): DashboardData {
  const [metrics, setMetrics] = useState<DashboardMetric[]>([]);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [platformDistribution, setPlatformDistribution] = useState<PlatformDistribution[]>([]);
  const [summaryStats, setSummaryStats] = useState({
    compliance: '0%',
    uptime: '0%',
    avgLatency: '0ms',
  });
  const [networkStats, setNetworkStats] = useState<NetworkStatData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [metricsData, activityData, distributionData, stats, netStats] = await Promise.all([
          getDashboardMetrics(),
          getRecentActivity(),
          getPlatformDistribution(),
          getSummaryStats(),
          getNetworkStats(),
        ]);

        setMetrics(metricsData);
        setRecentActivity(activityData);
        setPlatformDistribution(distributionData);
        setSummaryStats(stats);
        setNetworkStats(netStats);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch dashboard data'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    metrics,
    recentActivity,
    platformDistribution,
    summaryStats,
    networkStats,
    isLoading,
    error,
  };
}
