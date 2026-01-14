/**
 * APM settings panel
 */

import React from 'react';
import type { APMConfig } from '../../../types/settings';
import { Card, CardHeader, Button, Badge } from '../../../components';

interface APMPanelProps {
  config: APMConfig;
  onUpdate: (updates: Partial<APMConfig>) => void;
}

const APM_OPTIONS = [
  { value: 'datadog', label: 'Datadog', color: 'from-purple-500 to-purple-600' },
  { value: 'newrelic', label: 'New Relic', color: 'from-teal-500 to-teal-600' },
  { value: 'dynatrace', label: 'Dynatrace', color: 'from-blue-500 to-blue-600' },
  { value: 'appdynamics', label: 'AppDynamics', color: 'from-cyan-500 to-cyan-600' },
  { value: 'none', label: 'None', color: 'from-slate-500 to-slate-600' },
];

export const APMPanel: React.FC<APMPanelProps> = ({ config, onUpdate }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">APM Integration</h2>
          <p className="text-slate-400 text-sm">Configure Application Performance Monitoring integration</p>
        </div>
        <Badge variant={config.isConfigured ? 'success' : 'warning'} size="lg">
          {config.isConfigured ? 'Configured' : 'Not Configured'}
        </Badge>
      </div>

      <Card>
        <CardHeader title="APM Platform" />
        <div className="grid grid-cols-5 gap-3">
          {APM_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => onUpdate({ type: option.value as APMConfig['type'] })}
              className={`p-4 rounded-lg border-2 transition-all ${
                config.type === option.value
                  ? 'border-cyan-500 bg-cyan-500/10'
                  : 'border-slate-700 bg-slate-800 hover:border-slate-600'
              }`}
            >
              <div
                className={`w-10 h-10 mx-auto mb-2 rounded-lg bg-gradient-to-br ${option.color} flex items-center justify-center text-white font-bold`}
              >
                {option.label.charAt(0)}
              </div>
              <p className={`text-sm font-medium text-center ${
                config.type === option.value ? 'text-cyan-400' : 'text-slate-400'
              }`}>
                {option.label}
              </p>
            </button>
          ))}
        </div>
      </Card>

      {config.type !== 'none' && (
        <>
          <Card>
            <CardHeader title="Connection Settings" />
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">API Endpoint</label>
                <input
                  type="url"
                  value={config.apiEndpoint}
                  onChange={(e) => onUpdate({ apiEndpoint: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                  placeholder="https://api.datadoghq.com"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">API Key</label>
                  <input
                    type="password"
                    placeholder="Enter API key"
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Application Key</label>
                  <input
                    type="password"
                    placeholder="Enter application key"
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
              <Button variant="secondary" size="sm">
                Test Connection
              </Button>
            </div>
          </Card>

          <Card>
            <CardHeader title="Data Collection" />
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                <div>
                  <p className="text-white font-medium">Collect Metrics</p>
                  <p className="text-sm text-slate-400">Import application metrics from APM platform</p>
                </div>
                <button
                  onClick={() => onUpdate({ collectMetrics: !config.collectMetrics })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    config.collectMetrics ? 'bg-cyan-500' : 'bg-slate-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      config.collectMetrics ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                <div>
                  <p className="text-white font-medium">Collect Traces</p>
                  <p className="text-sm text-slate-400">Import distributed traces for path analysis</p>
                </div>
                <button
                  onClick={() => onUpdate({ collectTraces: !config.collectTraces })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    config.collectTraces ? 'bg-cyan-500' : 'bg-slate-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      config.collectTraces ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">Sample Rate</label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0.01"
                    max="1"
                    step="0.01"
                    value={config.sampleRate}
                    onChange={(e) => onUpdate({ sampleRate: parseFloat(e.target.value) })}
                    className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                  <span className="text-white font-mono w-16 text-right">
                    {(config.sampleRate * 100).toFixed(0)}%
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Percentage of traces to collect. Lower values reduce overhead.
                </p>
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  );
};
