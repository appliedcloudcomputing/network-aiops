/**
 * Network traffic visualization component
 */

import React, { useMemo } from 'react';
import { Card } from '../../../components';
import { ChartIcon } from '../../../components/icons';
import { LIMITS } from '../../../constants';

export const TrafficGraph: React.FC = () => {
  const graphData = useMemo(() => {
    return Array.from({ length: LIMITS.TRAFFIC_GRAPH_POINTS }).map((_, i) => ({
      ingressHeight: 20 + Math.sin(i * 0.3) * 15 + Math.random() * 20,
      egressHeight: 15 + Math.cos(i * 0.25) * 10 + Math.random() * 15,
    }));
  }, []);

  return (
    <Card variant="bordered" className="mt-6 rounded-2xl">
      <TrafficGraphHeader />
      <TrafficBars data={graphData} />
      <TrafficTimeline />
    </Card>
  );
};

const TrafficGraphHeader: React.FC = () => (
  <div className="flex items-center justify-between mb-4">
    <h3 className="text-white font-semibold flex items-center gap-2">
      <ChartIcon className="w-5 h-5 text-cyan-400" />
      Network Traffic (Last 60 Minutes)
    </h3>
    <div className="flex items-center gap-4">
      <LegendItem color="bg-cyan-500" label="Ingress" />
      <LegendItem color="bg-purple-500" label="Egress" />
      <LegendItem color="bg-red-500" label="Blocked" />
    </div>
  </div>
);

interface LegendItemProps {
  color: string;
  label: string;
}

const LegendItem: React.FC<LegendItemProps> = ({ color, label }) => (
  <div className="flex items-center gap-2">
    <div className={`w-3 h-3 ${color} rounded-full`} />
    <span className="text-xs text-slate-400">{label}</span>
  </div>
);

interface TrafficBarsProps {
  data: Array<{ ingressHeight: number; egressHeight: number }>;
}

const TrafficBars: React.FC<TrafficBarsProps> = ({ data }) => (
  <div className="flex items-end gap-1 h-32">
    {data.map((bar, i) => (
      <div key={i} className="flex-1 flex flex-col gap-0.5">
        <div
          className="bg-gradient-to-t from-cyan-600 to-cyan-400 rounded-t transition-all duration-300"
          style={{ height: `${bar.ingressHeight}%` }}
        />
        <div
          className="bg-gradient-to-t from-purple-600 to-purple-400 rounded-t transition-all duration-300"
          style={{ height: `${bar.egressHeight}%` }}
        />
      </div>
    ))}
  </div>
);

const TrafficTimeline: React.FC = () => (
  <div className="flex justify-between mt-2 text-xs text-slate-500">
    <span>-60m</span>
    <span>-45m</span>
    <span>-30m</span>
    <span>-15m</span>
    <span>Now</span>
  </div>
);
