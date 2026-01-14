/**
 * SIEM settings panel
 */

import React from 'react';
import type { SIEMConfig } from '../../../types/settings';
import { Card, CardHeader, Button, Badge } from '../../../components';

interface SIEMPanelProps {
  config: SIEMConfig;
  onUpdate: (updates: Partial<SIEMConfig>) => void;
}

const SIEM_OPTIONS = [
  { value: 'splunk', label: 'Splunk', icon: 'S' },
  { value: 'qradar', label: 'IBM QRadar', icon: 'Q' },
  { value: 'sentinel', label: 'Microsoft Sentinel', icon: 'M' },
  { value: 'elastic', label: 'Elastic Security', icon: 'E' },
  { value: 'none', label: 'None', icon: '-' },
];

export const SIEMPanel: React.FC<SIEMPanelProps> = ({ config, onUpdate }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">SIEM Integration</h2>
          <p className="text-slate-400 text-sm">Configure Security Information and Event Management integration</p>
        </div>
        <Badge variant={config.isConfigured ? 'success' : 'warning'} size="lg">
          {config.isConfigured ? 'Configured' : 'Not Configured'}
        </Badge>
      </div>

      <Card>
        <CardHeader title="SIEM Platform" />
        <div className="grid grid-cols-5 gap-3">
          {SIEM_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => onUpdate({ type: option.value as SIEMConfig['type'] })}
              className={`p-4 rounded-lg border-2 transition-all ${
                config.type === option.value
                  ? 'border-cyan-500 bg-cyan-500/10'
                  : 'border-slate-700 bg-slate-800 hover:border-slate-600'
              }`}
            >
              <div
                className={`w-10 h-10 mx-auto mb-2 rounded-lg flex items-center justify-center text-lg font-bold ${
                  config.type === option.value
                    ? 'bg-cyan-500 text-white'
                    : 'bg-slate-700 text-slate-400'
                }`}
              >
                {option.icon}
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
                  value={config.endpoint}
                  onChange={(e) => onUpdate({ endpoint: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                  placeholder="https://your-siem.example.com:8089"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">API Key / Token</label>
                  <input
                    type="password"
                    placeholder="Enter API key"
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Index / Data Source</label>
                  <input
                    type="text"
                    placeholder="main"
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
            <CardHeader title="Data Forwarding" />
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                <div>
                  <p className="text-white font-medium">Forward Alerts</p>
                  <p className="text-sm text-slate-400">Send security alerts to SIEM platform</p>
                </div>
                <button
                  onClick={() => onUpdate({ forwardAlerts: !config.forwardAlerts })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    config.forwardAlerts ? 'bg-cyan-500' : 'bg-slate-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      config.forwardAlerts ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                <div>
                  <p className="text-white font-medium">Forward Logs</p>
                  <p className="text-sm text-slate-400">Send audit and system logs to SIEM</p>
                </div>
                <button
                  onClick={() => onUpdate({ forwardLogs: !config.forwardLogs })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    config.forwardLogs ? 'bg-cyan-500' : 'bg-slate-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      config.forwardLogs ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">Alert Severity Threshold</label>
                <select
                  value={config.alertSeverityThreshold}
                  onChange={(e) => onUpdate({ alertSeverityThreshold: e.target.value as SIEMConfig['alertSeverityThreshold'] })}
                  className="w-48 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="low">Low and above</option>
                  <option value="medium">Medium and above</option>
                  <option value="high">High and above</option>
                  <option value="critical">Critical only</option>
                </select>
                <p className="text-xs text-slate-500 mt-1">Only forward alerts at or above this severity</p>
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  );
};
