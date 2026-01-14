/**
 * Monitoring feature - Main dashboard component
 * Refactored from 397-line monolithic component to modular architecture
 */

import React from 'react';
import { PageContainer, GridContainer } from '../../components';
import { useCurrentTime } from '../../hooks';
import { useRealTimeMetrics } from './hooks/useRealTimeMetrics';
import { useAlerts } from './hooks/useAlerts';
import {
  MonitoringHeader,
  GaugeGrid,
  SystemMetricsPanel,
  AlertsFeed,
  TrafficGraph,
} from './components';

export const RealTimeMonitoringDashboard: React.FC = () => {
  const currentTime = useCurrentTime();
  const { metrics, getFirewallCpuStatus } = useRealTimeMetrics();
  const { alerts, acknowledgeAlert } = useAlerts();

  return (
    <PageContainer>
      <MonitoringHeader currentTime={currentTime} />
      <GaugeGrid
        metrics={metrics}
        firewallCpuStatus={getFirewallCpuStatus()}
      />
      <GridContainer cols={3}>
        <SystemMetricsPanel />
        <AlertsFeed
          alerts={alerts}
          onAcknowledge={acknowledgeAlert}
        />
      </GridContainer>
      <TrafficGraph />
    </PageContainer>
  );
};
