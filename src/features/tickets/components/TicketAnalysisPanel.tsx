/**
 * Ticket Analysis Panel - Displays AI-parsed ticket data
 */

import React from 'react';
import { Card, CardHeader } from '../../../components';
import type { ParsedTicketData, Environment } from '../../../types/tickets';

interface TicketAnalysisPanelProps {
  parsedData: ParsedTicketData;
}

const ENVIRONMENT_COLORS: Record<Environment, string> = {
  production: 'bg-red-500/20 text-red-400 border-red-500/30',
  uat: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  development: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
};

export const TicketAnalysisPanel: React.FC<TicketAnalysisPanelProps> = ({ parsedData }) => {
  return (
    <Card>
      <CardHeader
        title="AI Ticket Analysis"
        subtitle="Automatically extracted from ServiceNow"
      />

      <div className="space-y-4">
        {/* Environment Badge */}
        <div>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${ENVIRONMENT_COLORS[parsedData.environment]}`}>
            {parsedData.environment.toUpperCase()} Environment
          </span>
        </div>

        {/* Rule Details Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-slate-700/30 rounded-lg border border-slate-600">
            <p className="text-xs text-slate-400 mb-1">Source IP/CIDR</p>
            <p className="text-white font-mono font-semibold">{parsedData.sourceIp}</p>
          </div>

          <div className="p-3 bg-slate-700/30 rounded-lg border border-slate-600">
            <p className="text-xs text-slate-400 mb-1">Destination IP</p>
            <p className="text-white font-mono font-semibold">{parsedData.destinationIp}</p>
          </div>

          <div className="p-3 bg-slate-700/30 rounded-lg border border-slate-600">
            <p className="text-xs text-slate-400 mb-1">Port</p>
            <p className="text-white font-mono font-semibold">{parsedData.port}</p>
          </div>

          <div className="p-3 bg-slate-700/30 rounded-lg border border-slate-600">
            <p className="text-xs text-slate-400 mb-1">Protocol</p>
            <p className="text-white font-mono font-semibold uppercase">{parsedData.protocol}</p>
          </div>
        </div>

        {/* Description */}
        <div className="p-3 bg-slate-700/30 rounded-lg border border-slate-600">
          <p className="text-xs text-slate-400 mb-2">Description</p>
          <p className="text-white text-sm">{parsedData.description}</p>
        </div>

        {/* Business Justification */}
        <div className="p-3 bg-slate-700/30 rounded-lg border border-slate-600">
          <p className="text-xs text-slate-400 mb-2">Business Justification</p>
          <p className="text-white text-sm">{parsedData.businessJustification}</p>
        </div>
      </div>
    </Card>
  );
};
