/**
 * Ops Value Dashboard - Mock Data for Management Metrics
 */

import type {
  OpsValueSummary,
  TicketTATMetrics,
  AutomationMetrics,
  FirewallChangeMetrics,
  ComplianceRiskMetrics,
  ROIMetrics,
} from '../types/opsMetrics';

export const ticketTATMetrics: TicketTATMetrics = {
  beforeAIOps: {
    averageTATHours: 48.5,
    p50Hours: 36,
    p95Hours: 96,
    totalTickets: 1245,
  },
  afterAIOps: {
    averageTATHours: 8.2,
    p50Hours: 4,
    p95Hours: 18,
    totalTickets: 1567,
  },
  improvement: {
    percentageReduction: 83.1,
    hoursSaved: 63156,
    ticketsAccelerated: 1567,
  },
  trendData: [
    { month: 'Jul 2023', beforeAIOps: 52, afterAIOps: 0, ticketCount: 189 },
    { month: 'Aug 2023', beforeAIOps: 49, afterAIOps: 0, ticketCount: 203 },
    { month: 'Sep 2023', beforeAIOps: 47, afterAIOps: 0, ticketCount: 195 },
    { month: 'Oct 2023', beforeAIOps: 48, afterAIOps: 18, ticketCount: 211 },
    { month: 'Nov 2023', beforeAIOps: 46, afterAIOps: 14, ticketCount: 224 },
    { month: 'Dec 2023', beforeAIOps: 51, afterAIOps: 11, ticketCount: 198 },
    { month: 'Jan 2024', beforeAIOps: 0, afterAIOps: 9, ticketCount: 247 },
  ],
};

export const automationMetrics: AutomationMetrics = {
  manual: {
    count: 234,
    averageTimeHours: 4.5,
    errorRate: 12.8,
    totalEffort: 1053,
  },
  automated: {
    count: 1876,
    averageTimeMinutes: 8,
    errorRate: 2.1,
    totalEffort: 250,
  },
  improvement: {
    automationRate: 88.9,
    timeSavingsHours: 6593,
    errorReduction: 83.6,
    effortSavings: 803,
  },
  byCategory: [
    {
      category: 'Firewall Rule Changes',
      manual: 45,
      automated: 523,
      automationRate: 92.1,
      timeSaved: 1892,
    },
    {
      category: 'ACL Updates',
      manual: 67,
      automated: 412,
      automationRate: 86.0,
      timeSaved: 1345,
    },
    {
      category: 'Compliance Remediation',
      manual: 89,
      automated: 567,
      automationRate: 86.4,
      timeSaved: 2134,
    },
    {
      category: 'Network Policy Validation',
      manual: 23,
      automated: 289,
      automationRate: 92.6,
      timeSaved: 876,
    },
    {
      category: 'Security Group Changes',
      manual: 10,
      automated: 85,
      automationRate: 89.5,
      timeSaved: 346,
    },
  ],
};

export const firewallChangeMetrics: FirewallChangeMetrics = {
  totalChanges: 2345,
  successful: 2267,
  failed: 56,
  rolledBack: 22,
  failureRate: 2.4,
  failuresByReason: [
    { reason: 'Configuration Syntax Error', count: 18, percentage: 32.1, avgResolutionTime: 1.2 },
    { reason: 'Conflicting Rules', count: 14, percentage: 25.0, avgResolutionTime: 2.8 },
    { reason: 'Resource Capacity', count: 9, percentage: 16.1, avgResolutionTime: 4.5 },
    { reason: 'Network Connectivity', count: 8, percentage: 14.3, avgResolutionTime: 3.1 },
    { reason: 'Permission Issues', count: 7, percentage: 12.5, avgResolutionTime: 0.8 },
  ],
  trendData: [
    { month: 'Jul 2023', totalChanges: 298, failures: 24, failureRate: 8.1 },
    { month: 'Aug 2023', totalChanges: 312, failures: 19, failureRate: 6.1 },
    { month: 'Sep 2023', totalChanges: 287, failures: 15, failureRate: 5.2 },
    { month: 'Oct 2023', totalChanges: 334, failures: 12, failureRate: 3.6 },
    { month: 'Nov 2023', totalChanges: 389, failures: 9, failureRate: 2.3 },
    { month: 'Dec 2023', totalChanges: 356, failures: 7, failureRate: 2.0 },
    { month: 'Jan 2024', totalChanges: 369, failures: 6, failureRate: 1.6 },
  ],
  mttr: 2.1,
  impactAnalysis: {
    highImpactFailures: 8,
    mediumImpactFailures: 23,
    lowImpactFailures: 25,
    totalDowntimeHours: 47.3,
  },
};

