/**
 * L1 Whitelisting Service
 * Handles ticket parsing, firewall path analysis, rule generation, and conflict detection
 */

import type {
  L1WhitelistingTicket,
  ParsedTicketData,
  FirewallInPath,
  RuleRecommendation,
  ConflictCheck,
  RuleConflict,
  RuleWarning,
  Environment,
  RiskAssessment,
  ApprovalStep,
} from '../types/tickets';

/**
 * Parse ServiceNow ticket and extract firewall rule requirements
 */
export const parseServiceNowTicket = async (_ticketId: string): Promise<ParsedTicketData> => {
  // Simulate AI parsing of ServiceNow ticket
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Mock parsed data based on ticket ID patterns
  const mockData: ParsedTicketData = {
    sourceIp: '10.100.5.0/24',
    destinationIp: '172.16.20.50',
    port: '443',
    protocol: 'tcp',
    environment: 'production',
    description: 'Allow HTTPS traffic from application servers to database endpoint',
    businessJustification: 'Required for new microservice deployment to access production database',
  };

  return mockData;
};

/**
 * Determine firewalls and security groups in the traffic path
 */
export const determineFirewallsInPath = async (
  _sourceIp: string,
  _destinationIp: string,
  environment: Environment
): Promise<FirewallInPath[]> => {
  // Simulate path analysis
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const firewalls: FirewallInPath[] = [];

  // Add firewalls based on environment
  if (environment === 'production') {
    firewalls.push(
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
        managementUrl: 'https://console.aws.amazon.com/ec2/v2/home?region=us-east-1#SecurityGroups',
      },
      {
        id: 'nsg-db-tier-prod',
        name: 'Database NSG - Production',
        type: 'nsg',
        platform: 'azure',
        location: 'eastus',
        zone: 'vnet-prod-001',
        managementUrl: 'https://portal.azure.com/#resource/subscriptions/.../networkSecurityGroups/nsg-db-tier-prod',
      }
    );
  } else if (environment === 'uat') {
    firewalls.push(
      {
        id: 'fw-uat-edge-01',
        name: 'UAT Edge Firewall',
        type: 'firewall',
        platform: 'onprem',
        location: 'DC-US-EAST-1',
        managementUrl: 'https://fw-uat-edge-01.company.com',
      },
      {
        id: 'sg-uat-9z8y7x6w5v',
        name: 'UAT Security Group',
        type: 'security_group',
        platform: 'aws',
        location: 'us-east-1',
        zone: 'vpc-uat-001',
      }
    );
  } else {
    firewalls.push(
      {
        id: 'fw-dev-edge-01',
        name: 'Development Edge Firewall',
        type: 'firewall',
        platform: 'onprem',
        location: 'DC-US-WEST-1',
        managementUrl: 'https://fw-dev-edge-01.company.com',
      }
    );
  }

  return firewalls;
};

/**
 * Generate platform-specific rule recommendations
 */
export const generateRuleRecommendations = async (
  parsedData: ParsedTicketData,
  firewalls: FirewallInPath[]
): Promise<RuleRecommendation[]> => {
  await new Promise((resolve) => setTimeout(resolve, 800));

  const recommendations: RuleRecommendation[] = firewalls.map((fw) => {
    const baseRule = {
      source: parsedData.sourceIp,
      destination: parsedData.destinationIp,
      port: parsedData.port,
      protocol: parsedData.protocol,
      action: 'allow' as const,
    };

    let syntax = '';

    switch (fw.platform) {
      case 'aws':
        syntax = `{
  "IpProtocol": "${parsedData.protocol}",
  "FromPort": ${parsedData.port},
  "ToPort": ${parsedData.port},
  "IpRanges": [{ "CidrIp": "${parsedData.sourceIp}" }],
  "Description": "${parsedData.description}"
}`;
        break;

      case 'azure':
        syntax = `{
  "name": "Allow-${parsedData.port}-Inbound",
  "protocol": "${parsedData.protocol.toUpperCase()}",
  "sourceAddressPrefix": "${parsedData.sourceIp}",
  "destinationAddressPrefix": "${parsedData.destinationIp}",
  "destinationPortRange": "${parsedData.port}",
  "access": "Allow",
  "priority": 100,
  "direction": "Inbound"
}`;
        break;

      case 'gcp':
        syntax = `{
  "name": "allow-${parsedData.protocol}-${parsedData.port}",
  "network": "default",
  "sourceRanges": ["${parsedData.sourceIp}"],
  "allowed": [{
    "IPProtocol": "${parsedData.protocol}",
    "ports": ["${parsedData.port}"]
  }]
}`;
        break;

      case 'onprem':
        syntax = `access-list ${fw.id} extended permit ${parsedData.protocol} ${parsedData.sourceIp} ${parsedData.destinationIp} eq ${parsedData.port}`;
        break;
    }

    return {
      firewallId: fw.id,
      firewallName: fw.name,
      ruleType: fw.type,
      rule: baseRule,
      syntax,
      platform: fw.platform,
    };
  });

  return recommendations;
};

