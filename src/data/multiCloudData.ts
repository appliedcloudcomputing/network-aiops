/**
 * Mock data for Multi-Cloud Visibility
 * Includes AWS, Azure, GCP, OCI, and On-Premises infrastructure
 */

import type { CloudNetwork, MultiCloudSummary, TransitGateway } from '../types/multiCloudVisibility';

// AWS VPCs
export const awsNetworks: CloudNetwork[] = [
  {
    id: 'vpc-0a1b2c3d4e5f6g7h8',
    name: 'Production VPC',
    provider: 'aws',
    type: 'vpc',
    cidr: ['10.100.0.0/16'],
    region: 'us-east-1',
    status: 'active',
    subnets: [
      {
        id: 'subnet-pub-1a',
        name: 'Public Subnet 1A',
        cidr: '10.100.1.0/24',
        availabilityZone: 'us-east-1a',
        routeTableId: 'rtb-public',
        public: true,
        status: 'active',
        usedIps: 45,
        availableIps: 206,
        resources: [
          { id: 'i-123', name: 'web-server-01', type: 'instance', privateIp: '10.100.1.10', publicIp: '52.94.76.50' },
          { id: 'lb-456', name: 'app-load-balancer', type: 'loadbalancer', privateIp: '10.100.1.20', publicIp: '52.94.76.51' },
        ],
      },
      {
        id: 'subnet-priv-1a',
        name: 'Private Subnet 1A',
        cidr: '10.100.10.0/24',
        availabilityZone: 'us-east-1a',
        routeTableId: 'rtb-private',
        public: false,
        status: 'active',
        usedIps: 82,
        availableIps: 169,
        resources: [
          { id: 'i-789', name: 'app-server-01', type: 'instance', privateIp: '10.100.10.10' },
          { id: 'rds-001', name: 'prod-database', type: 'database', privateIp: '10.100.10.50' },
        ],
      },
    ],
    routeTables: [
      {
        id: 'rtb-public',
        name: 'Public Route Table',
        status: 'active',
        routes: [
          { destination: '10.100.0.0/16', target: 'local', targetType: 'local', status: 'active', propagated: false },
          { destination: '0.0.0.0/0', target: 'igw-12345678', targetType: 'gateway', status: 'active', propagated: false },
          { destination: '10.200.0.0/16', target: 'pcx-azure-peer', targetType: 'peering', status: 'active', propagated: false },
        ],
        associations: [
          { subnetId: 'subnet-pub-1a', subnetName: 'Public Subnet 1A' },
        ],
      },
      {
        id: 'rtb-private',
        name: 'Private Route Table',
        status: 'active',
        routes: [
          { destination: '10.100.0.0/16', target: 'local', targetType: 'local', status: 'active', propagated: false },
          { destination: '0.0.0.0/0', target: 'nat-0abc123', targetType: 'nat', status: 'active', propagated: false },
          { destination: '172.16.0.0/12', target: 'tgw-09876543', targetType: 'transit', status: 'active', propagated: true },
        ],
        associations: [
          { subnetId: 'subnet-priv-1a', subnetName: 'Private Subnet 1A' },
        ],
      },
    ],
    peerings: [
      {
        id: 'pcx-azure-peer',
        name: 'AWS-Azure Peering',
        requesterNetworkId: 'vpc-0a1b2c3d4e5f6g7h8',
        requesterNetworkName: 'Production VPC',
        requesterCidr: '10.100.0.0/16',
        accepterNetworkId: 'vnet-azure-prod',
        accepterNetworkName: 'Azure Production VNet',
        accepterCidr: '10.200.0.0/16',
        status: 'active',
        crossRegion: true,
        crossAccount: false,
      },
    ],
    gateways: [
      {
        id: 'igw-12345678',
        name: 'Production Internet Gateway',
        type: 'internet',
        status: 'active',
        attachedTo: ['vpc-0a1b2c3d4e5f6g7h8'],
      },
      {
        id: 'nat-0abc123',
        name: 'NAT Gateway 1A',
        type: 'nat',
        status: 'active',
        attachedTo: ['subnet-pub-1a'],
        publicIp: '52.94.76.100',
      },
    ],
    firewalls: [],
    securityGroups: [
      {
        id: 'sg-web-tier',
        name: 'Web Tier Security Group',
        type: 'security_group',
        description: 'Security group for web servers',
        status: 'active',
        attachedResources: ['i-123'],
        inboundRules: [
          {
            id: 'sgr-001',
            priority: 100,
            name: 'Allow HTTP',
            direction: 'inbound',
            action: 'allow',
            protocol: 'tcp',
            sourceType: 'cidr',
            source: '0.0.0.0/0',
            destinationType: 'any',
            destination: 'any',
            portRange: '80',
          },
          {
            id: 'sgr-002',
            priority: 110,
            name: 'Allow HTTPS',
            direction: 'inbound',
            action: 'allow',
            protocol: 'tcp',
            sourceType: 'cidr',
            source: '0.0.0.0/0',
            destinationType: 'any',
            destination: 'any',
            portRange: '443',
          },
        ],
        outboundRules: [
          {
            id: 'sgr-out-001',
            priority: 100,
            name: 'Allow All Outbound',
            direction: 'outbound',
            action: 'allow',
            protocol: 'all',
            sourceType: 'any',
            source: 'any',
            destinationType: 'cidr',
            destination: '0.0.0.0/0',
            portRange: 'all',
          },
        ],
      },
    ],
    tags: { Environment: 'Production', Team: 'Platform', CostCenter: 'Engineering' },
    createdAt: '2024-01-15T10:00:00Z',
    lastModified: '2026-01-19T14:30:00Z',
  },
];

