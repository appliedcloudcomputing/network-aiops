/**
 * Page Visibility Context - Manages which navigation items are visible
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { PageVisibilitySettings } from '../types/settings';
import type { ViewId } from '../types/navigation';

interface PageVisibilityContextType {
  pageVisibility: PageVisibilitySettings;
  isPageVisible: (pageId: ViewId) => boolean;
  togglePageVisibility: (pageId: ViewId) => void;
  setPageVisibility: (pageId: ViewId, visible: boolean) => void;
  resetToDefaults: () => void;
}

const PageVisibilityContext = createContext<PageVisibilityContextType | undefined>(undefined);

const STORAGE_KEY = 'network-aiops-page-visibility';

// Default visibility - all pages visible by default
const getDefaultVisibility = (): PageVisibilitySettings => ({
  dashboard: true,
  opsvalue: true,
  compliance: true,
  monitoring: true,
  dependencymap: true,
  incidents: true,
  cloudmanagement: true,
  multicloudvisibility: true,
  pathanalysis: true,
  routeintelligence: true,
  l1whitelisting: true,
  tickets: true,
  statusboard: true,
  rulegenerator: true,
  ruleanalysis: true,
  validation: true,
  conflicts: true,
  settings: true,
});

// Load visibility from localStorage
const loadVisibilityFromStorage = (): PageVisibilitySettings => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Merge with defaults to handle new pages
      return { ...getDefaultVisibility(), ...parsed };
    }
  } catch (error) {
    console.error('Failed to load page visibility settings:', error);
  }
  return getDefaultVisibility();
};

// Save visibility to localStorage
const saveVisibilityToStorage = (visibility: PageVisibilitySettings) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(visibility));
  } catch (error) {
    console.error('Failed to save page visibility settings:', error);
  }
};

export const PageVisibilityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [pageVisibility, setPageVisibilityState] = useState<PageVisibilitySettings>(
    loadVisibilityFromStorage
  );

  // Save to localStorage whenever visibility changes
  useEffect(() => {
    saveVisibilityToStorage(pageVisibility);
  }, [pageVisibility]);

  const isPageVisible = (pageId: ViewId): boolean => {
    // Dashboard and Settings are always visible
    if (pageId === 'dashboard' || pageId === 'settings') {
      return true;
    }
    return pageVisibility[pageId] !== false;
  };

  const togglePageVisibility = (pageId: ViewId) => {
    // Prevent hiding Dashboard and Settings
    if (pageId === 'dashboard' || pageId === 'settings') {
      return;
    }
    setPageVisibilityState((prev) => ({
      ...prev,
      [pageId]: !prev[pageId],
    }));
  };

  const setPageVisibility = (pageId: ViewId, visible: boolean) => {
    // Prevent hiding Dashboard and Settings
    if (pageId === 'dashboard' || pageId === 'settings') {
      return;
    }
    setPageVisibilityState((prev) => ({
      ...prev,
      [pageId]: visible,
    }));
  };

  const resetToDefaults = () => {
    const defaults = getDefaultVisibility();
    setPageVisibilityState(defaults);
    saveVisibilityToStorage(defaults);
  };

  return (
    <PageVisibilityContext.Provider
      value={{
        pageVisibility,
        isPageVisible,
        togglePageVisibility,
        setPageVisibility,
        resetToDefaults,
      }}
    >
      {children}
    </PageVisibilityContext.Provider>
  );
};

export const usePageVisibility = (): PageVisibilityContextType => {
  const context = useContext(PageVisibilityContext);
  if (!context) {
    throw new Error('usePageVisibility must be used within a PageVisibilityProvider');
  }
  return context;
};
