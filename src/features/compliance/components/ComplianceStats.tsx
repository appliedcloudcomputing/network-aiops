/**
 * Compliance summary statistics component
 */

import React from 'react';
import { Card } from '../../../components';

interface ComplianceStatsProps {
  totalControls: number;
  passedControls: number;
  failedControls: number;
  totalFrameworks: number;
  compliantFrameworks: number;
  totalViolations: number;
  mediumViolations: number;
  lowViolations: number;
}

export const ComplianceStats: React.FC<ComplianceStatsProps> = ({
  totalControls,
  passedControls,
  failedControls,
  totalFrameworks,
  compliantFrameworks,
  totalViolations,
  mediumViolations,
  lowViolations,
}) => {
  return (
    <div className="col-span-3 grid grid-cols-3 gap-6">
      <StatCard
        label="Total Controls"
        icon="📋"
        value={totalControls.toLocaleString()}
        details={
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 text-sm">✓ {passedControls.toLocaleString()} passed</span>
            <span className="text-slate-600">|</span>
            <span className="text-red-400 text-sm">✗ {failedControls} failed</span>
          </div>
        }
      />

      <StatCard
        label="Frameworks Tracked"
        icon="🏛️"
        value={totalFrameworks.toString()}
        details={
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 text-sm">{compliantFrameworks} compliant</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400 text-sm">0 at risk</span>
          </div>
        }
      />

      <ViolationsCard
        totalViolations={totalViolations}
        mediumViolations={mediumViolations}
        lowViolations={lowViolations}
      />
    </div>
  );
};

interface StatCardProps {
  label: string;
  icon: string;
  value: string;
  details: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ label, icon, value, details }) => (
  <Card>
    <div className="flex items-center justify-between mb-4">
      <span className="text-slate-400">{label}</span>
      <span className="text-2xl">{icon}</span>
    </div>
    <div className="text-4xl font-bold text-white mb-2">{value}</div>
    {details}
  </Card>
);

interface ViolationsCardProps {
  totalViolations: number;
  mediumViolations: number;
  lowViolations: number;
}

const ViolationsCard: React.FC<ViolationsCardProps> = ({
  totalViolations,
  mediumViolations,
  lowViolations,
}) => (
  <div className="bg-gradient-to-br from-red-900/50 to-red-800/30 rounded-xl border border-red-500/30 p-6">
    <div className="flex items-center justify-between mb-4">
      <span className="text-red-400">Open Violations</span>
      <span className="text-2xl">⚠️</span>
    </div>
    <div className="text-4xl font-bold text-red-400 mb-2">{totalViolations}</div>
    <div className="flex items-center gap-2 text-sm">
      <span className="text-amber-400">{mediumViolations} medium</span>
      <span className="text-slate-600">|</span>
      <span className="text-blue-400">{lowViolations} low</span>
    </div>
  </div>
);
