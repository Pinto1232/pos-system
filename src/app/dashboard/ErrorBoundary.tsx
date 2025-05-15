'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import DashboardError from './DashboardError';
import { useQueryClient } from '@tanstack/react-query';

interface Props {
  children: ReactNode;
  /**
   * Optional cache tags to revalidate when an error occurs
   * This helps ensure fresh data is fetched after an error
   */
  cacheTags?: string[];
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary component for catching errors in the component tree
 * This is a Client Component as error boundaries must be class components
 *
 * Enhanced to work with Next.js caching:
 * - Provides detailed error information
 * - Supports cache revalidation on error
 * - Includes retry mechanism that can refresh cached data
 */
class ErrorBoundaryClass extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Update state with error info for better debugging
    this.setState({ errorInfo });

    // Log the error to an error reporting service
    console.error('Error caught by boundary:', error, errorInfo);

    // You could add additional error reporting here
    // e.g., send to an error tracking service
  }

  handleReset = async (): Promise<void> => {
    // First, try to refresh the cache if the method exists
    // @ts-expect-error - Using custom property added by the wrapper
    if (typeof this.refreshCache === 'function') {
      try {
        // @ts-expect-error - Using custom property added by the wrapper
        await this.refreshCache();
      } catch (err) {
        console.error('Error refreshing cache during reset:', err);
      }
    }

    // Then reset the error state
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // Render the error component with reset handler
      return (
        <DashboardError
          error={this.state.error!}
          errorInfo={this.state.errorInfo}
          reset={this.handleReset}
        />
      );
    }

    // Render children if no error
    return this.props.children;
  }
}

/**
 * Wrapper component that provides React Query client to the error boundary
 * This allows us to invalidate cache when errors occur
 */
export default function ErrorBoundary({ children, cacheTags }: Props): ReactNode {
  // Get React Query client for cache operations
  const queryClient = useQueryClient();

  return (
    <ErrorBoundaryClass
      cacheTags={cacheTags}
      ref={(errorBoundary) => {
        // This is a workaround since we can't directly pass the queryClient to the class component
        // We're attaching a custom method to the class instance
        if (errorBoundary) {
          // @ts-expect-error - Adding a custom property to the component instance
          errorBoundary.refreshCache = async () => {
            // If cache tags are provided, invalidate those specific queries
            if (cacheTags && cacheTags.length > 0) {
              console.log('Invalidating cache tags on error:', cacheTags);

              // Invalidate each cache tag
              cacheTags.forEach(tag => {
                queryClient.invalidateQueries({ queryKey: [tag] });
              });
            }

            // Optionally, refetch active queries to get fresh data
            await queryClient.refetchQueries();
          };
        }
      }}
    >
      {children}
    </ErrorBoundaryClass>
  );
}
