/**
 * Ticket service - handles ticket-related API operations
 * Uses real data from set1_tickets.json
 */

import type {
  Ticket,
  TicketFormData,
  TicketStatus,
  TicketFilter,
  RiskAssessment,
  TicketCategory,
  TicketPriority,
  ChangeType,
} from '../types/tickets';

// Import real ticket data
import ticketsDataset from '../../data/set1_tickets.json';

// Map JSON state to application TicketStatus
const mapState = (state: string): TicketStatus => {
  const stateMap: Record<string, TicketStatus> = {
    'Draft': 'awaiting',
    'Awaiting Approval': 'awaiting',
    'Approved': 'approved',
    'Implementing': 'implementing',
    'Implemented': 'completed',
    'Monitoring': 'completed',
    'Scheduled': 'approved',
    'Rejected': 'rejected',
    'Cancelled': 'rejected',
    'On Hold': 'awaiting',
  };
  return stateMap[state] || 'awaiting';
};

// Map JSON priority to application priority
const mapPriority = (priority: number): TicketPriority => {
  if (priority === 1) return 'critical';
  if (priority === 2) return 'high';
  if (priority === 3) return 'medium';
  return 'low';
};

// Map JSON category to application category
const mapCategory = (category: string): TicketCategory => {
  const categoryMap: Record<string, TicketCategory> = {
    'Network / Firewall Change': 'firewall_rule',
    'Network / WAF Change': 'firewall_rule',
    'Network / VPN Access': 'vpn',
    'Network / Transit Gateway': 'routing',
    'Network / VPC Peering': 'routing',
    'Network / Vendor Access': 'firewall_rule',
    'Network / Load Balancer': 'load_balancer',
    'Security / Emergency Block': 'firewall_rule',
    'Security / Threat Response': 'firewall_rule',
    'Security / Access Revocation': 'security_group',
    'Compliance / Audit Remediation': 'security_group',
    'Compliance / Policy Update': 'other',
  };
  return categoryMap[category] || 'other';
};

// Map JSON risk level to RiskAssessment level
const mapRiskLevel = (level: string): RiskAssessment['level'] => {
  const levelMap: Record<string, RiskAssessment['level']> = {
    'LOW': 'low',
    'MEDIUM': 'medium',
    'HIGH': 'high',
    'CRITICAL': 'critical',
    'EMERGENCY': 'critical',
  };
  return levelMap[level] || 'medium';
};

// Transform JSON ticket to application Ticket type
const transformTicket = (jsonTicket: typeof ticketsDataset.tickets[0], index: number): Ticket => {
  const riskScore = jsonTicket.atlas_risk_score ?? 50;
  const riskLevel = mapRiskLevel(jsonTicket.risk_level);

  return {
    id: `TKT-${String(index + 1).padStart(3, '0')}`,
    serviceNowId: jsonTicket.ticket_number,
    title: jsonTicket.short_description,
    description: jsonTicket.business_justification,
    status: mapState(jsonTicket.state),
    priority: mapPriority(jsonTicket.priority),
    category: mapCategory(jsonTicket.category),
    changeType: jsonTicket.action === 'DENY' ? 'delete' : 'add' as ChangeType,
    assignee: jsonTicket.assigned_to?.name || 'Unassigned',
    requester: jsonTicket.requested_by?.email || 'unknown@company.com',
    createdAt: jsonTicket.created_at,
    updatedAt: jsonTicket.updated_at,
    scheduledAt: jsonTicket.change_window?.split(' to ')[0],
    completedAt: jsonTicket.state === 'Implemented' ? jsonTicket.updated_at : undefined,
    affectedResources: [
      {
        id: `res-${index}-src`,
        type: 'Source System',
        name: jsonTicket.source_system,
        platform: 'aws' as const,
      },
      {
        id: `res-${index}-dst`,
        type: 'Destination System',
        name: jsonTicket.destination_system,
        platform: 'aws' as const,
      },
    ],
    riskAssessment: {
      score: riskScore,
      level: riskLevel,
      factors: [
        {
          name: 'Risk Score',
          impact: riskScore > 60 ? 'negative' : riskScore > 40 ? 'neutral' : 'positive',
          weight: riskScore,
          description: `Atlas risk score: ${riskScore}`,
        },
        ...(jsonTicket.compliance_status?.violations?.length > 0 ? [{
          name: 'Compliance Violations',
          impact: 'negative' as const,
          weight: 20,
          description: `${jsonTicket.compliance_status.violations.length} compliance violations`,
        }] : []),
        ...(jsonTicket.additional_controls?.length > 0 ? [{
          name: 'Additional Controls',
          impact: 'positive' as const,
          weight: -10,
          description: `Controls: ${jsonTicket.additional_controls.join(', ')}`,
        }] : []),
      ],
      recommendation: riskLevel === 'critical'
        ? 'Requires CISO approval and detailed review.'
        : riskLevel === 'high'
        ? 'Proceed with caution. Implement during maintenance window.'
        : riskLevel === 'medium'
        ? 'Standard approval process. Monitor after implementation.'
        : 'Low risk. Can proceed with minimal oversight.',
    },
    approvalSteps: jsonTicket.approval_history?.map((approval, idx) => ({
      id: `step-${idx + 1}`,
      name: approval.approver === 'SYSTEM' ? 'Auto Approval' : 'Manual Review',
      approver: approval.approver,
      status: approval.action.toLowerCase().includes('approved') ? 'approved' as const :
              approval.action.toLowerCase().includes('rejected') ? 'rejected' as const : 'pending' as const,
      timestamp: approval.timestamp,
      comments: approval.comments,
    })) || [],
    rollbackPlan: jsonTicket.rollback_plan ?? undefined,
  };
};

