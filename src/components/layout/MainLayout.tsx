/**
 * Main layout wrapper component
 */

import React from 'react';
import type { ViewId, MenuItem, ViewInfo } from '../../types';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface MainLayoutProps {
  children: React.ReactNode;
  menuItems: MenuItem[];
  activeView: ViewId;
  viewInfo: ViewInfo;
  sidebarCollapsed: boolean;
  notifications: number;
  onViewChange: (viewId: ViewId) => void;
  onToggleSidebar: () => void;
  onNotificationClick?: () => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  menuItems,
  activeView,
  viewInfo,
  sidebarCollapsed,
  notifications,
  onViewChange,
  onToggleSidebar,
  onNotificationClick,
}) => {
  return (
    <div className="min-h-screen bg-slate-900 flex">
      <Sidebar
        menuItems={menuItems}
        activeView={activeView}
        collapsed={sidebarCollapsed}
        onViewChange={onViewChange}
        onToggleCollapse={onToggleSidebar}
      />
      <main className="flex-1 flex flex-col">
        <Header
          viewInfo={viewInfo}
          notifications={notifications}
          onNotificationClick={onNotificationClick}
        />
        <div className="flex-1 overflow-auto bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          {children}
        </div>
      </main>
    </div>
  );
};
