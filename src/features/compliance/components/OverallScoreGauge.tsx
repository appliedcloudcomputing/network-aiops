/**
 * Overall compliance score gauge component
 */

import React from 'react';
import { Card, ComplianceGauge, Badge } from '../../../components';

interface OverallScoreGaugeProps {
  score: number;
}

export const OverallScoreGauge: React.FC<OverallScoreGaugeProps> = ({ score }) => {
  return (
    <Card className="flex flex-col items-center justify-center">
      <div className="mb-4">
        <ComplianceGauge score={score} size="lg" />
      </div>
      <h3 className="text-lg font-bold text-white mb-1">Overall Compliance</h3>
      <Badge variant="success">
        <span className="flex items-center gap-1">
          <span>✓</span>
          <span>Compliant</span>
        </span>
      </Badge>
    </Card>
  );
};
