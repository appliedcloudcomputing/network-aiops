/**
 * Rule Validation Service - validates firewall rules across platforms
 * Uses real validation data from set5_rule_validation.json
 */

import type {
  ValidationPlatform,
  ValidationResult,
  ValidationIssue,
  SecurityCheck,
  ValidationHistory,
} from '../types/validation';

// Import real validation data
import validationDataset from '../../data/set5_rule_validation.json';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Export type for pre-validated rules
export interface PreValidatedRule {
  validation_id: string;
  rule_reference: string;
  rule_name: string;
  platform: string;
  validation_category: string;
  validation_check: string;
  check_description: string;
  severity: string;
  status: string;
  expected_value: string;
  actual_value: string;
  validation_timestamp: string;
  exception_reason: string | null;
  remediation: string | null;
  ticket_reference: string | null;
}

// Get all pre-validated rules from dataset
export const getPreValidatedRules = (): PreValidatedRule[] => {
  return validationDataset.validations as PreValidatedRule[];
};

// Get validation summary
export const getValidationSummary = () => {
  return validationDataset.validation_summary;
};

// Common security patterns to check
const SECURITY_PATTERNS = {
  openSSH: /0\.0\.0\.0\/0.*(?:22|ssh)/i,
  openRDP: /0\.0\.0\.0\/0.*(?:3389|rdp)/i,
  openDatabase: /0\.0\.0\.0\/0.*(?:3306|5432|1433|27017)/i,
  anySource: /(?:source|src|cidr).*(?:0\.0\.0\.0\/0|any|\*)/i,
  anyDestination: /(?:destination|dst|dest).*(?:0\.0\.0\.0\/0|any|\*)/i,
  insecureProtocol: /(?:telnet|ftp|http[^s])/i,
  widePortRange: /(?:0-65535|all|any)/i,
};

// Platform-specific syntax validators
const validateAWSSyntax = (content: string): ValidationIssue[] => {
  const issues: ValidationIssue[] = [];
  const lines = content.split('\n');

  lines.forEach((line, idx) => {
    const lineNum = idx + 1;
    const trimmed = line.trim();

    if (trimmed.startsWith('aws ec2')) {
      if (!trimmed.includes('--group-id') && !trimmed.includes('\\')) {
        issues.push({
          id: `aws-${lineNum}-1`,
          line: lineNum,
          severity: 'error',
          category: 'syntax',
          message: 'Missing --group-id parameter',
          suggestion: 'Add --group-id sg-xxxxxxxx to specify the security group',
        });
      }

      if (trimmed.includes('--cidr 0.0.0.0/0') && trimmed.includes('--port 22')) {
        issues.push({
          id: `aws-${lineNum}-2`,
          line: lineNum,
          severity: 'error',
          category: 'security',
          message: 'SSH port 22 is open to the internet (0.0.0.0/0)',
          suggestion: 'Restrict SSH access to specific IP ranges',
          ruleId: 'SEC-001',
        });
      }
    }

    if (trimmed.includes('--protocol') && !trimmed.match(/--protocol\s+(tcp|udp|icmp|-1)/i)) {
      issues.push({
        id: `aws-${lineNum}-3`,
        line: lineNum,
        severity: 'warning',
        category: 'syntax',
        message: 'Invalid protocol specified',
        suggestion: 'Use tcp, udp, icmp, or -1 (all)',
      });
    }
  });

  return issues;
};

const validateAzureSyntax = (content: string): ValidationIssue[] => {
  const issues: ValidationIssue[] = [];
  const lines = content.split('\n');

  lines.forEach((line, idx) => {
    const lineNum = idx + 1;
    const trimmed = line.trim();

    if (trimmed.includes('az network nsg rule')) {
      if (!trimmed.includes('--priority') && !trimmed.includes('\\')) {
        issues.push({
          id: `azure-${lineNum}-1`,
          line: lineNum,
          severity: 'warning',
          category: 'syntax',
          message: 'Missing --priority parameter',
          suggestion: 'Add --priority 100-4096 for rule ordering',
        });
      }

      if (!trimmed.includes('--direction') && !trimmed.includes('\\')) {
        issues.push({
          id: `azure-${lineNum}-2`,
          line: lineNum,
          severity: 'error',
          category: 'syntax',
          message: 'Missing --direction parameter',
          suggestion: 'Add --direction Inbound or Outbound',
        });
      }
    }

    if (trimmed.includes('--source-address-prefixes "*"') || trimmed.includes("--source-address-prefixes '*'")) {
      issues.push({
        id: `azure-${lineNum}-3`,
        line: lineNum,
        severity: 'warning',
        category: 'security',
        message: 'Source address is open to all (*)',
        suggestion: 'Restrict to specific IP ranges when possible',
      });
    }
  });

  return issues;
};

