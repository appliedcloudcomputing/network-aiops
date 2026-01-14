/**
 * Conflicts Service - Cross-platform rule comparison and conflict detection
 * Uses real data from set4_rule_comparison.json
 */

// Import real comparison data
import comparisonDataset from '../../data/set4_rule_comparison.json';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Types for rule comparison
export type ComparisonStatus = 'MATCH' | 'MISMATCH' | 'PARTIAL_MATCH' | 'MISSING_RULE' | 'EXTRA_RULE' | 'PENDING_SYNC';

export interface PlatformRule {
  rule_id?: string;
  rule_name?: string;
  security_group?: string;
  nsg?: string;
  network?: string;
  source_zone?: string;
  dest_zone?: string;
  priority?: number;
  status: string;
}

export interface RuleDifference {
  platform: string;
  field: string;
  expected: string;
  actual: string;
  severity: string;
}

export interface RuleComparison {
  comparison_id: string;
  rule_name: string;
  ticket_reference: string | null;
  description: string;
  source: string;
  destination: string;
  port: string;
  protocol: string;
  action: string;
  comparison_status: ComparisonStatus;
  last_compared: string;
  aws_rule: PlatformRule | null;
  azure_rule: PlatformRule | null;
  gcp_rule: PlatformRule | null;
  paloalto_rule: PlatformRule | null;
  differences: RuleDifference[];
}

export interface ComparisonSummary {
  total_comparisons: number;
  match: number;
  mismatch: number;
  partial_match: number;
  missing_rule: number;
  extra_rule: number;
  pending_sync: number;
}

// Transform comparison data
const transformComparison = (comparison: typeof comparisonDataset.comparisons[0]): RuleComparison => {
  return {
    comparison_id: comparison.comparison_id,
    rule_name: comparison.rule_name,
    ticket_reference: comparison.ticket_reference || null,
    description: comparison.description,
    source: comparison.source,
    destination: comparison.destination,
    port: comparison.port,
    protocol: comparison.protocol,
    action: comparison.action,
    comparison_status: comparison.comparison_status as ComparisonStatus,
    last_compared: comparison.last_compared,
    aws_rule: comparison.aws_rule || null,
    azure_rule: comparison.azure_rule || null,
    gcp_rule: comparison.gcp_rule || null,
    paloalto_rule: comparison.paloalto_rule || null,
    differences: comparison.differences || [],
  };
};

export const conflictsService = {
  // Get all rule comparisons
  async getComparisons(filter?: { status?: ComparisonStatus; platform?: string }): Promise<RuleComparison[]> {
    await delay(500);
    let comparisons = comparisonDataset.comparisons.map(transformComparison);

    if (filter?.status) {
      comparisons = comparisons.filter(c => c.comparison_status === filter.status);
    }

    return comparisons;
  },

  // Get comparison summary
  async getSummary(): Promise<ComparisonSummary> {
    await delay(200);
    return comparisonDataset.comparison_summary;
  },

  // Get comparisons with conflicts (mismatches, partial matches, missing rules)
  async getConflicts(): Promise<RuleComparison[]> {
    await delay(400);
    return comparisonDataset.comparisons
      .filter(c => ['MISMATCH', 'PARTIAL_MATCH', 'MISSING_RULE', 'EXTRA_RULE'].includes(c.comparison_status))
      .map(transformComparison);
  },

  // Get comparison by ID
  async getComparisonById(id: string): Promise<RuleComparison | null> {
    await delay(200);
    const comparison = comparisonDataset.comparisons.find(c => c.comparison_id === id);
    return comparison ? transformComparison(comparison) : null;
  },

  // Get comparisons by ticket reference
  async getComparisonsByTicket(ticketRef: string): Promise<RuleComparison[]> {
    await delay(300);
    return comparisonDataset.comparisons
      .filter(c => c.ticket_reference === ticketRef)
      .map(transformComparison);
  },

  // Get platform-specific statistics
  async getPlatformStats(): Promise<Record<string, { total: number; conflicts: number; missing: number }>> {
    await delay(300);
    const stats = {
      aws: { total: 0, conflicts: 0, missing: 0 },
      azure: { total: 0, conflicts: 0, missing: 0 },
      gcp: { total: 0, conflicts: 0, missing: 0 },
      paloalto: { total: 0, conflicts: 0, missing: 0 },
    };

    comparisonDataset.comparisons.forEach(c => {
      if (c.aws_rule) stats.aws.total++;
      if (c.azure_rule) stats.azure.total++;
      if (c.gcp_rule) stats.gcp.total++;
      if (c.paloalto_rule) stats.paloalto.total++;

      if (c.comparison_status === 'MISSING_RULE') {
        if (!c.aws_rule) stats.aws.missing++;
        if (!c.azure_rule) stats.azure.missing++;
        if (!c.gcp_rule) stats.gcp.missing++;
        if (!c.paloalto_rule) stats.paloalto.missing++;
      }

      c.differences?.forEach(d => {
        const platform = d.platform.toLowerCase() as keyof typeof stats;
        if (stats[platform]) {
          stats[platform].conflicts++;
        }
      });
    });

    return stats;
  },
};