/**
 * Perform conflict detection against existing rules
 */
export const performConflictCheck = async (
  parsedData: ParsedTicketData,
  environment: Environment
): Promise<ConflictCheck> => {
  await new Promise((resolve) => setTimeout(resolve, 1200));

  const conflicts: RuleConflict[] = [];
  const warnings: RuleWarning[] = [];

  // Simulate conflict detection
  // Example: Check for shadowing rule
  if (parsedData.sourceIp.includes('10.100')) {
    conflicts.push({
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
    });
  }

  // Check for high-risk ports
  const highRiskPorts = ['22', '23', '3389', '445', '139'];
  if (highRiskPorts.includes(parsedData.port)) {
    warnings.push({
      id: 'warn-001',
      type: 'high_risk_port',
      severity: 'high',
      message: `Port ${parsedData.port} is commonly targeted by attackers`,
    });
  }

  // Check for overly broad rules
  if (parsedData.sourceIp.includes('/8') || parsedData.sourceIp.includes('/16')) {
    warnings.push({
      id: 'warn-002',
      type: 'broad_rule',
      severity: 'medium',
      message: 'Source IP range is very broad - consider narrowing the scope',
    });
  }

  // Check environment crossing
  if (environment === 'production' && parsedData.sourceIp.includes('10.200')) {
    warnings.push({
      id: 'warn-003',
      type: 'cross_environment',
      severity: 'high',
      message: 'Production access from non-production network detected',
    });
  }

  return {
    hasConflicts: conflicts.length > 0,
    conflicts,
    warnings,
  };
};

/**
 * Calculate risk assessment for the proposed rule
 */
export const calculateRiskScore = (
  parsedData: ParsedTicketData,
  conflictCheck: ConflictCheck,
  environment: Environment
): RiskAssessment => {
  let score = 20; // Base score
  const factors: RiskAssessment['factors'] = [];

  // Environment factor
  if (environment === 'production') {
    score += 15;
    factors.push({
      name: 'Production Environment',
      impact: 'negative',
      weight: 15,
      description: 'Changes to production carry higher risk',
    });
  } else if (environment === 'uat') {
    score += 8;
    factors.push({
      name: 'UAT Environment',
      impact: 'negative',
      weight: 8,
      description: 'UAT environment changes require careful testing',
    });
  } else {
    factors.push({
      name: 'Development Environment',
      impact: 'positive',
      weight: -5,
      description: 'Development environment has lower risk',
    });
  }

  // Conflict factors
  conflictCheck.conflicts.forEach((conflict) => {
    const conflictWeight = conflict.severity === 'critical' ? 25 : conflict.severity === 'high' ? 18 : conflict.severity === 'medium' ? 12 : 6;
    score += conflictWeight;
    factors.push({
      name: `Rule ${conflict.type}`,
      impact: 'negative',
      weight: conflictWeight,
      description: conflict.message,
    });
  });

  // Warning factors
  conflictCheck.warnings.forEach((warning) => {
    const warningWeight = warning.severity === 'high' ? 12 : warning.severity === 'medium' ? 7 : 3;
    score += warningWeight;
    factors.push({
      name: warning.type.replace(/_/g, ' '),
      impact: 'negative',
      weight: warningWeight,
      description: warning.message,
    });
  });

  // Port-specific factors
  const wellKnownPorts = ['80', '443', '22', '3389'];
  if (wellKnownPorts.includes(parsedData.port)) {
    factors.push({
      name: 'Well-known port',
      impact: 'neutral',
      weight: 0,
      description: 'Standard service port',
    });
  }

  // Determine risk level
  let level: RiskAssessment['level'];
  let recommendation: string;

  if (score >= 70) {
    level = 'critical';
    recommendation = 'Critical risk - Requires security team review and change advisory board approval';
  } else if (score >= 50) {
    level = 'high';
    recommendation = 'High risk - Requires senior approval and detailed testing plan';
  } else if (score >= 30) {
    level = 'medium';
    recommendation = 'Medium risk - Standard approval process with peer review';
  } else {
    level = 'low';
    recommendation = 'Low risk - Can proceed with standard L1 approval';
  }

  return {
    score: Math.min(score, 100),
    level,
    factors,
    recommendation,
  };
};