const validateGCPSyntax = (content: string): ValidationIssue[] => {
  const issues: ValidationIssue[] = [];
  const lines = content.split('\n');

  lines.forEach((line, idx) => {
    const lineNum = idx + 1;
    const trimmed = line.trim();

    if (trimmed.includes('gcloud compute firewall-rules')) {
      if (!trimmed.includes('--network') && !trimmed.includes('\\')) {
        issues.push({
          id: `gcp-${lineNum}-1`,
          line: lineNum,
          severity: 'error',
          category: 'syntax',
          message: 'Missing --network parameter',
          suggestion: 'Specify the VPC network with --network=<network-name>',
        });
      }

      if (!trimmed.includes('--direction') && !trimmed.includes('\\')) {
        issues.push({
          id: `gcp-${lineNum}-2`,
          line: lineNum,
          severity: 'warning',
          category: 'syntax',
          message: 'Missing --direction parameter',
          suggestion: 'Add --direction=INGRESS or EGRESS',
        });
      }
    }

    if (trimmed.includes('--source-ranges=0.0.0.0/0')) {
      issues.push({
        id: `gcp-${lineNum}-3`,
        line: lineNum,
        severity: 'warning',
        category: 'security',
        message: 'Source ranges open to all (0.0.0.0/0)',
        suggestion: 'Restrict to specific IP ranges',
      });
    }
  });

  return issues;
};

const validateIptablesSyntax = (content: string): ValidationIssue[] => {
  const issues: ValidationIssue[] = [];
  const lines = content.split('\n');

  lines.forEach((line, idx) => {
    const lineNum = idx + 1;
    const trimmed = line.trim();

    if (trimmed.startsWith('iptables') || trimmed.startsWith('-A')) {
      if (!trimmed.includes('-j') && trimmed.length > 10) {
        issues.push({
          id: `ipt-${lineNum}-1`,
          line: lineNum,
          severity: 'error',
          category: 'syntax',
          message: 'Missing jump target (-j)',
          suggestion: 'Add -j ACCEPT, DROP, or REJECT',
        });
      }

      if (!trimmed.includes('-A') && !trimmed.includes('-I') && !trimmed.includes('-D')) {
        issues.push({
          id: `ipt-${lineNum}-2`,
          line: lineNum,
          severity: 'warning',
          category: 'syntax',
          message: 'Missing chain operation',
          suggestion: 'Use -A (append), -I (insert), or -D (delete)',
        });
      }
    }

    if (trimmed.includes('--dport 22') && !trimmed.includes('-s ')) {
      issues.push({
        id: `ipt-${lineNum}-3`,
        line: lineNum,
        severity: 'error',
        category: 'security',
        message: 'SSH rule without source restriction',
        suggestion: 'Add -s <source-ip> to restrict SSH access',
      });
    }
  });

  return issues;
};

const validateCiscoASASyntax = (content: string): ValidationIssue[] => {
  const issues: ValidationIssue[] = [];
  const lines = content.split('\n');

  lines.forEach((line, idx) => {
    const lineNum = idx + 1;
    const trimmed = line.trim();

    if (trimmed.startsWith('access-list')) {
      if (!trimmed.includes('extended') && !trimmed.includes('standard')) {
        issues.push({
          id: `asa-${lineNum}-1`,
          line: lineNum,
          severity: 'warning',
          category: 'syntax',
          message: 'Access list type not specified',
          suggestion: 'Use "extended" for IP-based ACLs',
        });
      }

      if (!trimmed.match(/permit|deny/)) {
        issues.push({
          id: `asa-${lineNum}-2`,
          line: lineNum,
          severity: 'error',
          category: 'syntax',
          message: 'Missing action (permit/deny)',
          suggestion: 'Specify permit or deny action',
        });
      }
    }

    if (trimmed.includes('permit') && trimmed.includes('any any')) {
      issues.push({
        id: `asa-${lineNum}-3`,
        line: lineNum,
        severity: 'error',
        category: 'security',
        message: 'Rule permits any to any traffic',
        suggestion: 'Restrict source and destination addresses',
      });
    }
  });

  return issues;
};

