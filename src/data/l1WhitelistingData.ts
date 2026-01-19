/**
 * Mock data for L1 Whitelisting feature
 */

import type { L1WhitelistingTicket } from '../types/tickets';

export const mockL1WhitelistingTickets: L1WhitelistingTicket[] = [
  {
    id: 'L1-1705847230001',
    serviceNowId: 'CHG0012345',
    status: 'completed',
    mode: 'automatic',
    parsedData: {
      sourceIp: '10.100.5.0/24',
      destinationIp: '172.16.20.50',
      port: '443',
      protocol: 'tcp',
      environment: 'production',
      description: 'Allow HTTPS traffic from application servers to database endpoint',
      businessJustification: 'Required for new microservice deployment to access production database',
    },
    firewallsInPath: [
      {
        id: 'fw-prod-edge-01',
        name: 'Production Edge Firewall',
        type: 'firewall',
        platform: 'onprem',
        location: 'DC-US-EAST-1',
        managementUrl: 'https://fw-prod-edge-01.company.com',
      },
      {
        id: 'sg-0a1b2c3d4e5f',
        name: 'App-Tier Security Group',
        type: 'security_group',
        platform: 'aws',
        location: 'us-east-1',
        zone: 'vpc-12345678',
      },
    ],
    recommendations: [
      {
        firewallId: 'fw-prod-edge-01',
        firewallName: 'Production Edge Firewall',
        ruleType: 'firewall',
        rule: {
          source: '10.100.5.0/24',
          destination: '172.16.20.50',
          port: '443',
          protocol: 'tcp',
          action: 'allow',
        },
        syntax: 'access-list fw-prod-edge-01 extended permit tcp 10.100.5.0/24 172.16.20.50 eq 443',
        platform: 'onprem',
      },
      {
        firewallId: 'sg-0a1b2c3d4e5f',
        firewallName: 'App-Tier Security Group',
        ruleType: 'security_group',
        rule: {
          source: '10.100.5.0/24',
          destination: '172.16.20.50',
          port: '443',
          protocol: 'tcp',
          action: 'allow',
        },
        syntax: '{\n  "IpProtocol": "tcp",\n  "FromPort": 443,\n  "ToPort": 443,\n  "IpRanges": [{ "CidrIp": "10.100.5.0/24" }]\n}',
        platform: 'aws',
      },
    ],
    riskAssessment: {
      score: 35,
      level: 'medium',
      factors: [
        {
          name: 'Production Environment',
          impact: 'negative',
          weight: 15,
          description: 'Changes to production carry higher risk',
        },
        {
          name: 'Well-known port',
          impact: 'neutral',
          weight: 0,
          description: 'Standard HTTPS port',
        },
      ],
      recommendation: 'Medium risk - Standard approval process with peer review',
    },
    conflictCheck: {
      hasConflicts: false,
      conflicts: [],
      warnings: [],
    },
    approvalChain: [
      {
        id: 'step-1',
        name: 'L1 Engineer Review',
        approver: 'John Smith',
        status: 'approved',
        timestamp: '2026-01-18T14:30:00Z',
        comments: 'Verified rule details and business justification',
      },
      {
        id: 'step-2',
        name: 'Change Advisory Board',
        approver: 'CAB Team',
        status: 'approved',
        timestamp: '2026-01-18T15:45:00Z',
        comments: 'Approved for implementation during next change window',
      },
    ],
    rollbackAvailable: true,
    rollbackPlan: 'Automated rollback available - rules will be removed in reverse order',
    createdAt: '2026-01-18T14:00:00Z',
    updatedAt: '2026-01-18T16:30:00Z',
    completedAt: '2026-01-18T16:30:00Z',
    createdBy: 'system',
    approvedBy: 'CAB Team',
  },
  {
    id: 'L1-1705847230002',
    serviceNowId: 'CHG0012346',
    status: 'pending_approval',
    mode: 'automatic',
    parsedData: {
      sourceIp: '192.168.10.0/24',
      destinationIp: '10.50.100.25',
      port: '22',
      protocol: 'tcp',
      environment: 'production',
      description: 'SSH access from jump server to production web servers',
      businessJustification: 'Required for emergency maintenance access',
    },
    firewallsInPath: [
      {
        id: 'fw-prod-dmz-01',
        name: 'Production DMZ Firewall',
        type: 'firewall',
        platform: 'onprem',
        location: 'DC-US-EAST-1',
        managementUrl: 'https://fw-prod-dmz-01.company.com',
      },
      {
        id: 'nsg-web-tier-prod',
        name: 'Web Tier NSG - Production',
        type: 'nsg',
        platform: 'azure',
        location: 'eastus',
        zone: 'vnet-prod-001',
      },
    ],
    recommendations: [
      {
        firewallId: 'fw-prod-dmz-01',
        firewallName: 'Production DMZ Firewall',
        ruleType: 'firewall',
        rule: {
          source: '192.168.10.0/24',
          destination: '10.50.100.25',
          port: '22',
          protocol: 'tcp',
          action: 'allow',
        },
        syntax: 'access-list fw-prod-dmz-01 extended permit tcp 192.168.10.0/24 10.50.100.25 eq 22',
        platform: 'onprem',
      },
      {
        firewallId: 'nsg-web-tier-prod',
        firewallName: 'Web Tier NSG - Production',
        ruleType: 'nsg',
        rule: {
          source: '192.168.10.0/24',
          destination: '10.50.100.25',
          port: '22',
          protocol: 'tcp',
          action: 'allow',
          priority: 100,
        },
        syntax: '{\n  "name": "Allow-22-Inbound",\n  "protocol": "TCP",\n  "sourceAddressPrefix": "192.168.10.0/24",\n  "destinationPortRange": "22",\n  "access": "Allow"\n}',
        platform: 'azure',
      },
    ],
    riskAssessment: {
      score: 58,
      level: 'high',
      factors: [
        {
          name: 'Production Environment',
          impact: 'negative',
          weight: 15,
          description: 'Changes to production carry higher risk',
        },
        {
          name: 'high risk port',
          impact: 'negative',
          weight: 12,
          description: 'Port 22 is commonly targeted by attackers',
        },
      ],
      recommendation: 'High risk - Requires senior approval and detailed testing plan',
    },
    conflictCheck: {
      hasConflicts: false,
      conflicts: [],
      warnings: [
        {
          id: 'warn-001',
          type: 'high_risk_port',
          severity: 'high',
          message: 'Port 22 is commonly targeted by attackers',
        },
      ],
    },
    approvalChain: [
      {
        id: 'step-1',
        name: 'L1 Engineer Review',
        approver: 'L1 Operations Team',
        status: 'pending',
      },
      {
        id: 'step-2',
        name: 'Security Team Review',
        approver: 'Security Operations',
        status: 'pending',
      },
      {
        id: 'step-3',
        name: 'Change Advisory Board',
        approver: 'CAB Team',
        status: 'pending',
      },
    ],
    rollbackAvailable: true,
    rollbackPlan: 'Automated rollback available - rules will be removed in reverse order',
    createdAt: '2026-01-19T09:15:00Z',
    updatedAt: '2026-01-19T09:15:00Z',
    createdBy: 'system',
  },
  {
    id: 'L1-1705847230003',
    serviceNowId: 'CHG0012347',
    status: 'analyzed',
    mode: 'manual',
    parsedData: {
      sourceIp: '10.200.15.0/24',
      destinationIp: '172.31.50.100',
      port: '3306',
      protocol: 'tcp',
      environment: 'uat',
      description: 'MySQL access from UAT application to database',
      businessJustification: 'Testing new database connection for upcoming release',
    },
    firewallsInPath: [
      {
        id: 'fw-uat-edge-01',
        name: 'UAT Edge Firewall',
        type: 'firewall',
        platform: 'onprem',
        location: 'DC-US-EAST-1',
        managementUrl: 'https://fw-uat-edge-01.company.com',
      },
      {
        id: 'sg-uat-db-9z8y7x6w',
        name: 'UAT Database Security Group',
        type: 'security_group',
        platform: 'aws',
        location: 'us-east-1',
        zone: 'vpc-uat-001',
      },
    ],
    recommendations: [
      {
        firewallId: 'fw-uat-edge-01',
        firewallName: 'UAT Edge Firewall',
        ruleType: 'firewall',
        rule: {
          source: '10.200.15.0/24',
          destination: '172.31.50.100',
          port: '3306',
          protocol: 'tcp',
          action: 'allow',
        },
        syntax: 'access-list fw-uat-edge-01 extended permit tcp 10.200.15.0/24 172.31.50.100 eq 3306',
        platform: 'onprem',
      },
      {
        firewallId: 'sg-uat-db-9z8y7x6w',
        firewallName: 'UAT Database Security Group',
        ruleType: 'security_group',
        rule: {
          source: '10.200.15.0/24',
          destination: '172.31.50.100',
          port: '3306',
          protocol: 'tcp',
          action: 'allow',
        },
        syntax: '{\n  "IpProtocol": "tcp",\n  "FromPort": 3306,\n  "ToPort": 3306,\n  "IpRanges": [{ "CidrIp": "10.200.15.0/24" }]\n}',
        platform: 'aws',
      },
    ],
    riskAssessment: {
      score: 28,
      level: 'low',
      factors: [
        {
          name: 'UAT Environment',
          impact: 'negative',
          weight: 8,
          description: 'UAT environment changes require careful testing',
        },
      ],
      recommendation: 'Low risk - Can proceed with standard L1 approval',
    },
    conflictCheck: {
      hasConflicts: false,
      conflicts: [],
      warnings: [],
    },
    approvalChain: [
      {
        id: 'step-1',
        name: 'L1 Engineer Review',
        approver: 'L1 Operations Team',
        status: 'pending',
      },
    ],
    rollbackAvailable: true,
    rollbackPlan: 'Automated rollback available - rules will be removed in reverse order',
    createdAt: '2026-01-19T10:30:00Z',
    updatedAt: '2026-01-19T10:30:00Z',
    createdBy: 'system',
  },
  {
    id: 'L1-1705847230004',
    serviceNowId: 'CHG0012348',
    status: 'implementing',
    mode: 'automatic',
    parsedData: {
      sourceIp: '10.100.0.0/16',
      destinationIp: '172.16.0.0/16',
      port: '80',
      protocol: 'tcp',
      environment: 'production',
      description: 'HTTP traffic from internal network to application tier',
      businessJustification: 'Legacy application access requirement',
    },
    firewallsInPath: [
      {
        id: 'fw-prod-core-01',
        name: 'Production Core Firewall',
        type: 'firewall',
        platform: 'onprem',
        location: 'DC-US-EAST-1',
      },
    ],
    recommendations: [
      {
        firewallId: 'fw-prod-core-01',
        firewallName: 'Production Core Firewall',
        ruleType: 'firewall',
        rule: {
          source: '10.100.0.0/16',
          destination: '172.16.0.0/16',
          port: '80',
          protocol: 'tcp',
          action: 'allow',
        },
        syntax: 'access-list fw-prod-core-01 extended permit tcp 10.100.0.0/16 172.16.0.0/16 eq 80',
        platform: 'onprem',
      },
    ],
    riskAssessment: {
      score: 52,
      level: 'high',
      factors: [
        {
          name: 'Production Environment',
          impact: 'negative',
          weight: 15,
          description: 'Changes to production carry higher risk',
        },
        {
          name: 'broad rule',
          impact: 'negative',
          weight: 7,
          description: 'Source IP range is very broad - consider narrowing the scope',
        },
        {
          name: 'Rule shadowing',
          impact: 'negative',
          weight: 12,
          description: 'Existing deny rule may shadow this allow rule',
        },
      ],
      recommendation: 'High risk - Requires senior approval and detailed testing plan',
    },
    conflictCheck: {
      hasConflicts: true,
      conflicts: [
        {
          id: 'conflict-001',
          type: 'shadowing',
          severity: 'medium',
          existingRule: {
            id: 'rule-12345',
            source: '10.100.0.0/16',
            destination: 'any',
            port: 'any',
            action: 'deny',
          },
          message: 'Existing deny rule may shadow this allow rule',
          recommendation: 'Review rule priority or modify existing rule scope',
        },
      ],
      warnings: [
        {
          id: 'warn-002',
          type: 'broad_rule',
          severity: 'medium',
          message: 'Source IP range is very broad - consider narrowing the scope',
        },
      ],
    },
    approvalChain: [
      {
        id: 'step-1',
        name: 'L1 Engineer Review',
        approver: 'Sarah Johnson',
        status: 'approved',
        timestamp: '2026-01-19T11:00:00Z',
      },
      {
        id: 'step-2',
        name: 'Security Team Review',
        approver: 'Mike Chen',
        status: 'approved',
        timestamp: '2026-01-19T11:30:00Z',
        comments: 'Approved with recommendation to narrow scope in next iteration',
      },
    ],
    implementationStatus: {
      step: 'Applying rule to Production Core Firewall',
      progress: 75,
      message: 'Verifying rule application...',
    },
    rollbackAvailable: true,
    rollbackPlan: 'Automated rollback available - rules will be removed in reverse order',
    createdAt: '2026-01-19T10:45:00Z',
    updatedAt: '2026-01-19T11:35:00Z',
    createdBy: 'system',
    approvedBy: 'Mike Chen',
  },
];

export const getL1WhitelistingTicketById = (id: string): L1WhitelistingTicket | undefined => {
  return mockL1WhitelistingTickets.find((ticket) => ticket.id === id);
};

export const getL1WhitelistingTicketByServiceNowId = (serviceNowId: string): L1WhitelistingTicket | undefined => {
  return mockL1WhitelistingTickets.find((ticket) => ticket.serviceNowId === serviceNowId);
};
