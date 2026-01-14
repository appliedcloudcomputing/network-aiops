/**
 * Ticket Status Board feature - Kanban board view with ticket management
 */

import React, { useState } from 'react';
import { PageContainer } from '../../components';
import { useTickets } from './hooks/useTickets';
import type { Ticket, TicketStatus, TicketPriority, ApprovalStep } from '../../types/tickets';

const STATUS_CONFIG: Record<TicketStatus, { label: string; color: string; bgColor: string }> = {
  awaiting: { label: 'Awaiting Approval', color: 'bg-amber-500', bgColor: 'bg-amber-50' },
  approved: { label: 'Approved', color: 'bg-blue-500', bgColor: 'bg-blue-50' },
  implementing: { label: 'Implementing', color: 'bg-purple-500', bgColor: 'bg-purple-50' },
  completed: { label: 'Completed', color: 'bg-green-500', bgColor: 'bg-green-50' },
  rejected: { label: 'Rejected', color: 'bg-red-500', bgColor: 'bg-red-50' },
};

const PRIORITY_CONFIG: Record<TicketPriority, { label: string; color: string; dotColor: string }> = {
  low: { label: 'Low', color: 'text-slate-600', dotColor: 'bg-slate-400' },
  medium: { label: 'Medium', color: 'text-blue-600', dotColor: 'bg-blue-500' },
  high: { label: 'High', color: 'text-amber-600', dotColor: 'bg-amber-500' },
  critical: { label: 'Critical', color: 'text-red-600', dotColor: 'bg-red-500' },
};

const RISK_CONFIG: Record<string, { color: string; bgColor: string }> = {
  low: { color: 'text-green-700', bgColor: 'bg-green-100' },
  medium: { color: 'text-amber-700', bgColor: 'bg-amber-100' },
  high: { color: 'text-orange-700', bgColor: 'bg-orange-100' },
  critical: { color: 'text-red-700', bgColor: 'bg-red-100' },
};

const CATEGORY_LABELS: Record<string, string> = {
  firewall_rule: 'Firewall Rule',
  security_group: 'Security Group',
  network_acl: 'Network ACL',
  routing: 'Routing',
  load_balancer: 'Load Balancer',
  vpn: 'VPN',
  dns: 'DNS',
  other: 'Other',
};

export const TicketStatusBoard: React.FC = () => {
  const { ticketsByStatus, isLoading, error, selectedTicket, selectTicket, updateStatus, approveStep, rejectStep } = useTickets();
  const [showDetailPanel, setShowDetailPanel] = useState(false);
  const [approvalComment, setApprovalComment] = useState('');
  const [rejectComment, setRejectComment] = useState('');
  const [activeApprovalStep, setActiveApprovalStep] = useState<string | null>(null);

  const handleTicketClick = async (ticket: Ticket) => {
    await selectTicket(ticket.id);
    setShowDetailPanel(true);
    setApprovalComment('');
    setRejectComment('');
    setActiveApprovalStep(null);
  };

  const handleClosePanel = () => {
    setShowDetailPanel(false);
    selectTicket(null);
  };

  const handleApprove = async (stepId: string) => {
    if (selectedTicket) {
      await approveStep(selectedTicket.id, stepId, approvalComment);
      setApprovalComment('');
      setActiveApprovalStep(null);
    }
  };

  const handleReject = async (stepId: string) => {
    if (selectedTicket && rejectComment.trim()) {
      await rejectStep(selectedTicket.id, stepId, rejectComment);
      setRejectComment('');
      setActiveApprovalStep(null);
    }
  };

  const handleStatusChange = async (ticketId: string, newStatus: TicketStatus) => {
    await updateStatus(ticketId, newStatus);
  };

  const statusOrder: TicketStatus[] = ['awaiting', 'approved', 'implementing', 'completed', 'rejected'];

  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
          <span className="ml-3 text-slate-600">Loading tickets...</span>
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">
          Error loading tickets: {error}
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="flex gap-6 h-[calc(100vh-200px)]">
        {/* Kanban Board */}
        <div className={`flex-1 grid grid-cols-5 gap-4 transition-all ${showDetailPanel ? 'w-2/3' : 'w-full'}`}>
          {statusOrder.map((status) => (
            <KanbanColumn
              key={status}
              status={status}
              config={STATUS_CONFIG[status]}
              tickets={ticketsByStatus[status]}
              onTicketClick={handleTicketClick}
              onStatusChange={handleStatusChange}
              selectedTicketId={selectedTicket?.id}
            />
          ))}
        </div>

        {/* Detail Panel */}
        {showDetailPanel && selectedTicket && (
          <TicketDetailPanel
            ticket={selectedTicket}
            onClose={handleClosePanel}
            approvalComment={approvalComment}
            setApprovalComment={setApprovalComment}
            rejectComment={rejectComment}
            setRejectComment={setRejectComment}
            activeApprovalStep={activeApprovalStep}
            setActiveApprovalStep={setActiveApprovalStep}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        )}
      </div>
    </PageContainer>
  );
};

