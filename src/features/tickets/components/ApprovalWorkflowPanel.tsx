/**
 * Approval Workflow Panel - Displays approval chain with auto-implement option
 */

import React, { useState } from 'react';
import { Card, CardHeader, Button } from '../../../components';
import type { ApprovalStep, L1WhitelistingTicket } from '../../../types/tickets';

interface ApprovalWorkflowPanelProps {
  ticket: L1WhitelistingTicket;
  onApprove?: () => void;
  onReject?: () => void;
  onImplement?: () => void;
  onRollback?: () => void;
}

const StepIcon: React.FC<{ status: ApprovalStep['status'] }> = ({ status }) => {
  if (status === 'approved') {
    return (
      <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center border-2 border-emerald-500">
        <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
    );
  }

  if (status === 'rejected') {
    return (
      <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center border-2 border-red-500">
        <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
    );
  }

  return (
    <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center border-2 border-slate-600">
      <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
  );
};

export const ApprovalWorkflowPanel: React.FC<ApprovalWorkflowPanelProps> = ({
  ticket,
  onApprove,
  onReject,
  onImplement,
  onRollback,
}) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [action, setAction] = useState<'approve' | 'reject' | 'implement' | 'rollback' | null>(null);

  const allApproved = ticket.approvalChain.every((step) => step.status === 'approved');
  const anyRejected = ticket.approvalChain.some((step) => step.status === 'rejected');
  const canImplement = allApproved && (ticket.status === 'approved' || ticket.status === 'pending_approval');
  const canApprove = ticket.status === 'analyzed' || ticket.status === 'pending_approval';
  const isImplementing = ticket.status === 'implementing';
  const isCompleted = ticket.status === 'completed';
  const canRollback = (isCompleted || ticket.status === 'rolled_back') && ticket.rollbackAvailable;

  const handleAction = (actionType: typeof action) => {
    setAction(actionType);
    setShowConfirm(true);
  };

  const confirmAction = () => {
    if (action === 'approve' && onApprove) onApprove();
    if (action === 'reject' && onReject) onReject();
    if (action === 'implement' && onImplement) onImplement();
    if (action === 'rollback' && onRollback) onRollback();
    setShowConfirm(false);
    setAction(null);
  };

  return (
    <Card>
      <CardHeader
        title="Approval Workflow"
        subtitle={ticket.mode === 'automatic' ? 'Automatic Implementation Mode' : 'Manual Implementation Mode'}
      />

      <div className="space-y-4">
        {/* Mode Badge */}
        <div className="flex items-center gap-2">
          {ticket.mode === 'automatic' ? (
            <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-full text-sm font-semibold flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Auto-Implement
            </span>
          ) : (
            <span className="px-3 py-1 bg-slate-500/20 text-slate-400 border border-slate-500/30 rounded-full text-sm font-semibold">
              Manual Mode
            </span>
          )}
        </div>

        {/* Approval Steps */}
        <div className="space-y-3">
          {ticket.approvalChain.map((step, index) => (
            <div key={step.id}>
              <div className="flex items-start gap-3">
                <StepIcon status={step.status} />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-white font-semibold">{step.name}</h4>
                    <span className={`text-xs uppercase font-bold ${
                      step.status === 'approved' ? 'text-emerald-400' :
                      step.status === 'rejected' ? 'text-red-400' :
                      'text-slate-400'
                    }`}>
                      {step.status === 'pending' ? 'Pending' : step.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400">{step.approver}</p>
                  {step.timestamp && (
                    <p className="text-xs text-slate-500 mt-1">
                      {new Date(step.timestamp).toLocaleString()}
                    </p>
                  )}
                  {step.comments && (
                    <div className="mt-2 p-2 bg-slate-700/30 rounded text-sm text-slate-300">
                      💬 {step.comments}
                    </div>
                  )}
                </div>
              </div>
              {index < ticket.approvalChain.length - 1 && (
                <div className="ml-5 h-6 border-l-2 border-slate-700" />
              )}
            </div>
          ))}
        </div>

        {/* Implementation Status */}
        {isImplementing && ticket.implementationStatus && (
          <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <svg className="w-5 h-5 text-cyan-400 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <div className="flex-1">
                <p className="text-cyan-400 font-semibold">{ticket.implementationStatus.step}</p>
                <p className="text-sm text-cyan-300/70">{ticket.implementationStatus.message}</p>
              </div>
            </div>
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-cyan-500 transition-all duration-500"
                style={{ width: `${ticket.implementationStatus.progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {!showConfirm && (
          <div className="flex gap-3">
            {canApprove && !anyRejected && (
              <>
                <Button
                  variant="primary"
                  className="flex-1"
                  onClick={() => handleAction('approve')}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Approve
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => handleAction('reject')}
                >
                  Reject
                </Button>
              </>
            )}

            {canImplement && ticket.mode === 'automatic' && (
              <Button
                variant="primary"
                className="flex-1"
                onClick={() => handleAction('implement')}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Auto-Implement Rules
              </Button>
            )}

            {canRollback && (
              <Button
                variant="ghost"
                className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                onClick={() => handleAction('rollback')}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
                Rollback Changes
              </Button>
            )}
          </div>
        )}

        {/* Confirmation Dialog */}
        {showConfirm && (
          <div className="p-4 bg-slate-700 border border-slate-600 rounded-lg space-y-3">
            <p className="text-white font-semibold">
              {action === 'approve' && 'Confirm Approval'}
              {action === 'reject' && 'Confirm Rejection'}
              {action === 'implement' && 'Confirm Auto-Implementation'}
              {action === 'rollback' && 'Confirm Rollback'}
            </p>
            <p className="text-sm text-slate-400">
              {action === 'approve' && 'This will approve the change request and move it to the next approval stage.'}
              {action === 'reject' && 'This will reject the change request. The ticket will be closed.'}
              {action === 'implement' && 'This will automatically implement all firewall rules. The process cannot be stopped once started.'}
              {action === 'rollback' && 'This will remove all implemented rules in reverse order. This action cannot be undone.'}
            </p>
            <div className="flex gap-2">
              <Button variant="primary" onClick={confirmAction} className="flex-1">
                Confirm
              </Button>
              <Button variant="ghost" onClick={() => { setShowConfirm(false); setAction(null); }}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Rollback Info */}
        {ticket.rollbackPlan && !isImplementing && (
          <div className="p-3 bg-slate-700/30 rounded-lg border border-slate-600">
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-sm font-medium text-slate-300 mb-1">Rollback Plan</p>
                <p className="text-sm text-slate-400">{ticket.rollbackPlan}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
