/**
 * Main App component - Application entry point
 * Refactored from 145-line monolithic component with improved architecture
 */

import React, { useState } from 'react';
import { MainLayout } from '../components';
import { useNavigation, useToggle } from '../hooks';
import { MENU_ITEMS } from '../constants';
import { ViewRouter } from './ViewRouter';

export const App: React.FC = () => {
  const { activeView, viewInfo, setActiveView } = useNavigation();
  const [sidebarCollapsed, toggleSidebar] = useToggle(false);
  const [notifications] = useState(3);

  return (
    <MainLayout
      menuItems={MENU_ITEMS}
      activeView={activeView}
      viewInfo={viewInfo}
      sidebarCollapsed={sidebarCollapsed}
      notifications={notifications}
      onViewChange={setActiveView}
      onToggleSidebar={toggleSidebar}
    >
      <ViewRouter activeView={activeView} />
    </MainLayout>
  );
};
