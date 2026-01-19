/**
 * Cloud Provider Card - Summary card for each cloud provider
 */

import React from 'react';
import { Card } from '../../../components';
import type { CloudProvider, ProviderSummary } from '../../../types/multiCloudVisibility';

interface CloudProviderCardProps {
  provider: CloudProvider;
  summary: ProviderSummary;
  selected: boolean;
  onClick: () => void;
}

const PROVIDER_CONFIG = {
  aws: {
    name: 'Amazon Web Services',
    shortName: 'AWS',
    icon: '☁️',
    color: 'from-orange-500 to-orange-600',
    borderColor: 'border-orange-500',
    bgColor: 'bg-orange-500/10',
  },
  azure: {
    name: 'Microsoft Azure',
    shortName: 'Azure',
    icon: '🔷',
    color: 'from-blue-500 to-blue-600',
    borderColor: 'border-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  gcp: {
    name: 'Google Cloud Platform',
    shortName: 'GCP',
    icon: '🔶',
    color: 'from-red-500 to-red-600',
    borderColor: 'border-red-500',
    bgColor: 'bg-red-500/10',
  },
  oci: {
    name: 'Oracle Cloud Infrastructure',
    shortName: 'OCI',
    icon: '🔴',
    color: 'from-red-600 to-orange-600',
    borderColor: 'border-red-600',
    bgColor: 'bg-red-600/10',
  },
  onprem: {
    name: 'On-Premises',
    shortName: 'On-Prem',
    icon: '🖥️',
    color: 'from-slate-500 to-slate-600',
    borderColor: 'border-slate-500',
    bgColor: 'bg-slate-500/10',
  },
};

const HEALTH_CONFIG = {
  healthy: {
    label: 'Healthy',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/20',
    borderColor: 'border-emerald-500/30',
  },
  degraded: {
    label: 'Degraded',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/20',
    borderColor: 'border-amber-500/30',
  },
  critical: {
    label: 'Critical',
    color: 'text-red-400',
    bgColor: 'bg-red-500/20',
    borderColor: 'border-red-500/30',
  },
};

export const CloudProviderCard: React.FC<CloudProviderCardProps> = ({
  provider,
  summary,
  selected,
  onClick,
}) => {
  const config = PROVIDER_CONFIG[provider];
  const healthConfig = HEALTH_CONFIG[summary.health];

  return (
    <div
      onClick={onClick}
      className={`cursor-pointer transition-all ${
        selected ? 'scale-105' : 'hover:scale-102'
      }`}
    >
      <Card
        className={`border-2 ${
          selected ? config.borderColor + ' shadow-lg' : 'border-slate-600'
        }`}
        padding="none"
      >
        {/* Header */}
        <div className={`bg-gradient-to-r ${config.color} p-4`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-3xl">{config.icon}</div>
              <div>
                <h3 className="text-white font-bold text-lg">{config.shortName}</h3>
                <p className="text-white/80 text-xs">{config.name}</p>
              </div>
            </div>
            {selected && (
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="p-4 space-y-3">
          {/* Health Status */}
          <div className={`flex items-center justify-between p-2 rounded-lg border ${healthConfig.bgColor} ${healthConfig.borderColor}`}>
            <span className="text-sm text-slate-300">Health</span>
            <span className={`text-sm font-semibold ${healthConfig.color}`}>{healthConfig.label}</span>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-slate-700/30 p-2 rounded">
              <p className="text-xs text-slate-400">Networks</p>
              <p className="text-lg font-bold text-white">{summary.networks}</p>
            </div>
            <div className="bg-slate-700/30 p-2 rounded">
              <p className="text-xs text-slate-400">Subnets</p>
              <p className="text-lg font-bold text-white">{summary.subnets}</p>
            </div>
            <div className="bg-slate-700/30 p-2 rounded col-span-2">
              <p className="text-xs text-slate-400">Active Resources</p>
              <p className="text-lg font-bold text-white">{summary.activeResources}</p>
            </div>
          </div>

          {/* Regions */}
          <div>
            <p className="text-xs text-slate-400 mb-1">Regions</p>
            <div className="flex flex-wrap gap-1">
              {summary.regions.map((region) => (
                <span
                  key={region}
                  className="px-2 py-1 bg-slate-700/50 text-slate-300 rounded text-xs"
                >
                  {region}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
