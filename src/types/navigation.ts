/**
 * Navigation-related type definitions
 */

export type ViewId =
  | 'dashboard'
  | 'compliance'
  | 'monitoring'
  | 'dependencymap'
  | 'incidents'
  | 'cloudmanagement'
  | 'pathanalysis'
  | 'routeintelligence'
  | 'tickets'
  | 'statusboard'
  | 'l1whitelisting'
  | 'rulegenerator'
  | 'ruleanalysis'
  | 'validation'
  | 'conflicts'
  | 'multicloudvisibility'
  | 'opsvalue'
  | 'settings';

export type IconName =
  | 'dashboard'
  | 'compliance'
  | 'monitoring'
  | 'topology'
  | 'incidents'
  | 'cloud'
  | 'path'
  | 'route'
  | 'ticket'
  | 'kanban'
  | 'whitelist'
  | 'code'
  | 'validation'
  | 'conflicts'
  | 'multicloud'
  | 'opsvalue'
  | 'settings';

export interface MenuItem {
  id: ViewId;
  label: string;
  icon: IconName;
}

export interface ViewInfo {
  title: string;
  subtitle: string;
}
