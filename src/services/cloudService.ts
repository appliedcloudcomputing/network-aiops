/**
 * Cloud service - handles cloud resource management operations
 * Uses real data from JSON files
 */

import type {
  CloudProvider,
  CloudOverview,
  VPC,
  Subnet,
  SecurityGroup,
  TransitGateway,
  LoadBalancer,
} from '../types/cloud';

// Import real cloud data
import awsSecurityGroupsData from '../../data/set3a_aws_security_groups.json';
import azureNsgData from '../../data/set3b_azure_nsg.json';
import gcpFirewallData from '../../data/set3c_gcp_firewall.json';

// Transform AWS security groups to SecurityGroup type
const transformAWSSecurityGroups = (): SecurityGroup[] => {
  const groupMap = new Map<string, typeof awsSecurityGroupsData.security_groups[0]>();
  awsSecurityGroupsData.security_groups.forEach(sg => groupMap.set(sg.name, sg));

  const groupedRules = new Map<string, { inbound: typeof awsSecurityGroupsData.rules, outbound: typeof awsSecurityGroupsData.rules }>();

  awsSecurityGroupsData.rules.forEach(rule => {
    if (!groupedRules.has(rule.security_group)) {
      groupedRules.set(rule.security_group, { inbound: [], outbound: [] });
    }
    const group = groupedRules.get(rule.security_group)!;
    if (rule.type === 'Inbound') {
      group.inbound.push(rule);
    } else {
      group.outbound.push(rule);
    }
  });

  return awsSecurityGroupsData.security_groups.map(sg => ({
    id: sg.sg_id,
    name: sg.name,
    description: sg.description,
    vpcId: sg.vpc,
    vpcName: sg.vpc,
    provider: 'aws' as const,
    inboundRules: (groupedRules.get(sg.name)?.inbound || []).map(r => ({
      id: r.rule_id,
      protocol: r.protocol.toLowerCase(),
      portRange: r.port_range,
      source: r.source,
      description: r.description,
    })),
    outboundRules: (groupedRules.get(sg.name)?.outbound || []).map(r => ({
      id: r.rule_id,
      protocol: r.protocol.toLowerCase(),
      portRange: r.port_range,
      source: r.source,
      description: r.description,
    })),
  }));
};

// Transform Azure NSGs to SecurityGroup type
const transformAzureNSGs = (): SecurityGroup[] => {
  const groupedRules = new Map<string, { inbound: typeof azureNsgData.rules, outbound: typeof azureNsgData.rules }>();

  azureNsgData.rules.forEach(rule => {
    const nsgId = rule.destination_asg || 'default';
    if (!groupedRules.has(nsgId)) {
      groupedRules.set(nsgId, { inbound: [], outbound: [] });
    }
    const group = groupedRules.get(nsgId)!;
    if (rule.direction === 'Inbound') {
      group.inbound.push(rule);
    } else {
      group.outbound.push(rule);
    }
  });

  return azureNsgData.network_security_groups.map(nsg => ({
    id: nsg.nsg_id,
    name: nsg.name,
    description: nsg.description,
    vpcId: nsg.resource_group,
    vpcName: nsg.resource_group,
    provider: 'azure' as const,
    inboundRules: azureNsgData.rules
      .filter(r => r.direction === 'Inbound')
      .slice(0, 10)
      .map((r, idx) => ({
        id: `${nsg.nsg_id}-in-${idx}`,
        protocol: r.protocol.toLowerCase(),
        portRange: String(r.port),
        source: r.source_asg,
        description: r.rule_name,
      })),
    outboundRules: azureNsgData.rules
      .filter(r => r.direction === 'Outbound')
      .slice(0, 5)
      .map((r, idx) => ({
        id: `${nsg.nsg_id}-out-${idx}`,
        protocol: r.protocol.toLowerCase(),
        portRange: String(r.port),
        source: r.destination_asg,
        description: r.rule_name,
      })),
  }));
};

