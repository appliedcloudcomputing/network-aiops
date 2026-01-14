/**
 * Custom hook for compliance data management
 */

import { useState, useEffect, useMemo } from 'react';
import type { ComplianceFramework } from '../../../types';
import {
  getComplianceFrameworks,
  calculateComplianceStats,
} from '../../../services';

interface ComplianceData {
  frameworks: ComplianceFramework[];
  selectedFramework: ComplianceFramework | null;
  stats: ReturnType<typeof calculateComplianceStats>;
  overallScore: number;
  isLoading: boolean;
  error: Error | null;
  selectFramework: (framework: ComplianceFramework | null) => void;
}

export function useComplianceData(): ComplianceData {
  const [frameworks, setFrameworks] = useState<ComplianceFramework[]>([]);
  const [selectedFramework, setSelectedFramework] = useState<ComplianceFramework | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await getComplianceFrameworks();
        setFrameworks(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch compliance data'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const stats = useMemo(() => calculateComplianceStats(frameworks), [frameworks]);

  const overallScore = useMemo(() => {
    if (frameworks.length === 0) return 0;
    const totalScore = frameworks.reduce((sum, f) => sum + f.score, 0);
    return Number((totalScore / frameworks.length).toFixed(1));
  }, [frameworks]);

  const selectFramework = (framework: ComplianceFramework | null) => {
    setSelectedFramework(
      selectedFramework?.id === framework?.id ? null : framework
    );
  };

  return {
    frameworks,
    selectedFramework,
    stats,
    overallScore,
    isLoading,
    error,
    selectFramework,
  };
}