// Generic security checks
const runSecurityChecks = (content: string): SecurityCheck[] => {
  const checks: SecurityCheck[] = [];

  // Check for open SSH
  checks.push({
    id: 'sec-ssh-001',
    name: 'SSH Access Restriction',
    description: 'SSH should not be open to 0.0.0.0/0',
    category: 'exposure',
    status: SECURITY_PATTERNS.openSSH.test(content) ? 'fail' : 'pass',
    severity: 'error',
    details: SECURITY_PATTERNS.openSSH.test(content) ? 'SSH (port 22) is exposed to the internet' : undefined,
  });

  // Check for open RDP
  checks.push({
    id: 'sec-rdp-001',
    name: 'RDP Access Restriction',
    description: 'RDP should not be open to 0.0.0.0/0',
    category: 'exposure',
    status: SECURITY_PATTERNS.openRDP.test(content) ? 'fail' : 'pass',
    severity: 'error',
    details: SECURITY_PATTERNS.openRDP.test(content) ? 'RDP (port 3389) is exposed to the internet' : undefined,
  });

  // Check for open database ports
  checks.push({
    id: 'sec-db-001',
    name: 'Database Port Restriction',
    description: 'Database ports should not be publicly accessible',
    category: 'exposure',
    status: SECURITY_PATTERNS.openDatabase.test(content) ? 'fail' : 'pass',
    severity: 'error',
    details: SECURITY_PATTERNS.openDatabase.test(content) ? 'Database ports exposed to the internet' : undefined,
  });

  // Check for overly permissive source
  checks.push({
    id: 'sec-src-001',
    name: 'Source Address Scope',
    description: 'Avoid using any/0.0.0.0/0 as source when possible',
    category: 'access',
    status: SECURITY_PATTERNS.anySource.test(content) ? 'warning' : 'pass',
    severity: 'warning',
    details: SECURITY_PATTERNS.anySource.test(content) ? 'Rules with overly permissive source addresses found' : undefined,
  });

  // Check for insecure protocols
  checks.push({
    id: 'sec-proto-001',
    name: 'Secure Protocol Usage',
    description: 'Avoid using insecure protocols like Telnet, FTP',
    category: 'compliance',
    status: SECURITY_PATTERNS.insecureProtocol.test(content) ? 'warning' : 'pass',
    severity: 'warning',
    details: SECURITY_PATTERNS.insecureProtocol.test(content) ? 'Insecure protocols detected' : undefined,
  });

  // Check for wide port ranges
  checks.push({
    id: 'sec-port-001',
    name: 'Port Range Restriction',
    description: 'Avoid opening all ports (0-65535)',
    category: 'access',
    status: SECURITY_PATTERNS.widePortRange.test(content) ? 'warning' : 'pass',
    severity: 'warning',
    details: SECURITY_PATTERNS.widePortRange.test(content) ? 'Wide port ranges detected' : undefined,
  });

  return checks;
};

// Calculate scores
const calculateScores = (issues: ValidationIssue[], securityChecks: SecurityCheck[]) => {
  const syntaxIssues = issues.filter(i => i.category === 'syntax');

  const syntaxErrors = syntaxIssues.filter(i => i.severity === 'error').length;
  const syntaxWarnings = syntaxIssues.filter(i => i.severity === 'warning').length;
  const syntaxScore = Math.max(0, 100 - (syntaxErrors * 20) - (syntaxWarnings * 5));

  const securityFails = securityChecks.filter(c => c.status === 'fail').length;
  const securityWarnings = securityChecks.filter(c => c.status === 'warning').length;
  const securityScore = Math.max(0, 100 - (securityFails * 25) - (securityWarnings * 10));

  const complianceIssues = issues.filter(i => i.category === 'compliance').length;
  const complianceScore = Math.max(0, 100 - (complianceIssues * 15));

  return { syntaxScore, securityScore, complianceScore };
};

