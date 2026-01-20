/**
 * View router component - renders active view based on navigation state
 */

import React from 'react';
import type { ViewId } from '../types';
import {
  DashboardView,
  ComplianceDashboard,
  RealTimeMonitoringDashboard,
  IncidentCorrelationView,
  CloudManagementView,
  MultiCloudVisibilityView,
  PathAnalysisView,
  RouteIntelligenceView,
  TicketFormView,
  TicketStatusBoard,
  L1WhitelistingView,
  RuleGeneratorView,
  ValidationDashboard,
  ConflictDetectionView,
  SettingsView,
} from '../features';
import { OpsValueDashboard } from '../features/ops-value/OpsValueDashboard';
import { DependencyMapViewEnhanced } from '../features/dependency-map/DependencyMapViewEnhanced';

interface ViewRouterProps {
  activeView: ViewId;
  onNavigate: (viewId: ViewId) => void;
}

export const ViewRouter: React.FC<ViewRouterProps> = ({ activeView, onNavigate }) => {
  // Special handling for Dashboard to pass navigation prop
  if (activeView === 'dashboard') {
    return <DashboardView onNavigate={onNavigate} />;
  }

  const VIEW_COMPONENTS: Record<Exclude<ViewId, 'dashboard'>, React.FC> = {
    opsvalue: OpsValueDashboard,
    compliance: ComplianceDashboard,
    monitoring: RealTimeMonitoringDashboard,
    dependencymap: DependencyMapViewEnhanced,
    incidents: IncidentCorrelationView,
    cloudmanagement: CloudManagementView,
    multicloudvisibility: MultiCloudVisibilityView,
    pathanalysis: PathAnalysisView,
    routeintelligence: RouteIntelligenceView,
    tickets: TicketFormView,
    statusboard: TicketStatusBoard,
    l1whitelisting: L1WhitelistingView,
    rulegenerator: RuleGeneratorView,
    validation: ValidationDashboard,
    conflicts: ConflictDetectionView,
    settings: SettingsView,
  };

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
