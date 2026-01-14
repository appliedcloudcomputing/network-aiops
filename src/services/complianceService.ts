/**
 * Compliance service for managing compliance framework data
 * Currently uses mock data - ready for API integration
 */

import type { ComplianceFramework, FrameworkColor, ViolationSeverity } from '../types';
import { COLORS, SCORE_THRESHOLDS } from '../constants';

export const getComplianceFrameworks = async (): Promise<ComplianceFramework[]> => {
  // TODO: Replace with actual API call
  // return apiClient.get<ComplianceFramework[]>('/compliance/frameworks');

  return [
    {
      id: 'pci-dss',
      name: 'PCI-DSS',
      fullName: 'Payment Card Industry Data Security Standard',
      score: 100,
      status: 'compliant',
      icon: '💳',
      color: 'emerald',
      totalControls: 264,
      passedControls: 264,
      failedControls: 0,
      violations: [],
      lastAudit: '2026-01-12T10:00:00Z',
      nextAudit: '2026-02-12T10:00:00Z',
      categories: [
        { name: 'Network Security', score: 100, controls: 45 },
        { name: 'Access Control', score: 100, controls: 38 },
        { name: 'Data Protection', score: 100, controls: 52 },
        { name: 'Monitoring & Testing', score: 100, controls: 67 },
        { name: 'Security Policies', score: 100, controls: 62 },
      ],
    },
    {
      id: 'hipaa',
      name: 'HIPAA',
      fullName: 'Health Insurance Portability and Accountability Act',
      score: 97,
      status: 'compliant',
      icon: '🏥',
      color: 'blue',
      totalControls: 189,
      passedControls: 183,
      failedControls: 6,
      violations: [
        { id: 'HIPAA-001', control: '§164.312(a)(1)', description: 'Access control - Unique user identification', severity: 'medium', resource: 'legacy-app-server', remediation: 'Implement individual user accounts for legacy application' },
        { id: 'HIPAA-002', control: '§164.312(b)', description: 'Audit controls - Hardware, software, and procedural mechanisms', severity: 'low', resource: 'db-analytics-01', remediation: 'Enable detailed audit logging on analytics database' },
        { id: 'HIPAA-003', control: '§164.312(c)(1)', description: 'Integrity - Electronic mechanisms to corroborate data integrity', severity: 'medium', resource: 'file-server-phi', remediation: 'Implement file integrity monitoring on PHI storage' },
        { id: 'HIPAA-004', control: '§164.312(d)', description: 'Person or entity authentication', severity: 'low', resource: 'vpn-gateway', remediation: 'Upgrade to certificate-based authentication' },
        { id: 'HIPAA-005', control: '§164.312(e)(1)', description: 'Transmission security - Integrity controls', severity: 'medium', resource: 'api-internal', remediation: 'Enable TLS 1.3 for internal API communications' },
        { id: 'HIPAA-006', control: '§164.308(a)(5)', description: 'Security awareness and training', severity: 'low', resource: 'org-wide', remediation: 'Complete annual security training for 12 employees' },
      ],
      lastAudit: '2026-01-10T14:00:00Z',
      nextAudit: '2026-02-10T14:00:00Z',
      categories: [
        { name: 'Administrative Safeguards', score: 96, controls: 54 },
        { name: 'Physical Safeguards', score: 100, controls: 28 },
        { name: 'Technical Safeguards', score: 95, controls: 42 },
        { name: 'Organizational Requirements', score: 98, controls: 35 },
        { name: 'Policies & Documentation', score: 97, controls: 30 },
      ],
    },
    {
      id: 'soc2',
      name: 'SOC 2',
      fullName: 'Service Organization Control 2',
      score: 99,
      status: 'compliant',
      icon: '🔐',
      color: 'purple',
      totalControls: 312,
      passedControls: 309,
      failedControls: 3,
      violations: [
        { id: 'SOC2-001', control: 'CC6.1', description: 'Logical and physical access controls', severity: 'low', resource: 'dev-environment', remediation: 'Implement stricter access controls for development environment' },
        { id: 'SOC2-002', control: 'CC7.2', description: 'System monitoring activities', severity: 'low', resource: 'logging-service', remediation: 'Increase log retention period to 12 months' },
        { id: 'SOC2-003', control: 'CC9.2', description: 'Vendor risk management', severity: 'medium', resource: 'third-party-integrations', remediation: 'Complete vendor security assessments for 2 pending vendors' },
      ],
      lastAudit: '2026-01-08T09:00:00Z',
      nextAudit: '2026-04-08T09:00:00Z',
      categories: [
        { name: 'Security', score: 99, controls: 89 },
        { name: 'Availability', score: 100, controls: 45 },
        { name: 'Processing Integrity', score: 99, controls: 52 },
        { name: 'Confidentiality', score: 100, controls: 68 },
        { name: 'Privacy', score: 98, controls: 58 },
      ],
    },
    {
      id: 'nist',
      name: 'NIST',
      fullName: 'NIST Cybersecurity Framework',
      score: 98,
      status: 'compliant',
      icon: '🏛️',
      color: 'amber',
      totalControls: 423,
      passedControls: 415,
      failedControls: 8,
      violations: [
        { id: 'NIST-001', control: 'ID.AM-5', description: 'Resources prioritization based on classification', severity: 'low', resource: 'asset-inventory', remediation: 'Complete criticality classification for 15 new assets' },
        { id: 'NIST-002', control: 'ID.RA-1', description: 'Asset vulnerabilities identified and documented', severity: 'medium', resource: 'vuln-scanner', remediation: 'Run vulnerability scan on newly deployed infrastructure' },
        { id: 'NIST-003', control: 'PR.AC-4', description: 'Access permissions managed with least privilege', severity: 'medium', resource: 'iam-policies', remediation: 'Review and reduce overly permissive IAM roles' },
        { id: 'NIST-004', control: 'PR.DS-1', description: 'Data-at-rest is protected', severity: 'low', resource: 'backup-storage', remediation: 'Enable encryption on backup storage volumes' },
        { id: 'NIST-005', control: 'PR.IP-1', description: 'Baseline configuration created and maintained', severity: 'low', resource: 'config-management', remediation: 'Update baseline configs for 3 new service types' },
        { id: 'NIST-006', control: 'DE.AE-3', description: 'Event data aggregated and correlated', severity: 'medium', resource: 'siem-platform', remediation: 'Configure correlation rules for new log sources' },
        { id: 'NIST-007', control: 'DE.CM-7', description: 'Monitoring for unauthorized activities', severity: 'low', resource: 'endpoint-protection', remediation: 'Deploy endpoint monitoring to 8 new workstations' },
        { id: 'NIST-008', control: 'RS.CO-3', description: 'Information sharing with stakeholders', severity: 'low', resource: 'incident-response', remediation: 'Update incident notification procedures' },
      ],
      lastAudit: '2026-01-05T11:00:00Z',
      nextAudit: '2026-03-05T11:00:00Z',
      categories: [
        { name: 'Identify', score: 97, controls: 78 },
        { name: 'Protect', score: 98, controls: 124 },
        { name: 'Detect', score: 97, controls: 89 },
        { name: 'Respond', score: 99, controls: 67 },
        { name: 'Recover', score: 100, controls: 65 },
      ],
    },
    {
      id: 'gdpr',
      name: 'GDPR',
      fullName: 'General Data Protection Regulation',
      score: 94,
      status: 'compliant',
      icon: '🇪🇺',
      color: 'blue',
      totalControls: 156,
      passedControls: 147,
      failedControls: 9,
      violations: [
        { id: 'GDPR-001', control: 'Art. 5(1)(c)', description: 'Data minimization - Personal data shall be adequate, relevant and limited', severity: 'medium', resource: 'customer-db', remediation: 'Review and remove unnecessary personal data fields from customer database' },
        { id: 'GDPR-002', control: 'Art. 5(1)(e)', description: 'Storage limitation - Data kept no longer than necessary', severity: 'high', resource: 'analytics-platform', remediation: 'Implement automated data retention policies for analytics data' },
        { id: 'GDPR-003', control: 'Art. 12', description: 'Transparent information and communication', severity: 'low', resource: 'privacy-policy', remediation: 'Update privacy policy with clearer data processing descriptions' },
        { id: 'GDPR-004', control: 'Art. 15', description: 'Right of access by data subject', severity: 'medium', resource: 'data-portal', remediation: 'Implement self-service data access request portal' },
        { id: 'GDPR-005', control: 'Art. 17', description: 'Right to erasure (right to be forgotten)', severity: 'medium', resource: 'backup-system', remediation: 'Ensure deletion requests propagate to backup systems within 30 days' },
        { id: 'GDPR-006', control: 'Art. 25', description: 'Data protection by design and default', severity: 'low', resource: 'new-services', remediation: 'Complete privacy impact assessment for 2 new service deployments' },
        { id: 'GDPR-007', control: 'Art. 30', description: 'Records of processing activities', severity: 'low', resource: 'documentation', remediation: 'Update processing activity records for Q4 changes' },
        { id: 'GDPR-008', control: 'Art. 33', description: 'Notification of data breach within 72 hours', severity: 'low', resource: 'incident-process', remediation: 'Update breach notification runbook with new contact procedures' },
        { id: 'GDPR-009', control: 'Art. 35', description: 'Data protection impact assessment', severity: 'medium', resource: 'ai-features', remediation: 'Complete DPIA for new AI-powered features processing personal data' },
      ],
      lastAudit: '2026-01-11T08:00:00Z',
      nextAudit: '2026-04-11T08:00:00Z',
      categories: [
        { name: 'Lawfulness & Transparency', score: 96, controls: 28 },
        { name: 'Data Subject Rights', score: 91, controls: 35 },
        { name: 'Data Security', score: 98, controls: 32 },
        { name: 'Accountability', score: 93, controls: 31 },
        { name: 'International Transfers', score: 95, controls: 30 },
      ],
    },
  ];
};

