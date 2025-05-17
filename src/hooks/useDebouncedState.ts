import { useState, useEffect, useRef, useCallback } from 'react';

export function useDebouncedState<T>(
  initialValue: T,
  delay: number = 300
): [T, (value: T | ((prev: T) => T)) => void, T, (value: T | ((prev: T) => T)) => void] {
  const [immediateValue, setImmediateValue] = useState<T>(initialValue);

  const [debouncedValue, setDebouncedValue] = useState<T>(initialValue);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(immediateValue);
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [immediateValue, delay]);

  const setImmediateValueMemoized = useCallback((value: T | ((prev: T) => T)) => {
    setImmediateValue(value);
  }, []);

  const setDebouncedValueMemoized = useCallback((value: T | ((prev: T) => T)) => {
    setImmediateValue(value);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (typeof value === 'function') {
      setDebouncedValue((prev: T) => (value as (prev: T) => T)(prev));
    } else {
      setDebouncedValue(value);
    }
  }, []);

  return [debouncedValue, setDebouncedValueMemoized, immediateValue, setImmediateValueMemoized];
}

export default useDebouncedState;