// Transform all tickets from JSON data
const mockTickets: Ticket[] = ticketsDataset.tickets.map(transformTicket);

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const ticketService = {
  async getTickets(filter?: TicketFilter): Promise<Ticket[]> {
    await delay(500);
    let tickets = [...mockTickets];

    if (filter?.status?.length) {
      tickets = tickets.filter(t => filter.status!.includes(t.status));
    }
    if (filter?.priority?.length) {
      tickets = tickets.filter(t => filter.priority!.includes(t.priority));
    }
    if (filter?.category?.length) {
      tickets = tickets.filter(t => filter.category!.includes(t.category));
    }
    if (filter?.search) {
      const searchLower = filter.search.toLowerCase();
      tickets = tickets.filter(
        t =>
          t.title.toLowerCase().includes(searchLower) ||
          t.description.toLowerCase().includes(searchLower) ||
          t.serviceNowId.toLowerCase().includes(searchLower)
      );
    }

    return tickets.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async getTicketById(id: string): Promise<Ticket | null> {
    await delay(300);
    return mockTickets.find(t => t.id === id) || null;
  },

  async getTicketsByStatus(status: TicketStatus): Promise<Ticket[]> {
    await delay(300);
    return mockTickets.filter(t => t.status === status);
  },

  async createTicket(formData: TicketFormData): Promise<Ticket> {
    await delay(1000);
    const riskAssessment = calculateRiskAssessment(formData);
    const newTicket: Ticket = {
      id: `TKT-${String(mockTickets.length + 1).padStart(3, '0')}`,
      serviceNowId: `CHG00${12350 + mockTickets.length}`,
      title: formData.title,
      description: formData.description,
      status: 'awaiting',
      priority: formData.priority,
      category: formData.category,
      changeType: formData.changeType,
      assignee: 'Unassigned',
      requester: 'current.user@company.com',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      scheduledAt: formData.scheduledAt,
      affectedResources: [],
      riskAssessment,
      approvalSteps: [
        { id: 'step-1', name: 'Security Review', approver: 'Security Team', status: 'pending' },
        { id: 'step-2', name: 'Manager Approval', approver: 'Network Manager', status: 'pending' },
      ],
      rollbackPlan: formData.rollbackPlan,
    };
    mockTickets.push(newTicket);
    return newTicket;
  },

  async updateTicketStatus(id: string, status: TicketStatus): Promise<Ticket | null> {
    await delay(500);
    const ticket = mockTickets.find(t => t.id === id);
    if (ticket) {
      ticket.status = status;
      ticket.updatedAt = new Date().toISOString();
      if (status === 'completed') {
        ticket.completedAt = new Date().toISOString();
      }
    }
    return ticket || null;
  },

  async approveTicketStep(ticketId: string, stepId: string, comments?: string): Promise<Ticket | null> {
    await delay(500);
    const ticket = mockTickets.find(t => t.id === ticketId);
    if (ticket) {
      const step = ticket.approvalSteps.find(s => s.id === stepId);
      if (step) {
        step.status = 'approved';
        step.timestamp = new Date().toISOString();
        step.comments = comments;
      }
      ticket.updatedAt = new Date().toISOString();

      // Check if all steps are approved
      const allApproved = ticket.approvalSteps.every(s => s.status === 'approved');
      if (allApproved) {
        ticket.status = 'approved';
      }
    }
    return ticket || null;
  },

  async rejectTicketStep(ticketId: string, stepId: string, comments: string): Promise<Ticket | null> {
    await delay(500);
    const ticket = mockTickets.find(t => t.id === ticketId);
    if (ticket) {
      const step = ticket.approvalSteps.find(s => s.id === stepId);
      if (step) {
        step.status = 'rejected';
        step.timestamp = new Date().toISOString();
        step.comments = comments;
      }
      ticket.status = 'rejected';
      ticket.updatedAt = new Date().toISOString();
    }
    return ticket || null;
  },

  async calculateRisk(formData: Partial<TicketFormData>): Promise<RiskAssessment> {
    await delay(800);
    return calculateRiskAssessment(formData as TicketFormData);
  },
};

function calculateRiskAssessment(formData: TicketFormData): RiskAssessment {
  const factors: RiskAssessment['factors'] = [];
  let baseScore = 50;

  // Change type impacts
  if (formData.changeType === 'delete') {
    factors.push({
      name: 'Rule Removal',
      impact: 'positive',
      weight: -20,
      description: 'Removing rules generally reduces attack surface',
    });
    baseScore -= 20;
  } else if (formData.changeType === 'add') {
    factors.push({
      name: 'New Rule',
      impact: 'negative',
      weight: 15,
      description: 'New rules may increase exposure',
    });
    baseScore += 15;
  }

  // Action impacts
  if (formData.action === 'deny') {
    factors.push({
      name: 'Deny Action',
      impact: 'positive',
      weight: -15,
      description: 'Deny rules improve security posture',
    });
    baseScore -= 15;
  }

  // Priority impacts
  if (formData.priority === 'critical') {
    factors.push({
      name: 'Critical Priority',
      impact: 'negative',
      weight: 20,
      description: 'Expedited changes may miss thorough review',
    });
    baseScore += 20;
  }

  // Source IP analysis
  if (formData.sourceIp === '0.0.0.0/0' || formData.sourceIp === 'any') {
    factors.push({
      name: 'Any Source',
      impact: 'negative',
      weight: 30,
      description: 'Allows traffic from any source IP',
    });
    baseScore += 30;
  }

  // Standard ports analysis
  const standardPorts = ['80', '443', '22', '3389'];
  if (formData.port && standardPorts.includes(formData.port)) {
    factors.push({
      name: 'Standard Port',
      impact: 'positive',
      weight: -10,
      description: 'Uses well-known standard port',
    });
    baseScore -= 10;
  }

  // Clamp score between 0 and 100
  const finalScore = Math.max(0, Math.min(100, baseScore));

  let level: RiskAssessment['level'];
  let recommendation: string;

  if (finalScore < 30) {
    level = 'low';
    recommendation = 'Low risk change. Can proceed with standard approval process.';
  } else if (finalScore < 50) {
    level = 'medium';
    recommendation = 'Moderate risk. Recommend implementing during maintenance window.';
  } else if (finalScore < 75) {
    level = 'high';
    recommendation = 'High risk change. Requires CAB approval and detailed rollback plan.';
  } else {
    level = 'critical';
    recommendation = 'Critical risk. Requires CISO approval and must include monitoring plan.';
  }

  return { score: finalScore, level, factors, recommendation };
}