export const getScoreColorConfig = (score: number) => {
  if (score >= SCORE_THRESHOLDS.EXCELLENT) return COLORS.score.excellent;
  if (score >= SCORE_THRESHOLDS.GOOD) return COLORS.score.good;
  if (score >= SCORE_THRESHOLDS.WARNING) return COLORS.score.warning;
  return COLORS.score.critical;
};

export const getFrameworkColorConfig = (color: FrameworkColor) => {
  return COLORS.framework[color] || COLORS.framework.emerald;
};

export const getSeverityConfig = (severity: ViolationSeverity) => {
  return COLORS.severity[severity] || COLORS.severity.low;
};

export const calculateComplianceStats = (frameworks: ComplianceFramework[]) => {
  const totalViolations = frameworks.reduce((sum, f) => sum + f.violations.length, 0);
  const totalControls = frameworks.reduce((sum, f) => sum + f.totalControls, 0);
  const passedControls = frameworks.reduce((sum, f) => sum + f.passedControls, 0);
  const mediumViolations = frameworks.reduce(
    (sum, f) => sum + f.violations.filter((v) => v.severity === 'medium').length,
    0
  );
  const lowViolations = frameworks.reduce(
    (sum, f) => sum + f.violations.filter((v) => v.severity === 'low').length,
    0
  );

  return {
    totalViolations,
    totalControls,
    passedControls,
    failedControls: totalControls - passedControls,
    mediumViolations,
    lowViolations,
    compliantFrameworks: frameworks.filter((f) => f.status === 'compliant').length,
  };
};

