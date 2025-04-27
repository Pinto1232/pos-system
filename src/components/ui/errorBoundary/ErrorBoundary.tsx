import React, {
  Component,
  ErrorInfo,
  ReactNode,
} from 'react';
import ErrorModal from '../errorModal/ErrorModal';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(
    error: Error
  ): ErrorBoundaryState {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(
    error: Error,
    errorInfo: ErrorInfo
  ): void {
    console.error(
      'Error caught by ErrorBoundary:',
      error,
      errorInfo
    );
    this.setState({
      errorInfo,
    });
  }

  handleResetError = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <ErrorModal
          message={
            this.state.error?.message ||
            'An unexpected error occurred'
          }
          onClose={this.handleResetError}
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
