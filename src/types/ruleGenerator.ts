/**
 * Rule Generator type definitions
 */

export type Platform = 'aws' | 'azure' | 'gcp' | 'palo_alto' | 'cisco_asa' | 'fortinet' | 'iptables';

export type Protocol = 'tcp' | 'udp' | 'icmp' | 'any';

export type RuleAction = 'allow' | 'deny';

export interface RuleInput {
  name: string;
  description: string;
  sourceIp: string;
  destinationIp: string;
  port: string;
  protocol: Protocol;
  action: RuleAction;
  direction: 'inbound' | 'outbound' | 'both';
  priority?: number;
  tags?: Record<string, string>;
}

export interface GeneratedRule {
  platform: Platform;
  syntax: string;
  isValid: boolean;
  validationErrors?: string[];
  warnings?: string[];
}

export interface RuleTemplate {
  id: string;
  name: string;
  description: string;
  category: 'web' | 'database' | 'application' | 'management' | 'security' | 'custom';
  input: RuleInput;
  platforms: Platform[];
}

export interface PlatformInfo {
  id: Platform;
  name: string;
  category: 'cloud' | 'firewall' | 'linux';
  icon: string;
  description: string;
  syntaxExample: string;
}

export interface RuleGeneratorState {
  input: RuleInput;
  selectedPlatforms: Platform[];
  generatedRules: GeneratedRule[];
  templates: RuleTemplate[];
  isGenerating: boolean;
  error: string | null;
}

export const DEFAULT_RULE_INPUT: RuleInput = {
  name: '',
  description: '',
  sourceIp: '',
  destinationIp: '',
  port: '',
  protocol: 'tcp',
  action: 'allow',
  direction: 'inbound',
};

export const PLATFORM_INFO: Record<Platform, PlatformInfo> = {
  aws: {
    id: 'aws',
    name: 'AWS Security Group',
    category: 'cloud',
    icon: 'aws',
    description: 'Amazon Web Services Security Groups',
    syntaxExample: 'aws ec2 authorize-security-group-ingress ...',
  },
  azure: {
    id: 'azure',
    name: 'Azure NSG',
    category: 'cloud',
    icon: 'azure',
    description: 'Azure Network Security Groups',
    syntaxExample: 'az network nsg rule create ...',
  },
  gcp: {
    id: 'gcp',
    name: 'GCP Firewall',
    category: 'cloud',
    icon: 'gcp',
    description: 'Google Cloud Platform Firewall Rules',
    syntaxExample: 'gcloud compute firewall-rules create ...',
  },
  palo_alto: {
    id: 'palo_alto',
    name: 'Palo Alto',
    category: 'firewall',
    icon: 'firewall',
    description: 'Palo Alto Networks PAN-OS',
    syntaxExample: 'set rulebase security rules ...',
  },
  cisco_asa: {
    id: 'cisco_asa',
    name: 'Cisco ASA',
    category: 'firewall',
    icon: 'firewall',
    description: 'Cisco Adaptive Security Appliance',
    syntaxExample: 'access-list outside_access_in extended ...',
  },
  fortinet: {
    id: 'fortinet',
    name: 'Fortinet FortiGate',
    category: 'firewall',
    icon: 'firewall',
    description: 'Fortinet FortiGate Firewall',
    syntaxExample: 'config firewall policy ...',
  },
  iptables: {
    id: 'iptables',
    name: 'Linux iptables',
    category: 'linux',
    icon: 'linux',
    description: 'Linux iptables/nftables',
    syntaxExample: 'iptables -A INPUT -p tcp ...',
  },
};
