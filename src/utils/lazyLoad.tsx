import React, { lazy, Suspense } from 'react';
import { CircularProgress, Box } from '@mui/material';

const LoadingFallback = () => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    minHeight="200px"
    width="100%"
  >
    <CircularProgress size={40} />
  </Box>
);

type JSXElementConstructor<P> = (props: P) => React.ReactElement | null;

export function lazyLoad<P extends Record<string, unknown>>(
  importFunc: () => Promise<{
    default: JSXElementConstructor<P>;
  }>,
  skipFallback = false
): JSXElementConstructor<P> {
  const LazyComponent = lazy(importFunc);

  function LazyLoadComponent(props: P) {
    return (
      <Suspense fallback={skipFallback ? null : <LoadingFallback />}>
        <LazyComponent {...props} />
      </Suspense>
    );
  }

  LazyLoadComponent.displayName = `LazyLoaded(${importFunc.name || 'Component'})`;

  return LazyLoadComponent;
}

export default lazyLoad;
