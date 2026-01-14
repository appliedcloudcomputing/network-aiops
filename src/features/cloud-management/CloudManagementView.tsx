/**
 * Cloud Management feature - Main view component
 */

import React from 'react';
import type { CloudProvider, VPC, SecurityGroup, LoadBalancer, TransitGateway, Subnet, CloudOverview } from '../../types';
import { PageContainer, Card } from '../../components';
import { useCloudManagement, ResourceType } from './hooks/useCloudManagement';

const CLOUD_PROVIDERS: { id: CloudProvider; name: string; color: string }[] = [
  { id: 'aws', name: 'AWS', color: 'from-orange-500 to-orange-600' },
  { id: 'azure', name: 'Azure', color: 'from-blue-500 to-blue-600' },
  { id: 'gcp', name: 'GCP', color: 'from-red-500 to-green-500' },
];

const RESOURCE_TABS: { id: ResourceType; name: string; icon: string }[] = [
  { id: 'vpcs', name: 'VPCs / VNets', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
  { id: 'security-groups', name: 'Security Groups', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
  { id: 'load-balancers', name: 'Load Balancers', icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' },
  { id: 'transit-gateways', name: 'Transit Gateways', icon: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1' },
];

export const CloudManagementView: React.FC = () => {
  const {
    activeProvider,
    activeResource,
    overview,
    vpcs,
    selectedVpc,
    subnets,
    securityGroups,
    selectedSecurityGroup,
    loadBalancers,
    transitGateways,
    isLoading,
    isSyncing,
    error,
    setActiveProvider,
    setActiveResource,
    selectVpc,
    selectSecurityGroup,
    syncResources,
  } = useCloudManagement();

  return (
    <PageContainer>
      {/* Provider Tabs */}
      <div className="bg-white rounded-xl shadow-lg mb-6 overflow-hidden flex">
        {CLOUD_PROVIDERS.map((provider) => (
          <button
            key={provider.id}
            onClick={() => setActiveProvider(provider.id)}
            className={`flex-1 px-6 py-4 font-bold transition-all ${
              activeProvider === provider.id
                ? `bg-gradient-to-r ${provider.color} text-white`
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            {provider.name}
          </button>
        ))}
      </div>

      {/* Overview Stats */}
      {overview && <OverviewStats overview={overview} isSyncing={isSyncing} onSync={syncResources} />}

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center justify-between">
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {/* Resource Tabs */}
      <div className="flex gap-2 mb-6">
        {RESOURCE_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveResource(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeResource === tab.id
                ? 'bg-cyan-500 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-50 shadow'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
            </svg>
            {tab.name}
          </button>
        ))}
      </div>

      {/* Resource Content */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
          <span className="ml-3 text-slate-600">Loading resources...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {activeResource === 'vpcs' && (
            <>
              <div className="lg:col-span-1">
                <VPCList vpcs={vpcs} selectedId={selectedVpc?.id} onSelect={selectVpc} />
              </div>
              <div className="lg:col-span-2">
                {selectedVpc ? (
                  <VPCDetails vpc={selectedVpc} subnets={subnets} />
                ) : (
                  <EmptyState message="Select a VPC to view details" />
                )}
              </div>
            </>
          )}

          {activeResource === 'security-groups' && (
            <>
              <div className="lg:col-span-1">
                <SecurityGroupList groups={securityGroups} selectedId={selectedSecurityGroup?.id} onSelect={selectSecurityGroup} />
              </div>
              <div className="lg:col-span-2">
                {selectedSecurityGroup ? (
                  <SecurityGroupDetails group={selectedSecurityGroup} />
                ) : (
                  <EmptyState message="Select a security group to view rules" />
                )}
              </div>
            </>
          )}

          {activeResource === 'load-balancers' && (
            <div className="lg:col-span-3">
              <LoadBalancerList loadBalancers={loadBalancers} />
            </div>
          )}

          {activeResource === 'transit-gateways' && (
            <div className="lg:col-span-3">
              <TransitGatewayList gateways={transitGateways} />
            </div>
          )}
        </div>
      )}
    </PageContainer>
  );
};

// Overview Stats Component
const OverviewStats: React.FC<{ overview: CloudOverview; isSyncing: boolean; onSync: () => void }> = ({
  overview,
  isSyncing,
  onSync,
}) => {
  const stats = [
    { label: 'VPCs', value: overview.vpcCount, color: 'text-blue-600' },
    { label: 'Subnets', value: overview.subnetCount, color: 'text-green-600' },
    { label: 'Security Groups', value: overview.securityGroupCount, color: 'text-purple-600' },
    { label: 'Load Balancers', value: overview.loadBalancerCount, color: 'text-orange-600' },
    { label: 'Instances', value: overview.totalInstances, color: 'text-cyan-600' },
  ];

  return (
    <Card className="bg-white shadow-lg mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${overview.healthScore >= 90 ? 'bg-green-500' : overview.healthScore >= 70 ? 'bg-amber-500' : 'bg-red-500'}`}></div>
            <span className="text-sm text-slate-600">Health: <span className="font-semibold">{overview.healthScore}%</span></span>
          </div>
          {overview.issueCount > 0 && (
            <span className="text-sm text-red-600 bg-red-50 px-2 py-1 rounded">
              {overview.issueCount} issues
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500">
            Last sync: {new Date(overview.lastSync).toLocaleTimeString()}
          </span>
          <button
            onClick={onSync}
            disabled={isSyncing}
            className="flex items-center gap-1 px-3 py-1.5 text-sm bg-cyan-500 text-white rounded hover:bg-cyan-600 disabled:bg-slate-300 transition-colors"
          >
            <svg className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {isSyncing ? 'Syncing...' : 'Sync'}
          </button>
        </div>
      </div>
      <div className="grid grid-cols-5 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-slate-500">{stat.label}</p>
          </div>
        ))}
      </div>
    </Card>
  );
};

// VPC List Component
const VPCList: React.FC<{ vpcs: VPC[]; selectedId?: string; onSelect: (id: string) => void }> = ({
  vpcs,
  selectedId,
  onSelect,
}) => (
  <Card className="bg-white shadow-lg">
    <h3 className="text-lg font-semibold text-slate-800 mb-4">VPCs / VNets ({vpcs.length})</h3>
    <div className="space-y-2 max-h-[500px] overflow-y-auto">
      {vpcs.map((vpc) => (
        <button
          key={vpc.id}
          onClick={() => onSelect(vpc.id)}
          className={`w-full text-left p-3 rounded-lg transition-colors ${
            selectedId === vpc.id
              ? 'bg-cyan-50 border-2 border-cyan-500'
              : 'bg-slate-50 hover:bg-slate-100 border-2 border-transparent'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="font-medium text-slate-800">{vpc.name}</span>
            <StatusBadge status={vpc.status} />
          </div>
          <p className="text-xs text-slate-500 font-mono">{vpc.cidrBlock}</p>
          <div className="flex gap-3 mt-2 text-xs text-slate-500">
            <span>{vpc.subnetCount} subnets</span>
            <span>{vpc.instanceCount} instances</span>
          </div>
        </button>
      ))}
    </div>
  </Card>
);

// VPC Details Component
const VPCDetails: React.FC<{ vpc: VPC; subnets: Subnet[] }> = ({ vpc, subnets }) => (
  <Card className="bg-white shadow-lg">
    <div className="flex items-center justify-between mb-4">
      <div>
        <h3 className="text-lg font-semibold text-slate-800">{vpc.name}</h3>
        <p className="text-sm text-slate-500 font-mono">{vpc.id}</p>
      </div>
      <StatusBadge status={vpc.status} />
    </div>

    <div className="grid grid-cols-3 gap-4 mb-6">
      <div className="bg-slate-50 rounded-lg p-3">
        <p className="text-xs text-slate-500">CIDR Block</p>
        <p className="font-mono font-medium text-slate-800">{vpc.cidrBlock}</p>
      </div>
      <div className="bg-slate-50 rounded-lg p-3">
        <p className="text-xs text-slate-500">Region</p>
        <p className="font-medium text-slate-800">{vpc.region}</p>
      </div>
      <div className="bg-slate-50 rounded-lg p-3">
        <p className="text-xs text-slate-500">Instances</p>
        <p className="font-medium text-slate-800">{vpc.instanceCount}</p>
      </div>
    </div>

    <h4 className="font-semibold text-slate-700 mb-3">Subnets ({subnets.length})</h4>
    <div className="space-y-2 max-h-[300px] overflow-y-auto">
      {subnets.map((subnet) => (
        <div key={subnet.id} className="bg-slate-50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="font-medium text-slate-800">{subnet.name}</span>
            <span className={`text-xs px-2 py-0.5 rounded ${subnet.isPublic ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-700'}`}>
              {subnet.isPublic ? 'Public' : 'Private'}
            </span>
          </div>
          <div className="flex gap-4 text-xs text-slate-500">
            <span className="font-mono">{subnet.cidrBlock}</span>
            <span>{subnet.availabilityZone}</span>
            <span>{subnet.availableIps} IPs available</span>
          </div>
        </div>
      ))}
    </div>
  </Card>
);

// Security Group List Component
const SecurityGroupList: React.FC<{ groups: SecurityGroup[]; selectedId?: string; onSelect: (id: string) => void }> = ({
  groups,
  selectedId,
  onSelect,
}) => (
  <Card className="bg-white shadow-lg">
    <h3 className="text-lg font-semibold text-slate-800 mb-4">Security Groups ({groups.length})</h3>
    <div className="space-y-2 max-h-[500px] overflow-y-auto">
      {groups.map((group) => (
        <button
          key={group.id}
          onClick={() => onSelect(group.id)}
          className={`w-full text-left p-3 rounded-lg transition-colors ${
            selectedId === group.id
              ? 'bg-cyan-50 border-2 border-cyan-500'
              : 'bg-slate-50 hover:bg-slate-100 border-2 border-transparent'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="font-medium text-slate-800">{group.name}</span>
          </div>
          <p className="text-xs text-slate-500 truncate">{group.description}</p>
          <div className="flex gap-3 mt-2 text-xs">
            <span className="text-green-600">{group.inboundRules.length} inbound</span>
            <span className="text-blue-600">{group.outboundRules.length} outbound</span>
          </div>
        </button>
      ))}
    </div>
  </Card>
);

// Security Group Details Component
const SecurityGroupDetails: React.FC<{ group: SecurityGroup }> = ({ group }) => (
  <Card className="bg-white shadow-lg">
    <div className="mb-4">
      <h3 className="text-lg font-semibold text-slate-800">{group.name}</h3>
      <p className="text-sm text-slate-500">{group.description}</p>
      <p className="text-xs text-slate-400 font-mono mt-1">{group.id}</p>
    </div>

    <div className="mb-4">
      <p className="text-xs text-slate-500">VPC: <span className="text-slate-700">{group.vpcName}</span></p>
    </div>

    {/* Inbound Rules */}
    <div className="mb-6">
      <h4 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-green-500"></span>
        Inbound Rules ({group.inboundRules.length})
      </h4>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-slate-500 border-b">
              <th className="pb-2">Protocol</th>
              <th className="pb-2">Port Range</th>
              <th className="pb-2">Source</th>
              <th className="pb-2">Description</th>
            </tr>
          </thead>
          <tbody>
            {group.inboundRules.map((rule) => (
              <tr key={rule.id} className="border-b border-slate-100">
                <td className="py-2 font-mono">{rule.protocol}</td>
                <td className="py-2">{rule.portRange}</td>
                <td className="py-2 font-mono text-xs">{rule.source}</td>
                <td className="py-2 text-slate-500">{rule.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    {/* Outbound Rules */}
    <div>
      <h4 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
        Outbound Rules ({group.outboundRules.length})
      </h4>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-slate-500 border-b">
              <th className="pb-2">Protocol</th>
              <th className="pb-2">Port Range</th>
              <th className="pb-2">Destination</th>
              <th className="pb-2">Description</th>
            </tr>
          </thead>
          <tbody>
            {group.outboundRules.map((rule) => (
              <tr key={rule.id} className="border-b border-slate-100">
                <td className="py-2 font-mono">{rule.protocol}</td>
                <td className="py-2">{rule.portRange}</td>
                <td className="py-2 font-mono text-xs">{rule.source}</td>
                <td className="py-2 text-slate-500">{rule.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </Card>
);

// Load Balancer List Component
const LoadBalancerList: React.FC<{ loadBalancers: LoadBalancer[] }> = ({ loadBalancers }) => (
  <Card className="bg-white shadow-lg">
    <h3 className="text-lg font-semibold text-slate-800 mb-4">Load Balancers ({loadBalancers.length})</h3>
    <div className="space-y-4">
      {loadBalancers.length === 0 ? (
        <p className="text-center text-slate-500 py-8">No load balancers found</p>
      ) : (
        loadBalancers.map((lb) => (
          <div key={lb.id} className="bg-slate-50 rounded-lg p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="font-medium text-slate-800">{lb.name}</h4>
                <p className="text-xs text-slate-500 font-mono">{lb.id}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded ${
                  lb.type === 'application' ? 'bg-blue-100 text-blue-700' :
                  lb.type === 'network' ? 'bg-purple-100 text-purple-700' :
                  'bg-slate-200 text-slate-700'
                }`}>
                  {lb.type.toUpperCase()}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded ${
                  lb.scheme === 'internet-facing' ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-700'
                }`}>
                  {lb.scheme}
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-500 font-mono mb-3 truncate">{lb.dnsName}</p>
            <div className="flex items-center gap-6 text-sm">
              <div>
                <span className="text-slate-500">Listeners:</span> <span className="font-medium">{lb.listenerCount}</span>
              </div>
              <div>
                <span className="text-slate-500">Target Groups:</span> <span className="font-medium">{lb.targetGroupCount}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-slate-500">Health:</span>
                <span className={`font-medium ${lb.healthyTargets === lb.totalTargets ? 'text-green-600' : 'text-amber-600'}`}>
                  {lb.healthyTargets}/{lb.totalTargets}
                </span>
                <span className="text-slate-400">targets</span>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  </Card>
);

// Transit Gateway List Component
const TransitGatewayList: React.FC<{ gateways: TransitGateway[] }> = ({ gateways }) => (
  <Card className="bg-white shadow-lg">
    <h3 className="text-lg font-semibold text-slate-800 mb-4">Transit Gateways ({gateways.length})</h3>
    {gateways.length === 0 ? (
      <p className="text-center text-slate-500 py-8">No transit gateways found</p>
    ) : (
      <div className="space-y-6">
        {gateways.map((tgw) => (
          <div key={tgw.id} className="bg-slate-50 rounded-lg p-4">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="font-medium text-slate-800">{tgw.name}</h4>
                <p className="text-xs text-slate-500 font-mono">{tgw.id}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">{tgw.region}</span>
                <StatusBadge status={tgw.state === 'available' ? 'active' : tgw.state === 'pending' ? 'pending' : 'error'} />
              </div>
            </div>

            <div className="mb-4">
              <span className="text-sm text-slate-600">{tgw.routeTables} route tables</span>
            </div>

            <div>
              <h5 className="text-sm font-medium text-slate-700 mb-2">Attachments ({tgw.attachments.length})</h5>
              <div className="grid grid-cols-2 gap-2">
                {tgw.attachments.map((attachment) => (
                  <div key={attachment.id} className="bg-white rounded p-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-slate-800">{attachment.resourceName}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded ${
                        attachment.resourceType === 'vpc' ? 'bg-blue-100 text-blue-700' :
                        attachment.resourceType === 'vpn' ? 'bg-orange-100 text-orange-700' :
                        attachment.resourceType === 'peering' ? 'bg-purple-100 text-purple-700' :
                        'bg-slate-200 text-slate-700'
                      }`}>
                        {attachment.resourceType}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-mono">{attachment.resourceId}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </Card>
);

// Status Badge Component
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const config = {
    active: { bg: 'bg-green-100', text: 'text-green-700', label: 'Active' },
    available: { bg: 'bg-green-100', text: 'text-green-700', label: 'Available' },
    inactive: { bg: 'bg-slate-100', text: 'text-slate-700', label: 'Inactive' },
    pending: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Pending' },
    error: { bg: 'bg-red-100', text: 'text-red-700', label: 'Error' },
    deleting: { bg: 'bg-red-100', text: 'text-red-700', label: 'Deleting' },
  };
  const c = config[status as keyof typeof config] || config.inactive;
  return (
    <span className={`text-xs px-2 py-0.5 rounded ${c.bg} ${c.text}`}>{c.label}</span>
  );
};

// Empty State Component
const EmptyState: React.FC<{ message: string }> = ({ message }) => (
  <Card className="bg-slate-50 border-2 border-dashed border-slate-200">
    <div className="text-center py-12">
      <svg className="w-12 h-12 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
      <p className="text-slate-500">{message}</p>
    </div>
  </Card>
);
