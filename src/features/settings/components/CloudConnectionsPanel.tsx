/**
 * Cloud Connections settings panel
 */

import React, { useState } from 'react';
import type { CloudConnection, CloudConnectionStatus } from '../../../types/settings';
import { Card, Button, Badge } from '../../../components';

interface CloudConnectionsPanelProps {
  connections: CloudConnection[];
  testingConnection: string | null;
  testResult: { success: boolean; message: string } | null;
  onTestConnection: (connectionId: string) => void;
  onUpdateConnection: (connectionId: string, updates: Partial<CloudConnection>) => void;
  onAddConnection: (connection: Omit<CloudConnection, 'id'>) => void;
  onDeleteConnection: (connectionId: string) => void;
  onClearTestResult: () => void;
}

const PROVIDER_CONFIG = {
  aws: {
    name: 'AWS',
    color: 'from-orange-500 to-orange-600',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
        <path d="M6.763 10.036c0 .296.032.535.088.71.064.176.144.368.256.576.04.063.056.127.056.183 0 .08-.048.16-.152.24l-.503.335a.383.383 0 01-.208.072c-.08 0-.16-.04-.239-.112a2.47 2.47 0 01-.287-.375 6.18 6.18 0 01-.248-.471c-.622.734-1.405 1.101-2.347 1.101-.67 0-1.205-.191-1.596-.574-.391-.384-.59-.894-.59-1.533 0-.678.239-1.23.726-1.644.487-.415 1.133-.623 1.955-.623.272 0 .551.024.846.064.296.04.6.104.918.176v-.583c0-.607-.127-1.03-.375-1.277-.255-.248-.686-.367-1.3-.367-.28 0-.568.031-.863.103-.295.072-.583.16-.862.272a2.287 2.287 0 01-.28.104.488.488 0 01-.127.023c-.112 0-.168-.08-.168-.247v-.391c0-.128.016-.224.056-.28a.597.597 0 01.224-.167c.279-.144.614-.264 1.005-.36a4.84 4.84 0 011.246-.151c.95 0 1.644.216 2.091.647.439.43.662 1.085.662 1.963v2.586zm-3.24 1.214c.263 0 .534-.048.822-.144.287-.096.543-.271.758-.51.128-.152.224-.32.272-.512.047-.191.08-.423.08-.694v-.335a6.66 6.66 0 00-.735-.136 6.02 6.02 0 00-.75-.048c-.535 0-.926.104-1.19.32-.263.215-.39.518-.39.917 0 .375.095.655.295.846.191.2.47.296.838.296zm6.41.862c-.144 0-.24-.024-.304-.08-.064-.048-.12-.16-.168-.311L7.586 5.55a1.398 1.398 0 01-.072-.32c0-.128.064-.2.191-.2h.783c.151 0 .255.025.31.08.065.048.113.16.16.312l1.342 5.284 1.245-5.284c.04-.16.088-.264.151-.312a.549.549 0 01.32-.08h.638c.152 0 .256.025.32.08.063.048.12.16.151.312l1.261 5.348 1.381-5.348c.048-.16.104-.264.16-.312a.52.52 0 01.311-.08h.743c.127 0 .2.065.2.2 0 .04-.009.08-.017.128a1.137 1.137 0 01-.056.2l-1.923 6.17c-.048.16-.104.263-.168.311a.51.51 0 01-.303.08h-.687c-.151 0-.255-.024-.32-.08-.063-.056-.119-.16-.15-.32l-1.238-5.148-1.23 5.14c-.04.16-.087.264-.15.32-.065.056-.177.08-.32.08zm10.256.215c-.415 0-.83-.048-1.229-.143-.399-.096-.71-.2-.918-.32-.128-.071-.215-.151-.247-.223a.563.563 0 01-.048-.224v-.407c0-.167.064-.247.183-.247.048 0 .096.008.144.024.048.016.12.048.2.08.271.12.566.215.878.279.319.064.63.096.95.096.502 0 .894-.088 1.165-.264a.86.86 0 00.415-.758.777.777 0 00-.215-.559c-.144-.151-.415-.287-.806-.407l-1.157-.36c-.583-.183-1.014-.454-1.277-.813a1.902 1.902 0 01-.4-1.158c0-.335.073-.63.216-.886.144-.255.335-.479.575-.654.24-.184.51-.32.83-.415.32-.096.655-.136 1.006-.136.175 0 .359.008.535.032.183.024.35.056.518.088.16.04.312.08.455.127.144.048.256.096.336.144a.69.69 0 01.24.2.43.43 0 01.071.263v.375c0 .168-.064.256-.184.256a.83.83 0 01-.303-.096 3.652 3.652 0 00-1.532-.311c-.455 0-.815.071-1.062.223-.248.152-.375.383-.375.71 0 .224.08.416.24.567.159.152.454.304.877.44l1.134.358c.574.184.99.44 1.237.767.247.327.367.702.367 1.117 0 .343-.072.655-.207.926-.144.272-.336.511-.583.703-.248.2-.543.343-.886.447-.36.111-.734.167-1.142.167z" />
      </svg>
    ),
  },
  azure: {
    name: 'Azure',
    color: 'from-blue-500 to-blue-600',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
        <path d="M5.483 21.3H24L14.025 4.013l-3.038 8.347 5.836 6.938L5.483 21.3zM13.23 2.7L6.105 8.677 0 19.253h5.505l7.725-16.553z" />
      </svg>
    ),
  },
  gcp: {
    name: 'GCP',
    color: 'from-red-500 to-yellow-500',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.19 2.38a9.344 9.344 0 00-9.234 6.893c.053-.02-.055.013 0 0-3.875 2.551-3.922 8.11-.247 10.941l.006-.007-.007.03a6.717 6.717 0 006.212 3.76h10.39c2.51-.034 4.659-1.9 5.42-4.287a5.91 5.91 0 00-.49-4.643 5.906 5.906 0 00-3.83-2.799l-.006-.004-.001-.009A9.34 9.34 0 0012.19 2.38zm-.358 4.146c1.244-.04 2.518.368 3.486 1.15a5.186 5.186 0 011.862 4.078v.518c3.53-.07 3.53 5.262 0 5.193h-5.193v-.518c-1.243.04-2.517-.368-3.485-1.15a5.186 5.186 0 01-1.863-4.078v-.518c-3.53.07-3.53-5.262 0-5.193h5.193v.518z" />
      </svg>
    ),
  },
  onprem: {
    name: 'On-Premises',
    color: 'from-slate-500 to-slate-600',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
      </svg>
    ),
  },
};

