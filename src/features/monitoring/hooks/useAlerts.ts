/**
 * Custom hook for managing alerts with real-time updates
 */

import { useState, useEffect, useCallback } from 'react';
import type { Alert } from '../../../types';
import { REFRESH_INTERVALS, LIMITS } from '../../../constants';
import {
  getInitialAlerts,
  getRandomAlertMessage,
  createAlert,
  getAlertCounts,
} from '../../../services';

interface UseAlertsReturn {
  alerts: Alert[];
  alertCounts: ReturnType<typeof getAlertCounts>;
  acknowledgeAlert: (id: number) => void;
}

export function useAlerts(): UseAlertsReturn {
  const [alerts, setAlerts] = useState<Alert[]>(() => getInitialAlerts());

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const newAlertMessage = getRandomAlertMessage();
        const newAlert = createAlert(newAlertMessage);

        setAlerts((prev) => [newAlert, ...prev].slice(0, LIMITS.MAX_ALERTS));
      }
    }, REFRESH_INTERVALS.ALERTS);

    return () => clearInterval(interval);
  }, []);

  const handleAcknowledgeAlert = useCallback((id: number) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === id ? { ...alert, acknowledged: true } : alert
      )
    );
  }, []);

  const alertCounts = getAlertCounts(alerts);

  return {
    alerts,
    alertCounts,
    acknowledgeAlert: handleAcknowledgeAlert,
  };
}
