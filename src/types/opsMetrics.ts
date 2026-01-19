/**
 * Ops Value Dashboard - Metrics for Management
 * Ticket TAT, Manual vs Automated Changes, Failure Rates, Compliance Risk Reduction
 */

export interface TicketTATMetrics {
  beforeAIOps: {
    averageTATHours: number;
    p50Hours: number;
    p95Hours: number;
    totalTickets: number;
  };
  afterAIOps: {
    averageTATHours: number;
    p50Hours: number;
    p95Hours: number;
    totalTickets: number;
  };
  improvement: {
    percentageReduction: number;
    hoursSaved: number;
    ticketsAccelerated: number;
  };
  trendData: TATTrendPoint[];
}

export interface TATTrendPoint {
  month: string;
  beforeAIOps: number;
  afterAIOps: number;
  ticketCount: number;
}

export interface AutomationMetrics {
  manual: {
    count: number;
    averageTimeHours: number;
    errorRate: number;
    totalEffort: number;
  };
  automated: {
    count: number;
    averageTimeMinutes: number;
    errorRate: number;
    totalEffort: number;
  };
  improvement: {
    automationRate: number;
    timeSavingsHours: number;
    errorReduction: number;
    effortSavings: number;
  };
  byCategory: CategoryAutomation[];
}

export interface CategoryAutomation {
  category: string;
  manual: number;
  automated: number;
  automationRate: number;
  timeSaved: number;
}

export interface FirewallChangeMetrics {
  totalChanges: number;
  successful: number;
  failed: number;
  rolledBack: number;
  failureRate: number;
  failuresByReason: FailureReason[];
  trendData: FailureTrendPoint[];
  mttr: number; // Mean Time To Resolve (hours)
  impactAnalysis: {
    highImpactFailures: number;
    mediumImpactFailures: number;
    lowImpactFailures: number;
    totalDowntimeHours: number;
  };
}

export interface FailureReason {
  reason: string;
  count: number;
  percentage: number;
  avgResolutionTime: number;
}

export interface FailureTrendPoint {
  month: string;
  totalChanges: number;
  failures: number;
  failureRate: number;
}

export interface ComplianceRiskMetrics {
  currentScore: number;
  previousScore: number;
  improvement: number;
  riskReduction: {
    criticalIssues: {
      before: number;
      after: number;
      reduction: number;
    };
    highRiskIssues: {
      before: number;
      after: number;
      reduction: number;
    };
    mediumRiskIssues: {
      before: number;
      after: number;
      reduction: number;
    };
  };
  byFramework: FrameworkRiskReduction[];
  trendData: ComplianceRiskTrendPoint[];
  estimatedFinancialImpact: {
    potentialFinesSaved: number;
    auditCostReduction: number;
    incidentCostAvoidance: number;
    totalValue: number;
  };
}

export interface FrameworkRiskReduction {
  framework: string;
  previousScore: number;
  currentScore: number;
  improvement: number;
  issuesResolved: number;
}

export interface ComplianceRiskTrendPoint {
  month: string;
  score: number;
  criticalIssues: number;
  highRiskIssues: number;
}

export interface OpsValueSummary {
  ticketTAT: TicketTATMetrics;
  automation: AutomationMetrics;
  firewallChanges: FirewallChangeMetrics;
  complianceRisk: ComplianceRiskMetrics;
  period: {
    from: string;
    to: string;
  };
  generatedAt: string;
}

export interface ROIMetrics {
  timeSavings: {
    hours: number;
    monetaryValue: number;
  };
  errorReduction: {
    incidents: number;
    monetaryValue: number;
  };
  complianceValue: {
    riskReduction: number;
    monetaryValue: number;
  };
  totalROI: number;
  costOfAIOps: number;
  netBenefit: number;
  roiPercentage: number;
}
