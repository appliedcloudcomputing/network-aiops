/**
 * Grid of metric gauges component
 */

import React from 'react';
import type { RealTimeMetrics, GaugeStatus } from '../../../types';
import { Gauge } from '../../../components';

interface GaugeGridProps {
  metrics: RealTimeMetrics;
  firewallCpuStatus: GaugeStatus;
}

export const GaugeGrid: React.FC<GaugeGridProps> = ({
  metrics,
  firewallCpuStatus,
}) => {
  return (
    <div className="grid grid-cols-4 gap-6 mb-6">
      <Gauge
        value={Math.round(metrics.activeConnections)}
        label="Active Connections"
        sublabel="24,567 / 50,000"
        status="normal"
        icon="🔌"
      />
      <Gauge
        value={Math.round(metrics.ingress)}
        label="Ingress Traffic"
        sublabel="2.4 Gbps"
        status="good"
        icon="📥"
      />
      <Gauge
        value={Math.round(metrics.egress)}
        label="Egress Traffic"
        sublabel="1.8 Gbps"
        status="good"
        icon="📤"
      />
      <Gauge
        value={Math.round(metrics.firewallCpu)}
        label="Firewall CPU"
        sublabel="pa-fw-prod-east"
        status={firewallCpuStatus}
        icon="🔥"
      />
    </div>
  );
};
