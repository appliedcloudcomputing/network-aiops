/**
 * Custom hook for real-time clock updates
 */

import { useState, useEffect } from 'react';
import { REFRESH_INTERVALS } from '../constants';

interface UseCurrentTimeOptions {
  refreshInterval?: number;
}

export function useCurrentTime(options: UseCurrentTimeOptions = {}): Date {
  const { refreshInterval = REFRESH_INTERVALS.METRICS } = options;
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, refreshInterval);

    return () => clearInterval(timer);
  }, [refreshInterval]);

  return currentTime;
}
