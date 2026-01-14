/**
 * Live alerts feed component
 */

import React from 'react';
import type { Alert } from '../../../types';
import { Card, Badge, Button } from '../../../components';
import { BellIcon } from '../../../components/icons';
import { formatAlertTime, getAlertIcon, getAlertCounts } from '../../../services';
import { COLORS } from '../../../constants';

interface AlertsFeedProps {
  alerts: Alert[];
  onAcknowledge: (id: number) => void;
}

export const AlertsFeed: React.FC<AlertsFeedProps> = ({
  alerts,
  onAcknowledge,
}) => {
  const alertCounts = getAlertCounts(alerts);

  return (
    <Card
      variant="bordered"
      padding="none"
      className="col-span-2 rounded-2xl overflow-hidden"
    >
      <AlertsFeedHeader alertCounts={alertCounts} />
      <AlertsList alerts={alerts} onAcknowledge={onAcknowledge} />
      <AlertsFeedFooter alertCount={alerts.length} />
    </Card>
  );
};

interface AlertsFeedHeaderProps {
  alertCounts: ReturnType<typeof getAlertCounts>;
}

const AlertsFeedHeader: React.FC<AlertsFeedHeaderProps> = ({ alertCounts }) => (
  <div className="p-4 border-b border-slate-700 flex items-center justify-between">
    <div className="flex items-center gap-3">
      <h3 className="text-white font-semibold flex items-center gap-2">
        <BellIcon className="w-5 h-5 text-red-400" />
        Live Alerts Feed
      </h3>
      <div className="flex items-center gap-1">
        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        <span className="text-xs text-slate-400">
          {alertCounts.unacknowledged} unacknowledged
        </span>
      </div>
    </div>
    <div className="flex items-center gap-2">
      <Badge variant="error" size="sm">
        {alertCounts.critical} Critical
      </Badge>
      <Badge variant="warning" size="sm">
        {alertCounts.warning} Warning
      </Badge>
    </div>
  </div>
);

interface AlertsListProps {
  alerts: Alert[];
  onAcknowledge: (id: number) => void;
}

const AlertsList: React.FC<AlertsListProps> = ({ alerts, onAcknowledge }) => (
  <div className="h-[400px] overflow-y-auto">
    <div className="divide-y divide-slate-700/50">
      {alerts.map((alert) => (
        <AlertItem
          key={alert.id}
          alert={alert}
          onAcknowledge={onAcknowledge}
        />
      ))}
    </div>
  </div>
);

interface AlertItemProps {
  alert: Alert;
  onAcknowledge: (id: number) => void;
}

const AlertItem: React.FC<AlertItemProps> = ({ alert, onAcknowledge }) => {
  const colorConfig = COLORS.alert[alert.type];

  return (
    <div
      className={`p-4 ${colorConfig.bg} ${colorConfig.hover} border-l-2 ${colorConfig.borderLeft} transition-all ${
        alert.acknowledged ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="text-lg mt-0.5">{getAlertIcon(alert.type)}</span>
          <div>
            <p className="text-white text-sm font-medium">{alert.message}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-slate-400 font-mono bg-slate-700/50 px-2 py-0.5 rounded">
                {alert.source}
              </span>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs text-slate-500">
                {formatAlertTime(alert.time)}
              </span>
            </div>
          </div>
        </div>
        {!alert.acknowledged ? (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onAcknowledge(alert.id)}
          >
            Acknowledge
          </Button>
        ) : (
          <Badge variant="success" size="sm">
            ✓ Ack
          </Badge>
        )}
      </div>
    </div>
  );
};

interface AlertsFeedFooterProps {
  alertCount: number;
}

const AlertsFeedFooter: React.FC<AlertsFeedFooterProps> = ({ alertCount }) => (
  <div className="p-3 border-t border-slate-700 bg-slate-900/50 flex items-center justify-between">
    <span className="text-xs text-slate-500">
      Showing latest {alertCount} alerts
    </span>
    <button className="text-xs text-cyan-400 hover:text-cyan-300 font-medium">
      View All Alerts →
    </button>
  </div>
);
