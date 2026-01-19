/**
 * Risk Assessment Panel - Displays risk score and factors
 */

import React from 'react';
import { Card, CardHeader } from '../../../components';
import type { RiskAssessment } from '../../../types/tickets';

interface RiskAssessmentPanelProps {
  assessment: RiskAssessment;
}

const RISK_LEVEL_COLORS = {
  low: {
    bg: 'bg-emerald-500/20',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
    gauge: 'bg-emerald-500',
  },
  medium: {
    bg: 'bg-amber-500/20',
    text: 'text-amber-400',
    border: 'border-amber-500/30',
    gauge: 'bg-amber-500',
  },
  high: {
    bg: 'bg-orange-500/20',
    text: 'text-orange-400',
    border: 'border-orange-500/30',
    gauge: 'bg-orange-500',
  },
  critical: {
    bg: 'bg-red-500/20',
    text: 'text-red-400',
    border: 'border-red-500/30',
    gauge: 'bg-red-500',
  },
};

export const RiskAssessmentPanel: React.FC<RiskAssessmentPanelProps> = ({ assessment }) => {
  const colors = RISK_LEVEL_COLORS[assessment.level];

  return (
    <Card>
      <CardHeader
        title="Risk Assessment"
        subtitle="AI-calculated risk score based on multiple factors"
      />

      <div className="space-y-4">
        {/* Risk Score Display */}
        <div className="text-center">
          <div className="inline-flex flex-col items-center">
            <div className={`w-32 h-32 rounded-full ${colors.bg} border-4 ${colors.border} flex items-center justify-center mb-3`}>
              <div>
                <div className={`text-4xl font-bold ${colors.text}`}>{assessment.score}</div>
                <div className="text-xs text-slate-400">/ 100</div>
              </div>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-bold uppercase ${colors.bg} ${colors.text} border ${colors.border}`}>
              {assessment.level} Risk
            </span>
          </div>
        </div>

        {/* Risk Gauge */}
        <div>
          <div className="flex justify-between text-xs text-slate-400 mb-2">
            <span>Low</span>
            <span>Medium</span>
            <span>High</span>
            <span>Critical</span>
          </div>
          <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`h-full ${colors.gauge} transition-all duration-1000 ease-out`}
              style={{ width: `${assessment.score}%` }}
            />
          </div>
        </div>

        {/* Risk Factors */}
        <div>
          <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Risk Factors
          </h4>
          <div className="space-y-2">
            {assessment.factors.map((factor, idx) => {
              const isNegative = factor.impact === 'negative';
              const isPositive = factor.impact === 'positive';

              return (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg border border-slate-600"
                >
                  <div className="flex items-center gap-3">
                    {isNegative && (
                      <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    )}
                    {isPositive && (
                      <svg className="w-5 h-5 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                    {factor.impact === 'neutral' && (
                      <svg className="w-5 h-5 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                    <div>
                      <p className="text-white font-medium capitalize">{factor.name}</p>
                      <p className="text-xs text-slate-400">{factor.description}</p>
                    </div>
                  </div>
                  <span className={`text-lg font-bold min-w-[3rem] text-right ${
                    factor.weight > 0 ? 'text-red-400' :
                    factor.weight < 0 ? 'text-emerald-400' :
                    'text-slate-400'
                  }`}>
                    {factor.weight > 0 ? '+' : ''}{factor.weight}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recommendation */}
        <div className={`p-4 rounded-lg border ${colors.bg} ${colors.border}`}>
          <div className="flex items-start gap-3">
            <svg className={`w-6 h-6 ${colors.text} flex-shrink-0 mt-0.5`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <div>
              <h5 className={`font-semibold ${colors.text} mb-1`}>Recommendation</h5>
              <p className="text-white text-sm">{assessment.recommendation}</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
