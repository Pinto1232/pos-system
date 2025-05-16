/**
 * Custom hook for debounced state updates to prevent excessive re-renders
 */

import {
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';

/**
 * Custom hook that creates a debounced version of useState
 * This is useful for preventing excessive re-renders when state changes rapidly
 *
 * @param initialValue - Initial state value
 * @param delay - Debounce delay in milliseconds
 * @returns [debouncedValue, setDebouncedValue, immediateValue, setImmediateValue]
 */
export function useDebouncedState<T>(
  initialValue: T,
  delay: number = 300
): [
  T, // Debounced value (updates after delay)
  (value: T | ((prev: T) => T)) => void, // Set debounced value
  T, // Immediate value (updates immediately)
  (value: T | ((prev: T) => T)) => void, // Set immediate value
] {
  // State for the immediate value (updates immediately)
  const [immediateValue, setImmediateValue] =
    useState<T>(initialValue);

  // State for the debounced value (updates after delay)
  const [debouncedValue, setDebouncedValue] =
    useState<T>(initialValue);

  // Ref for the timeout
  const timeoutRef =
    useRef<NodeJS.Timeout | null>(null);

  // Effect to update debounced value when immediate value changes
  useEffect(() => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set a new timeout to update the debounced value after the delay
    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(immediateValue);
    }, delay);

    // Cleanup function to clear the timeout when the component unmounts
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [immediateValue, delay]);

  // Memoized setter for the immediate value
  const setImmediateValueMemoized = useCallback(
    (value: T | ((prev: T) => T)) => {
      setImmediateValue(value);
    },
    []
  );

  // Memoized setter for the debounced value (also updates immediate value)
  const setDebouncedValueMemoized = useCallback(
    (value: T | ((prev: T) => T)) => {
      // Update immediate value
      setImmediateValue(value);

      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Update debounced value immediately
      if (typeof value === 'function') {
        // @ts-ignore - TypeScript doesn't understand that this is a function that takes the previous state
        setDebouncedValue((prev: T) =>
          (value as (prev: T) => T)(prev)
        );
      } else {
        setDebouncedValue(value);
      }
    },
    []
  );

  return [
    debouncedValue,
    setDebouncedValueMemoized,
    immediateValue,
    setImmediateValueMemoized,
  ];
}

export default useDebouncedState;
