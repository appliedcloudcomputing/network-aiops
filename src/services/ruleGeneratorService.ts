/**
 * Rule Generator service - generates firewall rules for multiple platforms
 */

import type { RuleInput, GeneratedRule, Platform, RuleTemplate } from '../types/ruleGenerator';

// Helper to normalize IP addresses/CIDR
const normalizeIp = (ip: string): string => {
  if (!ip || ip === '*' || ip === 'any' || ip === '0.0.0.0/0') {
    return '0.0.0.0/0';
  }
  // Add /32 if no CIDR notation
  if (!ip.includes('/') && !ip.includes('-')) {
    return `${ip}/32`;
  }
  return ip;
};

// Generate AWS Security Group CLI command
const generateAWSRule = (input: RuleInput): string => {
  const { name, sourceIp, destinationIp, port, protocol, action, direction, description } = input;
  const normalizedSource = normalizeIp(sourceIp);
  const normalizedDest = normalizeIp(destinationIp);

  if (action === 'deny') {
    return `# AWS Security Groups do not support explicit deny rules
# Consider using Network ACLs for deny rules
# aws ec2 create-network-acl-entry --network-acl-id <acl-id> \\
#   --rule-number 100 --protocol ${protocol === 'any' ? '-1' : protocol} \\
#   --port-range From=${port},To=${port} --cidr-block ${normalizedSource} \\
#   --rule-action deny --${direction === 'inbound' ? 'ingress' : 'egress'}`;
  }

  const portArg = protocol === 'icmp' ? '' : `--port ${port}`;
  const isIngress = direction === 'inbound' || direction === 'both';

  const commands: string[] = [];

  if (isIngress) {
    commands.push(`# ${name} - ${description || 'Inbound rule'}
aws ec2 authorize-security-group-ingress \\
  --group-id <security-group-id> \\
  --protocol ${protocol === 'any' ? '-1' : protocol} ${portArg} \\
  --cidr ${normalizedSource} \\
  --tag-specifications 'ResourceType=security-group-rule,Tags=[{Key=Name,Value=${name}}]'`);
  }

  if (direction === 'outbound' || direction === 'both') {
    commands.push(`# ${name} - ${description || 'Outbound rule'}
aws ec2 authorize-security-group-egress \\
  --group-id <security-group-id> \\
  --protocol ${protocol === 'any' ? '-1' : protocol} ${portArg} \\
  --cidr ${normalizedDest}`);
  }

  return commands.join('\n\n');
};

// Generate Azure NSG CLI command
const generateAzureRule = (input: RuleInput): string => {
  const { name, sourceIp, destinationIp, port, protocol, action, direction, priority = 100, description } = input;
  const normalizedSource = sourceIp === '*' || !sourceIp ? '*' : normalizeIp(sourceIp);
  const normalizedDest = destinationIp === '*' || !destinationIp ? '*' : normalizeIp(destinationIp);

  return `# ${name} - ${description || 'Azure NSG Rule'}
az network nsg rule create \\
  --resource-group <resource-group-name> \\
  --nsg-name <nsg-name> \\
  --name "${name.replace(/\s+/g, '-')}" \\
  --priority ${priority} \\
  --direction ${direction === 'inbound' ? 'Inbound' : 'Outbound'} \\
  --access ${action === 'allow' ? 'Allow' : 'Deny'} \\
  --protocol ${protocol === 'any' ? '*' : protocol.charAt(0).toUpperCase() + protocol.slice(1)} \\
  --source-address-prefixes "${normalizedSource}" \\
  --source-port-ranges "*" \\
  --destination-address-prefixes "${normalizedDest}" \\
  --destination-port-ranges "${port || '*'}"`;
};

// Generate GCP Firewall rule
const generateGCPRule = (input: RuleInput): string => {
  const { name, sourceIp, port, protocol, action, direction, priority = 1000, description } = input;
  const ruleName = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  const normalizedSource = normalizeIp(sourceIp);

  const portSpec = protocol === 'icmp' ? '' : port ? ` --rules ${protocol}:${port}` : ` --rules ${protocol}`;

  if (action === 'deny') {
    return `# ${name} - ${description || 'GCP Deny Rule'}
gcloud compute firewall-rules create ${ruleName} \\
  --project=<project-id> \\
  --network=<vpc-network> \\
  --priority=${priority} \\
  --direction=${direction === 'inbound' ? 'INGRESS' : 'EGRESS'} \\
  --action=DENY \\
  --source-ranges="${normalizedSource}"${portSpec} \\
  --description="${description || name}"`;
  }

  return `# ${name} - ${description || 'GCP Allow Rule'}
gcloud compute firewall-rules create ${ruleName} \\
  --project=<project-id> \\
  --network=<vpc-network> \\
  --priority=${priority} \\
  --direction=${direction === 'inbound' ? 'INGRESS' : 'EGRESS'} \\
  --action=ALLOW \\
  --source-ranges="${normalizedSource}"${portSpec} \\
  --target-tags=<target-tags> \\
  --description="${description || name}"`;
};

