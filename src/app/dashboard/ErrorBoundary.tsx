'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import DashboardError from './DashboardError';
import { useQueryClient } from '@tanstack/react-query';

interface Props {
  children: ReactNode;

  cacheTags?: string[];
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundaryClass extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });

    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleReset = async (): Promise<void> => {
    if (typeof this.refreshCache === 'function') {
      try {
        await this.refreshCache();
      } catch (err) {
        console.error('Error refreshing cache during reset:', JSON.stringify(err, null, 2));
      }
    }

    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return <DashboardError error={this.state.error!} errorInfo={this.state.errorInfo} reset={this.handleReset} />;
    }

    return this.props.children;
  }
}

export default function ErrorBoundary({ children, cacheTags }: Props): ReactNode {
  const queryClient = useQueryClient();

  return (
    <ErrorBoundaryClass
      cacheTags={cacheTags}
      ref={(errorBoundary) => {
        if (errorBoundary) {
          errorBoundary.refreshCache = async () => {
            if (cacheTags && cacheTags.length > 0) {
              console.log('Invalidating cache tags on error:', JSON.stringify(cacheTags, null, 2));

              cacheTags.forEach((tag) => {
                queryClient.invalidateQueries({
                  queryKey: [tag],
                });
              });
            }

            await queryClient.refetchQueries();
          };
        }
      }}
    >
      {children}
    </ErrorBoundaryClass>
  );
}
