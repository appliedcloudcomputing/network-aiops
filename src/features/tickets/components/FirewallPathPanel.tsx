/**
 * Firewall Path Panel - Shows firewalls and security groups in traffic path
 */

import React from 'react';
import { Card, CardHeader } from '../../../components';
import type { FirewallInPath } from '../../../types/tickets';

interface FirewallPathPanelProps {
  firewalls: FirewallInPath[];
}

const PLATFORM_ICONS: Record<string, string> = {
  aws: '☁️',
  azure: '🔷',
  gcp: '🔶',
  onprem: '🖥️',
};

const PLATFORM_COLORS: Record<string, string> = {
  aws: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  azure: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  gcp: 'bg-red-500/20 text-red-400 border-red-500/30',
  onprem: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
};

const TYPE_LABELS: Record<string, string> = {
  firewall: 'Firewall',
  nsg: 'Network Security Group',
  security_group: 'Security Group',
  nacl: 'Network ACL',
};

export const FirewallPathPanel: React.FC<FirewallPathPanelProps> = ({ firewalls }) => {
  return (
    <Card>
      <CardHeader
        title="Firewalls in Traffic Path"
        subtitle={`${firewalls.length} security control${firewalls.length !== 1 ? 's' : ''} identified`}
      />

      <div className="space-y-3">
        {firewalls.map((firewall, index) => (
          <div
            key={firewall.id}
            className="p-4 bg-slate-700/30 rounded-lg border border-slate-600 hover:border-cyan-500/50 transition-colors"
          >
            {/* Step Number */}
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-cyan-500/20 rounded-full flex items-center justify-center border border-cyan-500/30">
                <span className="text-cyan-400 font-semibold text-sm">{index + 1}</span>
              </div>

              <div className="flex-1">
                {/* Firewall Name */}
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white font-semibold">{firewall.name}</h4>
                  <span className={`px-2 py-1 rounded text-xs font-medium border ${PLATFORM_COLORS[firewall.platform]}`}>
                    {PLATFORM_ICONS[firewall.platform]} {firewall.platform.toUpperCase()}
                  </span>
                </div>

                {/* Firewall Details */}
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-slate-400">Type:</span>{' '}
                    <span className="text-white">{TYPE_LABELS[firewall.type]}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Location:</span>{' '}
                    <span className="text-white">{firewall.location}</span>
                  </div>
                  {firewall.zone && (
                    <div className="col-span-2">
                      <span className="text-slate-400">Zone:</span>{' '}
                      <span className="text-white font-mono text-xs">{firewall.zone}</span>
                    </div>
                  )}
                  {firewall.managementUrl && (
                    <div className="col-span-2">
                      <a
                        href={firewall.managementUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-400 hover:text-cyan-300 text-xs flex items-center gap-1"
                      >
                        Open Management Console
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Connection Arrow */}
            {index < firewalls.length - 1 && (
              <div className="flex justify-center mt-3">
                <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};
