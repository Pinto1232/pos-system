import React from 'react';

export const useRenderTracker = (
  componentName: string,
  props?: Record<string, unknown>
) => {
  const renderCount = React.useRef(0);
  const prevProps = React.useRef(props);

  React.useEffect(() => {
    renderCount.current += 1;

    if (process.env.NODE_ENV === 'development') {
      console.group(`🔄 ${componentName} Render #${renderCount.current}`);

      if (props && prevProps.current) {
        const changedProps = Object.keys(props).filter(
          (key) => props[key] !== prevProps.current?.[key]
        );

        if (changedProps.length > 0) {
          console.log('📝 Changed props:', changedProps);
          changedProps.forEach((key) => {
            console.log(`  ${key}:`, {
              from: prevProps.current?.[key],
              to: props[key],
            });
          });
        } else {
          console.log('⚠️ Re-render with no prop changes');
        }
      }

      console.groupEnd();
    }

    prevProps.current = props;
  });

  return renderCount.current;
};

export const withRenderTracker = <P extends Record<string, unknown>>(
  WrappedComponent: React.ComponentType<P>,
  componentName: string
) => {
  const TrackedComponent = React.forwardRef<unknown, P>((props) => {
    useRenderTracker(componentName, props);
    return React.createElement(WrappedComponent, props as P);
  });

  TrackedComponent.displayName = `withRenderTracker(${componentName})`;
  return TrackedComponent;
};

export const useRenderTime = (componentName: string) => {
  const startTime = React.useRef<number | undefined>(undefined);

  if (!startTime.current) {
    startTime.current = performance.now();
  }

  React.useEffect(() => {
    if (startTime.current && process.env.NODE_ENV === 'development') {
      const renderTime = performance.now() - startTime.current;
      console.log(
        `⏱️ ${componentName} render time: ${renderTime.toFixed(2)}ms`
      );
    }
    startTime.current = undefined;
  });
};

export const useStabilityTracker = (value: unknown, name: string) => {
  const prevValue = React.useRef(value);
  const isStable = React.useRef(true);

  React.useEffect(() => {
    if (prevValue.current !== value) {
      if (process.env.NODE_ENV === 'development') {
        if (
          typeof value === 'object' &&
          value !== null &&
          prevValue.current !== null
        ) {
          const isShallowEqual =
            JSON.stringify(value) === JSON.stringify(prevValue.current);
          if (isShallowEqual) {
            console.warn(
              `🔄 ${name}: Object/Array recreated with same content (consider memoization)`
            );
            isStable.current = false;
          }
        }
      }
      prevValue.current = value;
    }
  }, [value, name]);

  return isStable.current;
};

export const PerformanceMonitor: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [renderCount, setRenderCount] = React.useState(0);
  const [lastRenderTime, setLastRenderTime] = React.useState<number>(0);
  const startTime = React.useRef<number | undefined>(undefined);

  React.useEffect(() => {
    startTime.current = performance.now();
    setRenderCount((prev) => prev + 1);
  }, []);

  React.useEffect(() => {
    if (startTime.current) {
      const renderTime = performance.now() - startTime.current;
      setLastRenderTime(renderTime);

      if (process.env.NODE_ENV === 'development') {
        console.log(
          `📊 Custom Package Modal - Render #${renderCount}, Time: ${renderTime.toFixed(2)}ms`
        );

        if (renderCount > 10) {
          console.warn(
            `⚠️ Custom Package Modal has rendered ${renderCount} times. Consider optimization.`
          );
        }

        if (renderTime > 16) {
          console.warn(
            `⚠️ Slow render detected: ${renderTime.toFixed(2)}ms (target: <16ms for 60fps)`
          );
        }
      }
    }
  }, [renderCount]);

  return React.createElement(
    React.Fragment,
    null,
    children,
    process.env.NODE_ENV === 'development' &&
      React.createElement(
        'div',
        {
          style: {
            position: 'fixed',
            top: 10,
            right: 10,
            background: 'rgba(0,0,0,0.8)',
            color: 'white',
            padding: '8px',
            borderRadius: '4px',
            fontSize: '12px',
            zIndex: 9999,
            fontFamily: 'monospace',
          },
        },
        `Renders: ${renderCount} | Last: ${lastRenderTime.toFixed(1)}ms`
      )
  );
};

export const useStableCallback = <T extends (...args: unknown[]) => unknown>(
  callback: T,
  deps: React.DependencyList
): T => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return React.useCallback(callback, deps);
};

export const useStableObject = <T>(
  factory: () => T,
  deps: React.DependencyList
): T => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return React.useMemo(factory, deps);
};

export const useDependencyTracker = (
  deps: React.DependencyList,
  name: string
) => {
  const prevDeps = React.useRef<React.DependencyList | undefined>(undefined);

  React.useEffect(() => {
    if (prevDeps.current && process.env.NODE_ENV === 'development') {
      const changedDeps = deps
        .map((dep, index) => ({
          index,
          changed: dep !== prevDeps.current?.[index],
          from: prevDeps.current?.[index],
          to: dep,
        }))
        .filter((item) => item.changed);

      if (changedDeps.length > 0) {
        console.log(`🔍 ${name} dependencies changed:`, changedDeps);
      }
    }
    prevDeps.current = deps;
  }, [deps, name]);
};