// Export types
export type ExportFormat = 'csv' | 'json' | 'pdf';

// Generate compliance report data for export
export const generateComplianceReport = (
  frameworks: ComplianceFramework[],
  format: ExportFormat = 'json'
): string => {
  const reportData = {
    generatedAt: new Date().toISOString(),
    summary: calculateComplianceStats(frameworks),
    frameworks: frameworks.map(f => ({
      name: f.name,
      fullName: f.fullName,
      score: f.score,
      status: f.status,
      totalControls: f.totalControls,
      passedControls: f.passedControls,
      failedControls: f.failedControls,
      lastAudit: f.lastAudit,
      nextAudit: f.nextAudit,
      violations: f.violations,
      categories: f.categories,
    })),
  };

  if (format === 'json') {
    return JSON.stringify(reportData, null, 2);
  }

  if (format === 'csv') {
    // Generate CSV for violations
    const headers = ['Framework', 'Violation ID', 'Control', 'Description', 'Severity', 'Resource', 'Remediation'];
    const rows = frameworks.flatMap(f =>
      f.violations.map(v => [
        f.name,
        v.id,
        v.control,
        `"${v.description.replace(/"/g, '""')}"`,
        v.severity,
        v.resource,
        `"${v.remediation.replace(/"/g, '""')}"`,
      ])
    );

    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  }

  // For PDF format, return JSON that can be used to generate PDF
  return JSON.stringify(reportData, null, 2);
};

// Export compliance data to file (triggers download in browser)
export const exportComplianceReport = async (
  frameworks: ComplianceFramework[],
  format: ExportFormat
): Promise<{ filename: string; content: string; mimeType: string }> => {
  const content = generateComplianceReport(frameworks, format);
  const timestamp = new Date().toISOString().split('T')[0];

  const mimeTypes: Record<ExportFormat, string> = {
    csv: 'text/csv',
    json: 'application/json',
    pdf: 'application/json', // PDF would need additional processing
  };

  return {
    filename: `compliance-report-${timestamp}.${format}`,
    content,
    mimeType: mimeTypes[format],
  };
};