interface KanbanColumnProps {
  status: TicketStatus;
  config: { label: string; color: string; bgColor: string };
  tickets: Ticket[];
  onTicketClick: (ticket: Ticket) => void;
  onStatusChange: (ticketId: string, newStatus: TicketStatus) => void;
  selectedTicketId?: string;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({
  config,
  tickets,
  onTicketClick,
  selectedTicketId,
}) => (
  <div className={`${config.bgColor} rounded-xl overflow-hidden flex flex-col`}>
    <div className={`${config.color} px-4 py-3 text-white font-semibold flex items-center justify-between`}>
      <span>{config.label}</span>
      <span className="bg-white/20 px-2 py-0.5 rounded-full text-sm">{tickets.length}</span>
    </div>
    <div className="p-3 flex-1 overflow-y-auto space-y-3">
      {tickets.length === 0 ? (
        <div className="text-center text-slate-400 py-8 text-sm">No tickets</div>
      ) : (
        tickets.map((ticket) => (
          <TicketCard
            key={ticket.id}
            ticket={ticket}
            onClick={() => onTicketClick(ticket)}
            isSelected={ticket.id === selectedTicketId}
          />
        ))
      )}
    </div>
  </div>
);

interface TicketCardProps {
  ticket: Ticket;
  onClick: () => void;
  isSelected: boolean;
}

const TicketCard: React.FC<TicketCardProps> = ({ ticket, onClick, isSelected }) => {
  const priorityConfig = PRIORITY_CONFIG[ticket.priority];
  const riskConfig = RISK_CONFIG[ticket.riskAssessment.level];
  const pendingApprovals = ticket.approvalSteps.filter(s => s.status === 'pending').length;
  const totalApprovals = ticket.approvalSteps.length;

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-lg p-3 shadow-sm cursor-pointer transition-all hover:shadow-md ${
        isSelected ? 'ring-2 ring-cyan-500 shadow-md' : ''
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <span className="text-xs font-mono text-slate-500">{ticket.serviceNowId}</span>
        <div className="flex items-center gap-1">
          <span className={`w-2 h-2 rounded-full ${priorityConfig.dotColor}`}></span>
          <span className={`text-xs ${priorityConfig.color}`}>{priorityConfig.label}</span>
        </div>
      </div>

      {/* Title */}
      <h4 className="font-medium text-slate-800 text-sm mb-2 line-clamp-2">{ticket.title}</h4>

      {/* Category & Change Type */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
          {CATEGORY_LABELS[ticket.category] || ticket.category}
        </span>
        <span className={`text-xs px-2 py-0.5 rounded ${
          ticket.changeType === 'add' ? 'bg-green-100 text-green-700' :
          ticket.changeType === 'delete' ? 'bg-red-100 text-red-700' :
          'bg-blue-100 text-blue-700'
        }`}>
          {ticket.changeType.charAt(0).toUpperCase() + ticket.changeType.slice(1)}
        </span>
      </div>

      {/* Risk Badge */}
      <div className={`text-xs px-2 py-1 rounded ${riskConfig.bgColor} ${riskConfig.color} mb-2 inline-block`}>
        Risk: {ticket.riskAssessment.level.charAt(0).toUpperCase() + ticket.riskAssessment.level.slice(1)} ({ticket.riskAssessment.score}/100)
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
        <span>{ticket.assignee}</span>
        {totalApprovals > 0 && (
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {totalApprovals - pendingApprovals}/{totalApprovals}
          </span>
        )}
      </div>
    </div>
  );
};

interface TicketDetailPanelProps {
  ticket: Ticket;
  onClose: () => void;
  approvalComment: string;
  setApprovalComment: (value: string) => void;
  rejectComment: string;
  setRejectComment: (value: string) => void;
  activeApprovalStep: string | null;
  setActiveApprovalStep: (value: string | null) => void;
  onApprove: (stepId: string) => void;
  onReject: (stepId: string) => void;
}

const TicketDetailPanel: React.FC<TicketDetailPanelProps> = ({
  ticket,
  onClose,
  approvalComment,
  setApprovalComment,
  rejectComment,
  setRejectComment,
  activeApprovalStep,
  setActiveApprovalStep,
  onApprove,
  onReject,
}) => {
  const priorityConfig = PRIORITY_CONFIG[ticket.priority];
  const riskConfig = RISK_CONFIG[ticket.riskAssessment.level];

  return (
    <div className="w-1/3 min-w-[400px] bg-white rounded-xl shadow-lg overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-slate-800 text-white p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-sm text-slate-300">{ticket.serviceNowId}</span>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <h3 className="font-semibold text-lg">{ticket.title}</h3>
        <div className="flex items-center gap-3 mt-2">
          <span className={`${STATUS_CONFIG[ticket.status].color} text-white text-xs px-2 py-1 rounded`}>
            {STATUS_CONFIG[ticket.status].label}
          </span>
          <span className={`flex items-center gap-1 text-xs ${priorityConfig.color}`}>
            <span className={`w-2 h-2 rounded-full ${priorityConfig.dotColor}`}></span>
            {priorityConfig.label} Priority
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Description */}
        <section>
          <h4 className="text-sm font-semibold text-slate-700 mb-2">Description</h4>
          <p className="text-sm text-slate-600">{ticket.description}</p>
        </section>

        {/* Details Grid */}
        <section className="grid grid-cols-2 gap-3">
          <DetailItem label="Category" value={CATEGORY_LABELS[ticket.category] || ticket.category} />
          <DetailItem label="Change Type" value={ticket.changeType.charAt(0).toUpperCase() + ticket.changeType.slice(1)} />
          <DetailItem label="Requester" value={ticket.requester} />
          <DetailItem label="Assignee" value={ticket.assignee} />
          <DetailItem label="Created" value={new Date(ticket.createdAt).toLocaleDateString()} />
          {ticket.scheduledAt && (
            <DetailItem label="Scheduled" value={new Date(ticket.scheduledAt).toLocaleDateString()} />
          )}
        </section>

        {/* Risk Assessment */}
        <section>
          <h4 className="text-sm font-semibold text-slate-700 mb-2">Risk Assessment</h4>
          <div className={`${riskConfig.bgColor} ${riskConfig.color} rounded-lg p-3`}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold">
                {ticket.riskAssessment.level.charAt(0).toUpperCase() + ticket.riskAssessment.level.slice(1)} Risk
              </span>
              <span className="text-lg font-bold">{ticket.riskAssessment.score}/100</span>
            </div>
            <p className="text-sm">{ticket.riskAssessment.recommendation}</p>
            {ticket.riskAssessment.factors.length > 0 && (
              <div className="mt-2 pt-2 border-t border-current/20">
                <p className="text-xs font-medium mb-1">Risk Factors:</p>
                <ul className="text-xs space-y-1">
                  {ticket.riskAssessment.factors.slice(0, 3).map((factor, idx) => (
                    <li key={idx} className="flex items-start gap-1">
                      <span>{factor.impact === 'negative' ? '⚠️' : factor.impact === 'positive' ? '✓' : '•'}</span>
                      <span>{factor.description}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>

        {/* Affected Resources */}
        {ticket.affectedResources.length > 0 && (
          <section>
            <h4 className="text-sm font-semibold text-slate-700 mb-2">Affected Resources</h4>
            <div className="space-y-2">
              {ticket.affectedResources.map((resource) => (
                <div key={resource.id} className="bg-slate-50 rounded p-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{resource.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      resource.platform === 'aws' ? 'bg-orange-100 text-orange-700' :
                      resource.platform === 'azure' ? 'bg-blue-100 text-blue-700' :
                      resource.platform === 'gcp' ? 'bg-red-100 text-red-700' :
                      'bg-slate-200 text-slate-700'
                    }`}>
                      {resource.platform.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{resource.type} {resource.region && `• ${resource.region}`}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Approval Workflow */}
        <section>
          <h4 className="text-sm font-semibold text-slate-700 mb-2">Approval Workflow</h4>
          <div className="space-y-2">
            {ticket.approvalSteps.map((step) => (
              <ApprovalStepItem
                key={step.id}
                step={step}
                isActive={activeApprovalStep === step.id}
                onToggle={() => setActiveApprovalStep(activeApprovalStep === step.id ? null : step.id)}
                approvalComment={approvalComment}
                setApprovalComment={setApprovalComment}
                rejectComment={rejectComment}
                setRejectComment={setRejectComment}
                onApprove={() => onApprove(step.id)}
                onReject={() => onReject(step.id)}
              />
            ))}
          </div>
        </section>

        {/* Rollback Plan */}
        {ticket.rollbackPlan && (
          <section>
            <h4 className="text-sm font-semibold text-slate-700 mb-2">Rollback Plan</h4>
            <p className="text-sm text-slate-600 bg-slate-50 rounded p-3">{ticket.rollbackPlan}</p>
          </section>
        )}

        {/* Implementation Notes */}
        {ticket.implementationNotes && (
          <section>
            <h4 className="text-sm font-semibold text-slate-700 mb-2">Implementation Notes</h4>
            <p className="text-sm text-slate-600 bg-slate-50 rounded p-3">{ticket.implementationNotes}</p>
          </section>
        )}
      </div>
    </div>
  );
};

interface DetailItemProps {
  label: string;
  value: string;
}

const DetailItem: React.FC<DetailItemProps> = ({ label, value }) => (
  <div>
    <p className="text-xs text-slate-500">{label}</p>
    <p className="text-sm font-medium text-slate-700">{value}</p>
  </div>
);

interface ApprovalStepItemProps {
  step: ApprovalStep;
  isActive: boolean;
  onToggle: () => void;
  approvalComment: string;
  setApprovalComment: (value: string) => void;
  rejectComment: string;
  setRejectComment: (value: string) => void;
  onApprove: () => void;
  onReject: () => void;
}

const ApprovalStepItem: React.FC<ApprovalStepItemProps> = ({
  step,
  isActive,
  onToggle,
  approvalComment,
  setApprovalComment,
  rejectComment,
  setRejectComment,
  onApprove,
  onReject,
}) => {
  const statusConfig = {
    pending: { icon: '⏳', color: 'text-amber-600', bg: 'bg-amber-50' },
    approved: { icon: '✓', color: 'text-green-600', bg: 'bg-green-50' },
    rejected: { icon: '✗', color: 'text-red-600', bg: 'bg-red-50' },
  };
  const config = statusConfig[step.status];

  return (
    <div className={`${config.bg} rounded-lg overflow-hidden`}>
      <div
        className={`p-3 flex items-center justify-between cursor-pointer ${step.status === 'pending' ? 'hover:bg-amber-100' : ''}`}
        onClick={step.status === 'pending' ? onToggle : undefined}
      >
        <div className="flex items-center gap-2">
          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${config.bg} ${config.color}`}>
            {config.icon}
          </span>
          <div>
            <p className="text-sm font-medium text-slate-700">{step.name}</p>
            <p className="text-xs text-slate-500">{step.approver}</p>
          </div>
        </div>
        <div className="text-right">
          <p className={`text-xs font-medium ${config.color}`}>
            {step.status.charAt(0).toUpperCase() + step.status.slice(1)}
          </p>
          {step.timestamp && (
            <p className="text-xs text-slate-400">{new Date(step.timestamp).toLocaleDateString()}</p>
          )}
        </div>
      </div>

      {/* Approval Actions */}
      {step.status === 'pending' && isActive && (
        <div className="p-3 border-t border-amber-200 space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Approval Comment (optional)</label>
            <textarea
              value={approvalComment}
              onChange={(e) => setApprovalComment(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              rows={2}
              placeholder="Add a comment..."
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={onApprove}
              className="flex-1 bg-green-500 text-white py-2 px-3 rounded text-sm font-medium hover:bg-green-600 transition-colors"
            >
              Approve
            </button>
            <button
              onClick={() => {
                if (!rejectComment.trim()) {
                  setRejectComment('');
                }
              }}
              className="flex-1 bg-white text-slate-700 py-2 px-3 rounded text-sm font-medium border border-slate-300 hover:bg-slate-50 transition-colors"
            >
              Reject
            </button>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Rejection Reason (required to reject)</label>
            <textarea
              value={rejectComment}
              onChange={(e) => setRejectComment(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded focus:ring-2 focus:ring-red-500 focus:border-transparent"
              rows={2}
              placeholder="Explain why this is being rejected..."
            />
            {rejectComment.trim() && (
              <button
                onClick={onReject}
                className="mt-2 w-full bg-red-500 text-white py-2 px-3 rounded text-sm font-medium hover:bg-red-600 transition-colors"
              >
                Confirm Rejection
              </button>
            )}
          </div>
        </div>
      )}

      {/* Show existing comments */}
      {step.comments && (
        <div className="px-3 pb-3">
          <p className="text-xs text-slate-500 italic">"{step.comments}"</p>
        </div>
      )}
    </div>
  );
};
