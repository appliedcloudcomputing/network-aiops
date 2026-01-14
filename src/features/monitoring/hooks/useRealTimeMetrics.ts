/**
 * Custom hook for real-time metrics with simulated updates
 */

import { useState, useEffect, useCallback } from 'react';
import type { RealTimeMetrics } from '../../../types';
import { REFRESH_INTERVALS, METRIC_RANGES, CPU_THRESHOLDS } from '../../../constants';
import { getRealTimeMetrics } from '../../../services';

interface UseRealTimeMetricsReturn {
  metrics: RealTimeMetrics;
  isLoading: boolean;
  getFirewallCpuStatus: () => 'critical' | 'warning' | 'normal';
}

const clamp = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(max, value));
};

const simulateFluctuation = (current: number, range: { min: number; max: number }, variance: number): number => {
  const change = (Math.random() - 0.5) * variance;
  return clamp(current + change, range.min, range.max);
};

export function useRealTimeMetrics(): UseRealTimeMetricsReturn {
  const [metrics, setMetrics] = useState<RealTimeMetrics>({
    activeConnections: 49,
    ingress: 24,
    egress: 18,
    firewallCpu: 67,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const initialMetrics = await getRealTimeMetrics();
        setMetrics(initialMetrics);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setMetrics((prev) => ({
        activeConnections: simulateFluctuation(prev.activeConnections, METRIC_RANGES.activeConnections, 4),
        ingress: simulateFluctuation(prev.ingress, METRIC_RANGES.ingress, 3),
        egress: simulateFluctuation(prev.egress, METRIC_RANGES.egress, 2),
        firewallCpu: simulateFluctuation(prev.firewallCpu, METRIC_RANGES.firewallCpu, 5),
      }));
    }, REFRESH_INTERVALS.REAL_TIME);

    return () => clearInterval(timer);
  }, []);

  const getFirewallCpuStatus = useCallback((): 'critical' | 'warning' | 'normal' => {
    if (metrics.firewallCpu > CPU_THRESHOLDS.CRITICAL) return 'critical';
    if (metrics.firewallCpu > CPU_THRESHOLDS.WARNING) return 'warning';
    return 'normal';
  }, [metrics.firewallCpu]);

  return {
    metrics,
    isLoading,
    getFirewallCpuStatus,
  };
}