// Generate Palo Alto PAN-OS rule
const generatePaloAltoRule = (input: RuleInput): string => {
  const { name, sourceIp, destinationIp, port, action, description } = input;
  const srcZone = 'untrust';
  const dstZone = 'trust';
  const application = 'any';
  const service = port ? `tcp-${port}` : 'any';

  return `# ${name} - ${description || 'Palo Alto Security Rule'}
set rulebase security rules "${name}" from ${srcZone}
set rulebase security rules "${name}" to ${dstZone}
set rulebase security rules "${name}" source ${sourceIp || 'any'}
set rulebase security rules "${name}" destination ${destinationIp || 'any'}
set rulebase security rules "${name}" application ${application}
set rulebase security rules "${name}" service ${service}
set rulebase security rules "${name}" action ${action}
set rulebase security rules "${name}" log-start yes
set rulebase security rules "${name}" log-end yes
set rulebase security rules "${name}" description "${description || name}"`;
};

// Generate Cisco ASA rule
const generateCiscoASARule = (input: RuleInput): string => {
  const { name, sourceIp, destinationIp, port, protocol, action, direction, description } = input;
  const aclName = direction === 'inbound' ? 'outside_access_in' : 'inside_access_out';
  const sourceHost = sourceIp?.includes('/') ? `${sourceIp.split('/')[0]} ${cidrToNetmask(sourceIp)}` : `host ${sourceIp || 'any'}`;
  const destHost = destinationIp?.includes('/') ? `${destinationIp.split('/')[0]} ${cidrToNetmask(destinationIp)}` : `host ${destinationIp || 'any'}`;
  const portSpec = port ? `eq ${port}` : '';

  return `! ${name} - ${description || 'Cisco ASA Rule'}
access-list ${aclName} extended ${action === 'allow' ? 'permit' : 'deny'} ${protocol} ${sourceHost} ${destHost} ${portSpec}
! Apply to interface (if not already applied)
! access-group ${aclName} in interface outside`;
};

// Generate Fortinet FortiGate rule
const generateFortinetRule = (input: RuleInput): string => {
  const { name, sourceIp, destinationIp, port, action, description } = input;
  const service = port ? `TCP/${port}` : 'ALL';

  return `# ${name} - ${description || 'FortiGate Policy'}
config firewall policy
    edit 0
        set name "${name}"
        set srcintf "wan1"
        set dstintf "lan"
        set srcaddr "${sourceIp || 'all'}"
        set dstaddr "${destinationIp || 'all'}"
        set action ${action}
        set schedule "always"
        set service "${service}"
        set logtraffic all
        set comments "${description || name}"
    next
end`;
};

// Generate Linux iptables rule
const generateIptablesRule = (input: RuleInput): string => {
  const { name, sourceIp, destinationIp, port, protocol, action, direction, description } = input;
  const chain = direction === 'inbound' ? 'INPUT' : 'OUTPUT';
  const target = action === 'allow' ? 'ACCEPT' : 'DROP';

  const sourceArg = sourceIp && sourceIp !== '*' ? `-s ${normalizeIp(sourceIp)}` : '';
  const destArg = destinationIp && destinationIp !== '*' ? `-d ${normalizeIp(destinationIp)}` : '';
  const protoArg = protocol !== 'any' ? `-p ${protocol}` : '';
  const portArg = port && protocol !== 'icmp' && protocol !== 'any' ? `--dport ${port}` : '';

  return `# ${name} - ${description || 'iptables rule'}
iptables -A ${chain} ${protoArg} ${sourceArg} ${destArg} ${portArg} -j ${target} -m comment --comment "${name}"

# For persistent rules, save with:
# iptables-save > /etc/iptables/rules.v4

# Or using nftables equivalent:
# nft add rule inet filter ${chain.toLowerCase()} ${protocol !== 'any' ? `${protocol} ` : ''}${portArg ? `dport ${port} ` : ''}${sourceArg ? `ip saddr ${sourceIp} ` : ''}${destArg ? `ip daddr ${destinationIp} ` : ''}${target.toLowerCase()}`;
};

