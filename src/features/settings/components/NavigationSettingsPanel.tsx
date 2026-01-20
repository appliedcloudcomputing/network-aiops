/**
 * Navigation Settings Panel - Manage visible navigation items
 */

import React, { useState } from 'react';
import { Card, Button } from '../../../components';
import { usePageVisibility } from '../../../contexts/PageVisibilityContext';
import { MENU_ITEMS } from '../../../constants/navigation';
import type { PageVisibilityItem } from '../../../types/settings';
import type { ViewId } from '../../../types/navigation';

// Categorize pages
const getPageCategory = (id: ViewId): PageVisibilityItem['category'] => {
  switch (id) {
    case 'dashboard':
    case 'settings':
      return 'system';
    case 'pathanalysis':
    case 'ruleanalysis':
    case 'validation':
    case 'conflicts':
    case 'routeintelligence':
      return 'analysis';
    case 'l1whitelisting':
    case 'tickets':
    case 'statusboard':
    case 'opsvalue':
      return 'operations';
    case 'cloudmanagement':
    case 'multicloudvisibility':
      return 'cloud';
    default:
      return 'core';
  }
};

// Get page descriptions
const getPageDescription = (id: ViewId): string => {
  switch (id) {
    case 'dashboard':
      return 'Executive dashboard with high-level overview';
    case 'opsvalue':
      return 'Management metrics and operational value tracking';
    case 'compliance':
      return 'Framework compliance scores and violations';
    case 'monitoring':
      return 'Real-time metrics across infrastructure';
    case 'dependencymap':
      return 'Service topology and dependency visualization';
    case 'incidents':
      return 'AI-powered root cause analysis';
    case 'cloudmanagement':
      return 'Multi-cloud security controls management';
    case 'multicloudvisibility':
      return 'Unified view across cloud platforms';
    case 'pathanalysis':
      return 'Network path tracing and traffic analysis';
    case 'routeintelligence':
      return 'AI routing anomaly detection';
    case 'l1whitelisting':
      return 'AI-powered ServiceNow ticket processing';
    case 'tickets':
      return 'Create policy change requests';
    case 'statusboard':
      return 'Track tickets through approval workflow';
    case 'rulegenerator':
      return 'Generate platform-specific firewall rules';
    case 'ruleanalysis':
      return 'Rule validation and conflict detection';
    case 'validation':
      return 'Syntax and compliance validation';
    case 'conflicts':
      return 'Identify rule conflicts and shadowing';
    case 'settings':
      return 'System configuration and preferences';
    default:
      return '';
  }
};

// Build page visibility items from menu
const buildPageVisibilityItems = (
  visibilitySettings: Record<string, boolean>
): PageVisibilityItem[] => {
  return MENU_ITEMS.map((item) => ({
    id: item.id,
    label: item.label,
    description: getPageDescription(item.id),
    visible: visibilitySettings[item.id] !== false,
    category: getPageCategory(item.id),
    isRequired: item.id === 'dashboard' || item.id === 'settings',
  }));
};

const categoryLabels: Record<PageVisibilityItem['category'], string> = {
  system: 'System',
  core: 'Core Features',
  analysis: 'Analysis & Intelligence',
  operations: 'Operations',
  cloud: 'Cloud Management',
};

const categoryDescriptions: Record<PageVisibilityItem['category'], string> = {
  system: 'Essential system pages that cannot be hidden',
  core: 'Core platform features',
  analysis: 'Network analysis and intelligence tools',
  operations: 'Operational management and ticketing',
  cloud: 'Multi-cloud platform management',
};

