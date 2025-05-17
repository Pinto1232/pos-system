import { useRef, useCallback, useMemo, DependencyList } from 'react';
import { deepEqual } from '@/utils/optimizationUtils';

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

  let depsChanged = !ref.current.initialized;

  if (!depsChanged && dependencies.length === ref.current.deps.length) {
    depsChanged = !dependencies.every((dep, i) =>
      deepEqual(dep, ref.current.deps[i])
    );
  } else if (!depsChanged) {
    depsChanged = true;
  }

  if (depsChanged) {
    ref.current.deps = dependencies;
    ref.current.value = factory();
    ref.current.initialized = true;
  }

  return ref.current.value;
}

export function useDeepCallback<T extends (...args: any[]) => any>(
  callback: T,
  dependencies: DependencyList
): T {
  return useDeepMemo(() => callback, dependencies);
}

export function useMemoObject<T extends object>(values: T): T {
  return useMemo(() => values, Object.values(values)) as T;
}

export default {
  useDeepMemo,
  useDeepCallback,
  useMemoObject,
};