// Azure VNets
export const azureNetworks: CloudNetwork[] = [
  {
    id: 'vnet-azure-prod',
    name: 'Azure Production VNet',
    provider: 'azure',
    type: 'vnet',
    cidr: ['10.200.0.0/16'],
    region: 'eastus',
    status: 'active',
    subnets: [
      {
        id: 'subnet-web',
        name: 'WebSubnet',
        cidr: '10.200.1.0/24',
        availabilityZone: 'eastus-1',
        routeTableId: 'rt-web',
        public: true,
        status: 'active',
        usedIps: 30,
        availableIps: 221,
        resources: [
          { id: 'vm-web-01', name: 'web-vm-01', type: 'instance', privateIp: '10.200.1.10', publicIp: '13.82.100.50' },
        ],
      },
      {
        id: 'subnet-app',
        name: 'AppSubnet',
        cidr: '10.200.10.0/24',
        availabilityZone: 'eastus-1',
        routeTableId: 'rt-app',
        public: false,
        status: 'active',
        usedIps: 55,
        availableIps: 196,
        resources: [
          { id: 'vm-app-01', name: 'app-vm-01', type: 'instance', privateIp: '10.200.10.10' },
          { id: 'sqldb-01', name: 'sqldb-prod', type: 'database', privateIp: '10.200.10.50' },
        ],
      },
    ],
    routeTables: [
      {
        id: 'rt-web',
        name: 'Web Route Table',
        status: 'active',
        routes: [
          { destination: '10.200.0.0/16', target: 'local', targetType: 'local', status: 'active', propagated: false },
          { destination: '0.0.0.0/0', target: 'internet', targetType: 'gateway', status: 'active', propagated: false },
          { destination: '10.100.0.0/16', target: 'vnet-peering-aws', targetType: 'peering', status: 'active', propagated: false },
        ],
        associations: [
          { subnetId: 'subnet-web', subnetName: 'WebSubnet' },
        ],
      },
    ],
    peerings: [
      {
        id: 'peer-azure-gcp',
        name: 'Azure-GCP Peering',
        requesterNetworkId: 'vnet-azure-prod',
        requesterNetworkName: 'Azure Production VNet',
        requesterCidr: '10.200.0.0/16',
        accepterNetworkId: 'vpc-gcp-prod',
        accepterNetworkName: 'GCP Production VPC',
        accepterCidr: '10.150.0.0/16',
        status: 'active',
        crossRegion: true,
        crossAccount: false,
      },
    ],
    gateways: [
      {
        id: 'vgw-azure-01',
        name: 'Azure Virtual Network Gateway',
        type: 'vpn',
        status: 'active',
        attachedTo: ['vnet-azure-prod'],
        bandwidth: '1 Gbps',
        redundancy: 'ha',
      },
    ],
    firewalls: [
      {
        id: 'azfw-prod-01',
        name: 'Azure Firewall - Production',
        type: 'managed',
        vendor: 'Microsoft',
        status: 'active',
        throughput: '30 Gbps',
        loggingEnabled: true,
        intrusionPrevention: true,
        rules: [
          {
            id: 'fw-rule-001',
            name: 'Allow-Web-Traffic',
            priority: 100,
            action: 'allow',
            source: '0.0.0.0/0',
            destination: '10.200.1.0/24',
            ports: '80,443',
            protocol: 'tcp',
            enabled: true,
          },
          {
            id: 'fw-rule-002',
            name: 'Deny-All-Inbound',
            priority: 65000,
            action: 'deny',
            source: 'any',
            destination: 'any',
            ports: 'any',
            protocol: 'any',
            enabled: true,
          },
        ],
      },
    ],
    securityGroups: [
      {
        id: 'nsg-web',
        name: 'Web NSG',
        type: 'nsg',
        description: 'Network Security Group for web tier',
        status: 'active',
        attachedResources: ['subnet-web'],
        inboundRules: [
          {
            id: 'nsg-in-001',
            priority: 100,
            name: 'Allow-HTTPS',
            direction: 'inbound',
            action: 'allow',
            protocol: 'tcp',
            sourceType: 'cidr',
            source: '0.0.0.0/0',
            destinationType: 'any',
            destination: 'any',
            portRange: '443',
          },
        ],
        outboundRules: [
          {
            id: 'nsg-out-001',
            priority: 100,
            name: 'Allow-All-Outbound',
            direction: 'outbound',
            action: 'allow',
            protocol: 'all',
            sourceType: 'any',
            source: 'any',
            destinationType: 'cidr',
            destination: '0.0.0.0/0',
            portRange: 'all',
          },
        ],
      },
    ],
    tags: { Environment: 'Production', Team: 'Cloud', Owner: 'DevOps' },
    createdAt: '2024-02-10T09:00:00Z',
    lastModified: '2026-01-19T13:15:00Z',
  },
];

