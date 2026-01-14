/**
 * ServiceNow Integration settings panel
 */

import React, { useState } from 'react';
import type { ServiceNowConfig } from '../../../types/settings';
import { Card, CardHeader, Button, Badge } from '../../../components';

interface ServiceNowPanelProps {
  config: ServiceNowConfig;
  testingConnection: string | null;
  testResult: { success: boolean; message: string } | null;
  onUpdate: (updates: Partial<ServiceNowConfig>) => void;
  onTestConnection: () => void;
  onClearTestResult: () => void;
}

export const ServiceNowPanel: React.FC<ServiceNowPanelProps> = ({
  config,
  testingConnection,
  testResult,
  onUpdate,
  onTestConnection,
  onClearTestResult,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(config);

  const handleSave = () => {
    onUpdate(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(config);
    setIsEditing(false);
  };

  const isTesting = testingConnection === 'servicenow';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">ServiceNow Integration</h2>
          <p className="text-slate-400 text-sm">Configure ServiceNow ITSM integration for ticket management</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={config.isConfigured ? 'success' : 'warning'} size="lg">
            {config.isConfigured ? 'Configured' : 'Not Configured'}
          </Badge>
        </div>
      </div>

      {testResult && (
        <div
          className={`p-4 rounded-lg flex items-center justify-between ${
            testResult.success
              ? 'bg-emerald-500/20 border border-emerald-500/30'
              : 'bg-red-500/20 border border-red-500/30'
          }`}
        >
          <div className="flex items-center gap-3">
            {testResult.success ? (
              <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <span className={testResult.success ? 'text-emerald-400' : 'text-red-400'}>
              {testResult.message}
            </span>
          </div>
          <button onClick={onClearTestResult} className="text-slate-400 hover:text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      <Card>
        <CardHeader
          title="Connection Settings"
          action={
            !isEditing && (
              <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </Button>
            )
          }
        />
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-2">Instance URL</label>
              {isEditing ? (
                <input
                  type="url"
                  value={formData.instanceUrl}
                  onChange={(e) => setFormData({ ...formData, instanceUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                  placeholder="https://your-instance.service-now.com"
                />
              ) : (
                <p className="text-white font-mono">{config.instanceUrl}</p>
              )}
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-2">Username</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                />
              ) : (
                <p className="text-white font-mono">{config.username}</p>
              )}
            </div>
          </div>

          {isEditing && (
            <div>
              <label className="block text-sm text-slate-400 mb-2">Password</label>
              <input
                type="password"
                placeholder="Enter new password to change"
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          )}

          {isEditing && (
            <div className="flex gap-2 pt-4">
              <Button variant="primary" size="sm" onClick={handleSave}>
                Save Changes
              </Button>
              <Button variant="ghost" size="sm" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          )}

          {!isEditing && (
            <Button variant="secondary" size="sm" isLoading={isTesting} onClick={onTestConnection}>
              Test Connection
            </Button>
          )}
        </div>
      </Card>

      <Card>
        <CardHeader title="Ticket Settings" />
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
            <div>
              <p className="text-white font-medium">Auto-Create Tickets</p>
              <p className="text-sm text-slate-400">Automatically create tickets for critical alerts</p>
            </div>
            <button
              onClick={() => onUpdate({ autoCreateTickets: !config.autoCreateTickets })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                config.autoCreateTickets ? 'bg-cyan-500' : 'bg-slate-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  config.autoCreateTickets ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-2">Default Assignment Group</label>
              <select
                value={config.defaultAssignmentGroup}
                onChange={(e) => onUpdate({ defaultAssignmentGroup: e.target.value })}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="Network Operations">Network Operations</option>
                <option value="Security Operations">Security Operations</option>
                <option value="Cloud Infrastructure">Cloud Infrastructure</option>
                <option value="Application Support">Application Support</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-2">Default Priority</label>
              <select
                value={config.defaultPriority}
                onChange={(e) => onUpdate({ defaultPriority: e.target.value as ServiceNowConfig['defaultPriority'] })}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-2">Sync Interval (minutes)</label>
            <input
              type="number"
              min="1"
              max="60"
              value={config.syncInterval}
              onChange={(e) => onUpdate({ syncInterval: parseInt(e.target.value, 10) })}
              className="w-32 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>
      </Card>
    </div>
  );
};
