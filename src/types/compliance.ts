/**
 * Compliance-related type definitions
 */

export type ComplianceStatus = 'compliant' | 'at-risk' | 'non-compliant';

export type ViolationSeverity = 'critical' | 'high' | 'medium' | 'low';

export type FrameworkColor = 'emerald' | 'blue' | 'purple' | 'amber';

export interface Violation {
  id: string;
  control: string;
  description: string;
  severity: ViolationSeverity;
  resource: string;
  remediation: string;
}

export interface ComplianceCategory {
  name: string;
  score: number;
  controls: number;
}

export interface ComplianceFramework {
  id: string;
  name: string;
  fullName: string;
  score: number;
  status: ComplianceStatus;
  icon: string;
  color: FrameworkColor;
  totalControls: number;
  passedControls: number;
  failedControls: number;
  violations: Violation[];
  lastAudit: string;
  nextAudit: string;
  categories: ComplianceCategory[];
}

export interface ScoreColorConfig {
  text: string;
  bg: string;
  bgLight: string;
  ring: string;
}

export interface FrameworkColorConfig {
  bg: string;
  bgLight: string;
  border: string;
  text: string;
  gradient: string;
}

export interface SeverityConfig {
  bg: string;
  text: string;
  border: string;
}
