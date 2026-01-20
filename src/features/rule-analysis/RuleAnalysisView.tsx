/**
 * Unified Rule Analysis View - Consolidates Validation and Conflict Detection
 * MERGE #2: Rule Analysis Consolidation (2 views → 1 with tabs)
 */

import React, { useState } from 'react';
import { ValidationDashboard } from '../validation/ValidationDashboard';
import { ConflictDetectionView } from '../conflicts/ConflictDetectionView';

type RuleAnalysisTab = 'validation' | 'conflicts';

export const RuleAnalysisView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<RuleAnalysisTab>('validation');

  return (
    <>
      {/* Tab Navigation - positioned above PageContainers from child views */}
      <div className="px-6 pt-6">
        <div className="flex gap-2 border-b border-gray-200 -mb-6">
          <button
            onClick={() => setActiveTab('validation')}
            className={`px-6 py-3 font-semibold transition-colors relative ${
              activeTab === 'validation'
                ? 'text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Rule Validation
            {activeTab === 'validation' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('conflicts')}
            className={`px-6 py-3 font-semibold transition-colors relative ${
              activeTab === 'conflicts'
                ? 'text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Conflict Detection
            {activeTab === 'conflicts' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
            )}
          </button>
        </div>
      </div>

      {/* Tab Content - Each component renders its own PageContainer */}
      {activeTab === 'validation' && <ValidationDashboard />}
      {activeTab === 'conflicts' && <ConflictDetectionView />}
    </>
  );
};