/**
 * Process a ServiceNow ticket for L1 Whitelisting
 */
export const processL1WhitelistingTicket = async (
  serviceNowId: string,
  mode: 'manual' | 'automatic'
): Promise<L1WhitelistingTicket> => {
  // Step 1: Parse ticket
  const parsedData = await parseServiceNowTicket(serviceNowId);

  // Step 2: Determine firewalls in path
  const firewallsInPath = await determineFirewallsInPath(
    parsedData.sourceIp,
    parsedData.destinationIp,
    parsedData.environment
  );

  // Step 3: Generate rule recommendations
  const recommendations = await generateRuleRecommendations(parsedData, firewallsInPath);

  // Step 4: Perform conflict check
  const conflictCheck = await performConflictCheck(parsedData, parsedData.environment);

  // Step 5: Calculate risk assessment
  const riskAssessment = calculateRiskScore(parsedData, conflictCheck, parsedData.environment);

  // Step 6: Create approval chain
  const approvalChain: ApprovalStep[] = [
    {
      id: 'step-1',
      name: 'L1 Engineer Review',
      approver: 'L1 Operations Team',
      status: 'pending',
    },
  ];

  if (riskAssessment.level === 'high' || riskAssessment.level === 'critical') {
    approvalChain.push({
      id: 'step-2',
      name: 'Security Team Review',
      approver: 'Security Operations',
      status: 'pending',
    });
  }

  if (parsedData.environment === 'production') {
    approvalChain.push({
      id: 'step-3',
      name: 'Change Advisory Board',
      approver: 'CAB Team',
      status: 'pending',
    });
  }

  const ticket: L1WhitelistingTicket = {
    id: `L1-${Date.now()}`,
    serviceNowId,
    status: 'analyzed',
    mode,
    parsedData,
    firewallsInPath,
    recommendations,
    riskAssessment,
    conflictCheck,
    approvalChain,
    rollbackAvailable: true,
    rollbackPlan: 'Automated rollback available - rules will be removed in reverse order of implementation',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'system',
  };

  return ticket;
};

/**
 * Approve and implement L1 Whitelisting ticket
 */
export const implementL1WhitelistingTicket = async (
  _ticketId: string,
  _approvedBy: string
): Promise<void> => {
  // Simulate implementation process
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // In a real implementation, this would:
  // 1. Update ticket status to 'implementing'
  // 2. Apply rules to each firewall in sequence
  // 3. Verify rule application
  // 4. Update ServiceNow ticket
  // 5. Set status to 'completed'
};

/**
 * Rollback implemented rules
 */
export const rollbackL1WhitelistingTicket = async (_ticketId: string): Promise<void> => {
  // Simulate rollback process
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // In a real implementation, this would:
  // 1. Retrieve implemented rules
  // 2. Remove rules in reverse order
  // 3. Verify removal
  // 4. Update ticket status to 'rolled_back'
  // 5. Update ServiceNow
};
