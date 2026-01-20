/**
 * Main App component - Application entry point
 * Refactored from 145-line monolithic component with improved architecture
 */

import React, { useState, useMemo } from 'react';
import { MainLayout } from '../components';
import { useNavigation, useToggle } from '../hooks';
import { MENU_ITEMS } from '../constants';
import { ViewRouter } from './ViewRouter';
import { PageVisibilityProvider, usePageVisibility } from '../contexts/PageVisibilityContext';

const AppContent: React.FC = () => {
  const { activeView, viewInfo, setActiveView } = useNavigation();
  const [sidebarCollapsed, toggleSidebar] = useToggle(false);
  const [notifications] = useState(3);
  const { isPageVisible } = usePageVisibility();

  // Filter menu items based on visibility settings
  const visibleMenuItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => isPageVisible(item.id));
  }, [isPageVisible]);

  return (
    <MainLayout
      menuItems={visibleMenuItems}
      activeView={activeView}
      viewInfo={viewInfo}
      sidebarCollapsed={sidebarCollapsed}
      notifications={notifications}
      onViewChange={setActiveView}
      onToggleSidebar={toggleSidebar}
    >
      <ViewRouter activeView={activeView} onNavigate={setActiveView} />
    </MainLayout>
  );
};

export const App: React.FC = () => {
  return (
    <PageVisibilityProvider>
      <AppContent />
    </PageVisibilityProvider>
  );
};
