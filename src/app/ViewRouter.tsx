/**
 * View router component - renders active view based on navigation state
 */

import React from 'react';
import type { ViewId } from '../types';
import {
  DashboardView,
  ComplianceDashboard,
  RealTimeMonitoringDashboard,
  DependencyMapView,
  IncidentCorrelationView,
  CloudManagementView,
  PathAnalysisView,
  RouteIntelligenceView,
  TicketFormView,
  TicketStatusBoard,
  RuleGeneratorView,
  ValidationDashboard,
  ConflictDetectionView,
  SettingsView,
} from '../features';

interface ViewRouterProps {
  activeView: ViewId;
}

const VIEW_COMPONENTS: Record<ViewId, React.FC> = {
  dashboard: DashboardView,
  compliance: ComplianceDashboard,
  monitoring: RealTimeMonitoringDashboard,
  dependencymap: DependencyMapView,
  incidents: IncidentCorrelationView,
  cloudmanagement: CloudManagementView,
  pathanalysis: PathAnalysisView,
  routeintelligence: RouteIntelligenceView,
  tickets: TicketFormView,
  statusboard: TicketStatusBoard,
  rulegenerator: RuleGeneratorView,
  validation: ValidationDashboard,
  conflicts: ConflictDetectionView,
  settings: SettingsView,
};

export const ViewRouter: React.FC<ViewRouterProps> = ({ activeView }) => {
  const ViewComponent = VIEW_COMPONENTS[activeView];

  if (!ViewComponent) {
    return <FallbackView />;
  }

  return <ViewComponent />;
};

const FallbackView: React.FC = () => (
  <div className="flex items-center justify-center h-full">
    <p className="text-slate-400">View not found</p>
  </div>
);
