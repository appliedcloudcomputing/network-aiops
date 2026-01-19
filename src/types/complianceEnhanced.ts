/**
 * Enhanced Compliance Types - Drift, Violations, Audit, and AI Remediation
 */

import type { ViolationSeverity } from './compliance';
import type { CloudProvider } from './cloud';

export type DriftStatus = 'compliant' | 'drift_detected' | 'critical_drift' | 'unknown';
export type RemediationStatus = 'possible' | 'not_possible' | 'manual_required' | 'in_progress' | 'completed';
export type FirewallVendor = 'palo_alto' | 'cisco_asa' | 'fortinet' | 'checkpoint' | 'aws_network_firewall' | 'azure_firewall';
export type ComplianceCloudProvider = CloudProvider | 'oci';

// Firewall Policy Drift
export interface FirewallPolicyDrift {
  id: string;
  firewallName: string;
  firewallId: string;
  vendor: FirewallVendor;
  location: string;
  status: DriftStatus;
  baselineName: string;
  baselineVersion: string;
  driftDetectedAt: string;
  driftItems: DriftItem[];
  aiAnalysis: AIAnalysis;
  remediationStatus: RemediationStatus;
}

export interface DriftItem {
  id: string;
  type: 'rule_added' | 'rule_removed' | 'rule_modified' | 'config_changed';
  description: string;
  severity: ViolationSeverity;
  baseline: string;
  current: string;
  impact: string;
}

export interface AIAnalysis {
  violatesBaseline: string[];
  autoRemediationPossible: boolean;
  remediationSteps?: string[];
  confidence: number;
  reasoning: string;
  estimatedImpact: 'low' | 'medium' | 'high';
}

// Firewall Rule Hit Count
export interface FirewallRuleHitCount {
  id: string;
  firewallName: string;
  firewallId: string;
  vendor: FirewallVendor;
  ruleName: string;
  ruleId: string;
  hitCount: number;
  lastHit: string | null;
  createdAt: string;
  daysActive: number;
  status: 'active' | 'unused' | 'low_usage' | 'high_usage';
  recommendation: string;
  autoRemediationPossible: boolean;
}

// Cloud NSG Violations
export interface CloudNSGViolation {
  id: string;
  provider: ComplianceCloudProvider;
  resourceType: 'security_group' | 'nsg' | 'firewall_policy';
  resourceName: string;
  resourceId: string;
  region: string;
  accountId: string;
  violationType: 'open_to_internet' | 'overly_permissive' | 'missing_encryption' | 'unauthorized_port' | 'baseline_violation' | 'misconfiguration';
  severity: ViolationSeverity;
  description: string;
  detectedAt: string;
  affectedRules: ViolationRule[];
  baselineViolation?: BaselineViolation;
  aiRemediation: AIRemediation;
}

export interface ViolationRule {
  ruleId: string;
  ruleName: string;
  protocol: string;
  sourceRange: string;
  destinationRange: string;
  portRange: string;
  action: string;
  issue: string;
}

export interface BaselineViolation {
  baselineName: string;
  requirement: string;
  expectedValue: string;
  actualValue: string;
  complianceFramework: string[];
}

export interface AIRemediation {
  autoRemediationPossible: boolean;
  remediationPlan?: string[];
  manualSteps?: string[];
  estimatedTime: string;
  riskLevel: 'low' | 'medium' | 'high';
  reasoning: string;
}

// Expired Whitelists
export interface ExpiredWhitelist {
  id: string;
  ticketId: string;
  ruleName: string;
  firewallName: string;
  firewallId: string;
  location: string;
  sourceIp: string;
  destinationIp: string;
  port: string;
  protocol: string;
  createdAt: string;
  expiresAt: string;
  status: 'active' | 'expired' | 'expiring_soon' | 'removed';
  daysOverdue: number;
  requestedBy: string;
  businessJustification: string;
  autoRemovalPossible: boolean;
  removalRisk: 'low' | 'medium' | 'high';
  aiAnalysis: {
    stillInUse: boolean;
    lastUsed: string | null;
    usageCount: number;
    removalImpact: string;
    recommendation: string;
  };
}

// Unpatched Firewalls
export interface UnpatchedFirewall {
  id: string;
  firewallName: string;
  firewallId: string;
  vendor: FirewallVendor;
  location: string;
  currentVersion: string;
  latestVersion: string;
  patchStatus: 'critical' | 'high_priority' | 'normal' | 'up_to_date';
  daysOutdated: number;
  vulnerabilities: Vulnerability[];
  maintenanceWindow: string | null;
  autoUpdateSupported: boolean;
  updateRisk: 'low' | 'medium' | 'high';
  affectedServices: string[];
  complianceImpact: string[];
}

export interface Vulnerability {
  cveId: string;
  severity: ViolationSeverity;
  description: string;
  exploitAvailable: boolean;
  patchedInVersion: string;
  published: string;
}

// Compliance Summary
export interface ComplianceSummary {
  totalFirewalls: number;
  firewallsWithDrift: number;
  totalNSGViolations: number;
  criticalViolations: number;
  expiredWhitelists: number;
  unpatchedFirewalls: number;
  autoRemediationAvailable: number;
  complianceScore: number;
  byFramework: {
    [framework: string]: FrameworkCompliance;
  };
}

export interface FrameworkCompliance {
  score: number;
  passed: number;
  failed: number;
  status: 'compliant' | 'partial' | 'non_compliant';
}

// Audit Report
export interface AuditReport {
  id: string;
  reportType: 'drift' | 'violations' | 'expired_rules' | 'patches' | 'comprehensive';
  generatedAt: string;
  period: {
    from: string;
    to: string;
  };
  summary: ComplianceSummary;
  findings: AuditFinding[];
  recommendations: string[];
  auditReadiness: 'ready' | 'needs_attention' | 'not_ready';
}

export interface AuditFinding {
  id: string;
  category: string;
  severity: ViolationSeverity;
  finding: string;
  evidence: string[];
  remediation: string;
  status: 'open' | 'in_progress' | 'resolved';
}
