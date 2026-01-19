/**
 * Conflict Check Panel - Displays rule conflicts and warnings
 */

import React from 'react';
import { Card, CardHeader } from '../../../components';
import type { ConflictCheck, RuleConflict, RuleWarning } from '../../../types/tickets';

interface ConflictCheckPanelProps {
  conflictCheck: ConflictCheck;
}

const CONFLICT_SEVERITY_COLORS = {
  low: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
  medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  critical: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const CONFLICT_TYPE_LABELS = {
  shadowing: 'Rule Shadowing',
  overlap: 'Rule Overlap',
  contradiction: 'Rule Contradiction',
  redundancy: 'Rule Redundancy',
};

const WARNING_TYPE_LABELS = {
  broad_rule: 'Broad Rule Scope',
  high_risk_port: 'High Risk Port',
  cross_environment: 'Cross-Environment Access',
  compliance: 'Compliance Concern',
};

const ConflictItem: React.FC<{ conflict: RuleConflict }> = ({ conflict }) => (
  <div className={`p-4 rounded-lg border ${CONFLICT_SEVERITY_COLORS[conflict.severity]}`}>
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-semibold">{CONFLICT_TYPE_LABELS[conflict.type]}</h4>
          <span className="text-xs uppercase font-bold">{conflict.severity}</span>
        </div>
        <p className="text-sm mb-3">{conflict.message}</p>

        {/* Existing Rule Details */}
        <div className="p-3 bg-slate-900/50 rounded border border-slate-700">
          <p className="text-xs uppercase font-semibold mb-2 opacity-70">Existing Rule</p>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div><span className="opacity-70">Source:</span> {conflict.existingRule.source}</div>
            <div><span className="opacity-70">Destination:</span> {conflict.existingRule.destination}</div>
            <div><span className="opacity-70">Port:</span> {conflict.existingRule.port}</div>
            <div><span className="opacity-70">Action:</span> {conflict.existingRule.action}</div>
          </div>
        </div>

        {/* Recommendation */}
        <div className="mt-3 p-2 bg-slate-900/30 rounded text-sm">
          <span className="opacity-70">💡 Recommendation:</span> {conflict.recommendation}
        </div>
      </div>
    </div>
  </div>
);

const WarningItem: React.FC<{ warning: RuleWarning }> = ({ warning }) => (
  <div className={`p-3 rounded-lg border ${CONFLICT_SEVERITY_COLORS[warning.severity]}`}>
    <div className="flex items-start gap-2">
      <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <h5 className="font-medium text-sm">{WARNING_TYPE_LABELS[warning.type]}</h5>
          <span className="text-xs uppercase font-bold">{warning.severity}</span>
        </div>
        <p className="text-sm">{warning.message}</p>
      </div>
    </div>
  </div>
);

export const ConflictCheckPanel: React.FC<ConflictCheckPanelProps> = ({ conflictCheck }) => {
  const hasIssues = conflictCheck.hasConflicts || conflictCheck.warnings.length > 0;

  return (
    <Card>
      <CardHeader
        title="Conflict & Security Analysis"
        subtitle="Automated conflict detection and risk assessment"
      />

      {!hasIssues ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">No Conflicts Detected</h3>
          <p className="text-slate-400 text-sm">
            No rule conflicts or major security concerns found
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Conflicts */}
          {conflictCheck.conflicts.length > 0 && (
            <div>
              <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Rule Conflicts ({conflictCheck.conflicts.length})
              </h4>
              <div className="space-y-3">
                {conflictCheck.conflicts.map((conflict) => (
                  <ConflictItem key={conflict.id} conflict={conflict} />
                ))}
              </div>
            </div>
          )}

          {/* Warnings */}
          {conflictCheck.warnings.length > 0 && (
            <div>
              <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Security Warnings ({conflictCheck.warnings.length})
              </h4>
              <div className="space-y-2">
                {conflictCheck.warnings.map((warning) => (
                  <WarningItem key={warning.id} warning={warning} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};
