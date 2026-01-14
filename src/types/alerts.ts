/**
 * Alert-related type definitions
 */

export type AlertType = 'critical' | 'warning' | 'info';

export interface Alert {
  id: number;
  type: AlertType;
  message: string;
  source: string;
  time: Date;
  acknowledged: boolean;
}

export interface AlertConfig {
  icon: string;
  bgClass: string;
  borderClass: string;
}
