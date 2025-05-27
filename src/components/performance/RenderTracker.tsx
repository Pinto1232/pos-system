'use client';

import React, { useRef, useEffect } from 'react';

interface RenderTrackerProps {
  componentName: string;
  props?: Record<string, unknown>;
  children?: React.ReactNode;
  trackProps?: boolean;
  warnThreshold?: number;
}

const RenderTracker: React.FC<RenderTrackerProps> = ({
  componentName,
  props = {},
  children,
  trackProps = true,
  warnThreshold = 5,
}) => {
  const renderCount = useRef(0);
  const prevProps = useRef<Record<string, unknown>>({});
  const startTime = useRef<number>(0);
  const isEnabled = process.env.NODE_ENV === 'development';

  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    renderCount.current += 1;
    startTime.current = performance.now();
  });

  useEffect(() => {
    if (!isEnabled) {
      return;
    }
    const renderTime = performance.now() - startTime.current;

    console.log(
      `🔄 [RENDER] ${componentName} - Render #${renderCount.current} (${renderTime.toFixed(2)}ms)`
    );

    if (renderCount.current > warnThreshold) {
      console.warn(
        `⚠️ [PERFORMANCE] ${componentName} has rendered ${renderCount.current} times. Consider optimization.`
      );
    }

    if (renderTime > 16) {
      console.warn(
        `⚠️ [SLOW RENDER] ${componentName} took ${renderTime.toFixed(2)}ms (target: <16ms for 60fps)`
      );
    }

    if (trackProps && Object.keys(props).length > 0) {
      const changedProps: Record<string, { from: unknown; to: unknown }> = {};

      Object.keys(props).forEach((key) => {
        if (prevProps.current[key] !== props[key]) {
          changedProps[key] = {
            from: prevProps.current[key],
            to: props[key],
          };
        }
      });

      if (Object.keys(changedProps).length > 0) {
        console.log(`📝 [PROPS] ${componentName} prop changes:`, changedProps);
      }

      prevProps.current = { ...props };
    }
  }, [componentName, props, trackProps, warnThreshold, isEnabled]);

  if (!isEnabled) {
    return <>{children}</>;
  }

  return <>{children}</>;
};

export default RenderTracker;

export function withRenderTracker<P extends Record<string, unknown>>(
  Component: React.ComponentType<P>,
  componentName?: string,
  options: {
    trackProps?: boolean;
    warnThreshold?: number;
  } = {}
) {
  const WrappedComponent = (props: P) => (
    <RenderTracker
      componentName={
        componentName ?? Component.displayName ?? Component.name ?? 'Component'
      }
      props={props}
      trackProps={options.trackProps}
      warnThreshold={options.warnThreshold}
    >
      <Component {...props} />
    </RenderTracker>
  );

  WrappedComponent.displayName = `withRenderTracker(${componentName ?? Component.displayName ?? Component.name})`;

  return WrappedComponent;
}

export function useRenderTracker(
  componentName: string,
  props?: Record<string, unknown>,
  options: {
    trackProps?: boolean;
    warnThreshold?: number;
  } = {}
) {
  const renderCount = useRef(0);
  const prevProps = useRef<Record<string, unknown>>({});
  const startTime = useRef<number>(0);
  const isEnabled = process.env.NODE_ENV === 'development';

  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    renderCount.current += 1;
    startTime.current = performance.now();
  });

  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    const renderTime = performance.now() - startTime.current;

    console.log(
      `🔄 [RENDER] ${componentName} - Render #${renderCount.current} (${renderTime.toFixed(2)}ms)`
    );

    if (renderCount.current > (options.warnThreshold ?? 5)) {
      console.warn(
        `⚠️ [PERFORMANCE] ${componentName} has rendered ${renderCount.current} times. Consider optimization.`
      );
    }

    if (renderTime > 16) {
      console.warn(
        `⚠️ [SLOW RENDER] ${componentName} took ${renderTime.toFixed(2)}ms (target: <16ms for 60fps)`
      );
    }

    if (
      options.trackProps !== false &&
      props &&
      Object.keys(props).length > 0
    ) {
      const changedProps: Record<string, { from: unknown; to: unknown }> = {};

      Object.keys(props).forEach((key) => {
        if (prevProps.current[key] !== props[key]) {
          changedProps[key] = {
            from: prevProps.current[key],
            to: props[key],
          };
        }
      });

      if (Object.keys(changedProps).length > 0) {
        console.log(`📝 [PROPS] ${componentName} prop changes:`, changedProps);
      }

      prevProps.current = { ...props };
    }
  }, [
    componentName,
    props,
    options.trackProps,
    options.warnThreshold,
    isEnabled,
  ]);
}