export const complianceRiskMetrics: ComplianceRiskMetrics = {
  currentScore: 87.3,
  previousScore: 64.2,
  improvement: 23.1,
  riskReduction: {
    criticalIssues: {
      before: 47,
      after: 8,
      reduction: 83.0,
    },
    highRiskIssues: {
      before: 132,
      after: 23,
      reduction: 82.6,
    },
    mediumRiskIssues: {
      before: 287,
      after: 67,
      reduction: 76.7,
    },
  },
  byFramework: [
    {
      framework: 'PCI-DSS',
      previousScore: 68.5,
      currentScore: 91.2,
      improvement: 22.7,
      issuesResolved: 34,
    },
    {
      framework: 'SOC2',
      previousScore: 71.3,
      currentScore: 89.7,
      improvement: 18.4,
      issuesResolved: 28,
    },
    {
      framework: 'CIS AWS',
      previousScore: 59.8,
      currentScore: 85.1,
      improvement: 25.3,
      issuesResolved: 42,
    },
    {
      framework: 'NIST 800-53',
      previousScore: 62.4,
      currentScore: 84.8,
      improvement: 22.4,
      issuesResolved: 38,
    },
    {
      framework: 'ISO 27001',
      previousScore: 66.1,
      currentScore: 86.3,
      improvement: 20.2,
      issuesResolved: 31,
    },
  ],
  trendData: [
    { month: 'Jul 2023', score: 64.2, criticalIssues: 47, highRiskIssues: 132 },
    { month: 'Aug 2023', score: 69.5, criticalIssues: 38, highRiskIssues: 109 },
    { month: 'Sep 2023', score: 74.1, criticalIssues: 29, highRiskIssues: 87 },
    { month: 'Oct 2023', score: 78.8, criticalIssues: 21, highRiskIssues: 64 },
    { month: 'Nov 2023', score: 82.6, criticalIssues: 15, highRiskIssues: 42 },
    { month: 'Dec 2023', score: 85.4, criticalIssues: 11, highRiskIssues: 31 },
    { month: 'Jan 2024', score: 87.3, criticalIssues: 8, highRiskIssues: 23 },
  ],
  estimatedFinancialImpact: {
    potentialFinesSaved: 2450000,
    auditCostReduction: 380000,
    incidentCostAvoidance: 1820000,
    totalValue: 4650000,
  },
};

export const roiMetrics: ROIMetrics = {
  timeSavings: {
    hours: 69749,
    monetaryValue: 4184940,
  },
  errorReduction: {
    incidents: 203,
    monetaryValue: 2842000,
  },
  complianceValue: {
    riskReduction: 83.0,
    monetaryValue: 4650000,
  },
  totalROI: 11676940,
  costOfAIOps: 850000,
  netBenefit: 10826940,
  roiPercentage: 1373.8,
};

export const opsValueSummary: OpsValueSummary = {
  ticketTAT: ticketTATMetrics,
  automation: automationMetrics,
  firewallChanges: firewallChangeMetrics,
  complianceRisk: complianceRiskMetrics,
  period: {
    from: '2023-07-01T00:00:00Z',
    to: '2024-01-31T23:59:59Z',
  },
  generatedAt: '2024-01-19T14:00:00Z',
};
