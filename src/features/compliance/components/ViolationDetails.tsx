/**
 * Violation details panel component
 */

import React from 'react';
import type { ComplianceFramework, Violation } from '../../../types';
import { Card, Badge, Button } from '../../../components';
import { getFrameworkColorConfig } from '../../../services';
import { CloseIcon } from '../../../components/icons';

interface ViolationDetailsProps {
  framework: ComplianceFramework;
  onClose: () => void;
}

export const ViolationDetails: React.FC<ViolationDetailsProps> = ({
  framework,
  onClose,
}) => {
  const colorConfig = getFrameworkColorConfig(framework.color);

  return (
    <Card padding="none" className="overflow-hidden">
      <ViolationHeader
        icon={framework.icon}
        name={framework.name}
        violationsCount={framework.violations.length}
        gradient={colorConfig.gradient}
        onClose={onClose}
      />
      <div className="divide-y divide-slate-700">
        {framework.violations.map((violation) => (
          <ViolationItem key={violation.id} violation={violation} />
        ))}
      </div>
    </Card>
  );
};

interface ViolationHeaderProps {
  icon: string;
  name: string;
  violationsCount: number;
  gradient: string;
  onClose: () => void;
}

const ViolationHeader: React.FC<ViolationHeaderProps> = ({
  icon,
  name,
  violationsCount,
  gradient,
  onClose,
}) => (
  <div
    className={`p-4 bg-gradient-to-r ${gradient} flex items-center justify-between`}
  >
    <div className="flex items-center gap-3">
      <span className="text-2xl">{icon}</span>
      <div>
        <h3 className="text-lg font-bold text-white">{name} Violations</h3>
        <p className="text-sm text-white/70">
          {violationsCount} open violations requiring attention
        </p>
      </div>
    </div>
    <button
      onClick={onClose}
      className="p-2 hover:bg-white/20 rounded-lg transition-colors"
      aria-label="Close violation details"
    >
      <CloseIcon className="w-5 h-5 text-white" />
    </button>
  </div>
);

interface ViolationItemProps {
  violation: Violation;
}

const ViolationItem: React.FC<ViolationItemProps> = ({ violation }) => {
  return (
    <div className="p-4 hover:bg-slate-700/50 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="font-mono text-sm font-bold text-cyan-400">
              {violation.id}
            </span>
            <Badge
              variant={violation.severity === 'medium' ? 'warning' : 'info'}
              size="sm"
            >
              {violation.severity.toUpperCase()}
            </Badge>
            <span className="text-xs text-slate-500 font-mono">
              {violation.control}
            </span>
          </div>
          <p className="text-white font-medium mb-1">{violation.description}</p>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-slate-400">
              Resource:{' '}
              <span className="font-mono text-slate-300">{violation.resource}</span>
            </span>
          </div>
        </div>
        <div className="flex-shrink-0">
          <Button variant="ghost" size="sm">
            View Remediation
          </Button>
        </div>
      </div>
      <div className="mt-3 p-3 bg-slate-900/50 rounded-lg">
        <div className="text-xs text-slate-400 mb-1">Recommended Remediation</div>
        <p className="text-sm text-slate-300">{violation.remediation}</p>
      </div>
    </div>
  );
};
