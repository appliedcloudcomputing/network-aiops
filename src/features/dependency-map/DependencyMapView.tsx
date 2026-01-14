/**
 * Dependency Map feature - Main view component
 */

import React from 'react';
import { PageContainer, Card, GridContainer } from '../../components';

interface ServiceStat {
  label: string;
  value: string;
  color: string;
}

const SERVICE_STATS: ServiceStat[] = [
  { label: 'Overall Health', value: '87%', color: 'emerald' },
  { label: 'Total Services', value: '17', color: 'cyan' },
  { label: 'Healthy', value: '13', color: 'emerald' },
  { label: 'Degraded', value: '2', color: 'amber' },
  { label: 'Critical', value: '2', color: 'red' },
];

export const DependencyMapView: React.FC = () => {
  return (
    <PageContainer>
      <GridContainer cols={5} className="mb-6">
        {SERVICE_STATS.map((stat, index) => (
          <ServiceStatCard key={index} stat={stat} />
        ))}
      </GridContainer>
      <Card>
        <h3 className="text-white font-bold mb-4">Service Topology</h3>
        <div className="text-center py-16 text-slate-500">
          Topology visualization displayed here
        </div>
      </Card>
    </PageContainer>
  );
};

interface ServiceStatCardProps {
  stat: ServiceStat;
}

const ServiceStatCard: React.FC<ServiceStatCardProps> = ({ stat }) => {
  const colorClasses: Record<string, string> = {
    emerald: 'text-emerald-400',
    cyan: 'text-cyan-400',
    amber: 'text-amber-400',
    red: 'text-red-400',
  };

  return (
    <Card>
      <p className="text-sm text-slate-400">{stat.label}</p>
      <p className={`text-3xl font-bold ${colorClasses[stat.color]}`}>{stat.value}</p>
    </Card>
  );
};