// Helper: CIDR to netmask
function cidrToNetmask(cidr: string): string {
  const bits = parseInt(cidr.split('/')[1] || '32', 10);
  const mask = ~(2 ** (32 - bits) - 1);
  return [
    (mask >>> 24) & 255,
    (mask >>> 16) & 255,
    (mask >>> 8) & 255,
    mask & 255,
  ].join('.');
}

// Validate rule input
const validateInput = (input: RuleInput): string[] => {
  const errors: string[] = [];

  if (!input.name?.trim()) {
    errors.push('Rule name is required');
  }

  if (input.sourceIp && !/^(\d{1,3}\.){3}\d{1,3}(\/\d{1,2})?$|^\*$|^any$/.test(input.sourceIp)) {
    errors.push('Invalid source IP format');
  }

  if (input.destinationIp && !/^(\d{1,3}\.){3}\d{1,3}(\/\d{1,2})?$|^\*$|^any$/.test(input.destinationIp)) {
    errors.push('Invalid destination IP format');
  }

  if (input.port && !/^\d+(-\d+)?$/.test(input.port)) {
    errors.push('Invalid port format (use single port or range like 80-443)');
  }

  if (input.port) {
    const ports = input.port.split('-').map(Number);
    if (ports.some(p => p < 1 || p > 65535)) {
      errors.push('Port must be between 1 and 65535');
    }
  }

  return errors;
};

// Generate warnings for specific platforms
const generateWarnings = (input: RuleInput, platform: Platform): string[] => {
  const warnings: string[] = [];

  if (platform === 'aws' && input.action === 'deny') {
    warnings.push('AWS Security Groups do not support deny rules. Consider using Network ACLs.');
  }

  if (!input.sourceIp || input.sourceIp === '*' || input.sourceIp === '0.0.0.0/0') {
    warnings.push('Source IP is open to all (0.0.0.0/0). This may pose security risks.');
  }

  if (input.port === '22' && input.action === 'allow' && (!input.sourceIp || input.sourceIp === '0.0.0.0/0')) {
    warnings.push('SSH (port 22) is open to the internet. Restrict source IPs for security.');
  }

  if (input.port === '3389' && input.action === 'allow' && (!input.sourceIp || input.sourceIp === '0.0.0.0/0')) {
    warnings.push('RDP (port 3389) is open to the internet. Restrict source IPs for security.');
  }

  return warnings;
};

// Platform generators map
const platformGenerators: Record<Platform, (input: RuleInput) => string> = {
  aws: generateAWSRule,
  azure: generateAzureRule,
  gcp: generateGCPRule,
  palo_alto: generatePaloAltoRule,
  cisco_asa: generateCiscoASARule,
  fortinet: generateFortinetRule,
  iptables: generateIptablesRule,
};

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const ruleGeneratorService = {
  async generateRules(input: RuleInput, platforms: Platform[]): Promise<GeneratedRule[]> {
    await delay(500);

    const validationErrors = validateInput(input);

    return platforms.map(platform => {
      const warnings = generateWarnings(input, platform);
      const generator = platformGenerators[platform];

      if (validationErrors.length > 0) {
        return {
          platform,
          syntax: '',
          isValid: false,
          validationErrors,
          warnings,
        };
      }

      try {
        const syntax = generator(input);
        return {
          platform,
          syntax,
          isValid: true,
          warnings,
        };
      } catch (error) {
        return {
          platform,
          syntax: '',
          isValid: false,
          validationErrors: [`Failed to generate rule: ${error instanceof Error ? error.message : 'Unknown error'}`],
          warnings,
        };
      }
    });
  },

  async getTemplates(): Promise<RuleTemplate[]> {
    await delay(300);
    return mockTemplates;
  },

  async validateSyntax(_platform: Platform, syntax: string): Promise<{ isValid: boolean; errors: string[] }> {
    await delay(200);
    // Basic syntax validation - platform-specific validation could be added here
    if (!syntax.trim()) {
      return { isValid: false, errors: ['Empty rule syntax'] };
    }
    return { isValid: true, errors: [] };
  },
};

