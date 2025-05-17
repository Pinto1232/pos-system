import { useRef, useEffect, DependencyList } from 'react';

export function useRenderTracker(componentName: string, props: Record<string, any>, dependencies?: DependencyList): void {
  const renderCount = useRef(0);
  const prevProps = useRef<Record<string, any>>({});
  const prevDeps = useRef<any[]>([]);

  useEffect(() => {
    renderCount.current += 1;

    const changedProps: Record<string, { from: any; to: any }> = {};
    Object.keys(props).forEach((key) => {
      if (prevProps.current[key] !== props[key]) {
        changedProps[key] = {
          from: prevProps.current[key],
          to: props[key],
        };
      }
    });

    const changedDeps: Record<number, { from: any; to: any }> = {};
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

    if (renderCount.current > 1) {
      console.log(`[RENDER] ${componentName} rendered ${renderCount.current} times`);

      if (Object.keys(changedProps).length > 0) {
        console.log('Changed props:', JSON.stringify(changedProps, null, 2));
      }

      if (dependencies && Object.keys(changedDeps).length > 0) {
        console.log('Changed dependencies:', JSON.stringify(changedDeps, null, 2));
      }
    }

    prevProps.current = { ...props };
    if (dependencies) {
      prevDeps.current = [...dependencies];
    }
  });
}

export function isPlainObject(obj: any): boolean {
  return obj !== null && typeof obj === 'object' && !Array.isArray(obj) && Object.getPrototypeOf(obj) === Object.prototype;
}

export function deepEqual(a: any, b: any): boolean {
  if (a === b) return true;

  if (a == null || b == null) return a === b;

  if (typeof a !== typeof b) return false;

  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    return true;
  }

  if (isPlainObject(a) && isPlainObject(b)) {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);

    if (keysA.length !== keysB.length) return false;

    for (const key of keysA) {
      if (!Object.prototype.hasOwnProperty.call(b, key)) return false;
      if (!deepEqual(a[key], b[key])) return false;
    }

    return true;
  }

  return false;
}

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
        if (!deepEqual(prevValue, nextValue)) return false;
      } else {
        if (prevValue !== nextValue) return false;
      }
    }

    return true;
  };
}
