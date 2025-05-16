/**
 * Utility functions for optimizing React components and preventing unnecessary re-renders
 */

import {
  useRef,
  useEffect,
  DependencyList,
} from 'react';

/**
 * Custom hook to log when a component re-renders and why
 * @param componentName - The name of the component to track
 * @param props - The component props to track
 * @param dependencies - Optional dependency array to track specific values
 */
export function useRenderTracker(
  componentName: string,
  props: Record<string, any>,
  dependencies?: DependencyList
): void {
  const renderCount = useRef(0);
  const prevProps = useRef<Record<string, any>>(
    {}
  );
  const prevDeps = useRef<any[]>([]);

  useEffect(() => {
    renderCount.current += 1;

    // Check which props changed
    const changedProps: Record<
      string,
      { from: any; to: any }
    > = {};
    Object.keys(props).forEach((key) => {
      if (prevProps.current[key] !== props[key]) {
        changedProps[key] = {
          from: prevProps.current[key],
          to: props[key],
        };
      }
    });

    // Check which dependencies changed
    const changedDeps: Record<
      number,
      { from: any; to: any }
    > = {};
    if (dependencies) {
      dependencies.forEach((dep, index) => {
        if (prevDeps.current[index] !== dep) {
          changedDeps[index] = {
            from: prevDeps.current[index],
            to: dep,
          };
        }
      });
    }

    // Log render information
    if (renderCount.current > 1) {
      console.log(
        `[RENDER] ${componentName} rendered ${renderCount.current} times`
      );

      if (Object.keys(changedProps).length > 0) {
        console.log(
          'Changed props:',
          changedProps
        );
      }

      if (
        dependencies &&
        Object.keys(changedDeps).length > 0
      ) {
        console.log(
          'Changed dependencies:',
          changedDeps
        );
      }
    }

    // Update refs for next render
    prevProps.current = { ...props };
    if (dependencies) {
      prevDeps.current = [...dependencies];
    }
  });
}

/**
 * Checks if an object is a plain object (not an array, function, etc.)
 */
export function isPlainObject(obj: any): boolean {
  return (
    obj !== null &&
    typeof obj === 'object' &&
    !Array.isArray(obj) &&
    Object.getPrototypeOf(obj) ===
      Object.prototype
  );
}

/**
 * Deep compares two values to determine if they are equivalent
 */
export function deepEqual(
  a: any,
  b: any
): boolean {
  // Handle primitive types and referential equality
  if (a === b) return true;

  // Handle null/undefined
  if (a == null || b == null) return a === b;

  // Handle different types
  if (typeof a !== typeof b) return false;

  // Handle dates
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }

  // Handle arrays
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    return true;
  }

  // Handle plain objects
  if (isPlainObject(a) && isPlainObject(b)) {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);

    if (keysA.length !== keysB.length)
      return false;

    for (const key of keysA) {
      if (
        !Object.prototype.hasOwnProperty.call(
          b,
          key
        )
      )
        return false;
      if (!deepEqual(a[key], b[key]))
        return false;
    }

    return true;
  }

  // Handle other types (functions, etc.)
  return false;
}

/**
 * Creates a custom comparison function for React.memo
 * @param propsToCompare - Array of prop names to compare (if empty, compares all props)
 * @param useDeepComparison - Whether to use deep comparison for objects and arrays
 */
export function createMemoComparison(
  propsToCompare: string[] = [],
  useDeepComparison = false
): (prevProps: any, nextProps: any) => boolean {
  return (prevProps, nextProps) => {
    const keys =
      propsToCompare.length > 0
        ? propsToCompare
        : Object.keys({
            ...prevProps,
            ...nextProps,
          });

    for (const key of keys) {
      const prevValue = prevProps[key];
      const nextValue = nextProps[key];

      if (useDeepComparison) {
        if (!deepEqual(prevValue, nextValue))
          return false;
      } else {
        if (prevValue !== nextValue) return false;
      }
    }

    return true;
  };
}
