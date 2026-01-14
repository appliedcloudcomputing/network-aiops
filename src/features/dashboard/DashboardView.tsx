/**
 * Dashboard feature - Main view component
 * Refactored from monolithic component to modular architecture
 */

import React from 'react';
import { PageContainer, GridContainer } from '../../components';
import { useCurrentTime } from '../../hooks';
import { useDashboardData } from './hooks/useDashboardData';
import {
  WelcomeHeader,
  MetricsGrid,
  PlatformDistribution,
  RecentActivity,
  QuickActions,
  NetworkStats,
} from './components';

interface DashboardViewProps {
  onNavigate?: (path: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const currentTime = useCurrentTime();
  const { metrics, recentActivity, platformDistribution, summaryStats, networkStats, isLoading } = useDashboardData();

  const handleNavigate = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    }
  };

  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center h-64">
          <div className="text-slate-400">Loading dashboard...</div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <WelcomeHeader currentTime={currentTime} />
      <MetricsGrid metrics={metrics} />

      {/* Quick Actions Row */}
      <div className="mb-6">
        <QuickActions onNavigate={handleNavigate} />
      </div>

      {/* Main content grid */}
      <GridContainer cols={3}>
        <PlatformDistribution
          platforms={platformDistribution}
          summaryStats={summaryStats}
        />
        {networkStats && (
          <NetworkStats stats={networkStats} />
        )}
        <RecentActivity activities={recentActivity} />
      </GridContainer>
    </PageContainer>
  );
};