// Mock templates
const mockTemplates: RuleTemplate[] = [
  {
    id: 'web-server-http',
    name: 'Web Server HTTP',
    description: 'Allow HTTP traffic (port 80) to web servers',
    category: 'web',
    input: {
      name: 'Allow-HTTP-Inbound',
      description: 'Allow HTTP traffic from any source',
      sourceIp: '0.0.0.0/0',
      destinationIp: '',
      port: '80',
      protocol: 'tcp',
      action: 'allow',
      direction: 'inbound',
    },
    platforms: ['aws', 'azure', 'gcp', 'palo_alto', 'iptables'],
  },
  {
    id: 'web-server-https',
    name: 'Web Server HTTPS',
    description: 'Allow HTTPS traffic (port 443) to web servers',
    category: 'web',
    input: {
      name: 'Allow-HTTPS-Inbound',
      description: 'Allow HTTPS traffic from any source',
      sourceIp: '0.0.0.0/0',
      destinationIp: '',
      port: '443',
      protocol: 'tcp',
      action: 'allow',
      direction: 'inbound',
    },
    platforms: ['aws', 'azure', 'gcp', 'palo_alto', 'iptables'],
  },
  {
    id: 'ssh-management',
    name: 'SSH Management',
    description: 'Allow SSH access from management network',
    category: 'management',
    input: {
      name: 'Allow-SSH-Management',
      description: 'Allow SSH from management subnet',
      sourceIp: '10.0.0.0/8',
      destinationIp: '',
      port: '22',
      protocol: 'tcp',
      action: 'allow',
      direction: 'inbound',
    },
    platforms: ['aws', 'azure', 'gcp', 'palo_alto', 'cisco_asa', 'fortinet', 'iptables'],
  },
  {
    id: 'database-mysql',
    name: 'MySQL Database',
    description: 'Allow MySQL connections from application tier',
    category: 'database',
    input: {
      name: 'Allow-MySQL-AppTier',
      description: 'Allow MySQL from application servers',
      sourceIp: '10.1.0.0/16',
      destinationIp: '',
      port: '3306',
      protocol: 'tcp',
      action: 'allow',
      direction: 'inbound',
    },
    platforms: ['aws', 'azure', 'gcp', 'palo_alto', 'iptables'],
  },
  {
    id: 'database-postgres',
    name: 'PostgreSQL Database',
    description: 'Allow PostgreSQL connections from application tier',
    category: 'database',
    input: {
      name: 'Allow-PostgreSQL-AppTier',
      description: 'Allow PostgreSQL from application servers',
      sourceIp: '10.1.0.0/16',
      destinationIp: '',
      port: '5432',
      protocol: 'tcp',
      action: 'allow',
      direction: 'inbound',
    },
    platforms: ['aws', 'azure', 'gcp', 'palo_alto', 'iptables'],
  },
  {
    id: 'rdp-management',
    name: 'RDP Management',
    description: 'Allow RDP access from management network',
    category: 'management',
    input: {
      name: 'Allow-RDP-Management',
      description: 'Allow RDP from management subnet',
      sourceIp: '10.0.0.0/8',
      destinationIp: '',
      port: '3389',
      protocol: 'tcp',
      action: 'allow',
      direction: 'inbound',
    },
    platforms: ['aws', 'azure', 'gcp', 'palo_alto', 'cisco_asa', 'fortinet', 'iptables'],
  },
  {
    id: 'deny-all-inbound',
    name: 'Deny All Inbound',
    description: 'Default deny rule for all inbound traffic',
    category: 'security',
    input: {
      name: 'Deny-All-Inbound',
      description: 'Block all inbound traffic by default',
      sourceIp: '0.0.0.0/0',
      destinationIp: '',
      port: '',
      protocol: 'any',
      action: 'deny',
      direction: 'inbound',
    },
    platforms: ['azure', 'gcp', 'palo_alto', 'cisco_asa', 'fortinet', 'iptables'],
  },
  {
    id: 'icmp-ping',
    name: 'Allow ICMP Ping',
    description: 'Allow ICMP echo requests for ping',
    category: 'management',
    input: {
      name: 'Allow-ICMP-Ping',
      description: 'Allow ICMP for network diagnostics',
      sourceIp: '10.0.0.0/8',
      destinationIp: '',
      port: '',
      protocol: 'icmp',
      action: 'allow',
      direction: 'inbound',
    },
    platforms: ['aws', 'azure', 'gcp', 'palo_alto', 'cisco_asa', 'fortinet', 'iptables'],
  },
];
