/**
 * Custom hook for navigation state management
 */

import { useState, useCallback, useMemo } from 'react';
import type { ViewId, ViewInfo } from '../types';
import { VIEW_INFO_MAP, DEFAULT_VIEW } from '../constants';

interface UseNavigationReturn {
  activeView: ViewId;
  viewInfo: ViewInfo;
  setActiveView: (viewId: ViewId) => void;
}

export function useNavigation(initialView: ViewId = DEFAULT_VIEW): UseNavigationReturn {
  const [activeView, setActiveView] = useState<ViewId>(initialView);

  const viewInfo = useMemo<ViewInfo>(() => {
    return VIEW_INFO_MAP[activeView] || VIEW_INFO_MAP[DEFAULT_VIEW];
  }, [activeView]);

  const handleSetActiveView = useCallback((viewId: ViewId) => {
    setActiveView(viewId);
  }, []);

  return {
    activeView,
    viewInfo,
    setActiveView: handleSetActiveView,
  };
}
