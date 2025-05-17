import React from 'react';
import { createMemoComparison } from './optimizationUtils';

interface OptimizationOptions {
  memo?: boolean;

  propsToCompare?: string[];

  deepComparison?: boolean;

  trackRenders?: boolean;

  displayName?: string;
}

export function withOptimization<P extends object>(
  Component: React.ComponentType<P>,
  options: OptimizationOptions = {}
): React.ComponentType<P> {
  const {
    memo = true,
    propsToCompare = [],
    deepComparison = false,
    trackRenders = false,
    displayName,
  } = options;

  let OptimizedComponent: React.ComponentType<P> = (props: P) => {
    if (trackRenders) {
      const componentName =
        displayName || Component.displayName || Component.name || 'Component';
      console.log(`[RENDER] ${componentName} rendered`);
    }

    return <Component {...props} />;
  };

  if (memo) {
    const compareFunction = createMemoComparison(
      propsToCompare,
      deepComparison
    );
    OptimizedComponent = React.memo(OptimizedComponent, compareFunction);
  }

  const wrappedName =
    displayName || Component.displayName || Component.name || 'Component';
  OptimizedComponent.displayName = `withOptimization(${wrappedName})`;

  return OptimizedComponent;
}

export default withOptimization;
