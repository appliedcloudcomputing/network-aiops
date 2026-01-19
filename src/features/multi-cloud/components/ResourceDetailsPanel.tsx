/**
 * Resource Details Panel - Shows detailed information for selected network
 */

import React, { useState } from 'react';
import { Card } from '../../../components';
import type { CloudNetwork } from '../../../types/multiCloudVisibility';

interface ResourceDetailsPanelProps {
  network: CloudNetwork;
  onClose: () => void;
}

type DetailTab = 'overview' | 'subnets' | 'routes' | 'peerings' | 'gateways' | 'security';

const STATUS_CONFIG = {
  active: { color: 'text-emerald-400', bg: 'bg-emerald-500/20', border: 'border-emerald-500/30' },
  inactive: { color: 'text-slate-400', bg: 'bg-slate-500/20', border: 'border-slate-500/30' },
  degraded: { color: 'text-amber-400', bg: 'bg-amber-500/20', border: 'border-amber-500/30' },
  error: { color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/30' },
  unknown: { color: 'text-slate-400', bg: 'bg-slate-500/20', border: 'border-slate-500/30' },
};

const ROUTE_TARGET_TYPE_CONFIG = {
  local: { icon: '🏠', color: 'text-slate-400' },
  gateway: { icon: '🌐', color: 'text-cyan-400' },
  peering: { icon: '🔗', color: 'text-purple-400' },
  transit: { icon: '🚦', color: 'text-blue-400' },
  nat: { icon: '📡', color: 'text-green-400' },
  instance: { icon: '💻', color: 'text-yellow-400' },
  blackhole: { icon: '⚫', color: 'text-red-400' },
};

export const ResourceDetailsPanel: React.FC<ResourceDetailsPanelProps> = ({ network, onClose }) => {
  const [activeTab, setActiveTab] = useState<DetailTab>('overview');

  const tabs: { id: DetailTab; label: string; count?: number }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'subnets', label: 'Subnets', count: network.subnets.length },
    { id: 'routes', label: 'Route Tables', count: network.routeTables.length },
    { id: 'peerings', label: 'Peerings', count: network.peerings.length },
    { id: 'gateways', label: 'Gateways', count: network.gateways.length },
    { id: 'security', label: 'Security', count: network.firewalls.length + network.securityGroups.length },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 rounded-lg border border-slate-700 w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">{network.name}</h2>
              <p className="text-slate-400 text-sm font-mono mb-3">{network.id}</p>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-slate-700 text-slate-300 rounded text-xs font-mono">
                  {network.type.toUpperCase()}
                </span>
                <span className="px-3 py-1 bg-slate-700 text-slate-300 rounded text-xs">
                  {network.region}
                </span>
                <span className={`px-3 py-1 rounded text-xs font-semibold border ${STATUS_CONFIG[network.status].bg} ${STATUS_CONFIG[network.status].border} ${STATUS_CONFIG[network.status].color}`}>
                  {network.status.toUpperCase()}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-700">
          <div className="flex px-6 gap-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-cyan-400 border-b-2 border-cyan-400'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
                {tab.count !== undefined && (
                  <span className="ml-2 px-2 py-0.5 bg-slate-700 rounded text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* CIDR Blocks */}
              <Card className="p-4">
                <h3 className="text-white font-semibold mb-3">CIDR Blocks</h3>
                <div className="flex flex-wrap gap-2">
                  {network.cidr.map((cidr, idx) => (
                    <span key={idx} className="px-3 py-2 bg-slate-700/50 text-white rounded font-mono">
                      {cidr}
                    </span>
                  ))}
                </div>
              </Card>

              {/* Metadata */}
              <Card className="p-4">
                <h3 className="text-white font-semibold mb-3">Metadata</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-slate-400 text-sm mb-1">Provider</p>
                    <p className="text-white">{network.provider.toUpperCase()}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm mb-1">Region</p>
                    <p className="text-white">{network.region}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm mb-1">Created</p>
                    <p className="text-white">{new Date(network.createdAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm mb-1">Last Modified</p>
                    <p className="text-white">{new Date(network.lastModified).toLocaleString()}</p>
                  </div>
                </div>
              </Card>

              {/* Tags */}
              {Object.keys(network.tags).length > 0 && (
                <Card className="p-4">
                  <h3 className="text-white font-semibold mb-3">Tags</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(network.tags).map(([key, value]) => (
                      <div key={key} className="flex items-center gap-2">
                        <span className="text-slate-400 text-sm">{key}:</span>
                        <span className="text-white text-sm font-mono">{value}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          )}

          {activeTab === 'subnets' && (
            <div className="space-y-4">
              {network.subnets.map((subnet) => {
                const usagePercent = (subnet.usedIps / (subnet.usedIps + subnet.availableIps)) * 100;
                return (
                  <Card key={subnet.id} className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="text-white font-semibold">{subnet.name}</h4>
                        <p className="text-slate-400 text-sm font-mono">{subnet.id}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${subnet.public ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-500/20 text-slate-400'}`}>
                        {subnet.public ? 'Public' : 'Private'}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div>
                        <p className="text-slate-400 text-xs mb-1">CIDR</p>
                        <p className="text-white font-mono text-sm">{subnet.cidr}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs mb-1">Availability Zone</p>
                        <p className="text-white text-sm">{subnet.availabilityZone}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs mb-1">Status</p>
                        <span className={`px-2 py-1 rounded text-xs ${STATUS_CONFIG[subnet.status].bg} ${STATUS_CONFIG[subnet.status].color}`}>
                          {subnet.status}
                        </span>
                      </div>
                    </div>

                    {/* IP Usage */}
                    <div className="mb-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-400">IP Usage</span>
                        <span className="text-white">{subnet.usedIps} / {subnet.usedIps + subnet.availableIps} ({usagePercent.toFixed(1)}%)</span>
                      </div>
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${usagePercent > 80 ? 'bg-red-500' : usagePercent > 60 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                          style={{ width: `${usagePercent}%` }}
                        />
                      </div>
                    </div>

                    {/* Resources */}
                    {subnet.resources.length > 0 && (
                      <div>
                        <p className="text-slate-400 text-xs mb-2">Resources ({subnet.resources.length})</p>
                        <div className="space-y-2">
                          {subnet.resources.slice(0, 3).map((resource) => (
                            <div key={resource.id} className="flex items-center gap-3 p-2 bg-slate-700/30 rounded text-xs">
                              <span className="text-slate-400">{resource.type}</span>
                              <span className="text-white font-mono flex-1">{resource.privateIp}</span>
                              {resource.publicIp && (
                                <span className="text-cyan-400 font-mono">{resource.publicIp}</span>
                              )}
                            </div>
                          ))}
                          {subnet.resources.length > 3 && (
                            <p className="text-slate-400 text-xs text-center">
                              +{subnet.resources.length - 3} more resources
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          )}

          {activeTab === 'routes' && (
            <div className="space-y-4">
              {network.routeTables.map((routeTable) => (
                <Card key={routeTable.id} className="p-4">
                  <h4 className="text-white font-semibold mb-3">{routeTable.name}</h4>
                  <p className="text-slate-400 text-sm font-mono mb-4">{routeTable.id}</p>

                  {/* Routes */}
                  <div className="mb-4">
                    <h5 className="text-slate-300 font-medium text-sm mb-2">Routes</h5>
                    <div className="space-y-2">
                      {routeTable.routes.map((route, idx) => {
                        const config = ROUTE_TARGET_TYPE_CONFIG[route.targetType];
                        return (
                          <div
                            key={idx}
                            className={`flex items-center justify-between p-3 rounded border ${
                              route.status === 'blackhole'
                                ? 'bg-red-500/10 border-red-500/30'
                                : 'bg-slate-700/30 border-slate-600'
                            }`}
                          >
                            <div className="flex items-center gap-3 flex-1">
                              <span className={`text-2xl ${config.color}`}>{config.icon}</span>
                              <div>
                                <p className="text-white font-mono text-sm">{route.destination}</p>
                                <p className="text-slate-400 text-xs">
                                  → {route.target} ({route.targetType})
                                  {route.propagated && <span className="ml-2 text-cyan-400">• Propagated</span>}
                                </p>
                              </div>
                            </div>
                            <span className={`px-2 py-1 rounded text-xs ${
                              route.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                            }`}>
                              {route.status}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Associations */}
                  {routeTable.associations.length > 0 && (
                    <div>
                      <h5 className="text-slate-300 font-medium text-sm mb-2">Associated Subnets</h5>
                      <div className="flex flex-wrap gap-2">
                        {routeTable.associations.map((assoc) => (
                          <span key={assoc.subnetId} className="px-3 py-1 bg-slate-700 text-slate-300 rounded text-xs">
                            {assoc.subnetName}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}

          {activeTab === 'peerings' && (
            <div className="space-y-4">
              {network.peerings.length === 0 ? (
                <Card className="p-8 text-center">
                  <p className="text-slate-400">No peering connections configured</p>
                </Card>
              ) : (
                network.peerings.map((peering) => (
                  <Card key={peering.id} className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="text-white font-semibold">{peering.name}</h4>
                        <p className="text-slate-400 text-sm font-mono">{peering.id}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        peering.status === 'active' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                        peering.status === 'pending' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                        'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}>
                        {peering.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div className="p-3 bg-slate-700/30 rounded">
                        <p className="text-slate-400 text-xs mb-1">Requester</p>
                        <p className="text-white text-sm font-semibold">{peering.requesterNetworkName}</p>
                        <p className="text-cyan-400 text-xs font-mono">{peering.requesterCidr}</p>
                      </div>
                      <div className="p-3 bg-slate-700/30 rounded">
                        <p className="text-slate-400 text-xs mb-1">Accepter</p>
                        <p className="text-white text-sm font-semibold">{peering.accepterNetworkName}</p>
                        <p className="text-cyan-400 text-xs font-mono">{peering.accepterCidr}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {peering.crossRegion && (
                        <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs">
                          Cross-Region
                        </span>
                      )}
                      {peering.crossAccount && (
                        <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">
                          Cross-Account
                        </span>
                      )}
                    </div>
                  </Card>
                ))
              )}
            </div>
          )}

          {activeTab === 'gateways' && (
            <div className="space-y-4">
              {network.gateways.length === 0 ? (
                <Card className="p-8 text-center">
                  <p className="text-slate-400">No gateways configured</p>
                </Card>
              ) : (
                network.gateways.map((gateway) => (
                  <Card key={gateway.id} className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="text-white font-semibold">{gateway.name}</h4>
                        <p className="text-slate-400 text-sm font-mono">{gateway.id}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${STATUS_CONFIG[gateway.status].bg} ${STATUS_CONFIG[gateway.status].color}`}>
                        {gateway.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-slate-400 text-xs mb-1">Type</p>
                        <p className="text-white text-sm">{gateway.type.replace('_', ' ').toUpperCase()}</p>
                      </div>
                      {gateway.publicIp && (
                        <div>
                          <p className="text-slate-400 text-xs mb-1">Public IP</p>
                          <p className="text-cyan-400 text-sm font-mono">{gateway.publicIp}</p>
                        </div>
                      )}
                      {gateway.bandwidth && (
                        <div>
                          <p className="text-slate-400 text-xs mb-1">Bandwidth</p>
                          <p className="text-white text-sm">{gateway.bandwidth}</p>
                        </div>
                      )}
                      {gateway.redundancy && (
                        <div>
                          <p className="text-slate-400 text-xs mb-1">Redundancy</p>
                          <p className="text-white text-sm">{gateway.redundancy.toUpperCase()}</p>
                        </div>
                      )}
                    </div>
                  </Card>
                ))
              )}
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              {/* Firewalls */}
              {network.firewalls.length > 0 && (
                <div>
                  <h3 className="text-white font-semibold mb-3">Firewalls</h3>
                  <div className="space-y-4">
                    {network.firewalls.map((firewall) => (
                      <Card key={firewall.id} className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="text-white font-semibold">{firewall.name}</h4>
                            <p className="text-slate-400 text-sm font-mono">{firewall.id}</p>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs ${STATUS_CONFIG[firewall.status].bg} ${STATUS_CONFIG[firewall.status].color}`}>
                            {firewall.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-3">
                          <div>
                            <p className="text-slate-400 text-xs mb-1">Type</p>
                            <p className="text-white text-sm">{firewall.type.replace('_', ' ').toUpperCase()}</p>
                          </div>
                          {firewall.vendor && (
                            <div>
                              <p className="text-slate-400 text-xs mb-1">Vendor</p>
                              <p className="text-white text-sm">{firewall.vendor}</p>
                            </div>
                          )}
                          <div>
                            <p className="text-slate-400 text-xs mb-1">Throughput</p>
                            <p className="text-white text-sm">{firewall.throughput}</p>
                          </div>
                        </div>

                        <div className="flex gap-2 mb-3">
                          {firewall.loggingEnabled && (
                            <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">
                              Logging Enabled
                            </span>
                          )}
                          {firewall.intrusionPrevention && (
                            <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs">
                              IPS Enabled
                            </span>
                          )}
                        </div>

                        <div>
                          <p className="text-slate-400 text-xs mb-2">Rules ({firewall.rules.length})</p>
                          <div className="space-y-1">
                            {firewall.rules.slice(0, 3).map((rule) => (
                              <div key={rule.id} className="flex items-center justify-between p-2 bg-slate-700/30 rounded text-xs">
                                <span className="text-white">{rule.name}</span>
                                <span className={`px-2 py-1 rounded ${
                                  rule.action === 'allow' ? 'bg-emerald-500/20 text-emerald-400' :
                                  rule.action === 'deny' ? 'bg-red-500/20 text-red-400' :
                                  'bg-amber-500/20 text-amber-400'
                                }`}>
                                  {rule.action.toUpperCase()}
                                </span>
                              </div>
                            ))}
                            {firewall.rules.length > 3 && (
                              <p className="text-slate-400 text-xs text-center py-1">
                                +{firewall.rules.length - 3} more rules
                              </p>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Security Groups */}
              {network.securityGroups.length > 0 && (
                <div>
                  <h3 className="text-white font-semibold mb-3">Security Groups / NSGs</h3>
                  <div className="space-y-4">
                    {network.securityGroups.map((sg) => (
                      <Card key={sg.id} className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="text-white font-semibold">{sg.name}</h4>
                            <p className="text-slate-400 text-sm">{sg.description}</p>
                            <p className="text-slate-400 text-xs font-mono mt-1">{sg.id}</p>
                          </div>
                          <span className="px-2 py-1 bg-slate-700 text-slate-300 rounded text-xs">
                            {sg.type === 'security_group' ? 'Security Group' : 'NSG'}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-slate-400 text-xs mb-2">Inbound Rules ({sg.inboundRules.length})</p>
                            <div className="space-y-1">
                              {sg.inboundRules.slice(0, 2).map((rule) => (
                                <div key={rule.id} className="p-2 bg-slate-700/30 rounded text-xs">
                                  <div className="flex justify-between mb-1">
                                    <span className="text-white">{rule.protocol.toUpperCase()}</span>
                                    <span className={`px-1 rounded ${
                                      rule.action === 'allow' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                                    }`}>
                                      {rule.action}
                                    </span>
                                  </div>
                                  <p className="text-slate-400">Port: {rule.portRange}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="text-slate-400 text-xs mb-2">Outbound Rules ({sg.outboundRules.length})</p>
                            <div className="space-y-1">
                              {sg.outboundRules.slice(0, 2).map((rule) => (
                                <div key={rule.id} className="p-2 bg-slate-700/30 rounded text-xs">
                                  <div className="flex justify-between mb-1">
                                    <span className="text-white">{rule.protocol.toUpperCase()}</span>
                                    <span className={`px-1 rounded ${
                                      rule.action === 'allow' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                                    }`}>
                                      {rule.action}
                                    </span>
                                  </div>
                                  <p className="text-slate-400">Port: {rule.portRange}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