export const NavigationSettingsPanel: React.FC = () => {
  const { pageVisibility, setPageVisibility, resetToDefaults } = usePageVisibility();
  const [filterCategory, setFilterCategory] = useState<PageVisibilityItem['category'] | 'all'>(
    'all'
  );
  const [searchTerm, setSearchTerm] = useState('');

  const pageItems = buildPageVisibilityItems(pageVisibility);

  // Filter pages
  const filteredPages = pageItems.filter((page) => {
    if (filterCategory !== 'all' && page.category !== filterCategory) return false;
    if (searchTerm && !page.label.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  // Group by category
  const groupedPages = filteredPages.reduce(
    (acc, page) => {
      if (!acc[page.category]) {
        acc[page.category] = [];
      }
      acc[page.category].push(page);
      return acc;
    },
    {} as Record<PageVisibilityItem['category'], PageVisibilityItem[]>
  );

  const visibleCount = pageItems.filter((p) => p.visible).length;
  const totalCount = pageItems.length;

  const handleToggle = (pageId: ViewId, currentVisible: boolean) => {
    setPageVisibility(pageId, !currentVisible);
  };

  const handleShowAll = () => {
    pageItems.forEach((page) => {
      if (!page.isRequired) {
        setPageVisibility(page.id, true);
      }
    });
  };

  const handleHideNonEssential = () => {
    pageItems.forEach((page) => {
      if (!page.isRequired && page.category !== 'core') {
        setPageVisibility(page.id, false);
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Navigation Settings</h2>
        <p className="text-slate-400">
          Customize which pages appear in your navigation menu. Changes take effect immediately.
        </p>
      </div>

      {/* Stats Card */}
      <Card className="p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-500/20">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-slate-400 mb-1">Visible Pages</div>
            <div className="text-3xl font-bold text-white">
              {visibleCount} <span className="text-lg text-slate-400">/ {totalCount}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={handleShowAll}>
              Show All
            </Button>
            <Button variant="secondary" onClick={handleHideNonEssential}>
              Hide Non-Essential
            </Button>
            <Button variant="secondary" onClick={resetToDefaults}>
              Reset to Defaults
            </Button>
          </div>
        </div>
      </Card>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search pages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Category Filter */}
          <div className="flex gap-2">
            {(['all', 'system', 'core', 'analysis', 'operations', 'cloud'] as const).map(
              (category) => (
                <button
                  key={category}
                  onClick={() => setFilterCategory(category)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filterCategory === category
                      ? 'bg-cyan-500 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {category === 'all' ? 'All' : categoryLabels[category]}
                </button>
              )
            )}
          </div>
        </div>
      </Card>

      {/* Pages List Grouped by Category */}
      <div className="space-y-6">
        {(Object.keys(groupedPages) as PageVisibilityItem['category'][]).map((category) => (
          <div key={category}>
            <div className="mb-3">
              <h3 className="text-lg font-semibold text-white mb-1">{categoryLabels[category]}</h3>
              <p className="text-sm text-slate-400">{categoryDescriptions[category]}</p>
            </div>

            <div className="space-y-2">
              {groupedPages[category].map((page) => (
                <Card
                  key={page.id}
                  className={`p-4 transition-all ${
                    page.visible
                      ? 'bg-slate-800 border-slate-700'
                      : 'bg-slate-800/50 border-slate-700/50 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="text-white font-medium">{page.label}</h4>
                        {page.isRequired && (
                          <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded border border-blue-500/30">
                            Required
                          </span>
                        )}
                        <span
                          className={`px-2 py-0.5 text-xs rounded ${
                            page.visible
                              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                              : 'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                          }`}
                        >
                          {page.visible ? 'Visible' : 'Hidden'}
                        </span>
                      </div>
                      <p className="text-sm text-slate-400">{page.description}</p>
                    </div>

                    <div className="ml-4">
                      <button
                        onClick={() => handleToggle(page.id, page.visible)}
                        disabled={page.isRequired}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${
                          page.isRequired
                            ? 'bg-slate-600 cursor-not-allowed opacity-50'
                            : page.visible
                            ? 'bg-cyan-600'
                            : 'bg-slate-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            page.visible ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {filteredPages.length === 0 && (
        <Card className="p-8 text-center">
          <div className="text-slate-400">
            <svg
              className="w-16 h-16 mx-auto mb-4 opacity-50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-lg">No pages found matching your filters</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterCategory('all');
              }}
              className="mt-4 text-cyan-400 hover:text-cyan-300"
            >
              Clear filters
            </button>
          </div>
        </Card>
      )}
    </div>
  );
};
