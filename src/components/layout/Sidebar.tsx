/**
 * Sidebar navigation component
 */

import React from 'react';
import type { ViewId, MenuItem } from '../../types';
import { Icon, LogoIcon, ChevronLeftIcon } from '../icons';
import { APP_CONFIG } from '../../constants';

interface SidebarProps {
  menuItems: MenuItem[];
  activeView: ViewId;
  collapsed: boolean;
  onViewChange: (viewId: ViewId) => void;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  menuItems,
  activeView,
  collapsed,
  onViewChange,
  onToggleCollapse,
}) => {
  return (
    <aside
      className={`${
        collapsed ? 'w-20' : 'w-64'
      } bg-slate-800 border-r border-slate-700 flex flex-col transition-all duration-300`}
    >
      <SidebarHeader collapsed={collapsed} />
      <SidebarNav
        menuItems={menuItems}
        activeView={activeView}
        collapsed={collapsed}
        onViewChange={onViewChange}
      />
      <SidebarFooter collapsed={collapsed} onToggleCollapse={onToggleCollapse} />
    </aside>
  );
};

interface SidebarHeaderProps {
  collapsed: boolean;
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({ collapsed }) => (
  <div className="p-4 border-b border-slate-700">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
        <LogoIcon className="w-6 h-6 text-white" />
      </div>
      {!collapsed && (
        <div>
          <h1 className="text-lg font-bold text-white">{APP_CONFIG.name}</h1>
          <p className="text-xs text-slate-400">{APP_CONFIG.tagline}</p>
        </div>
      )}
    </div>
  </div>
);

interface SidebarNavProps {
  menuItems: MenuItem[];
  activeView: ViewId;
  collapsed: boolean;
  onViewChange: (viewId: ViewId) => void;
}

const SidebarNav: React.FC<SidebarNavProps> = ({
  menuItems,
  activeView,
  collapsed,
  onViewChange,
}) => (
  <nav className="flex-1 p-4 overflow-y-auto">
    <ul className="space-y-2">
      {menuItems.map((item) => (
        <SidebarNavItem
          key={item.id}
          item={item}
          isActive={activeView === item.id}
          collapsed={collapsed}
          onClick={() => onViewChange(item.id)}
        />
      ))}
    </ul>
  </nav>
);

interface SidebarNavItemProps {
  item: MenuItem;
  isActive: boolean;
  collapsed: boolean;
  onClick: () => void;
}

const SidebarNavItem: React.FC<SidebarNavItemProps> = ({
  item,
  isActive,
  collapsed,
  onClick,
}) => {
  const baseClasses = 'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all';
  const activeClasses = 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25';
  const inactiveClasses = 'text-slate-400 hover:bg-slate-700 hover:text-white';

  return (
    <li>
      <button
        onClick={onClick}
        className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
        title={collapsed ? item.label : undefined}
        aria-current={isActive ? 'page' : undefined}
      >
        <Icon name={item.icon} />
        {!collapsed && <span className="font-medium">{item.label}</span>}
      </button>
    </li>
  );
};

interface SidebarFooterProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const SidebarFooter: React.FC<SidebarFooterProps> = ({ collapsed, onToggleCollapse }) => (
  <div className="p-4 border-t border-slate-700">
    <button
      onClick={onToggleCollapse}
      className="w-full flex items-center justify-center gap-2 px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
      aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
    >
      <ChevronLeftIcon
        className={`w-5 h-5 transition-transform ${collapsed ? 'rotate-180' : ''}`}
      />
      {!collapsed && <span className="text-sm">Collapse</span>}
    </button>
  </div>
);
