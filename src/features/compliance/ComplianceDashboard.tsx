/**
 * Compliance feature - Main dashboard component
 * Refactored from 383-line monolithic component to modular architecture
 */

import React from 'react';
import { PageContainer } from '../../components';
import { useComplianceData } from './hooks/useComplianceData';
import {
  OverallScoreGauge,
  ComplianceStats,
  FrameworkGrid,
  ViolationDetails,
  FrameworkCategories,
  ExportPanel,
} from './components';

export const ComplianceDashboard: React.FC = () => {
  const {
    frameworks,
    selectedFramework,
    stats,
    overallScore,
    isLoading,
    selectFramework,
  } = useComplianceData();

  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center h-64">
          <div className="text-slate-400">Loading compliance data...</div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {/* Overall Score Section */}
      <div className="grid grid-cols-4 gap-6 mb-6">
        <OverallScoreGauge score={overallScore} />
        <ComplianceStats
          totalControls={stats.totalControls}
          passedControls={stats.passedControls}
          failedControls={stats.failedControls}
          totalFrameworks={frameworks.length}
          compliantFrameworks={stats.compliantFrameworks}
          totalViolations={stats.totalViolations}
          mediumViolations={stats.mediumViolations}
          lowViolations={stats.lowViolations}
        />
      </div>

      {/* Framework Cards */}
      <FrameworkGrid
        frameworks={frameworks}
        selectedFramework={selectedFramework}
        onSelectFramework={selectFramework}
      />

      {/* Framework Details Panel */}
      {selectedFramework && selectedFramework.violations.length > 0 && (
        <ViolationDetails
          framework={selectedFramework}
          onClose={() => selectFramework(null)}
        />
      )}

      {selectedFramework && selectedFramework.violations.length === 0 && (
        <FrameworkCategories
          framework={selectedFramework}
          onClose={() => selectFramework(null)}
        />
      )}

      {/* Export Panel */}
      <div className="mt-6">
        <ExportPanel frameworks={frameworks} />
      </div>
    </PageContainer>
  );
};
