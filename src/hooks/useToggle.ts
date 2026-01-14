/**
 * Custom hook for boolean toggle state
 */

import { useState, useCallback } from 'react';

type UseToggleReturn = [boolean, () => void, (value: boolean) => void];

export function useToggle(initialValue: boolean = false): UseToggleReturn {
  const [value, setValue] = useState<boolean>(initialValue);

  const toggle = useCallback(() => {
    setValue((prev) => !prev);
  }, []);

  const setValueDirectly = useCallback((newValue: boolean) => {
    setValue(newValue);
  }, []);

  return [value, toggle, setValueDirectly];
}
