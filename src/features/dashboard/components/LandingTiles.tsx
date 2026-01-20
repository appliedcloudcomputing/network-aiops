/**
 * Landing Tiles component for Dashboard Home Page
 * Provides quick access to key features with guided workflows
 */

import React from 'react';
import { Card } from '../../../components';
import type { ViewId } from '../../../types';

interface LandingTile {
  id: string;
  title: string;
  description: string;
  icon: string;
  gradientFrom: string;
  gradientTo: string;
  route: ViewId;
  badge?: string;
}

interface LandingTilesProps {
  onNavigate: (path: ViewId) => void;
}

export const LandingTiles: React.FC<LandingTilesProps> = ({ onNavigate }) => {
  const tiles: LandingTile[] = [
    {
      id: 'firewall-whitelisting',
      title: 'Firewall Whitelisting (L1 Guided)',
      description: 'L1 guided workflow for firewall rule creation with automated validation',
      icon: '🛡️',
      gradientFrom: 'from-blue-600',
      gradientTo: 'to-blue-800',
      route: 'l1whitelisting',
      badge: 'L1 Guided',
    },
    {
      id: 'traffic-path-analysis',
      title: 'Traffic Path Analysis',
      description: 'Visualize network traffic flow across multi-cloud infrastructure with graph view',
      icon: '🔍',
      gradientFrom: 'from-purple-600',
      gradientTo: 'to-purple-800',
      route: 'pathanalysis',
    },
    {
      id: 'multi-cloud-route-validation',
      title: 'Multi-Cloud Route Validation',
      description: 'Unified view of network routes across AWS, Azure, GCP, OCI & On-Prem',
      icon: '☁️',
      gradientFrom: 'from-cyan-600',
      gradientTo: 'to-cyan-800',
      route: 'multicloudvisibility',
    },
    {
      id: 'firewall-patch-management',
      title: 'Firewall Patch Management',
      description: 'Track unpatched firewalls, CVE vulnerabilities, and security updates',
      icon: '🔧',
      gradientFrom: 'from-green-600',
      gradientTo: 'to-green-800',
      route: 'compliance',
    },
    {
      id: 'compliance-drift-reports',
      title: 'Compliance & Drift Reports',
      description: 'Monitor compliance frameworks, detect configuration drift, and view audit reports',
      icon: '📊',
      gradientFrom: 'from-amber-600',
      gradientTo: 'to-amber-800',
      route: 'compliance',
    },
    {
      id: 'incident-root-cause-analysis',
      title: 'Incident Root Cause Analysis',
      description: 'AI-powered correlation and root cause identification for network incidents',
      icon: '🎯',
      gradientFrom: 'from-red-600',
      gradientTo: 'to-red-800',
      route: 'incidents',
    },
  ];

  return (
    <div className="mb-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold text-white">Quick Access to Key Features</h2>
          <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-xs font-semibold border border-cyan-500/30">
            6 Features
          </span>
        </div>
        <p className="text-slate-400">
          Click on any tile below to navigate directly to the feature. Each module provides specialized AI-powered capabilities for network operations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tiles.map((tile) => (
          <div
            key={tile.id}
            onClick={() => onNavigate(tile.route)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onNavigate(tile.route);
              }
            }}
            role="button"
            tabIndex={0}
            aria-label={`Navigate to ${tile.title}`}
            className="group cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-900 rounded-xl"
          >
            <Card
              variant="gradient"
              padding="none"
              hover
              className={`bg-gradient-to-br ${tile.gradientFrom} ${tile.gradientTo} border-0 h-full overflow-hidden shadow-lg group-hover:shadow-2xl transition-shadow`}
            >
              <div className="p-6 relative">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity">
                  <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                    backgroundSize: '24px 24px'
                  }} />
                </div>

                {/* Badge */}
                {tile.badge && (
                  <div className="absolute top-4 right-4 z-10">
                    <span className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold text-white border border-white/30">
                      {tile.badge}
                    </span>
                  </div>
                )}

                {/* Icon */}
                <div className="mb-4 relative z-10">
                  <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center text-3xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                    {tile.icon}
                  </div>
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:translate-x-1 transition-transform">
                    {tile.title}
                  </h3>
                  <p className="text-white/80 text-sm leading-relaxed">
                    {tile.description}
                  </p>
                </div>

                {/* Arrow indicator */}
                <div className="mt-4 flex items-center text-white/60 group-hover:text-white group-hover:translate-x-2 transition-all relative z-10">
                  <span className="text-sm font-medium">Launch Module</span>
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};
