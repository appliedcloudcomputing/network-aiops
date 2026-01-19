/**
 * Enhanced Path Analysis View - Includes graph-based visualization
 * Features: List view, Graph view, Scenario selector
 */

import React, { useState } from 'react';
import { PageContainer, Card, Button } from '../../components';
import { PathGraphVisualizationComponent } from './components';
import { mockPathScenarios } from '../../data/pathAnalysisData';
import type { PathGraphVisualization } from '../../types/pathAnalysis';

type ViewMode = 'list' | 'graph';
type Scenario = 'healthy' | 'blocked' | 'asymmetric' | 'missingRule' | 'custom';

export const PathAnalysisEnhancedView: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('graph');
  const [selectedScenario, setSelectedScenario] = useState<Scenario>('healthy');
  const [pathData, setPathData] = useState<PathGraphVisualization>(mockPathScenarios.healthy);

  const handleScenarioChange = (scenario: Scenario) => {
    setSelectedScenario(scenario);
    if (scenario !== 'custom') {
      setPathData(mockPathScenarios[scenario]);
    }
  };

  const scenarios = [
    {
      id: 'healthy' as Scenario,
      name: 'Healthy Path',
      description: 'Production to AWS - No issues',
      icon: '✅',
      color: 'from-emerald-500 to-emerald-600',
    },
    {
      id: 'blocked' as Scenario,
      name: 'Blocked Traffic',
      description: 'Firewall blocking UAT to Prod',
      icon: '🚫',
      color: 'from-red-500 to-red-600',
    },
    {
      id: 'asymmetric' as Scenario,
      name: 'Asymmetric Routing',
      description: 'Different forward/return paths',
      icon: '🔄',
      color: 'from-amber-500 to-amber-600',
    },
    {
      id: 'missingRule' as Scenario,
      name: 'Missing Rule',
      description: 'Fallback to default policy',
      icon: '⚠️',
      color: 'from-orange-500 to-orange-600',
    },
  ];

  return (
    <PageContainer>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Traffic Path Analysis</h1>
        <p className="text-slate-400">
          Graph-based visualization with blocked hop, asymmetric routing, and missing rule detection
        </p>
      </div>

      {/* View Mode Toggle & Scenario Selector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* View Mode Toggle */}
        <Card className="p-4">
          <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Visualization Mode
          </h3>
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'graph' ? 'primary' : 'secondary'}
              onClick={() => setViewMode('graph')}
              className="flex-1"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              Graph View
            </Button>
            <Button
              variant={viewMode === 'list' ? 'primary' : 'secondary'}
              onClick={() => setViewMode('list')}
              className="flex-1"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              List View
            </Button>
          </div>
        </Card>

        {/* Path Info */}
        <Card className="p-4 col-span-2">
          <h3 className="text-white font-semibold mb-3">Current Path</h3>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-slate-400 mb-1">Source</p>
              <p className="text-white font-mono">{pathData.source}</p>
            </div>
            <div>
              <p className="text-slate-400 mb-1">Destination</p>
              <p className="text-white font-mono">{pathData.destination}</p>
            </div>
            <div>
              <p className="text-slate-400 mb-1">Total Hops</p>
              <p className="text-white font-semibold">{pathData.hops.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Scenario Selector */}
      <div className="mb-6">
        <Card className="p-6">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
            Sample Scenarios
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {scenarios.map((scenario) => (
              <button
                key={scenario.id}
                onClick={() => handleScenarioChange(scenario.id)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  selectedScenario === scenario.id
                    ? 'border-cyan-500 bg-cyan-500/10 scale-105'
                    : 'border-slate-600 bg-slate-800 hover:border-slate-500'
                }`}
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${scenario.color} rounded-lg flex items-center justify-center text-2xl mb-3`}>
                  {scenario.icon}
                </div>
                <h4 className="text-white font-semibold mb-1">{scenario.name}</h4>
                <p className="text-slate-400 text-xs">{scenario.description}</p>
              </button>
            ))}
          </div>
        </Card>
      </div>

      {/* Main Visualization */}
      {viewMode === 'graph' ? (
        <PathGraphVisualizationComponent pathData={pathData} />
      ) : (
        <Card className="p-6">
          <h3 className="text-white font-semibold mb-4">List View</h3>
          <p className="text-slate-400 text-center py-8">
            List view coming soon - showing classic hop-by-hop table format
          </p>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="mt-6 flex justify-between">
        <Button variant="ghost">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export Report
        </Button>
        <div className="flex gap-2">
          <Button variant="secondary">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Compare Paths
          </Button>
          <Button variant="primary">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Run New Analysis
          </Button>
        </div>
      </div>
    </PageContainer>
  );
};
