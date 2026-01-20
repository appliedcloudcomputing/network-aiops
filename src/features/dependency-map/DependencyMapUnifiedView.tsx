/**
 * Unified Dependency Map View - Consolidates Classic and Enhanced views
 * MERGE #4: Dependency Map Consolidation (2 views → 1 with toggle)
 */

import React, { useState } from 'react';
import { DependencyMapView } from './DependencyMapView';
import { DependencyMapViewEnhanced } from './DependencyMapViewEnhanced';

type ViewMode = 'enhanced' | 'classic';

export const DependencyMapUnifiedView: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('enhanced');

  return (
    <>
      {/* View Mode Toggle - positioned above the view */}
      <div className="px-6 pt-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm text-slate-400">View Mode:</span>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('enhanced')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                viewMode === 'enhanced'
                  ? 'bg-cyan-500 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              Enhanced View
            </button>
            <button
              onClick={() => setViewMode('classic')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                viewMode === 'classic'
                  ? 'bg-cyan-500 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              Classic View
            </button>
          </div>
        </div>
      </div>

      {/* View Content - Each component renders its own PageContainer */}
      {viewMode === 'enhanced' && <DependencyMapViewEnhanced />}
      {viewMode === 'classic' && <DependencyMapView />}
    </>
  );
};
