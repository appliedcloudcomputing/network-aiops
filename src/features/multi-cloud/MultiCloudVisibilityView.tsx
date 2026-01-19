/**
 * Multi-Cloud Visibility View - Unified view of AWS, Azure, GCP, OCI, and On-Premises networks
 */

import React, { useState, useMemo } from 'react';
import { PageContainer, Card, Button } from '../../components';
import { CloudProviderCard, NetworkResourceGrid, ResourceDetailsPanel } from './components';
import { multiCloudNetworks, transitGatewayData } from '../../data/multiCloudData';
import type { CloudProvider, CloudNetwork, MultiCloudSummary, ProviderSummary, TransitAttachment } from '../../types/multiCloudVisibility';

export const MultiCloudVisibilityView: React.FC = () => {
  const [selectedProvider, setSelectedProvider] = useState<CloudProvider | 'all'>('all');
  const [selectedNetwork, setSelectedNetwork] = useState<CloudNetwork | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate multi-cloud summary
  const summary: MultiCloudSummary = useMemo(() => {
    const providerSummaries: Record<CloudProvider, ProviderSummary> = {
      aws: { networks: 0, subnets: 0, activeResources: 0, regions: [], health: 'healthy' },
      azure: { networks: 0, subnets: 0, activeResources: 0, regions: [], health: 'healthy' },
      gcp: { networks: 0, subnets: 0, activeResources: 0, regions: [], health: 'healthy' },
      oci: { networks: 0, subnets: 0, activeResources: 0, regions: [], health: 'healthy' },
      onprem: { networks: 0, subnets: 0, activeResources: 0, regions: [], health: 'healthy' },
    };

    let totalNetworks = 0;
    let totalSubnets = 0;
    let totalRouteTables = 0;
    let totalPeerings = 0;
    let totalGateways = 0;
    let totalFirewalls = 0;
    let totalSecurityGroups = 0;

    multiCloudNetworks.forEach((network: CloudNetwork) => {
      const provider: CloudProvider = network.provider;
      providerSummaries[provider].networks++;
      providerSummaries[provider].subnets += network.subnets.length;

      // Count active resources in subnets
      const activeResources = network.subnets.reduce((acc: number, subnet) => acc + subnet.resources.length, 0);
      providerSummaries[provider].activeResources += activeResources;

      // Add region if not already present
      if (!providerSummaries[provider].regions.includes(network.region)) {
        providerSummaries[provider].regions.push(network.region);
      }

      // Determine health
      if (network.status === 'error') {
        providerSummaries[provider].health = 'critical';
      } else if (network.status === 'degraded' && providerSummaries[provider].health !== 'critical') {
        providerSummaries[provider].health = 'degraded';
      }

      // Totals
      totalNetworks++;
      totalSubnets += network.subnets.length;
      totalRouteTables += network.routeTables.length;
      totalPeerings += network.peerings.length;
      totalGateways += network.gateways.length;
      totalFirewalls += network.firewalls.length;
      totalSecurityGroups += network.securityGroups.length;
    });

    return {
      totalNetworks,
      totalSubnets,
      totalRouteTables,
      totalPeerings,
      totalGateways,
      totalFirewalls,
      totalSecurityGroups,
      byProvider: providerSummaries,
    };
  }, []);

  // Filter networks based on provider and search
  const filteredNetworks = useMemo(() => {
    let networks = multiCloudNetworks;

    // Filter by provider
    if (selectedProvider !== 'all') {
      networks = networks.filter((n: CloudNetwork) => n.provider === selectedProvider);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      networks = networks.filter(
        (n: CloudNetwork) =>
          n.name.toLowerCase().includes(query) ||
          n.id.toLowerCase().includes(query) ||
          n.region.toLowerCase().includes(query) ||
          n.cidr.some((cidr: string) => cidr.includes(query))
      );
    }

    return networks;
  }, [selectedProvider, searchQuery]);

  const providers: CloudProvider[] = ['aws', 'azure', 'gcp', 'oci', 'onprem'];

  return (
    <PageContainer>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Multi-Cloud Visibility</h1>
        <p className="text-slate-400">
          Unified view of network infrastructure across AWS, Azure, GCP, OCI, and On-Premises
        </p>
      </div>

      {/* Global Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
        <Card className="p-4 text-center">
          <p className="text-3xl font-bold text-white mb-1">{summary.totalNetworks}</p>
          <p className="text-slate-400 text-xs">Networks</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-3xl font-bold text-white mb-1">{summary.totalSubnets}</p>
          <p className="text-slate-400 text-xs">Subnets</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-3xl font-bold text-white mb-1">{summary.totalRouteTables}</p>
          <p className="text-slate-400 text-xs">Route Tables</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-3xl font-bold text-white mb-1">{summary.totalPeerings}</p>
          <p className="text-slate-400 text-xs">Peerings</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-3xl font-bold text-white mb-1">{summary.totalGateways}</p>
          <p className="text-slate-400 text-xs">Gateways</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-3xl font-bold text-white mb-1">{summary.totalFirewalls}</p>
          <p className="text-slate-400 text-xs">Firewalls</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-3xl font-bold text-white mb-1">{summary.totalSecurityGroups}</p>
          <p className="text-slate-400 text-xs">Security Groups</p>
        </Card>
      </div>

      {/* Cloud Provider Selector */}
      <Card className="p-6 mb-6">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
          </svg>
          Cloud Providers
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {/* All Providers */}
          <button
            onClick={() => setSelectedProvider('all')}
            className={`p-4 rounded-lg border-2 transition-all ${
              selectedProvider === 'all'
                ? 'border-cyan-500 bg-cyan-500/10 scale-105'
                : 'border-slate-600 bg-slate-800 hover:border-slate-500'
            }`}
          >
            <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-700 rounded-lg flex items-center justify-center text-2xl mb-2 mx-auto">
              🌐
            </div>
            <h4 className="text-white font-semibold text-sm text-center">All Providers</h4>
            <p className="text-slate-400 text-xs text-center mt-1">{summary.totalNetworks} networks</p>
          </button>

          {/* Provider Cards */}
          {providers.map((provider) => (
            <CloudProviderCard
              key={provider}
              provider={provider}
              summary={summary.byProvider[provider]}
              selected={selectedProvider === provider}
              onClick={() => setSelectedProvider(provider)}
            />
          ))}
        </div>
      </Card>

      {/* Search & Filters */}
      <Card className="p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, ID, CIDR, or region..."
                className="w-full pl-10 pr-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filters
            </Button>
            <Button variant="secondary">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export
            </Button>
          </div>
        </div>
      </Card>

      {/* Results Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">
          {selectedProvider === 'all' ? 'All Networks' : `${selectedProvider.toUpperCase()} Networks`}
          <span className="ml-2 text-slate-400 text-sm font-normal">
            ({filteredNetworks.length} {filteredNetworks.length === 1 ? 'network' : 'networks'})
          </span>
        </h3>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </Button>
          <Button variant="ghost" size="sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </Button>
        </div>
      </div>

      {/* Network Grid */}
      {filteredNetworks.length === 0 ? (
        <Card className="p-12 text-center">
          <svg className="w-16 h-16 text-slate-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-slate-400 text-lg mb-2">No networks found</p>
          <p className="text-slate-500 text-sm">
            {searchQuery
              ? 'Try adjusting your search query or filters'
              : 'No networks configured for the selected provider'}
          </p>
        </Card>
      ) : (
        <NetworkResourceGrid networks={filteredNetworks} onSelectNetwork={setSelectedNetwork} />
      )}

      {/* Transit Gateway Info */}
      <Card className="p-6 mt-6">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Transit Gateway
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <p className="text-slate-400 text-sm mb-1">Name</p>
            <p className="text-white font-semibold">{transitGatewayData.name}</p>
          </div>
          <div>
            <p className="text-slate-400 text-sm mb-1">Region</p>
            <p className="text-white">{transitGatewayData.region}</p>
          </div>
          <div>
            <p className="text-slate-400 text-sm mb-1">Attachments</p>
            <p className="text-white font-semibold">{transitGatewayData.attachments.length}</p>
          </div>
          <div>
            <p className="text-slate-400 text-sm mb-1">Status</p>
            <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-sm">
              {transitGatewayData.status.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-700">
          <p className="text-slate-400 text-sm mb-2">Attachments</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {transitGatewayData.attachments.map((attachment: TransitAttachment) => (
              <div key={attachment.id} className="p-3 bg-slate-700/30 rounded">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-white text-sm font-semibold">{attachment.name}</p>
                  <span className="px-2 py-0.5 bg-slate-600 text-slate-300 rounded text-xs">
                    {attachment.type}
                  </span>
                </div>
                <p className="text-slate-400 text-xs">{attachment.networkName}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="mt-6 flex justify-between">
        <Button variant="ghost">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh Data
        </Button>
        <div className="flex gap-2">
          <Button variant="secondary">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            View Topology
          </Button>
          <Button variant="primary">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Network
          </Button>
        </div>
      </div>

      {/* Resource Details Panel (Modal) */}
      {selectedNetwork && (
        <ResourceDetailsPanel network={selectedNetwork} onClose={() => setSelectedNetwork(null)} />
      )}
    </PageContainer>
  );
};
