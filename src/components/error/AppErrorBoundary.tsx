'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Alert, Button, Collapse, Paper } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

interface ErrorDisplayProps {
  error: Error;
  errorInfo?: ErrorInfo | null;
  reset: () => void;
  title?: string;
  showHomeButton?: boolean;
}

/**
 * Generic error display component
 */
function ErrorDisplay({ 
  error, 
  errorInfo, 
  reset, 
  title = 'An error occurred', 
  showHomeButton = true 
}: ErrorDisplayProps) {
  const router = useRouter();
  const [showDetails, setShowDetails] = useState(false);

  return (
    <Box sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
      <Alert severity="error" sx={{ mb: 2 }}>
        <Typography variant="h6" component="div" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body1">{error.message}</Typography>
      </Alert>
      
      {/* Error details (expandable) */}
      <Box sx={{ mb: 3 }}>
        <Button 
          variant="text" 
          color="info" 
          size="small"
          onClick={() => setShowDetails(!showDetails)}
          sx={{ mb: 1 }}
        >
          {showDetails ? 'Hide' : 'Show'} Technical Details
        </Button>
        
        <Collapse in={showDetails}>
          <Paper sx={{ p: 2, bgcolor: '#f5f5f5', overflowX: 'auto' }}>
            <Typography variant="subtitle2" color="error" gutterBottom>
              Error: {error.name}
            </Typography>
            
            <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap', fontSize: '0.8rem' }}>
              {error.stack || error.message}
            </Typography>
            
            {errorInfo && (
              <>
                <Typography variant="subtitle2" color="error" sx={{ mt: 2 }} gutterBottom>
                  Component Stack:
                </Typography>
                <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap', fontSize: '0.8rem' }}>
                  {errorInfo.componentStack}
                </Typography>
              </>
            )}
          </Paper>
        </Collapse>
      </Box>
      
      <Typography variant="body2" color="text.secondary" paragraph>
        This error might be caused by stale data. Try refreshing to get the latest content.
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={reset}
        >
          Refresh and Try Again
        </Button>
        {showHomeButton && (
          <Button 
            variant="outlined" 
            onClick={() => router.push('/')}
          >
            Return to Home
          </Button>
        )}
      </Box>
    </Box>
  );
}

interface Props {
  children: ReactNode;
  /**
   * Optional cache tags to revalidate when an error occurs
   */
  cacheTags?: string[];
  /**
   * Custom error title
   */
  errorTitle?: string;
  /**
   * Whether to show the home button
   */
  showHomeButton?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary class component
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
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });
    console.error('Error caught by boundary:', error, errorInfo);
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
      return (
        <ErrorDisplay 
          error={this.state.error!}
          errorInfo={this.state.errorInfo}
          reset={this.handleReset}
          title={this.props.errorTitle}
          showHomeButton={this.props.showHomeButton}
        />
      );
    }

    return this.props.children;
  }
}

/**
 * Generic Error Boundary component with cache integration
 * This component can be used throughout the application to catch errors
 * and provide a consistent error experience with cache revalidation
 */
export default function AppErrorBoundary({ 
  children, 
  cacheTags,
  errorTitle,
  showHomeButton
}: Props): ReactNode {
  const queryClient = useQueryClient();
  
  return (
    <ErrorBoundaryClass 
      cacheTags={cacheTags}
      errorTitle={errorTitle}
      showHomeButton={showHomeButton}
      ref={(errorBoundary) => {
        if (errorBoundary) {
          // @ts-expect-error - Adding a custom property to the component instance
          errorBoundary.refreshCache = async () => {
            if (cacheTags && cacheTags.length > 0) {
              console.log('Invalidating cache tags on error:', cacheTags);
              
              cacheTags.forEach(tag => {
                queryClient.invalidateQueries({ queryKey: [tag] });
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
