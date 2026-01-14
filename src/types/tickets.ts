/**
 * Ticket management type definitions
 */

export type TicketStatus = 'awaiting' | 'approved' | 'implementing' | 'completed' | 'rejected';

export type TicketPriority = 'low' | 'medium' | 'high' | 'critical';

export type TicketCategory =
  | 'firewall_rule'
  | 'security_group'
  | 'network_acl'
  | 'routing'
  | 'load_balancer'
  | 'vpn'
  | 'dns'
  | 'other';

export type ChangeType = 'add' | 'modify' | 'delete';

export interface RiskAssessment {
  score: number;
  level: 'low' | 'medium' | 'high' | 'critical';
  factors: RiskFactor[];
  recommendation: string;
}

export interface RiskFactor {
  name: string;
  impact: 'positive' | 'negative' | 'neutral';
  weight: number;
  description: string;
}

export interface AffectedResource {
  id: string;
  type: string;
  name: string;
  platform: 'aws' | 'azure' | 'gcp' | 'onprem';
  region?: string;
}

export interface ApprovalStep {
  id: string;
  name: string;
  approver: string;
  status: 'pending' | 'approved' | 'rejected';
  timestamp?: string;
  comments?: string;
}

export interface Ticket {
  id: string;
  serviceNowId: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: TicketCategory;
  changeType: ChangeType;
  assignee: string;
  requester: string;
  createdAt: string;
  updatedAt: string;
  scheduledAt?: string;
  completedAt?: string;
  affectedResources: AffectedResource[];
  riskAssessment: RiskAssessment;
  approvalSteps: ApprovalStep[];
  implementationNotes?: string;
  rollbackPlan?: string;
}

export interface TicketFormData {
  title: string;
  description: string;
  priority: TicketPriority;
  category: TicketCategory;
  changeType: ChangeType;
  sourceIp: string;
  destinationIp: string;
  port: string;
  protocol: string;
  action: 'allow' | 'deny';
  platform: 'aws' | 'azure' | 'gcp' | 'onprem';
  justification: string;
  scheduledAt?: string;
  rollbackPlan?: string;
}

export interface TicketFilter {
  status?: TicketStatus[];
  priority?: TicketPriority[];
  category?: TicketCategory[];
  search?: string;
}
