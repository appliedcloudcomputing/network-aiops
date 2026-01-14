/**
 * Path Analysis feature - Network path tracing and hop-by-hop analysis
 */

import React, { useState } from 'react';
import { PageContainer, Card, Button, Input, Select, Badge, Modal } from '../../components';
import { usePathAnalysis } from './hooks/usePathAnalysis';
import { COMMON_DESTINATIONS, type PathHop, type PathHealth } from '../../types/pathAnalysis';

// Health badge component
const HealthBadge: React.FC<{ health: PathHealth }> = ({ health }) => {
  const variants: Record<PathHealth, 'success' | 'warning' | 'error' | 'default'> = {
    healthy: 'success',
    degraded: 'warning',
    critical: 'error',
    unknown: 'default',
  };
  return <Badge variant={variants[health]}>{health}</Badge>;
};

// Hop status indicator
const HopStatusIndicator: React.FC<{ status: string; latency: number }> = ({ status, latency }) => {
  const getColor = () => {
    if (status === 'timeout') return 'bg-gray-400';
    if (status === 'unreachable') return 'bg-red-500';
    if (latency > 100) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className={`w-3 h-3 rounded-full ${getColor()}`} title={status} />
  );
};

// Hop row component
const HopRow: React.FC<{ hop: PathHop; isLast: boolean }> = ({ hop, isLast }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="relative">
      {/* Connection line */}
      {!isLast && (
        <div className="absolute left-[18px] top-10 w-0.5 h-8 bg-gray-300" />
      )}

      <div
        className={`border rounded-lg p-3 mb-2 cursor-pointer transition-all ${
          expanded ? 'bg-gray-50 border-blue-300' : 'bg-white hover:bg-gray-50'
        }`}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-4">
          {/* Hop number with status */}
          <div className="flex items-center gap-2 w-16">
            <HopStatusIndicator status={hop.status} latency={hop.avgLatency} />
            <span className="text-sm font-medium text-gray-600">#{hop.hopNumber}</span>
          </div>

          {/* IP and hostname */}
          <div className="flex-1 min-w-0">
            <div className="font-mono text-sm text-gray-900">{hop.ipAddress}</div>
            {hop.hostname && (
              <div className="text-xs text-gray-500 truncate">{hop.hostname}</div>
            )}
          </div>

          {/* Location */}
          <div className="hidden md:block w-32 text-sm text-gray-600">
            {hop.location || '-'}
          </div>

          {/* Latency */}
          <div className="w-24 text-right">
            {hop.status === 'timeout' ? (
              <span className="text-gray-400">* * *</span>
            ) : (
              <span className={`font-medium ${
                hop.avgLatency > 100 ? 'text-yellow-600' :
                hop.avgLatency > 50 ? 'text-blue-600' : 'text-green-600'
              }`}>
                {hop.avgLatency.toFixed(1)} ms
              </span>
            )}
          </div>

          {/* Packet loss */}
          <div className="w-20 text-right">
            <span className={`text-sm ${hop.packetLoss > 5 ? 'text-red-600' : 'text-gray-500'}`}>
              {hop.packetLoss.toFixed(1)}% loss
            </span>
          </div>

          {/* Cloud provider badge */}
          <div className="w-20">
            {hop.cloudProvider && (
              <Badge variant="default" className="text-xs">
                {hop.cloudProvider.toUpperCase()}
              </Badge>
            )}
          </div>

          {/* Expand icon */}
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* Expanded details */}
        {expanded && (
          <div className="mt-3 pt-3 border-t grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-gray-500">Min Latency</div>
              <div className="font-medium">{hop.minLatency.toFixed(2)} ms</div>
            </div>
            <div>
              <div className="text-gray-500">Max Latency</div>
              <div className="font-medium">{hop.maxLatency.toFixed(2)} ms</div>
            </div>
            <div>
              <div className="text-gray-500">Jitter</div>
              <div className="font-medium">{hop.jitter.toFixed(2)} ms</div>
            </div>
            <div>
              <div className="text-gray-500">Device Type</div>
              <div className="font-medium capitalize">{hop.deviceType || 'Unknown'}</div>
            </div>
            {hop.asn && (
              <>
                <div>
                  <div className="text-gray-500">ASN</div>
                  <div className="font-medium">{hop.asn}</div>
                </div>
                <div>
                  <div className="text-gray-500">Organization</div>
                  <div className="font-medium">{hop.asnOrg || '-'}</div>
                </div>
              </>
            )}
            {hop.region && (
              <div>
                <div className="text-gray-500">Region</div>
                <div className="font-medium">{hop.region}</div>
              </div>
            )}
            <div>
              <div className="text-gray-500">RTT Samples</div>
              <div className="font-mono text-xs">
                {hop.latency.length > 0
                  ? hop.latency.map(l => l.toFixed(1)).join(' / ')
                  : '* / * / *'
                }
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const PathAnalysisView: React.FC = () => {
  const {
    source,
    destination,
    protocol,
    port,
    result,
    history,
    savedPaths,
    isRunning,
    isLoadingHistory,
    isLoadingSaved,
    error,
    setSource,
    setDestination,
    setProtocol,
    setPort,
    runAnalysis,
    runSavedPath,
    savePath,
    deleteSavedPath,
    clearHistory,
    clearResult,
    clearError,
  } = usePathAnalysis();

  const [showSaveModal, setShowSaveModal] = useState(false);
  const [pathName, setPathName] = useState('');
  const [activeTab, setActiveTab] = useState<'results' | 'saved' | 'history'>('results');

  const handleSave = async () => {
    await savePath(pathName);
    setShowSaveModal(false);
    setPathName('');
  };

  const formatTimestamp = (ts: string) => {
    const date = new Date(ts);
    return date.toLocaleString();
  };

  return (
    <PageContainer>
      {/* Error Alert */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
          <span className="text-red-700">{error}</span>
          <button onClick={clearError} className="text-red-500 hover:text-red-700">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Input Section */}
      <Card className="bg-white shadow-lg mb-6">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Network Path Analysis</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
            {/* Source */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Source IP</label>
              <Input
                value={source}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSource(e.target.value)}
                placeholder="e.g., 192.168.1.100"
              />
            </div>

            {/* Destination */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
              <Input
                value={destination}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDestination(e.target.value)}
                placeholder="e.g., 8.8.8.8"
              />
            </div>

            {/* Protocol */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Protocol</label>
              <Select
                value={protocol}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setProtocol(e.target.value as 'icmp' | 'tcp' | 'udp')}
              >
                <option value="icmp">ICMP</option>
                <option value="tcp">TCP</option>
                <option value="udp">UDP</option>
              </Select>
            </div>

            {/* Port (for TCP/UDP) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Port</label>
              <Input
                type="number"
                value={port}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPort(e.target.value)}
                placeholder="e.g., 443"
                disabled={protocol === 'icmp'}
              />
            </div>

            {/* Run button */}
            <div className="flex items-end">
              <Button
                onClick={runAnalysis}
                disabled={isRunning}
                className="w-full"
              >
                {isRunning ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Tracing...
                  </>
                ) : (
                  'Run Traceroute'
                )}
              </Button>
            </div>
          </div>

          {/* Quick destinations */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-500 mr-2">Quick targets:</span>
            {COMMON_DESTINATIONS.map((dest) => (
              <button
                key={dest.ip}
                onClick={() => setDestination(dest.ip)}
                className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded text-gray-700"
              >
                {dest.name}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {(['results', 'saved', 'history'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === tab
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            {tab === 'results' && 'Results'}
            {tab === 'saved' && `Saved Paths (${savedPaths.length})`}
            {tab === 'history' && `History (${history.length})`}
          </button>
        ))}
      </div>

      {/* Results Tab */}
      {activeTab === 'results' && (
        <>
          {result ? (
            <Card className="bg-white shadow-lg">
              <div className="p-6">
                {/* Result summary */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Path: {result.source} &rarr; {result.destination}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {result.protocol.toUpperCase()}{result.port ? `:${result.port}` : ''} |
                      Completed at {formatTimestamp(result.endTime || result.startTime)}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <HealthBadge health={result.health} />
                    <Button
                      variant="secondary"
                      onClick={() => setShowSaveModal(true)}
                    >
                      Save Path
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={clearResult}
                    >
                      Clear
                    </Button>
                  </div>
                </div>

                {/* Summary stats */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{result.totalHops}</div>
                    <div className="text-sm text-gray-500">Total Hops</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{result.avgLatency.toFixed(1)} ms</div>
                    <div className="text-sm text-gray-500">Avg Latency</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{result.totalLatency.toFixed(1)} ms</div>
                    <div className="text-sm text-gray-500">Total RTT</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${result.packetLoss > 5 ? 'text-red-600' : 'text-green-600'}`}>
                      {result.packetLoss.toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-500">Packet Loss</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{result.mtu}</div>
                    <div className="text-sm text-gray-500">MTU</div>
                  </div>
                </div>

                {/* Hop-by-hop results */}
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-4">Hop-by-Hop Path</h4>

                  {/* Legend */}
                  <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                      <span>Healthy (&lt;50ms)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-blue-500" />
                      <span>Normal (50-100ms)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <span>High Latency (&gt;100ms)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <span>Unreachable</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-gray-400" />
                      <span>Timeout</span>
                    </div>
                  </div>

                  {/* Hops list */}
                  <div className="space-y-0">
                    {result.hops.map((hop, index) => (
                      <HopRow
                        key={hop.hopNumber}
                        hop={hop}
                        isLast={index === result.hops.length - 1}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="bg-white shadow-lg">
              <div className="text-center py-16 text-gray-400">
                {isRunning ? (
                  <div>
                    <svg className="animate-spin mx-auto h-12 w-12 text-blue-500 mb-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <p className="text-gray-600">Running path analysis...</p>
                    <p className="text-sm text-gray-400 mt-2">Discovering network hops to {destination}</p>
                  </div>
                ) : (
                  <div>
                    <svg className="mx-auto h-12 w-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    <p>Enter a destination and click "Run Traceroute" to analyze the network path</p>
                  </div>
                )}
              </div>
            </Card>
          )}
        </>
      )}

      {/* Saved Paths Tab */}
      {activeTab === 'saved' && (
        <Card className="bg-white shadow-lg">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Saved Paths</h3>

            {isLoadingSaved ? (
              <div className="text-center py-8 text-gray-400">Loading saved paths...</div>
            ) : savedPaths.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                No saved paths. Run an analysis and save it for quick access.
              </div>
            ) : (
              <div className="space-y-3">
                {savedPaths.map((path) => (
                  <div
                    key={path.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{path.name}</div>
                      <div className="text-sm text-gray-500">
                        {path.source} &rarr; {path.destination}
                        <span className="mx-2">|</span>
                        {path.protocol.toUpperCase()}{path.port ? `:${path.port}` : ''}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {path.runCount} runs | Last: {path.lastRun ? formatTimestamp(path.lastRun) : 'Never'}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="primary"
                        onClick={() => runSavedPath(path)}
                        disabled={isRunning}
                      >
                        Run
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => deleteSavedPath(path.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <Card className="bg-white shadow-lg">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Analysis History</h3>
              {history.length > 0 && (
                <Button variant="secondary" onClick={clearHistory}>
                  Clear History
                </Button>
              )}
            </div>

            {isLoadingHistory ? (
              <div className="text-center py-8 text-gray-400">Loading history...</div>
            ) : history.length === 0 ? (
              <div className="text-center py-8 text-gray-400">No analysis history yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-3 text-sm font-medium text-gray-500">Time</th>
                      <th className="text-left py-2 px-3 text-sm font-medium text-gray-500">Source</th>
                      <th className="text-left py-2 px-3 text-sm font-medium text-gray-500">Destination</th>
                      <th className="text-center py-2 px-3 text-sm font-medium text-gray-500">Hops</th>
                      <th className="text-center py-2 px-3 text-sm font-medium text-gray-500">Avg Latency</th>
                      <th className="text-center py-2 px-3 text-sm font-medium text-gray-500">Health</th>
                      <th className="text-center py-2 px-3 text-sm font-medium text-gray-500">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((item) => (
                      <tr key={item.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-3 text-sm text-gray-600">
                          {formatTimestamp(item.timestamp)}
                        </td>
                        <td className="py-3 px-3 text-sm font-mono text-gray-900">{item.source}</td>
                        <td className="py-3 px-3 text-sm font-mono text-gray-900">{item.destination}</td>
                        <td className="py-3 px-3 text-sm text-center text-gray-600">{item.totalHops}</td>
                        <td className="py-3 px-3 text-sm text-center text-gray-600">
                          {item.avgLatency.toFixed(1)} ms
                        </td>
                        <td className="py-3 px-3 text-center">
                          <HealthBadge health={item.health} />
                        </td>
                        <td className="py-3 px-3 text-center">
                          <Badge variant={item.status === 'completed' ? 'success' : 'error'}>
                            {item.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Save Path Modal */}
      {showSaveModal && (
        <Modal
          isOpen={showSaveModal}
          onClose={() => setShowSaveModal(false)}
          title="Save Path"
        >
          <div className="p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Path Name
            </label>
            <Input
              value={pathName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPathName(e.target.value)}
              placeholder="e.g., Production to AWS"
              className="mb-4"
            />
            <div className="text-sm text-gray-500 mb-4">
              {source} &rarr; {destination} ({protocol.toUpperCase()}{port ? `:${port}` : ''})
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setShowSaveModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                Save
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </PageContainer>
  );
};