// GCP VPCs
export const gcpNetworks: CloudNetwork[] = [
  {
    id: 'vpc-gcp-prod',
    name: 'GCP Production VPC',
    provider: 'gcp',
    type: 'vpc',
    cidr: ['10.150.0.0/16'],
    region: 'us-central1',
    status: 'active',
    subnets: [
      {
        id: 'subnet-gcp-us-central1',
        name: 'us-central1-subnet',
        cidr: '10.150.1.0/24',
        availabilityZone: 'us-central1-a',
        routeTableId: 'default',
        public: false,
        status: 'active',
        usedIps: 25,
        availableIps: 226,
        resources: [
          { id: 'instance-1', name: 'gcp-web-01', type: 'instance', privateIp: '10.150.1.10', publicIp: '35.192.50.25' },
        ],
      },
    ],
    routeTables: [
      {
        id: 'default',
        name: 'Default Route Table',
        status: 'active',
        routes: [
          { destination: '10.150.0.0/16', target: 'local', targetType: 'local', status: 'active', propagated: false },
          { destination: '0.0.0.0/0', target: 'default-internet-gateway', targetType: 'gateway', status: 'active', propagated: false },
        ],
        associations: [
          { subnetId: 'subnet-gcp-us-central1', subnetName: 'us-central1-subnet' },
        ],
      },
    ],
    peerings: [],
    gateways: [
      {
        id: 'default-internet-gateway',
        name: 'Default Internet Gateway',
        type: 'internet',
        status: 'active',
        attachedTo: ['vpc-gcp-prod'],
      },
    ],
    firewalls: [],
    securityGroups: [],
    tags: { environment: 'production', team: 'platform' },
    createdAt: '2024-03-05T11:30:00Z',
    lastModified: '2026-01-18T16:45:00Z',
  },
];

