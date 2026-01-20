/**
 * Navigation configuration constants
 */

import type { MenuItem, ViewId, ViewInfo } from '../types';

export const MENU_ITEMS: MenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { id: 'opsvalue', label: 'Ops Value Dashboard', icon: 'opsvalue' },
  { id: 'compliance', label: 'Compliance', icon: 'compliance' },
  { id: 'monitoring', label: 'Real-Time Monitoring', icon: 'monitoring' },
  { id: 'dependencymap', label: 'Dependency Map', icon: 'topology' },
  { id: 'incidents', label: 'Incident Correlation', icon: 'incidents' },
  { id: 'cloudmanagement', label: 'Cloud Management', icon: 'cloud' },
  { id: 'multicloudvisibility', label: 'Multi-Cloud Visibility', icon: 'multicloud' },
  { id: 'pathanalysis', label: 'Path Analysis', icon: 'path' },
  { id: 'routeintelligence', label: 'Route Intelligence', icon: 'route' },
  { id: 'l1whitelisting', label: 'L1 Whitelisting', icon: 'whitelist' },
  { id: 'tickets', label: 'Create Ticket', icon: 'ticket' },
  { id: 'statusboard', label: 'Ticket Status', icon: 'kanban' },
  { id: 'rulegenerator', label: 'Rule Generator', icon: 'code' },
  { id: 'ruleanalysis', label: 'Rule Analysis', icon: 'validation' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
];

export const VIEW_INFO_MAP: Record<ViewId, ViewInfo> = {
  dashboard: {
    title: 'Executive Dashboard',
    subtitle: 'High-level overview of security posture and operations',
  },
  compliance: {
    title: 'Compliance Dashboard',
    subtitle: 'Framework compliance scores and violation tracking',
  },
  monitoring: {
    title: 'Real-Time Monitoring',
    subtitle: 'Live metrics across AWS, Azure, GCP & On-Premises infrastructure',
  },
  dependencymap: {
    title: 'Application Dependency Map',
    subtitle: 'Real-time service topology with health scores and latency monitoring',
  },
  incidents: {
    title: 'Incident Correlation',
    subtitle: 'AI-powered root cause analysis across multi-cloud infrastructure',
  },
  cloudmanagement: {
    title: 'Multi-Cloud Management',
    subtitle: 'Unified view of AWS, Azure & GCP security controls',
  },
  pathanalysis: {
    title: 'Path Analysis',
    subtitle: 'Network path tracing with classic, graph, and traffic flow analysis',
  },
  routeintelligence: {
    title: 'Route Intelligence',
    subtitle: 'AI-powered anomaly detection for network routing issues',
  },
  tickets: {
    title: 'Create Policy Change Request',
    subtitle: 'ServiceNow Integration - Automated Risk Assessment',
  },
  statusboard: {
    title: 'Ticket Status Board',
    subtitle: 'Track policy change requests through approval workflow',
  },
  rulegenerator: {
    title: 'Multi-Cloud Rule Generator',
    subtitle: 'Generate platform-specific firewall rules from unified policy',
  },
  ruleanalysis: {
    title: 'Rule Analysis',
    subtitle: 'Rule validation, conflict detection, and compliance checks',
  },
  validation: {
    title: 'Rule Validation Dashboard',
    subtitle: 'Syntax, Conflict Detection & Compliance Validation',
  },
  conflicts: {
    title: 'Conflict Detection Engine',
    subtitle: 'Identify Allow/Deny conflicts, Shadowing & Redundancy issues',
  },
  l1whitelisting: {
    title: 'L1 Firewall Whitelisting',
    subtitle: 'AI-powered ServiceNow ticket processing with automatic implementation',
  },
  multicloudvisibility: {
    title: 'Multi-Cloud Visibility',
    subtitle: 'Unified view of network infrastructure across AWS, Azure, GCP, OCI, and On-Premises',
  },
  opsvalue: {
    title: 'Ops Value Dashboard',
    subtitle: 'Metrics for management: Ticket TAT, Automation Rate, Change Success, Compliance & ROI',
  },
  settings: {
    title: 'Settings & Configuration',
    subtitle: 'Manage cloud connections, integrations, users, and system preferences',
  },
};

export const DEFAULT_VIEW: ViewId = 'dashboard';