// Transform GCP firewall rules to SecurityGroup type
type GCPRule = typeof gcpFirewallData.rules[0];
const transformGCPFirewalls = (): SecurityGroup[] => {
  const groupedRules = new Map<string, GCPRule[]>();

  gcpFirewallData.rules.forEach(rule => {
    if (!groupedRules.has(rule.network)) {
      groupedRules.set(rule.network, []);
    }
    groupedRules.get(rule.network)!.push(rule);
  });

  return gcpFirewallData.networks.map(network => {
    const rules = groupedRules.get(network.name) || [];
    return {
      id: network.network_id,
      name: network.name,
      description: network.description,
      vpcId: network.project,
      vpcName: network.project,
      provider: 'gcp' as const,
      inboundRules: rules
        .filter(r => r.direction === 'INGRESS')
        .slice(0, 10)
        .map((r, idx) => ({
          id: `${network.network_id}-in-${idx}`,
          protocol: r.protocols.split(':')[0] || 'tcp',
          portRange: r.protocols.split(':')[1] || 'all',
          source: r.source_ranges?.join(', ') || r.source_tags?.join(', ') || 'any',
          description: r.rule_name,
        })),
      outboundRules: rules
        .filter(r => r.direction === 'EGRESS')
        .slice(0, 5)
        .map((r, idx) => ({
          id: `${network.network_id}-out-${idx}`,
          protocol: r.protocols.split(':')[0] || 'tcp',
          portRange: r.protocols.split(':')[1] || 'all',
          source: r.target_tags?.join(', ') || 'any',
          description: r.rule_name,
        })),
    };
  });
};