// OCI VCNs
export const ociNetworks: CloudNetwork[] = [
  {
    id: 'vcn-oci-prod',
    name: 'OCI Production VCN',
    provider: 'oci',
    type: 'vcn',
    cidr: ['10.50.0.0/16'],
    region: 'us-ashburn-1',
    status: 'active',
    subnets: [
      {
        id: 'subnet-oci-public',
        name: 'Public Subnet',
        cidr: '10.50.1.0/24',
        availabilityZone: 'AD-1',
        routeTableId: 'rt-public',
        public: true,
        status: 'active',
        usedIps: 15,
        availableIps: 236,
        resources: [],
      },
    ],
    routeTables: [
      {
        id: 'rt-public',
        name: 'Public Route Table',
        status: 'active',
        routes: [
          { destination: '10.50.0.0/16', target: 'local', targetType: 'local', status: 'active', propagated: false },
          { destination: '0.0.0.0/0', target: 'igw-oci', targetType: 'gateway', status: 'active', propagated: false },
        ],
        associations: [
          { subnetId: 'subnet-oci-public', subnetName: 'Public Subnet' },
        ],
      },
    ],
    peerings: [],
    gateways: [
      {
        id: 'igw-oci',
        name: 'OCI Internet Gateway',
        type: 'internet',
        status: 'active',
        attachedTo: ['vcn-oci-prod'],
      },
    ],
    firewalls: [],
    securityGroups: [
      {
        id: 'sl-oci-web',
        name: 'Web Security List',
        type: 'security_group',
        description: 'Security list for web tier',
        status: 'active',
        attachedResources: ['subnet-oci-public'],
        inboundRules: [
          {
            id: 'sl-in-001',
            priority: 1,
            name: 'Allow-SSH',
            direction: 'inbound',
            action: 'allow',
            protocol: 'tcp',
            sourceType: 'cidr',
            source: '0.0.0.0/0',
            destinationType: 'any',
            destination: 'any',
            portRange: '22',
          },
        ],
        outboundRules: [
          {
            id: 'sl-out-001',
            priority: 1,
            name: 'Allow-All',
            direction: 'outbound',
            action: 'allow',
            protocol: 'all',
            sourceType: 'any',
            source: 'any',
            destinationType: 'cidr',
            destination: '0.0.0.0/0',
            portRange: 'all',
          },
        ],
      },
    ],
    tags: { Environment: 'Production' },
    createdAt: '2024-04-12T08:00:00Z',
    lastModified: '2026-01-17T10:20:00Z',
  },
];

// On-Premises Networks
export const onpremNetworks: CloudNetwork[] = [
  {
    id: 'dc-us-east-1',
    name: 'Data Center US-EAST-1',
    provider: 'onprem',
    type: 'vpc',
    cidr: ['172.16.0.0/12'],
    region: 'on-premises',
    status: 'active',
    subnets: [
      {
        id: 'subnet-dmz',
        name: 'DMZ Subnet',
        cidr: '172.16.1.0/24',
        availabilityZone: 'Rack-A',
        routeTableId: 'rt-dmz',
        public: true,
        status: 'active',
        usedIps: 50,
        availableIps: 201,
        resources: [
          { id: 'srv-fw-01', name: 'firewall-01', type: 'other', privateIp: '172.16.1.1' },
        ],
      },
      {
        id: 'subnet-app',
        name: 'Application Subnet',
        cidr: '172.16.10.0/24',
        availabilityZone: 'Rack-B',
        routeTableId: 'rt-internal',
        public: false,
        status: 'active',
        usedIps: 120,
        availableIps: 131,
        resources: [
          { id: 'srv-app-01', name: 'app-server-01', type: 'instance', privateIp: '172.16.10.10' },
        ],
      },
    ],
    routeTables: [
      {
        id: 'rt-dmz',
        name: 'DMZ Route Table',
        status: 'active',
        routes: [
          { destination: '172.16.0.0/12', target: 'local', targetType: 'local', status: 'active', propagated: false },
          { destination: '0.0.0.0/0', target: 'edge-router', targetType: 'gateway', status: 'active', propagated: false },
        ],
        associations: [
          { subnetId: 'subnet-dmz', subnetName: 'DMZ Subnet' },
        ],
      },
    ],
    peerings: [],
    gateways: [
      {
        id: 'vpn-aws-direct-connect',
        name: 'AWS Direct Connect',
        type: 'direct_connect',
        status: 'active',
        attachedTo: ['dc-us-east-1'],
        bandwidth: '10 Gbps',
        redundancy: 'ha',
      },
    ],
    firewalls: [
      {
        id: 'fw-palo-alto-01',
        name: 'Palo Alto NGFW - DC Edge',
        type: 'third_party',
        vendor: 'Palo Alto Networks',
        status: 'active',
        throughput: '40 Gbps',
        loggingEnabled: true,
        intrusionPrevention: true,
        rules: [
          {
            id: 'pa-rule-001',
            name: 'Allow-Internet-Outbound',
            priority: 10,
            action: 'allow',
            source: '172.16.0.0/12',
            destination: 'any',
            ports: '80,443',
            protocol: 'tcp',
            enabled: true,
          },
          {
            id: 'pa-rule-002',
            name: 'Block-High-Risk-Countries',
            priority: 5,
            action: 'deny',
            source: 'high-risk-geoip',
            destination: '172.16.0.0/12',
            ports: 'any',
            protocol: 'any',
            enabled: true,
          },
        ],
      },
    ],
    securityGroups: [],
    tags: { Location: 'US-EAST-1', Tier: 'Production' },
    createdAt: '2020-01-01T00:00:00Z',
    lastModified: '2026-01-19T12:00:00Z',
  },
];

