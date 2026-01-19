/**
 * Conflict Detection Engine - Firewall Rule Analysis Types
 */

export type ConflictType =
  | 'shadowing'
  | 'redundancy'
  | 'correlation'
  | 'generalization'
  | 'overlap'
  | 'contradiction'
  | 'policy_violation';

export type ConflictSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';
export type FirewallRuleAction = 'allow' | 'deny' | 'reject' | 'log';
export type DetectionStatus = 'active' | 'resolved' | 'ignored' | 'false_positive';
export type ResolutionStrategy = 'merge' | 'reorder' | 'remove' | 'modify' | 'split';

export interface FirewallRuleReference {
  ruleId: string;
  ruleName: string;
  firewall: string;
  zone: string;
  priority: number;
  action: FirewallRuleAction;
  source: string;
  destination: string;
  service: string;
  application?: string;
  enabled: boolean;
  createdAt: string;
  lastModified: string;
  owner: string;
}

export interface ConflictEvidence {
  description: string;
  technicalDetail: string;
  trafficExample?: string;
  riskScore: number; // 0-100
}

export interface ConflictImpact {
  securityRisk: 'high' | 'medium' | 'low' | 'none';
  performanceImpact: 'high' | 'medium' | 'low' | 'none';
  complianceViolation: boolean;
  affectedTraffic: string;
  estimatedHitCount: number; // daily
  potentialDataExposure: boolean;
}

export interface ResolutionOption {
  id: string;
  strategy: ResolutionStrategy;
  title: string;
  description: string;
  steps: string[];
  affectedRules: string[];
  automationAvailable: boolean;
  riskLevel: 'low' | 'medium' | 'high';
  estimatedEffort: string;
  recommendationScore: number; // 0-100
  rollbackPlan?: string;
}

export interface FirewallRuleConflict {
  id: string;
  type: ConflictType;
  severity: ConflictSeverity;
  status: DetectionStatus;
  title: string;
  description: string;
  detectedAt: string;
  rule1: FirewallRuleReference;
  rule2: FirewallRuleReference;
  evidence: ConflictEvidence[];
  impact: ConflictImpact;
  resolutionOptions: ResolutionOption[];
  similarConflicts: string[];
  tags: string[];
  assignedTo?: string;
  resolvedAt?: string;
  resolutionNote?: string;
}

export interface PolicyViolation {
  id: string;
  policyName: string;
  violationType: string;
  severity: ConflictSeverity;
  description: string;
  violatingRules: FirewallRuleReference[];
  policyRequirement: string;
  detectedAt: string;
  complianceFramework?: string[];
  remediationRequired: boolean;
}

export interface ConflictAnalysisMetrics {
  totalRulesAnalyzed: number;
  totalConflictsDetected: number;
  criticalConflicts: number;
  highSeverityConflicts: number;
  mediumSeverityConflicts: number;
  lowSeverityConflicts: number;
  resolvedConflicts: number;
  activeConflicts: number;
  falsePositives: number;
  policyViolations: number;
  averageResolutionTime: string;
  conflictsByType: Record<ConflictType, number>;
  firewallsCovered: number;
  lastAnalysisTime: string;
}

export interface ConflictTrend {
  date: string;
  totalConflicts: number;
  criticalConflicts: number;
  resolvedConflicts: number;
  newConflicts: number;
}

export interface FirewallRuleStats {
  firewall: string;
  totalRules: number;
  conflictingRules: number;
  shadowedRules: number;
  redundantRules: number;
  unusedRules: number;
  healthScore: number; // 0-100
}

export interface ConflictDetectionData {
  conflicts: FirewallRuleConflict[];
  policyViolations: PolicyViolation[];
  metrics: ConflictAnalysisMetrics;
  trends: ConflictTrend[];
  firewallStats: FirewallRuleStats[];
  lastUpdated: string;
}
