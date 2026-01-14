/**
 * Network Statistics panel for dashboard
 * Displays network health metrics including packet drop rate
 */

import React from 'react';
import { Card, ProgressBar, Badge } from '../../../components';

export interface NetworkStatData {
  packetDropRate: number;
  throughput: {
    ingress: number;
    egress: number;
  };
  connections: {
    active: number;
    blocked: number;
  };
  latency: {
    avg: number;
    p95: number;
    p99: number;
  };
  firewallHealth: {
    cpu: number;
    memory: number;
    sessions: number;
  };
}

interface NetworkStatsProps {
  stats: NetworkStatData;
}

const getDropRateStatus = (rate: number): 'success' | 'warning' | 'error' => {
  if (rate < 0.1) return 'success';
  if (rate < 1) return 'warning';
  return 'error';
};

const getHealthStatus = (value: number): 'success' | 'warning' | 'error' => {
  if (value < 60) return 'success';
  if (value < 80) return 'warning';
  return 'error';
};

export const NetworkStats: React.FC<NetworkStatsProps> = ({ stats }) => {
  const dropRateStatus = getDropRateStatus(stats.packetDropRate);

  return (
    <Card className="bg-white shadow-lg h-full">
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Network Statistics</h3>

        {/* Packet Drop Rate - Featured metric */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Packet Drop Rate</span>
            <Badge variant={dropRateStatus}>
              {stats.packetDropRate.toFixed(2)}%
            </Badge>
          </div>
          <ProgressBar
            value={Math.min(stats.packetDropRate * 10, 100)}
            max={100}
            color={dropRateStatus === 'success' ? 'green' : dropRateStatus === 'warning' ? 'yellow' : 'red'}
          />
          <p className="text-xs text-gray-500 mt-1">
            {dropRateStatus === 'success' && 'Excellent - Network is performing well'}
            {dropRateStatus === 'warning' && 'Elevated - Monitor for potential issues'}
            {dropRateStatus === 'error' && 'Critical - Investigate immediately'}
          </p>
        </div>

        {/* Throughput */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Throughput</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-lg font-bold text-green-600">
                {stats.throughput.ingress.toFixed(1)} Gbps
              </div>
              <div className="text-xs text-gray-500">Ingress</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-lg font-bold text-blue-600">
                {stats.throughput.egress.toFixed(1)} Gbps
              </div>
              <div className="text-xs text-gray-500">Egress</div>
            </div>
          </div>
        </div>

        {/* Connections */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Connections</h4>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xl font-bold text-gray-900">{stats.connections.active.toLocaleString()}</span>
              <span className="text-sm text-gray-500 ml-1">active</span>
            </div>
            <div className="text-right">
              <span className="text-xl font-bold text-red-600">{stats.connections.blocked.toLocaleString()}</span>
              <span className="text-sm text-gray-500 ml-1">blocked/hr</span>
            </div>
          </div>
        </div>

        {/* Latency */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Latency</h4>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 bg-gray-50 rounded">
              <div className="font-medium text-gray-900">{stats.latency.avg}ms</div>
              <div className="text-xs text-gray-500">Avg</div>
            </div>
            <div className="p-2 bg-gray-50 rounded">
              <div className="font-medium text-gray-900">{stats.latency.p95}ms</div>
              <div className="text-xs text-gray-500">P95</div>
            </div>
            <div className="p-2 bg-gray-50 rounded">
              <div className="font-medium text-gray-900">{stats.latency.p99}ms</div>
              <div className="text-xs text-gray-500">P99</div>
            </div>
          </div>
        </div>

        {/* Firewall Health */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Firewall Health</h4>
          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>CPU</span>
                <span className={getHealthStatus(stats.firewallHealth.cpu) === 'error' ? 'text-red-600' : ''}>
                  {stats.firewallHealth.cpu}%
                </span>
              </div>
              <ProgressBar
                value={stats.firewallHealth.cpu}
                max={100}
                color={getHealthStatus(stats.firewallHealth.cpu) === 'success' ? 'blue' : getHealthStatus(stats.firewallHealth.cpu) === 'warning' ? 'yellow' : 'red'}
              />
            </div>
            <div>
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Memory</span>
                <span className={getHealthStatus(stats.firewallHealth.memory) === 'error' ? 'text-red-600' : ''}>
                  {stats.firewallHealth.memory}%
                </span>
              </div>
              <ProgressBar
                value={stats.firewallHealth.memory}
                max={100}
                color={getHealthStatus(stats.firewallHealth.memory) === 'success' ? 'blue' : getHealthStatus(stats.firewallHealth.memory) === 'warning' ? 'yellow' : 'red'}
              />
            </div>
            <div>
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Sessions</span>
                <span>{stats.firewallHealth.sessions}%</span>
              </div>
              <ProgressBar
                value={stats.firewallHealth.sessions}
                max={100}
                color="purple"
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