// Transit Gateway
export const transitGateways: TransitGateway[] = [
  {
    id: 'tgw-09876543',
    name: 'Production Transit Gateway',
    provider: 'aws',
    region: 'us-east-1',
    asn: 64512,
    status: 'active',
    attachments: [
      {
        id: 'tgw-attach-vpc-prod',
        name: 'Prod VPC Attachment',
        type: 'vpc',
        transitGatewayId: 'tgw-09876543',
        transitGatewayName: 'Production Transit Gateway',
        networkId: 'vpc-0a1b2c3d4e5f6g7h8',
        networkName: 'Production VPC',
        status: 'active',
        routeTableId: 'tgw-rtb-main',
      },
      {
        id: 'tgw-attach-vpn-onprem',
        name: 'On-Prem VPN Attachment',
        type: 'vpn',
        transitGatewayId: 'tgw-09876543',
        transitGatewayName: 'Production Transit Gateway',
        networkId: 'vpn-connection-001',
        networkName: 'DC US-EAST-1 VPN',
        status: 'active',
        routeTableId: 'tgw-rtb-main',
      },
    ],
    routeTables: [
      {
        id: 'tgw-rtb-main',
        name: 'Main Transit Route Table',
        routes: [
          { destination: '10.100.0.0/16', target: 'tgw-attach-vpc-prod', targetType: 'transit', status: 'active', propagated: true },
          { destination: '172.16.0.0/12', target: 'tgw-attach-vpn-onprem', targetType: 'transit', status: 'active', propagated: true },
        ],
        associations: ['tgw-attach-vpc-prod', 'tgw-attach-vpn-onprem'],
        propagations: ['tgw-attach-vpc-prod', 'tgw-attach-vpn-onprem'],
      },
    ],
  },
];

// Multi-Cloud Summary
export const multiCloudSummary: MultiCloudSummary = {
  totalNetworks: 5,
  totalSubnets: 7,
  totalRouteTables: 7,
  totalPeerings: 2,
  totalGateways: 7,
  totalFirewalls: 2,
  totalSecurityGroups: 4,
  byProvider: {
    aws: {
      networks: 1,
      subnets: 2,
      activeResources: 15,
      regions: ['us-east-1'],
      health: 'healthy',
    },
    azure: {
      networks: 1,
      subnets: 2,
      activeResources: 12,
      regions: ['eastus'],
      health: 'healthy',
    },
    gcp: {
      networks: 1,
      subnets: 1,
      activeResources: 8,
      regions: ['us-central1'],
      health: 'healthy',
    },
    oci: {
      networks: 1,
      subnets: 1,
      activeResources: 5,
      regions: ['us-ashburn-1'],
      health: 'healthy',
    },
    onprem: {
      networks: 1,
      subnets: 2,
      activeResources: 25,
      regions: ['on-premises'],
      health: 'healthy',
    },
  },
};

export const allNetworks = [...awsNetworks, ...azureNetworks, ...gcpNetworks, ...ociNetworks, ...onpremNetworks];
export const multiCloudNetworks = allNetworks;
export const transitGatewayData = transitGateways[0];
