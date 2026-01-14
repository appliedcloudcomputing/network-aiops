/**
 * Header component with search and user profile
 */

import React from 'react';
import type { ViewInfo } from '../../types';
import { SearchInput } from '../common';
import { BellIcon } from '../icons';

interface HeaderProps {
  viewInfo: ViewInfo;
  notifications: number;
  onNotificationClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  viewInfo,
  notifications,
  onNotificationClick,
}) => {
  return (
    <header className="bg-slate-800 border-b border-slate-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <HeaderTitle title={viewInfo.title} subtitle={viewInfo.subtitle} />
        <HeaderActions
          notifications={notifications}
          onNotificationClick={onNotificationClick}
        />
      </div>
    </header>
  );
};

interface HeaderTitleProps {
  title: string;
  subtitle: string;
}

const HeaderTitle: React.FC<HeaderTitleProps> = ({ title, subtitle }) => (
  <div>
    <h2 className="text-xl font-bold text-white">{title}</h2>
    <p className="text-sm text-slate-400">{subtitle}</p>
  </div>
);

interface HeaderActionsProps {
  notifications: number;
  onNotificationClick?: () => void;
}

const HeaderActions: React.FC<HeaderActionsProps> = ({
  notifications,
  onNotificationClick,
}) => (
  <div className="flex items-center gap-4">
    <SearchInput className="w-64" />
    <NotificationBell count={notifications} onClick={onNotificationClick} />
    <UserProfile />
  </div>
);

interface NotificationBellProps {
  count: number;
  onClick?: () => void;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ count, onClick }) => (
  <button
    onClick={onClick}
    className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
    aria-label={`Notifications (${count} unread)`}
  >
    <BellIcon className="w-6 h-6" />
    {count > 0 && (
      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
        {count}
      </span>
    )}
  </button>
);

const UserProfile: React.FC = () => (
  <div className="flex items-center gap-3 pl-4 border-l border-slate-700">
    <div className="text-right">
      <div className="text-sm font-medium text-white">Admin User</div>
      <div className="text-xs text-slate-400">Security Team</div>
    </div>
    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
      AU
    </div>
  </div>
);
