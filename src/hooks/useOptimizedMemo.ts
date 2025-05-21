import { useRef, DependencyList } from 'react';
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

export function useDeepCallback<T extends (...args: unknown[]) => unknown>(
  callback: T,
  dependencies: DependencyList
): T {
  return useDeepMemo(() => callback, dependencies);
}

export function useMemoObject<T extends object>(values: T): T {
  // Using useDeepMemo instead of useMemo to properly handle object dependencies
  return useDeepMemo(() => values, [values]);
}

// Named export object to avoid anonymous default export
const optimizedHooks = {
  useDeepMemo,
  useDeepCallback,
  useMemoObject,
};

export default optimizedHooks;