// Build overviews from real data
const mockOverviews: Record<CloudProvider, CloudOverview> = {
  aws: {
    provider: 'aws',
    vpcCount: 5,
    subnetCount: 24,
    securityGroupCount: awsSecurityGroupsData.security_groups.length,
    loadBalancerCount: 8,
    transitGatewayCount: 2,
    totalInstances: 156,
    regions: ['us-east-1', 'us-west-2', 'eu-west-1', 'ap-southeast-1'],
    healthScore: 94,
    issueCount: 3,
    lastSync: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  azure: {
    provider: 'azure',
    vpcCount: azureNsgData.network_security_groups.length,
    subnetCount: 15,
    securityGroupCount: azureNsgData.network_security_groups.length,
    loadBalancerCount: 5,
    transitGatewayCount: 1,
    totalInstances: 89,
    regions: ['eastus', 'westeurope', 'southeastasia'],
    healthScore: 87,
    issueCount: 5,
    lastSync: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
  },
  gcp: {
    provider: 'gcp',
    vpcCount: gcpFirewallData.networks.length,
    subnetCount: 12,
    securityGroupCount: gcpFirewallData.rules.length,
    loadBalancerCount: 4,
    transitGatewayCount: 0,
    totalInstances: 67,
    regions: ['us-central1', 'europe-west1'],
    healthScore: 92,
    issueCount: 2,
    lastSync: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
  },
};

// Mock VPCs (keeping structure, using real VPC names from data)
const mockVPCs: Record<CloudProvider, VPC[]> = {
  aws: [
    { id: 'vpc-prod-us-east-1', name: 'Production VPC US-East-1', cidrBlock: '10.0.0.0/16', region: 'us-east-1', provider: 'aws', status: 'active', isDefault: false, subnetCount: 8, securityGroupCount: awsSecurityGroupsData.security_groups.filter(sg => sg.vpc === 'vpc-prod-us-east-1').length || 15, instanceCount: 45 },
    { id: 'vpc-devops-us-east-1', name: 'DevOps VPC', cidrBlock: '10.80.0.0/16', region: 'us-east-1', provider: 'aws', status: 'active', isDefault: false, subnetCount: 4, securityGroupCount: 8, instanceCount: 23 },
    { id: 'vpc-pci-us-east-1', name: 'PCI-DSS VPC', cidrBlock: '10.90.0.0/16', region: 'us-east-1', provider: 'aws', status: 'active', isDefault: false, subnetCount: 4, securityGroupCount: 6, instanceCount: 12 },
    { id: 'vpc-dmz-01', name: 'DMZ VPC', cidrBlock: '172.16.0.0/16', region: 'us-east-1', provider: 'aws', status: 'active', isDefault: false, subnetCount: 2, securityGroupCount: 10, instanceCount: 8 },
    { id: 'vpc-default', name: 'Default VPC', cidrBlock: '172.31.0.0/16', region: 'us-east-1', provider: 'aws', status: 'active', isDefault: true, subnetCount: 6, securityGroupCount: 8, instanceCount: 68 },
  ],
  azure: azureNsgData.network_security_groups.map((nsg, idx) => ({
    id: `vnet-${nsg.location}-${idx}`,
    name: `${nsg.resource_group} VNet`,
    cidrBlock: `10.${10 + idx}.0.0/16`,
    region: nsg.location,
    provider: 'azure' as const,
    status: 'active' as const,
    isDefault: false,
    subnetCount: 6,
    securityGroupCount: 12,
    instanceCount: 34,
  })),
  gcp: gcpFirewallData.networks.map(network => ({
    id: network.network_id,
    name: network.name,
    cidrBlock: 'auto',
    region: 'us-central1',
    provider: 'gcp' as const,
    status: 'active' as const,
    isDefault: false,
    subnetCount: 8,
    securityGroupCount: gcpFirewallData.rules.filter(r => r.network === network.name).length,
    instanceCount: 45,
  })),
};

// Generate security groups from real data
const mockSecurityGroups: Record<CloudProvider, SecurityGroup[]> = {
  aws: transformAWSSecurityGroups(),
  azure: transformAzureNSGs(),
  gcp: transformGCPFirewalls(),
};

// Mock Load Balancers
const mockLoadBalancers: Record<CloudProvider, LoadBalancer[]> = {
  aws: [
    { id: 'alb-prod-web', name: 'prod-web-alb', type: 'application', scheme: 'internet-facing', state: 'active', dnsName: 'prod-web-alb-123456.us-east-1.elb.amazonaws.com', vpcId: 'vpc-prod-us-east-1', listenerCount: 2, targetGroupCount: 3, healthyTargets: 6, totalTargets: 6 },
    { id: 'nlb-prod-api', name: 'prod-api-nlb', type: 'network', scheme: 'internal', state: 'active', dnsName: 'prod-api-nlb-789012.us-east-1.elb.amazonaws.com', vpcId: 'vpc-prod-us-east-1', listenerCount: 1, targetGroupCount: 1, healthyTargets: 4, totalTargets: 4 },
    { id: 'alb-staging', name: 'staging-alb', type: 'application', scheme: 'internet-facing', state: 'active', dnsName: 'staging-alb-345678.us-west-2.elb.amazonaws.com', vpcId: 'vpc-staging-01', listenerCount: 1, targetGroupCount: 2, healthyTargets: 2, totalTargets: 2 },
  ],
  azure: [
    { id: 'lb-prod-web', name: 'prod-web-lb', type: 'application', scheme: 'internet-facing', state: 'active', dnsName: 'prod-web-lb.eastus.cloudapp.azure.com', vpcId: 'vnet-prod-01', listenerCount: 2, targetGroupCount: 2, healthyTargets: 4, totalTargets: 5 },
    { id: 'lb-prod-internal', name: 'prod-internal-lb', type: 'network', scheme: 'internal', state: 'active', dnsName: 'prod-internal-lb.internal', vpcId: 'vnet-prod-01', listenerCount: 1, targetGroupCount: 1, healthyTargets: 3, totalTargets: 3 },
  ],
  gcp: [
    { id: 'lb-prod', name: 'production-lb', type: 'application', scheme: 'internet-facing', state: 'active', dnsName: '34.120.123.45', vpcId: 'vpc-production', listenerCount: 1, targetGroupCount: 2, healthyTargets: 5, totalTargets: 5 },
  ],
};

// Mock Transit Gateways
const mockTransitGateways: Record<CloudProvider, TransitGateway[]> = {
  aws: [
    {
      id: 'tgw-prod',
      name: 'production-tgw',
      state: 'available',
      routeTables: 3,
      region: 'us-east-1',
      attachments: [
        { id: 'tgw-attach-1', resourceType: 'vpc', resourceId: 'vpc-prod-us-east-1', resourceName: 'Production VPC', state: 'available' },
        { id: 'tgw-attach-2', resourceType: 'vpc', resourceId: 'vpc-devops-us-east-1', resourceName: 'DevOps VPC', state: 'available' },
        { id: 'tgw-attach-3', resourceType: 'vpc', resourceId: 'vpc-pci-us-east-1', resourceName: 'PCI-DSS VPC', state: 'available' },
        { id: 'tgw-attach-4', resourceType: 'vpn', resourceId: 'vpn-onprem', resourceName: 'On-Premises VPN', state: 'available' },
      ],
    },
    {
      id: 'tgw-dr',
      name: 'disaster-recovery-tgw',
      state: 'available',
      routeTables: 1,
      region: 'us-west-2',
      attachments: [
        { id: 'tgw-attach-5', resourceType: 'vpc', resourceId: 'vpc-staging-01', resourceName: 'Staging VPC', state: 'available' },
        { id: 'tgw-attach-6', resourceType: 'peering', resourceId: 'tgw-prod', resourceName: 'Production TGW Peering', state: 'available' },
      ],
    },
  ],
  azure: [
    {
      id: 'vhub-prod',
      name: 'production-virtual-hub',
      state: 'available',
      routeTables: 2,
      region: 'eastus',
      attachments: [
        { id: 'conn-1', resourceType: 'vpc', resourceId: 'vnet-eastus-0', resourceName: 'Production VNet', state: 'available' },
        { id: 'conn-2', resourceType: 'vpc', resourceId: 'vnet-eastus-1', resourceName: 'Development VNet', state: 'available' },
      ],
    },
  ],
  gcp: [],
};

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const cloudService = {
  async getOverview(provider: CloudProvider): Promise<CloudOverview> {
    await delay(300);
    return mockOverviews[provider];
  },

  async getAllOverviews(): Promise<CloudOverview[]> {
    await delay(500);
    return Object.values(mockOverviews);
  },

  async getVPCs(provider: CloudProvider): Promise<VPC[]> {
    await delay(400);
    return mockVPCs[provider] || [];
  },

  async getVPCDetails(provider: CloudProvider, vpcId: string): Promise<VPC | null> {
    await delay(200);
    const vpcs = mockVPCs[provider] || [];
    return vpcs.find(vpc => vpc.id === vpcId) || null;
  },

  async getSubnets(provider: CloudProvider, vpcId: string): Promise<Subnet[]> {
    await delay(300);
    // Generate mock subnets based on VPC
    const vpc = mockVPCs[provider]?.find(v => v.id === vpcId);
    if (!vpc) return [];

    const subnets: Subnet[] = [];
    const azs = provider === 'aws' ? ['a', 'b', 'c'] : provider === 'azure' ? ['1', '2', '3'] : ['a', 'b'];

    for (let i = 0; i < vpc.subnetCount; i++) {
      const isPublic = i < vpc.subnetCount / 2;
      subnets.push({
        id: `${vpcId}-subnet-${i + 1}`,
        name: `${isPublic ? 'public' : 'private'}-subnet-${(i % 3) + 1}`,
        vpcId,
        cidrBlock: `10.${i}.0.0/24`,
        availabilityZone: `${vpc.region}${azs[i % azs.length]}`,
        isPublic,
        availableIps: 250 - Math.floor(Math.random() * 100),
        instanceCount: Math.floor(vpc.instanceCount / vpc.subnetCount),
      });
    }
    return subnets;
  },

  async getSecurityGroups(provider: CloudProvider, vpcId?: string): Promise<SecurityGroup[]> {
    await delay(400);
    let groups = mockSecurityGroups[provider] || [];
    if (vpcId) {
      groups = groups.filter(sg => sg.vpcId === vpcId);
    }
    return groups;
  },

  async getSecurityGroupDetails(provider: CloudProvider, sgId: string): Promise<SecurityGroup | null> {
    await delay(200);
    const groups = mockSecurityGroups[provider] || [];
    return groups.find(sg => sg.id === sgId) || null;
  },

  async getLoadBalancers(provider: CloudProvider): Promise<LoadBalancer[]> {
    await delay(400);
    return mockLoadBalancers[provider] || [];
  },

  async getTransitGateways(provider: CloudProvider): Promise<TransitGateway[]> {
    await delay(400);
    return mockTransitGateways[provider] || [];
  },

  async syncResources(provider: CloudProvider): Promise<{ success: boolean; message: string }> {
    await delay(2000);
    mockOverviews[provider].lastSync = new Date().toISOString();
    return { success: true, message: `Successfully synced ${provider.toUpperCase()} resources` };
  },
};