const STATUS_CONFIG: Record<CloudConnectionStatus, { label: string; variant: 'success' | 'error' | 'warning' | 'default' }> = {
  connected: { label: 'Connected', variant: 'success' },
  disconnected: { label: 'Disconnected', variant: 'default' },
  error: { label: 'Error', variant: 'error' },
  pending: { label: 'Pending', variant: 'warning' },
};

export const CloudConnectionsPanel: React.FC<CloudConnectionsPanelProps> = ({
  connections,
  testingConnection,
  testResult,
  onTestConnection,
  onAddConnection,
  onDeleteConnection,
  onClearTestResult,
}) => {
  // onAddConnection will be used when Add Connection modal is implemented
  void onAddConnection;
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Never';
    return new Date(dateStr).toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Cloud Connections</h2>
          <p className="text-slate-400 text-sm">Manage connections to AWS, Azure, GCP, and On-Premises infrastructure</p>
        </div>
        <Button variant="primary" size="md">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Connection
        </Button>
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

      <div className="grid gap-4">
        {connections.map((connection) => {
          const config = PROVIDER_CONFIG[connection.provider];
          const statusConfig = STATUS_CONFIG[connection.status];
          const isExpanded = expandedId === connection.id;
          const isTesting = testingConnection === connection.id;

          return (
            <Card key={connection.id} padding="none" className="overflow-hidden">
              <div
                className="p-4 cursor-pointer"
                onClick={() => setExpandedId(isExpanded ? null : connection.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${config.color} flex items-center justify-center text-white`}>
                      {config.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="font-bold text-white">{connection.name}</h3>
                        <Badge variant={statusConfig.variant} size="sm">
                          {statusConfig.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-400">
                        {config.name} {connection.region && `- ${connection.region}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="secondary"
                      size="sm"
                      isLoading={isTesting}
                      onClick={(e) => {
                        e.stopPropagation();
                        onTestConnection(connection.id);
                      }}
                    >
                      Test Connection
                    </Button>
                    <svg
                      className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {isExpanded && (
                <div className="px-4 pb-4 pt-2 border-t border-slate-700">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Account/Project ID</label>
                      <p className="text-sm text-slate-300 font-mono">
                        {connection.accountId || connection.subscriptionId || connection.projectId || connection.datacenterName || '-'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Last Sync</label>
                      <p className="text-sm text-slate-300">{formatDate(connection.lastSync)}</p>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Credentials Type</label>
                      <p className="text-sm text-slate-300 capitalize">
                        {connection.credentials.type.replace('_', ' ')}
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Credentials Status</label>
                      <Badge variant={connection.credentials.configured ? 'success' : 'warning'} size="sm">
                        {connection.credentials.configured ? 'Configured' : 'Not Configured'}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Sync Now
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteConnection(connection.id);
                      }}
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};
