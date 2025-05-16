/**
 * Higher-order component for optimizing React components
 */

import React from 'react';
import { createMemoComparison } from './optimizationUtils';

interface OptimizationOptions {
  /**
   * Whether to use React.memo to memoize the component
   */
  memo?: boolean;

  /**
   * Array of prop names to compare for memoization
   * If empty, all props will be compared
   */
  propsToCompare?: string[];

  /**
   * Whether to use deep comparison for objects and arrays
   */
  deepComparison?: boolean;

  /**
   * Whether to log render information
   */
  trackRenders?: boolean;

  /**
   * Custom display name for the component
   */
  displayName?: string;
}

/**
 * Higher-order component that applies optimization techniques to a React component
 *
 * @param Component - The component to optimize
 * @param options - Optimization options
 * @returns Optimized component
 */
export function withOptimization<
  P extends object,
>(
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

  // Create the optimized component
  let OptimizedComponent: React.ComponentType<
    P
  > = (props: P) => {
    // Track renders if enabled
    if (trackRenders) {
      const componentName =
        displayName ||
        Component.displayName ||
        Component.name ||
        'Component';
      console.log(
        `[RENDER] ${componentName} rendered`
      );
    }

    return <Component {...props} />;
  };

  // Apply React.memo if enabled
  if (memo) {
    const compareFunction = createMemoComparison(
      propsToCompare,
      deepComparison
    );
    OptimizedComponent = React.memo(
      OptimizedComponent,
      compareFunction
    );
  }

  // Set display name
  const wrappedName =
    displayName ||
    Component.displayName ||
    Component.name ||
    'Component';
  OptimizedComponent.displayName = `withOptimization(${wrappedName})`;

  return OptimizedComponent;
}

export default withOptimization;
