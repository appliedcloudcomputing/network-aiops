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
  | 'rulegenerator'
  | 'validation'
  | 'conflicts'
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
  | 'code'
  | 'validation'
  | 'conflicts'
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
