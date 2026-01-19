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

// L1 Whitelisting Types
export type Environment = 'production' | 'uat' | 'development';

export type ImplementationMode = 'manual' | 'automatic';

export interface ParsedTicketData {
  sourceIp: string;
  destinationIp: string;
  port: string;
  protocol: string;
  environment: Environment;
  description: string;
  businessJustification: string;
}

export interface FirewallInPath {
  id: string;
  name: string;
  type: 'firewall' | 'nsg' | 'security_group' | 'nacl';
  platform: 'aws' | 'azure' | 'gcp' | 'onprem';
  location: string;
  zone?: string;
  managementUrl?: string;
}

export interface RuleRecommendation {
  firewallId: string;
  firewallName: string;
  ruleType: string;
  rule: {
    source: string;
    destination: string;
    port: string;
    protocol: string;
    action: 'allow' | 'deny';
    priority?: number;
  };
  syntax: string;
  platform: 'aws' | 'azure' | 'gcp' | 'onprem';
}

export interface ConflictCheck {
  hasConflicts: boolean;
  conflicts: RuleConflict[];
  warnings: RuleWarning[];
}

export interface RuleConflict {
  id: string;
  type: 'shadowing' | 'overlap' | 'contradiction' | 'redundancy';
  severity: 'low' | 'medium' | 'high' | 'critical';
  existingRule: {
    id: string;
    source: string;
    destination: string;
    port: string;
    action: string;
  };
  message: string;
  recommendation: string;
}

export interface RuleWarning {
  id: string;
  type: 'broad_rule' | 'high_risk_port' | 'cross_environment' | 'compliance';
  severity: 'low' | 'medium' | 'high';
  message: string;
}

export interface L1WhitelistingTicket {
  id: string;
  serviceNowId: string;
  status: 'parsing' | 'analyzed' | 'pending_approval' | 'approved' | 'implementing' | 'completed' | 'rejected' | 'rolled_back';
  mode: ImplementationMode;
  parsedData: ParsedTicketData;
  firewallsInPath: FirewallInPath[];
  recommendations: RuleRecommendation[];
  riskAssessment: RiskAssessment;
  conflictCheck: ConflictCheck;
  approvalChain: ApprovalStep[];
  implementationStatus?: {
    step: string;
    progress: number;
    message: string;
  };
  rollbackAvailable: boolean;
  rollbackPlan?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  createdBy: string;
  approvedBy?: string;
}
