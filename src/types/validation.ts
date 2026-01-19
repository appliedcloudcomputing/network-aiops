/**
 * Rule Validation Engine type definitions
 */

export type ValidationPlatform = 'aws' | 'azure' | 'gcp' | 'palo_alto' | 'cisco_asa' | 'fortinet' | 'iptables';

export type ValidationSeverity = 'error' | 'warning' | 'info';

export type ValidationCategory = 'syntax' | 'security' | 'best_practice' | 'compliance';

export interface ValidationIssue {
  id: string;
  line: number;
  column?: number;
  severity: ValidationSeverity;
  category: ValidationCategory;
  message: string;
  suggestion?: string;
  ruleId?: string;
}

export interface ValidationResult {
  isValid: boolean;
  platform: ValidationPlatform;
  issues: ValidationIssue[];
  syntaxScore: number;
  securityScore: number;
  complianceScore: number;
  parsedRules?: ParsedRule[];
}

export interface ParsedRule {
  id: string;
  action: 'allow' | 'deny';
  protocol: string;
  sourceIp: string;
  destinationIp: string;
  port: string;
  direction: 'inbound' | 'outbound' | 'both';
  raw: string;
}

export interface ValidationHistory {
  id: string;
  timestamp: string;
  platform: ValidationPlatform;
  ruleCount: number;
  issueCount: number;
  isValid: boolean;
  snippet: string;
}

export interface SecurityCheck {
  id: string;
  name: string;
  description: string;
  category: 'access' | 'exposure' | 'compliance' | 'configuration';
  status: 'pass' | 'fail' | 'warning' | 'skipped';
  severity: ValidationSeverity;
  details?: string;
}

export interface ValidationMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
  dismissible: boolean;
  actionLabel?: string;
  actionUrl?: string;
}

export interface ValidationMetrics {
  totalValidations: number;
  successfulValidations: number;
  failedValidations: number;
  totalIssues: number;
  errorCount: number;
  warningCount: number;
  infoCount: number;
  avgSyntaxScore: number;
  avgSecurityScore: number;
  avgComplianceScore: number;
  topPlatform: ValidationPlatform;
  lastValidation: string;
}

export interface ValidationBestPractice {
  id: string;
  title: string;
  description: string;
  category: ValidationCategory;
  severity: ValidationSeverity;
  examples: {
    bad: string;
    good: string;
    explanation: string;
  };
  platforms: ValidationPlatform[];
}

export interface ValidationDashboardData {
  recentValidations: ValidationHistory[];
  metrics: ValidationMetrics;
  bestPractices: ValidationBestPractice[];
  commonIssues: ValidationIssue[];
  messages: ValidationMessage[];
}

export const PLATFORM_EXAMPLES: Record<ValidationPlatform, string> = {
  aws: `# AWS Security Group Rules (CLI format)
aws ec2 authorize-security-group-ingress \\
  --group-id sg-12345678 \\
  --protocol tcp \\
  --port 443 \\
  --cidr 10.0.0.0/8

aws ec2 authorize-security-group-ingress \\
  --group-id sg-12345678 \\
  --protocol tcp \\
  --port 22 \\
  --cidr 10.0.0.0/8`,

  azure: `# Azure NSG Rules (CLI format)
az network nsg rule create \\
  --resource-group myRG \\
  --nsg-name myNSG \\
  --name Allow-HTTPS \\
  --priority 100 \\
  --direction Inbound \\
  --access Allow \\
  --protocol Tcp \\
  --source-address-prefixes 10.0.0.0/8 \\
  --destination-port-ranges 443`,

  gcp: `# GCP Firewall Rules (gcloud format)
gcloud compute firewall-rules create allow-https \\
  --network=my-vpc \\
  --direction=INGRESS \\
  --action=ALLOW \\
  --rules=tcp:443 \\
  --source-ranges=10.0.0.0/8`,

  palo_alto: `# Palo Alto PAN-OS Rules
set rulebase security rules "Allow-HTTPS" from untrust to trust
set rulebase security rules "Allow-HTTPS" source any
set rulebase security rules "Allow-HTTPS" destination 10.0.0.0/8
set rulebase security rules "Allow-HTTPS" application ssl
set rulebase security rules "Allow-HTTPS" service application-default
set rulebase security rules "Allow-HTTPS" action allow`,

  cisco_asa: `! Cisco ASA Access List
access-list outside_access_in extended permit tcp any host 10.0.0.50 eq 443
access-list outside_access_in extended permit tcp 10.0.0.0 255.0.0.0 any eq 22
access-list outside_access_in extended deny ip any any log`,

  fortinet: `# FortiGate Firewall Policy
config firewall policy
    edit 1
        set name "Allow-HTTPS"
        set srcintf "wan1"
        set dstintf "lan"
        set srcaddr "all"
        set dstaddr "webservers"
        set action accept
        set schedule "always"
        set service "HTTPS"
        set logtraffic all
    next
end`,

  iptables: `# Linux iptables Rules
iptables -A INPUT -p tcp --dport 443 -j ACCEPT
iptables -A INPUT -p tcp --dport 22 -s 10.0.0.0/8 -j ACCEPT
iptables -A INPUT -p tcp --dport 3306 -s 10.1.0.0/16 -j ACCEPT
iptables -A INPUT -j DROP`,
};
