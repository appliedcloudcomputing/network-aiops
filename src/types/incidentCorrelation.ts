/**
 * Incident Correlation & Root Cause Analysis Types
 */

export type IncidentSeverity = 'critical' | 'high' | 'medium' | 'low';
export type IncidentStatus = 'active' | 'investigating' | 'resolved' | 'closed';
export type IncidentCategory = 'network' | 'security' | 'performance' | 'availability' | 'configuration' | 'capacity';
export type RootCauseConfidence = 'high' | 'medium' | 'low';

export interface IncidentTimeline {
  timestamp: string;
  event: string;
  source: string;
  severity: IncidentSeverity;
  affectedComponents: string[];
}

export interface CorrelatedEvent {
  id: string;
  timestamp: string;
  source: string;
  message: string;
  severity: IncidentSeverity;
  category: IncidentCategory;
  correlationScore: number; // 0-100
  affectedServices: string[];
}

export interface RootCauseAnalysis {
  primaryCause: string;
  confidence: RootCauseConfidence;
  confidenceScore: number; // 0-100
  contributingFactors: string[];
  evidencePoints: string[];
  affectedComponents: string[];
  propagationPath: string[];
  estimatedImpactRadius: number; // number of affected services
}

export interface RemediationStep {
  order: number;
  action: string;
  owner: string;
  estimatedDuration: string;
  automationAvailable: boolean;
  riskLevel: 'low' | 'medium' | 'high';
  dependencies: number[];
}

export interface RemediationPlan {
  recommendedSteps: RemediationStep[];
  alternativeApproaches: string[];
  preventionMeasures: string[];
  estimatedTotalTime: string;
  automationPotential: number; // percentage
}

export interface IncidentImpact {
  affectedUsers: number;
  affectedServices: number;
  affectedRegions: string[];
  estimatedRevenueLoss: number;
  slaViolations: number;
  downtime: string;
}

export interface SimilarIncident {
  id: string;
  title: string;
  occurredAt: string;
  similarity: number; // 0-100
  resolution: string;
  resolutionTime: string;
  rootCause: string;
}

export interface NetworkIncident {
  id: string;
  title: string;
  description: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  category: IncidentCategory;
  detectedAt: string;
  acknowledgedAt?: string;
  resolvedAt?: string;
  detectionSource: string;
  assignedTeam: string;
  assignedTo?: string;
  impact: IncidentImpact;
  timeline: IncidentTimeline[];
  correlatedEvents: CorrelatedEvent[];
  rootCauseAnalysis: RootCauseAnalysis;
  remediationPlan: RemediationPlan;
  similarIncidents: SimilarIncident[];
  tags: string[];
  attachments: string[];
  notes: string[];
}

export interface IncidentMetrics {
  totalIncidents: number;
  activeIncidents: number;
  resolvedToday: number;
  avgResolutionTime: string;
  mttr: string; // Mean Time To Resolution
  mttd: string; // Mean Time To Detection
  automatedResolution: number; // percentage
  falsePositives: number;
  criticalIncidents: number;
  highSeverityIncidents: number;
}

export interface CorrelationPattern {
  id: string;
  name: string;
  description: string;
  occurrences: number;
  lastSeen: string;
  avgImpact: string;
  services: string[];
  confidence: number; // 0-100
}

export interface IncidentCorrelationData {
  incidents: NetworkIncident[];
  metrics: IncidentMetrics;
  correlationPatterns: CorrelationPattern[];
  lastUpdated: string;
}
