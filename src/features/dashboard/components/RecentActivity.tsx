/**
 * Recent activity list component
 */

import React from 'react';
import type { ActivityItem } from '../../../types';
import { Card, StatusIndicator } from '../../../components';

interface RecentActivityProps {
  activities: ActivityItem[];
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  return (
    <Card padding="none" className="overflow-hidden">
      <div className="p-4 border-b border-slate-700 flex items-center justify-between">
        <h3 className="font-bold text-white">Recent Activity</h3>
        <span className="text-xs text-slate-400">Last 24 hours</span>
      </div>
      <div className="divide-y divide-slate-700">
        {activities.map((activity) => (
          <ActivityListItem key={activity.id} activity={activity} />
        ))}
      </div>
    </Card>
  );
};

interface ActivityListItemProps {
  activity: ActivityItem;
}

const ActivityListItem: React.FC<ActivityListItemProps> = ({ activity }) => {
  return (
    <div className="p-4 hover:bg-slate-700/50 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <StatusIndicator status={activity.status} size="sm" />
          <div>
            <div className="text-white text-sm font-medium">{activity.action}</div>
            <div className="text-xs text-slate-400">
              <span className="font-mono text-cyan-400">{activity.target}</span>
              <span className="mx-2">•</span>
              <span>{activity.user}</span>
            </div>
          </div>
        </div>
        <span className="text-xs text-slate-500">{activity.time}</span>
      </div>
    </div>
  );
};