// Build validation history from real data
const buildHistoryFromRealData = (): ValidationHistory[] => {
  // Group validations by platform and create history entries
  const platformGroups = new Map<string, typeof validationDataset.validations>();

  validationDataset.validations.forEach((v: typeof validationDataset.validations[0]) => {
    const platform = v.platform.toLowerCase() as ValidationPlatform;
    if (!platformGroups.has(platform)) {
      platformGroups.set(platform, []);
    }
    platformGroups.get(platform)!.push(v);
  });

  const history: ValidationHistory[] = [];
  let idx = 0;

  platformGroups.forEach((validations, platform) => {
    const failCount = validations.filter((v: typeof validationDataset.validations[0]) => v.status === 'FAIL').length;
    const warningCount = validations.filter((v: typeof validationDataset.validations[0]) => v.status === 'WARNING').length;
    history.push({
      id: `vh-real-${idx++}`,
      timestamp: validations[0].validation_timestamp,
      platform: platform as ValidationPlatform,
      ruleCount: validations.length,
      issueCount: failCount + warningCount,
      isValid: failCount === 0,
      snippet: `${validations.length} rules validated for ${platform.toUpperCase()}`,
    });
  });

  return history;
};

// Mock validation history - populated with real data
let mockHistory: ValidationHistory[] = buildHistoryFromRealData();

export const validationService = {
  async validateRules(platform: ValidationPlatform, content: string): Promise<ValidationResult> {
    await delay(800);

    if (!content.trim()) {
      return {
        isValid: false,
        platform,
        issues: [{
          id: 'empty-1',
          line: 1,
          severity: 'error',
          category: 'syntax',
          message: 'No rule content provided',
          suggestion: 'Enter firewall rules to validate',
        }],
        syntaxScore: 0,
        securityScore: 0,
        complianceScore: 0,
      };
    }

    let issues: ValidationIssue[] = [];

    // Run platform-specific validation
    switch (platform) {
      case 'aws':
        issues = validateAWSSyntax(content);
        break;
      case 'azure':
        issues = validateAzureSyntax(content);
        break;
      case 'gcp':
        issues = validateGCPSyntax(content);
        break;
      case 'iptables':
        issues = validateIptablesSyntax(content);
        break;
      case 'cisco_asa':
        issues = validateCiscoASASyntax(content);
        break;
      default:
        // Basic validation for other platforms
        if (content.length < 10) {
          issues.push({
            id: 'gen-1',
            line: 1,
            severity: 'warning',
            category: 'syntax',
            message: 'Rule content appears incomplete',
          });
        }
    }

    // Run security checks
    const securityChecks = runSecurityChecks(content);

    // Add security issues from checks
    securityChecks.filter(c => c.status === 'fail' || c.status === 'warning').forEach((check, idx) => {
      issues.push({
        id: `sec-${idx}`,
        line: 0,
        severity: check.severity,
        category: 'security',
        message: check.details || check.description,
        ruleId: check.id,
      });
    });

    const { syntaxScore, securityScore, complianceScore } = calculateScores(issues, securityChecks);
    const hasErrors = issues.some(i => i.severity === 'error');

    // Add to history
    mockHistory.unshift({
      id: `vh-${Date.now()}`,
      timestamp: new Date().toISOString(),
      platform,
      ruleCount: content.split('\n').filter(l => l.trim() && !l.trim().startsWith('#') && !l.trim().startsWith('!')).length,
      issueCount: issues.length,
      isValid: !hasErrors,
      snippet: content.substring(0, 50) + '...',
    });

    return {
      isValid: !hasErrors,
      platform,
      issues,
      syntaxScore,
      securityScore,
      complianceScore,
    };
  },

  async runSecurityAnalysis(content: string): Promise<SecurityCheck[]> {
    await delay(500);
    return runSecurityChecks(content);
  },

  async getValidationHistory(): Promise<ValidationHistory[]> {
    await delay(300);
    return mockHistory.slice(0, 10);
  },

  async clearHistory(): Promise<void> {
    await delay(200);
    mockHistory = buildHistoryFromRealData();
  },

  // Get all pre-validated rules from dataset
  async getPreValidatedRules(): Promise<PreValidatedRule[]> {
    await delay(300);
    return validationDataset.validations as PreValidatedRule[];
  },

  // Get validation summary statistics
  async getValidationSummary(): Promise<typeof validationDataset.validation_summary> {
    await delay(200);
    return validationDataset.validation_summary;
  },
};
