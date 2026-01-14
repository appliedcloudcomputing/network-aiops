/**
 * Custom hook for cloud resource management
 */

import { useState, useEffect, useCallback } from 'react';
import type {
  CloudProvider,
  CloudOverview,
  VPC,
  Subnet,
  SecurityGroup,
  LoadBalancer,
  TransitGateway,
} from '../../../types/cloud';
import { cloudService } from '../../../services/cloudService';

export type ResourceType = 'vpcs' | 'security-groups' | 'load-balancers' | 'transit-gateways';

interface UseCloudManagementReturn {
  activeProvider: CloudProvider;
  activeResource: ResourceType;
  overview: CloudOverview | null;
  vpcs: VPC[];
  selectedVpc: VPC | null;
  subnets: Subnet[];
  securityGroups: SecurityGroup[];
  selectedSecurityGroup: SecurityGroup | null;
  loadBalancers: LoadBalancer[];
  transitGateways: TransitGateway[];
  isLoading: boolean;
  isSyncing: boolean;
  error: string | null;

  // Actions
  setActiveProvider: (provider: CloudProvider) => void;
  setActiveResource: (resource: ResourceType) => void;
  selectVpc: (vpcId: string | null) => Promise<void>;
  selectSecurityGroup: (sgId: string | null) => Promise<void>;
  syncResources: () => Promise<void>;
  refreshData: () => Promise<void>;
  clearError: () => void;
}

export const useCloudManagement = (): UseCloudManagementReturn => {
  const [activeProvider, setActiveProvider] = useState<CloudProvider>('aws');
  const [activeResource, setActiveResource] = useState<ResourceType>('vpcs');
  const [overview, setOverview] = useState<CloudOverview | null>(null);
  const [vpcs, setVpcs] = useState<VPC[]>([]);
  const [selectedVpc, setSelectedVpc] = useState<VPC | null>(null);
  const [subnets, setSubnets] = useState<Subnet[]>([]);
  const [securityGroups, setSecurityGroups] = useState<SecurityGroup[]>([]);
  const [selectedSecurityGroup, setSelectedSecurityGroup] = useState<SecurityGroup | null>(null);
  const [loadBalancers, setLoadBalancers] = useState<LoadBalancer[]>([]);
  const [transitGateways, setTransitGateways] = useState<TransitGateway[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load overview when provider changes
  useEffect(() => {
    const loadOverview = async () => {
      try {
        const data = await cloudService.getOverview(activeProvider);
        setOverview(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load overview');
      }
    };
    loadOverview();
  }, [activeProvider]);

  // Load resource data when provider or resource type changes
  useEffect(() => {
    const loadResourceData = async () => {
      setIsLoading(true);
      setError(null);
      setSelectedVpc(null);
      setSelectedSecurityGroup(null);
      setSubnets([]);

      try {
        switch (activeResource) {
          case 'vpcs':
            const vpcData = await cloudService.getVPCs(activeProvider);
            setVpcs(vpcData);
            break;
          case 'security-groups':
            const sgData = await cloudService.getSecurityGroups(activeProvider);
            setSecurityGroups(sgData);
            break;
          case 'load-balancers':
            const lbData = await cloudService.getLoadBalancers(activeProvider);
            setLoadBalancers(lbData);
            break;
          case 'transit-gateways':
            const tgData = await cloudService.getTransitGateways(activeProvider);
            setTransitGateways(tgData);
            break;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load resources');
      } finally {
        setIsLoading(false);
      }
    };

    loadResourceData();
  }, [activeProvider, activeResource]);

  const selectVpc = useCallback(async (vpcId: string | null) => {
    if (!vpcId) {
      setSelectedVpc(null);
      setSubnets([]);
      return;
    }

    try {
      const [vpc, subnetData] = await Promise.all([
        cloudService.getVPCDetails(activeProvider, vpcId),
        cloudService.getSubnets(activeProvider, vpcId),
      ]);
      setSelectedVpc(vpc);
      setSubnets(subnetData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load VPC details');
    }
  }, [activeProvider]);

  const selectSecurityGroup = useCallback(async (sgId: string | null) => {
    if (!sgId) {
      setSelectedSecurityGroup(null);
      return;
    }

    try {
      const sg = await cloudService.getSecurityGroupDetails(activeProvider, sgId);
      setSelectedSecurityGroup(sg);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load security group details');
    }
  }, [activeProvider]);

  const syncResources = useCallback(async () => {
    setIsSyncing(true);
    setError(null);

    try {
      const result = await cloudService.syncResources(activeProvider);
      if (result.success) {
        // Refresh overview after sync
        const data = await cloudService.getOverview(activeProvider);
        setOverview(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sync resources');
    } finally {
      setIsSyncing(false);
    }
  }, [activeProvider]);

  const refreshData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [overviewData, vpcData, sgData, lbData, tgData] = await Promise.all([
        cloudService.getOverview(activeProvider),
        cloudService.getVPCs(activeProvider),
        cloudService.getSecurityGroups(activeProvider),
        cloudService.getLoadBalancers(activeProvider),
        cloudService.getTransitGateways(activeProvider),
      ]);

      setOverview(overviewData);
      setVpcs(vpcData);
      setSecurityGroups(sgData);
      setLoadBalancers(lbData);
      setTransitGateways(tgData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh data');
    } finally {
      setIsLoading(false);
    }
  }, [activeProvider]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
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
    refreshData,
    clearError,
  };
};
