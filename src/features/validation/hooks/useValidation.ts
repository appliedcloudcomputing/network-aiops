/**
 * Custom hook for rule validation
 */

import { useState, useEffect, useCallback } from 'react';
import type {
  ValidationPlatform,
  ValidationResult,
  ValidationHistory,
  SecurityCheck,
} from '../../../types/validation';
import { validationService } from '../../../services/validationService';

interface UseValidationReturn {
  platform: ValidationPlatform;
  content: string;
  result: ValidationResult | null;
  securityChecks: SecurityCheck[];
  history: ValidationHistory[];
  isValidating: boolean;
  isLoadingHistory: boolean;
  error: string | null;

  // Actions
  setPlatform: (platform: ValidationPlatform) => void;
  setContent: (content: string) => void;
  validate: () => Promise<void>;
  runSecurityAnalysis: () => Promise<void>;
  clearResult: () => void;
  clearHistory: () => Promise<void>;
  clearError: () => void;
}

export const useValidation = (): UseValidationReturn => {
  const [platform, setPlatform] = useState<ValidationPlatform>('aws');
  const [content, setContent] = useState('');
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [securityChecks, setSecurityChecks] = useState<SecurityCheck[]>([]);
  const [history, setHistory] = useState<ValidationHistory[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load history on mount
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await validationService.getValidationHistory();
        setHistory(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load history');
      } finally {
        setIsLoadingHistory(false);
      }
    };
    loadHistory();
  }, []);

  const validate = useCallback(async () => {
    if (!content.trim()) {
      setError('Please enter rule content to validate');
      return;
    }

    setIsValidating(true);
    setError(null);

    try {
      const [validationResult, checks] = await Promise.all([
        validationService.validateRules(platform, content),
        validationService.runSecurityAnalysis(content),
      ]);
      setResult(validationResult);
      setSecurityChecks(checks);

      // Refresh history
      const updatedHistory = await validationService.getValidationHistory();
      setHistory(updatedHistory);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Validation failed');
    } finally {
      setIsValidating(false);
    }
  }, [platform, content]);

  const runSecurityAnalysis = useCallback(async () => {
    if (!content.trim()) {
      setError('Please enter rule content to analyze');
      return;
    }

    setIsValidating(true);
    setError(null);

    try {
      const checks = await validationService.runSecurityAnalysis(content);
      setSecurityChecks(checks);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Security analysis failed');
    } finally {
      setIsValidating(false);
    }
  }, [content]);

  const clearResult = useCallback(() => {
    setResult(null);
    setSecurityChecks([]);
  }, []);

  const clearHistory = useCallback(async () => {
    try {
      await validationService.clearHistory();
      setHistory([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clear history');
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    platform,
    content,
    result,
    securityChecks,
    history,
    isValidating,
    isLoadingHistory,
    error,
    setPlatform,
    setContent,
    validate,
    runSecurityAnalysis,
    clearResult,
    clearHistory,
    clearError,
  };
};
