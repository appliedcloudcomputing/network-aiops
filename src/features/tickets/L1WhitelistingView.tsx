/**
 * L1 Whitelisting View - AI-powered ticket processing with auto-implementation
 */

import React, { useState } from 'react';
import { PageContainer, Card, CardHeader, Button } from '../../components';
import {
  TicketAnalysisPanel,
  FirewallPathPanel,
  RuleRecommendationPanel,
  ConflictCheckPanel,
  RiskAssessmentPanel,
  ApprovalWorkflowPanel,
} from './components';
import { processL1WhitelistingTicket, implementL1WhitelistingTicket, rollbackL1WhitelistingTicket } from '../../services/l1WhitelistingService';
import { mockL1WhitelistingTickets } from '../../data/l1WhitelistingData';
import type { L1WhitelistingTicket, ImplementationMode } from '../../types/tickets';

export const L1WhitelistingView: React.FC = () => {
  const [serviceNowId, setServiceNowId] = useState('');
  const [mode, setMode] = useState<ImplementationMode>('automatic');
  const [isProcessing, setIsProcessing] = useState(false);
  const [ticket, setTicket] = useState<L1WhitelistingTicket | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsProcessing(true);

    try {
      // Process the ServiceNow ticket
      const processedTicket = await processL1WhitelistingTicket(serviceNowId, mode);
      setTicket(processedTicket);
    } catch (err) {
      setError('Failed to process ServiceNow ticket. Please check the ticket ID and try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApprove = async () => {
    if (!ticket) return;

    // Simulate approval
    const updatedTicket = {
      ...ticket,
      status: 'approved' as const,
      approvalChain: ticket.approvalChain.map((step, index) =>
        index === 0
          ? {
              ...step,
              status: 'approved' as const,
              timestamp: new Date().toISOString(),
              approver: 'Current User',
              comments: 'Reviewed and approved',
            }
          : step
      ),
    };
    setTicket(updatedTicket);
  };

  const handleReject = () => {
    if (!ticket) return;

    const updatedTicket = {
      ...ticket,
      status: 'rejected' as const,
      approvalChain: ticket.approvalChain.map((step, index) =>
        index === 0
          ? {
              ...step,
              status: 'rejected' as const,
              timestamp: new Date().toISOString(),
              approver: 'Current User',
              comments: 'Rejected - does not meet security requirements',
            }
          : step
      ),
    };
    setTicket(updatedTicket);
  };

  const handleImplement = async () => {
    if (!ticket) return;

    // Start implementation
    setTicket({
      ...ticket,
      status: 'implementing',
      implementationStatus: {
        step: 'Initializing implementation',
        progress: 0,
        message: 'Preparing to apply firewall rules...',
      },
    });

    // Simulate implementation progress
    const steps = [
      { step: 'Applying rule to Production Edge Firewall', progress: 25, message: 'Connecting to firewall...' },
      { step: 'Applying rule to Production Edge Firewall', progress: 50, message: 'Rule applied successfully' },
      { step: 'Applying rule to App-Tier Security Group', progress: 75, message: 'Updating AWS Security Group...' },
      { step: 'Finalizing implementation', progress: 95, message: 'Verifying all changes...' },
    ];

    for (const stepData of steps) {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setTicket((prev) =>
        prev
          ? {
              ...prev,
              implementationStatus: stepData,
            }
          : null
      );
    }

    // Complete implementation
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await implementL1WhitelistingTicket(ticket.id, 'Current User');

    setTicket((prev) =>
      prev
        ? {
            ...prev,
            status: 'completed',
            completedAt: new Date().toISOString(),
            implementationStatus: undefined,
          }
        : null
    );
  };

  const handleRollback = async () => {
    if (!ticket) return;

    setTicket({
      ...ticket,
      status: 'implementing',
      implementationStatus: {
        step: 'Rolling back changes',
        progress: 50,
        message: 'Removing firewall rules in reverse order...',
      },
    });

    await rollbackL1WhitelistingTicket(ticket.id);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    setTicket({
      ...ticket,
      status: 'rolled_back',
      implementationStatus: undefined,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleReset = () => {
    setTicket(null);
    setServiceNowId('');
    setError(null);
  };

  const loadSampleTicket = (sampleTicket: L1WhitelistingTicket) => {
    setTicket(sampleTicket);
    setServiceNowId(sampleTicket.serviceNowId);
    setShowHistory(false);
  };

  return (
    <PageContainer>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">L1 Firewall Whitelisting</h1>
        <p className="text-slate-400">
          AI-powered ticket processing with automatic firewall rule implementation
        </p>
      </div>

      {/* Ticket Input Form */}
      {!ticket && (
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader
              title="Process ServiceNow Ticket"
              subtitle="Enter a ServiceNow ticket ID to begin AI analysis"
            />

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
                  <p className="text-red-400">{error}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  ServiceNow Ticket ID
                </label>
                <input
                  type="text"
                  value={serviceNowId}
                  onChange={(e) => setServiceNowId(e.target.value)}
                  placeholder="e.g., CHG0012345"
                  required
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                />
                <p className="mt-2 text-xs text-slate-400">
                  The AI will automatically extract source IP, destination IP, port, protocol, and environment
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  Implementation Mode
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setMode('automatic')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      mode === 'automatic'
                        ? 'border-cyan-500 bg-cyan-500/10'
                        : 'border-slate-700 bg-slate-800 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <svg className={`w-5 h-5 ${mode === 'automatic' ? 'text-cyan-400' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span className={`font-semibold ${mode === 'automatic' ? 'text-cyan-400' : 'text-slate-400'}`}>
                        Automatic
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 text-left">
                      Rules implemented automatically after approval
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMode('manual')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      mode === 'manual'
                        ? 'border-cyan-500 bg-cyan-500/10'
                        : 'border-slate-700 bg-slate-800 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <svg className={`w-5 h-5 ${mode === 'manual' ? 'text-cyan-400' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                      </svg>
                      <span className={`font-semibold ${mode === 'manual' ? 'text-cyan-400' : 'text-slate-400'}`}>
                        Manual
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 text-left">
                      Review recommendations, implement manually
                    </p>
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isProcessing}
                  className="flex-1"
                >
                  {isProcessing ? 'Processing Ticket...' : 'Process Ticket'}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowHistory(!showHistory)}
                >
                  {showHistory ? 'Hide History' : 'View History'}
                </Button>
              </div>
            </form>

            {/* Sample Tickets */}
            {showHistory && (
              <div className="mt-6 pt-6 border-t border-slate-700">
                <h4 className="text-white font-semibold mb-3">Recent Tickets</h4>
                <div className="space-y-2">
                  {mockL1WhitelistingTickets.slice(0, 4).map((sampleTicket) => (
                    <button
                      key={sampleTicket.id}
                      onClick={() => loadSampleTicket(sampleTicket)}
                      className="w-full p-3 bg-slate-700/30 hover:bg-slate-700/50 rounded-lg border border-slate-600 hover:border-cyan-500/50 transition-all text-left"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-medium font-mono text-sm">{sampleTicket.serviceNowId}</p>
                          <p className="text-xs text-slate-400 mt-1">{sampleTicket.parsedData.description}</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          sampleTicket.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                          sampleTicket.status === 'implementing' ? 'bg-cyan-500/20 text-cyan-400' :
                          sampleTicket.status === 'pending_approval' ? 'bg-amber-500/20 text-amber-400' :
                          'bg-slate-500/20 text-slate-400'
                        }`}>
                          {sampleTicket.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Ticket Analysis Results */}
      {ticket && (
        <div className="space-y-6">
          {/* Header with Ticket Info */}
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">
                  Ticket: <span className="text-cyan-400 font-mono">{ticket.serviceNowId}</span>
                </h2>
                <p className="text-slate-400">
                  Created {new Date(ticket.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-4 py-2 rounded-full text-sm font-bold uppercase border ${
                  ticket.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                  ticket.status === 'implementing' ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' :
                  ticket.status === 'approved' || ticket.status === 'pending_approval' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                  ticket.status === 'rejected' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                  ticket.status === 'rolled_back' ? 'bg-slate-500/20 text-slate-400 border-slate-500/30' :
                  'bg-blue-500/20 text-blue-400 border-blue-500/30'
                }`}>
                  {ticket.status.replace(/_/g, ' ')}
                </span>
                <Button variant="ghost" onClick={handleReset}>
                  New Ticket
                </Button>
              </div>
            </div>
          </Card>

          {/* Main Content Grid */}
          <div className="grid grid-cols-3 gap-6">
            {/* Left Column - Ticket Details */}
            <div className="col-span-2 space-y-6">
              <TicketAnalysisPanel parsedData={ticket.parsedData} />
              <FirewallPathPanel firewalls={ticket.firewallsInPath} />
              <RuleRecommendationPanel recommendations={ticket.recommendations} />
              <ConflictCheckPanel conflictCheck={ticket.conflictCheck} />
            </div>

            {/* Right Column - Risk & Approval */}
            <div className="col-span-1 space-y-6">
              <RiskAssessmentPanel assessment={ticket.riskAssessment} />
              <ApprovalWorkflowPanel
                ticket={ticket}
                onApprove={handleApprove}
                onReject={handleReject}
                onImplement={handleImplement}
                onRollback={handleRollback}
              />
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
};
