/**
 * Network Resource Grid - Displays VPCs/VNets/VCNs with detailed information
 */

import React from 'react';
import { Card } from '../../../components';
import type { CloudNetwork } from '../../../types/multiCloudVisibility';

interface NetworkResourceGridProps {
  networks: CloudNetwork[];
  onSelectNetwork: (network: CloudNetwork) => void;
}

const NETWORK_TYPE_LABELS = {
  vpc: 'VPC',
  vnet: 'VNet',
  vcn: 'VCN',
};

const STATUS_CONFIG = {
  active: { color: 'text-emerald-400', bg: 'bg-emerald-500/20', border: 'border-emerald-500/30' },
  inactive: { color: 'text-slate-400', bg: 'bg-slate-500/20', border: 'border-slate-500/30' },
  degraded: { color: 'text-amber-400', bg: 'bg-amber-500/20', border: 'border-amber-500/30' },
  error: { color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/30' },
  unknown: { color: 'text-slate-400', bg: 'bg-slate-500/20', border: 'border-slate-500/30' },
};

export const NetworkResourceGrid: React.FC<NetworkResourceGridProps> = ({
  networks,
  onSelectNetwork,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {networks.map((network) => {
        const statusConfig = STATUS_CONFIG[network.status];
        const totalSubnets = network.subnets.length;
        const totalRouteTables = network.routeTables.length;
        const totalPeerings = network.peerings.length;
        const totalGateways = network.gateways.length;

        return (
          <Card
            key={network.id}
            className="cursor-pointer hover:border-cyan-500 transition-colors"
            onClick={() => onSelectNetwork(network)}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-white font-semibold text-lg">{network.name}</h3>
                  <span className="px-2 py-1 bg-slate-700 text-slate-300 rounded text-xs font-mono">
                    {NETWORK_TYPE_LABELS[network.type]}
                  </span>
                </div>
                <p className="text-slate-400 text-sm font-mono">{network.id}</p>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusConfig.bg} ${statusConfig.border} ${statusConfig.color}`}>
                {network.status.toUpperCase()}
              </div>
            </div>

            {/* CIDR Blocks */}
            <div className="mb-4">
              <p className="text-slate-400 text-xs mb-2">CIDR Blocks</p>
              <div className="flex flex-wrap gap-2">
                {network.cidr.map((cidr, idx) => (
                  <span key={idx} className="px-3 py-1 bg-slate-700/50 text-white rounded font-mono text-sm">
                    {cidr}
                  </span>
                ))}
              </div>
            </div>

            {/* Region */}
            <div className="mb-4">
              <span className="text-slate-400 text-xs">Region: </span>
              <span className="text-white text-sm">{network.region}</span>
            </div>

            {/* Resource Counts */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              <div className="bg-slate-700/30 p-2 rounded text-center">
                <p className="text-xl font-bold text-white">{totalSubnets}</p>
                <p className="text-xs text-slate-400">Subnets</p>
              </div>
              <div className="bg-slate-700/30 p-2 rounded text-center">
                <p className="text-xl font-bold text-white">{totalRouteTables}</p>
                <p className="text-xs text-slate-400">Routes</p>
              </div>
              <div className="bg-slate-700/30 p-2 rounded text-center">
                <p className="text-xl font-bold text-white">{totalPeerings}</p>
                <p className="text-xs text-slate-400">Peerings</p>
              </div>
              <div className="bg-slate-700/30 p-2 rounded text-center">
                <p className="text-xl font-bold text-white">{totalGateways}</p>
                <p className="text-xs text-slate-400">Gateways</p>
              </div>
            </div>

            {/* Security */}
            <div className="flex gap-2 text-xs">
              {network.firewalls.length > 0 && (
                <span className="px-2 py-1 bg-red-500/20 text-red-400 border border-red-500/30 rounded">
                  🛡️ {network.firewalls.length} Firewall{network.firewalls.length > 1 ? 's' : ''}
                </span>
              )}
              {network.securityGroups.length > 0 && (
                <span className="px-2 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded">
                  🔒 {network.securityGroups.length} SG/NSG
                </span>
              )}
            </div>

            {/* Tags */}
            {Object.keys(network.tags).length > 0 && (
              <div className="mt-3 pt-3 border-t border-slate-700">
                <p className="text-slate-400 text-xs mb-2">Tags</p>
                <div className="flex flex-wrap gap-1">
                  {Object.entries(network.tags).slice(0, 3).map(([key, value]) => (
                    <span key={key} className="px-2 py-1 bg-slate-700/50 text-slate-300 rounded text-xs">
                      {key}: {value}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
};
