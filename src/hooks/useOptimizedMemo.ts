/**
 * Custom hooks for optimizing memoization in React components
 */

import {
  useRef,
  useCallback,
  useMemo,
  DependencyList,
} from 'react';
import { deepEqual } from '@/utils/optimizationUtils';

/**
 * Custom hook that works like useMemo but with deep comparison of dependencies
 * This prevents unnecessary recalculations when dependency objects have the same values
 * but different references
 *
 * @param factory - Factory function that creates the memoized value
 * @param dependencies - Dependency array
 * @returns Memoized value
 */
export function useDeepMemo<T>(
  factory: () => T,
  dependencies: DependencyList
): T {
  const ref = useRef<{
    deps: DependencyList;
    value: T;
    initialized: boolean;
  }>({
    deps: [],
    value: undefined as unknown as T,
    initialized: false,
  });

  // Check if dependencies have changed using deep comparison
  let depsChanged = !ref.current.initialized;

  if (
    !depsChanged &&
    dependencies.length ===
      ref.current.deps.length
  ) {
    depsChanged = !dependencies.every((dep, i) =>
      deepEqual(dep, ref.current.deps[i])
    );
  } else if (!depsChanged) {
    depsChanged = true;
  }

  // Update ref if dependencies changed
  if (depsChanged) {
    ref.current.deps = dependencies;
    ref.current.value = factory();
    ref.current.initialized = true;
  }

  return ref.current.value;
}

/**
 * Custom hook that works like useCallback but with deep comparison of dependencies
 * This prevents unnecessary recreation of callbacks when dependency objects have the same values
 * but different references
 *
 * @param callback - Callback function to memoize
 * @param dependencies - Dependency array
 * @returns Memoized callback
 */
export function useDeepCallback<
  T extends (...args: any[]) => any,
>(callback: T, dependencies: DependencyList): T {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useDeepMemo(
    () => callback,
    dependencies
  );
}

/**
 * Custom hook that memoizes an object created from multiple values
 * This helps prevent unnecessary re-renders when passing objects as props
 *
 * @param values - Object containing values to memoize
 * @returns Memoized object
 */
export function useMemoObject<T extends object>(
  values: T
): T {
  return useMemo(
    () => values,
    Object.values(values)
  ) as T;
}

export default {
  useDeepMemo,
  useDeepCallback,
  useMemoObject,
};
