/**
 * Multi-Cloud Visibility Types
 * Supports: AWS, Azure, GCP, OCI, On-Premises
 */

export type CloudProvider = 'aws' | 'azure' | 'gcp' | 'oci' | 'onprem';
export type ResourceType = 'vpc' | 'vnet' | 'vcn' | 'subnet' | 'route_table' | 'transit_attachment' | 'peering' | 'gateway' | 'firewall' | 'nsg' | 'security_group';
export type ResourceStatus = 'active' | 'inactive' | 'degraded' | 'error' | 'unknown';

// Cloud Network (VPC/VNet/VCN)
export interface CloudNetwork {
  id: string;
  name: string;
  provider: CloudProvider;
  type: 'vpc' | 'vnet' | 'vcn';
  cidr: string[];
  region: string;
  status: ResourceStatus;
  subnets: Subnet[];
  routeTables: RouteTable[];
  peerings: NetworkPeering[];
  gateways: Gateway[];
  firewalls: Firewall[];
  securityGroups: SecurityGroup[];
  tags: Record<string, string>;
  createdAt: string;
  lastModified: string;
}

// Subnet
export interface Subnet {
  id: string;
  name: string;
  cidr: string;
  availabilityZone: string;
  routeTableId: string;
  public: boolean;
  status: ResourceStatus;
  usedIps: number;
  availableIps: number;
  resources: SubnetResource[];
}

export interface SubnetResource {
  id: string;
  name: string;
  type: 'instance' | 'loadbalancer' | 'database' | 'other';
  privateIp: string;
  publicIp?: string;
}

// Route Table
export interface RouteTable {
  id: string;
  name: string;
  routes: Route[];
  associations: RouteAssociation[];
  status: ResourceStatus;
}

export interface Route {
  destination: string;
  target: string;
  targetType: 'local' | 'gateway' | 'peering' | 'transit' | 'nat' | 'instance' | 'blackhole';
  status: 'active' | 'blackhole';
  propagated: boolean;
}

export interface RouteAssociation {
  subnetId: string;
  subnetName: string;
}

// Transit Attachments
export interface TransitAttachment {
  id: string;
  name: string;
  type: 'vpc' | 'vpn' | 'direct_connect' | 'peering';
  transitGatewayId: string;
  transitGatewayName: string;
  networkId: string;
  networkName: string;
  status: ResourceStatus;
  routeTableId?: string;
}

export interface TransitGateway {
  id: string;
  name: string;
  provider: CloudProvider;
  region: string;
  asn: number;
  attachments: TransitAttachment[];
  routeTables: TransitRouteTable[];
  status: ResourceStatus;
}

export interface TransitRouteTable {
  id: string;
  name: string;
  routes: Route[];
  associations: string[];
  propagations: string[];
}

// Network Peering
export interface NetworkPeering {
  id: string;
  name: string;
  requesterNetworkId: string;
  requesterNetworkName: string;
  requesterCidr: string;
  accepterNetworkId: string;
  accepterNetworkName: string;
  accepterCidr: string;
  status: 'active' | 'pending' | 'failed' | 'deleted';
  crossRegion: boolean;
  crossAccount: boolean;
}

// Gateway
export interface Gateway {
  id: string;
  name: string;
  type: 'internet' | 'nat' | 'vpn' | 'direct_connect' | 'virtual' | 'peering';
  status: ResourceStatus;
  attachedTo: string[];
  publicIp?: string;
  bandwidth?: string;
  redundancy?: 'single' | 'ha';
}

// Firewall / NGFW
export interface Firewall {
  id: string;
  name: string;
  type: 'managed' | 'network_firewall' | 'third_party' | 'onprem';
  vendor?: string;
  status: ResourceStatus;
  throughput: string;
  rules: FirewallRule[];
  loggingEnabled: boolean;
  intrusionPrevention: boolean;
}

export interface FirewallRule {
  id: string;
  name: string;
  priority: number;
  action: 'allow' | 'deny' | 'alert';
  source: string;
  destination: string;
  ports: string;
  protocol: string;
  enabled: boolean;
}

// Security Groups / NSG
export interface SecurityGroup {
  id: string;
  name: string;
  type: 'security_group' | 'nsg';
  description: string;
  inboundRules: NetworkSecurityRule[];
  outboundRules: NetworkSecurityRule[];
  attachedResources: string[];
  status: ResourceStatus;
}

export interface NetworkSecurityRule {
  id: string;
  priority: number;
  name: string;
  direction: 'inbound' | 'outbound';
  action: 'allow' | 'deny';
  protocol: string;
  sourceType: 'cidr' | 'security_group' | 'any';
  source: string;
  destinationType: 'cidr' | 'security_group' | 'any';
  destination: string;
  portRange: string;
  description?: string;
}

// Multi-Cloud Summary
export interface MultiCloudSummary {
  totalNetworks: number;
  totalSubnets: number;
  totalRouteTables: number;
  totalPeerings: number;
  totalGateways: number;
  totalFirewalls: number;
  totalSecurityGroups: number;
  byProvider: {
    [key in CloudProvider]: ProviderSummary;
  };
}

export interface ProviderSummary {
  networks: number;
  subnets: number;
  activeResources: number;
  regions: string[];
  health: 'healthy' | 'degraded' | 'critical';
}

// Filters
export interface CloudVisibilityFilters {
  providers: CloudProvider[];
  regions: string[];
  status: ResourceStatus[];
  resourceTypes: ResourceType[];
  searchQuery: string;
}

// Topology View
export interface CloudTopology {
  nodes: TopologyNode[];
  edges: TopologyEdge[];
}

export interface TopologyNode {
  id: string;
  label: string;
  type: ResourceType;
  provider: CloudProvider;
  status: ResourceStatus;
  metadata: Record<string, any>;
}

export interface TopologyEdge {
  id: string;
  source: string;
  target: string;
  type: 'peering' | 'transit' | 'routing' | 'attachment';
  bidirectional: boolean;
  status: ResourceStatus;
}
