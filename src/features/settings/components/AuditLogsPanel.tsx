/**
 * Audit Logs settings panel
 */

import React, { useEffect, useState } from 'react';
import type { AuditLogEntry } from '../../../types/settings';
import { Card, CardHeader, Button, Badge } from '../../../components';

interface AuditLogsPanelProps {
  logs: AuditLogEntry[];
  onLoadLogs: (filters?: { user?: string; action?: string }) => void;
}

const ACTION_COLORS: Record<string, string> = {
  UPDATE_SETTINGS: 'bg-blue-500/20 text-blue-400',
  CREATE_RULE: 'bg-emerald-500/20 text-emerald-400',
  TEST_CONNECTION: 'bg-amber-500/20 text-amber-400',
  ADD_USER: 'bg-purple-500/20 text-purple-400',
  UPDATE_PERMISSIONS: 'bg-indigo-500/20 text-indigo-400',
  APPROVE_TICKET: 'bg-cyan-500/20 text-cyan-400',
  EXPORT_REPORT: 'bg-slate-500/20 text-slate-400',
  SYNC_CLOUD: 'bg-teal-500/20 text-teal-400',
  DELETE_RULE: 'bg-red-500/20 text-red-400',
};

const ACTIONS = [
  { value: '', label: 'All Actions' },
  { value: 'UPDATE_SETTINGS', label: 'Update Settings' },
  { value: 'CREATE_RULE', label: 'Create Rule' },
  { value: 'DELETE_RULE', label: 'Delete Rule' },
  { value: 'TEST_CONNECTION', label: 'Test Connection' },
  { value: 'ADD_USER', label: 'Add User' },
  { value: 'UPDATE_PERMISSIONS', label: 'Update Permissions' },
  { value: 'APPROVE_TICKET', label: 'Approve Ticket' },
  { value: 'EXPORT_REPORT', label: 'Export Report' },
  { value: 'SYNC_CLOUD', label: 'Sync Cloud' },
];

export const AuditLogsPanel: React.FC<AuditLogsPanelProps> = ({ logs, onLoadLogs }) => {
  const [userFilter, setUserFilter] = useState('');
  const [actionFilter, setActionFilter] = useState('');

  useEffect(() => {
    onLoadLogs();
  }, [onLoadLogs]);

  const handleFilter = () => {
    onLoadLogs({
      user: userFilter || undefined,
      action: actionFilter || undefined,
    });
  };

  const handleClearFilters = () => {
    setUserFilter('');
    setActionFilter('');
    onLoadLogs();
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins} min ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hours ago`;
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const formatAction = (action: string) => {
    return action.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Audit Logs</h2>
          <p className="text-slate-400 text-sm">Track all system activities and changes</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export CSV
          </Button>
          <Button variant="secondary">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export JSON
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader title="Filters" />
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm text-slate-400 mb-2">User</label>
            <input
              type="text"
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              placeholder="Search by email or username"
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
            />
          </div>
          <div className="w-48">
            <label className="block text-sm text-slate-400 mb-2">Action</label>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
            >
              {ACTIONS.map((action) => (
                <option key={action.value} value={action.value}>
                  {action.label}
                </option>
              ))}
            </select>
          </div>
          <Button variant="primary" onClick={handleFilter}>
            Apply Filters
          </Button>
          <Button variant="ghost" onClick={handleClearFilters}>
            Clear
          </Button>
        </div>
      </Card>

      <Card padding="none">
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white">Activity Log</h3>
            <span className="text-sm text-slate-400">{logs.length} entries</span>
          </div>
        </div>
        <div className="divide-y divide-slate-700">
          {logs.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              No audit logs found matching your criteria
            </div>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="p-4 hover:bg-slate-700/30 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div
                      className={`mt-1 w-2 h-2 rounded-full ${
                        log.status === 'success' ? 'bg-emerald-400' : 'bg-red-400'
                      }`}
                    />
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-medium ${
                            ACTION_COLORS[log.action] || 'bg-slate-500/20 text-slate-400'
                          }`}
                        >
                          {formatAction(log.action)}
                        </span>
                        <span className="text-white font-medium">{log.resource}</span>
                      </div>
                      <p className="text-sm text-slate-400 mb-2">{log.details}</p>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          {log.user}
                        </span>
                        <span className="flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                          </svg>
                          {log.ipAddress}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-400">{formatTimestamp(log.timestamp)}</p>
                    <Badge
                      variant={log.status === 'success' ? 'success' : 'error'}
                      size="sm"
                    >
                      {log.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};
