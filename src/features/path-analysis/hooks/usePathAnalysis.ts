/**
 * Custom hook for path analysis functionality
 */

import { useState, useEffect, useCallback } from 'react';
import type {
  PathAnalysisRequest,
  PathAnalysisResult,
  PathAnalysisHistory,
  SavedPath,
} from '../../../types/pathAnalysis';
import { pathAnalysisService } from '../../../services/pathAnalysisService';

interface UsePathAnalysisReturn {
  // State
  source: string;
  destination: string;
  protocol: 'icmp' | 'tcp' | 'udp';
  port: string;
  result: PathAnalysisResult | null;
  history: PathAnalysisHistory[];
  savedPaths: SavedPath[];
  isRunning: boolean;
  isLoadingHistory: boolean;
  isLoadingSaved: boolean;
  error: string | null;

  // Actions
  setSource: (source: string) => void;
  setDestination: (destination: string) => void;
  setProtocol: (protocol: 'icmp' | 'tcp' | 'udp') => void;
  setPort: (port: string) => void;
  runAnalysis: () => Promise<void>;
  runSavedPath: (path: SavedPath) => Promise<void>;
  savePath: (name: string) => Promise<void>;
  deleteSavedPath: (id: string) => Promise<void>;
  clearHistory: () => Promise<void>;
  clearResult: () => void;
  clearError: () => void;
}

export const usePathAnalysis = (): UsePathAnalysisReturn => {
  const [source, setSource] = useState('192.168.1.100');
  const [destination, setDestination] = useState('');
  const [protocol, setProtocol] = useState<'icmp' | 'tcp' | 'udp'>('icmp');
  const [port, setPort] = useState('');
  const [result, setResult] = useState<PathAnalysisResult | null>(null);
  const [history, setHistory] = useState<PathAnalysisHistory[]>([]);
  const [savedPaths, setSavedPaths] = useState<SavedPath[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [isLoadingSaved, setIsLoadingSaved] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load history and saved paths on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [historyData, savedData] = await Promise.all([
          pathAnalysisService.getHistory(),
          pathAnalysisService.getSavedPaths(),
        ]);
        setHistory(historyData);
        setSavedPaths(savedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setIsLoadingHistory(false);
        setIsLoadingSaved(false);
      }
    };
    loadData();
  }, []);

  const runAnalysis = useCallback(async () => {
    if (!destination.trim()) {
      setError('Please enter a destination IP address or hostname');
      return;
    }

    if ((protocol === 'tcp' || protocol === 'udp') && !port) {
      setError('Please enter a port number for TCP/UDP');
      return;
    }

    setIsRunning(true);
    setError(null);
    setResult(null);

    try {
      const request: PathAnalysisRequest = {
        source,
        destination,
        protocol,
        port: port ? parseInt(port, 10) : undefined,
        maxHops: 30,
        timeout: 5000,
        probesPerHop: 3,
        resolveHostnames: true,
      };

      const analysisResult = await pathAnalysisService.runAnalysis(request);
      setResult(analysisResult);

      // Refresh history
      const updatedHistory = await pathAnalysisService.getHistory();
      setHistory(updatedHistory);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Path analysis failed');
    } finally {
      setIsRunning(false);
    }
  }, [source, destination, protocol, port]);

  const runSavedPath = useCallback(async (savedPath: SavedPath) => {
    setSource(savedPath.source);
    setDestination(savedPath.destination);
    setProtocol(savedPath.protocol);
    setPort(savedPath.port?.toString() || '');

    setIsRunning(true);
    setError(null);
    setResult(null);

    try {
      const request: PathAnalysisRequest = {
        source: savedPath.source,
        destination: savedPath.destination,
        protocol: savedPath.protocol,
        port: savedPath.port,
        maxHops: 30,
        timeout: 5000,
        probesPerHop: 3,
        resolveHostnames: true,
      };

      const analysisResult = await pathAnalysisService.runAnalysis(request);
      setResult(analysisResult);

      // Update saved path run count
      await pathAnalysisService.updateSavedPathRun(savedPath.id);
      const updatedSaved = await pathAnalysisService.getSavedPaths();
      setSavedPaths(updatedSaved);

      // Refresh history
      const updatedHistory = await pathAnalysisService.getHistory();
      setHistory(updatedHistory);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Path analysis failed');
    } finally {
      setIsRunning(false);
    }
  }, []);

  const savePath = useCallback(async (name: string) => {
    if (!name.trim()) {
      setError('Please enter a name for the saved path');
      return;
    }

    if (!destination.trim()) {
      setError('Please enter a destination before saving');
      return;
    }

    try {
      const newPath = await pathAnalysisService.savePath({
        name,
        source,
        destination,
        protocol,
        port: port ? parseInt(port, 10) : undefined,
      });
      setSavedPaths(prev => [newPath, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save path');
    }
  }, [source, destination, protocol, port]);

  const deleteSavedPath = useCallback(async (id: string) => {
    try {
      await pathAnalysisService.deleteSavedPath(id);
      setSavedPaths(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete path');
    }
  }, []);

  const clearHistory = useCallback(async () => {
    try {
      await pathAnalysisService.clearHistory();
      setHistory([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clear history');
    }
  }, []);

  const clearResult = useCallback(() => {
    setResult(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
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
  };
};
