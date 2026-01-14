/**
 * Cloud management type definitions
 */

export type CloudProvider = 'aws' | 'azure' | 'gcp';

export type ResourceStatus = 'active' | 'inactive' | 'error' | 'pending' | 'deleting';

export interface CloudResource {
  id: string;
  name: string;
  type: string;
  status: ResourceStatus;
  region: string;
  provider: CloudProvider;
  createdAt: string;
  tags?: Record<string, string>;
}

export interface VPC {
  id: string;
  name: string;
  cidrBlock: string;
  region: string;
  provider: CloudProvider;
  status: ResourceStatus;
  isDefault: boolean;
  subnetCount: number;
  securityGroupCount: number;
  instanceCount: number;
}

export interface Subnet {
  id: string;
  name: string;
  vpcId: string;
  cidrBlock: string;
  availabilityZone: string;
  isPublic: boolean;
  availableIps: number;
  instanceCount: number;
}

export interface SecurityGroup {
  id: string;
  name: string;
  description: string;
  vpcId: string;
  vpcName: string;
  provider: CloudProvider;
  inboundRules: SecurityRule[];
  outboundRules: SecurityRule[];
}

export interface SecurityRule {
  id: string;
  protocol: string;
  portRange: string;
  source: string;
  description: string;
}

export interface TransitGateway {
  id: string;
  name: string;
  state: 'available' | 'pending' | 'deleting' | 'deleted';
  attachments: TransitGatewayAttachment[];
  routeTables: number;
  region: string;
}

export interface TransitGatewayAttachment {
  id: string;
  resourceType: 'vpc' | 'vpn' | 'direct-connect' | 'peering';
  resourceId: string;
  resourceName: string;
  state: 'available' | 'pending' | 'deleting';
}

export interface LoadBalancer {
  id: string;
  name: string;
  type: 'application' | 'network' | 'classic' | 'gateway';
  scheme: 'internet-facing' | 'internal';
  state: 'active' | 'provisioning' | 'failed';
  dnsName: string;
  vpcId: string;
  listenerCount: number;
  targetGroupCount: number;
  healthyTargets: number;
  totalTargets: number;
}

export interface FirewallRule {
  id: string;
  name: string;
  priority: number;
  direction: 'inbound' | 'outbound';
  action: 'allow' | 'deny';
  protocol: string;
  sourceIp: string;
  destinationIp: string;
  port: string;
  status: 'enabled' | 'disabled';
}

export interface CloudOverview {
  provider: CloudProvider;
  vpcCount: number;
  subnetCount: number;
  securityGroupCount: number;
  loadBalancerCount: number;
  transitGatewayCount: number;
  totalInstances: number;
  regions: string[];
  healthScore: number;
  issueCount: number;
  lastSync: string;
}

export interface CloudFilter {
  provider?: CloudProvider;
  region?: string;
  status?: ResourceStatus;
  search?: string;
}
