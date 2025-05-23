import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import Dashboard from '../page';
import { useSpinner } from '@/contexts/SpinnerContext';

jest.mock('@/contexts/SpinnerContext', () => ({
  useSpinner: jest.fn(() => ({
    stopLoading: jest.fn(),
  })),
}));

jest.mock('@/components/dashboard-layout/DashboardContainer', () => {
  return function DummyDashboardContainer() {
    return <div data-testid="dashboard-container">Dashboard Content</div>;
  };
});

describe('Dashboard Page', () => {
  beforeEach(() => {
    const mockStopLoading = jest.fn();
    (useSpinner as jest.Mock).mockReturnValue({
      stopLoading: mockStopLoading,
    });

    window.sessionStorage.clear();

    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should stop loading immediately when no flags are set', () => {
    const mockStopLoading = jest.fn();
    (useSpinner as jest.Mock).mockReturnValue({
      stopLoading: mockStopLoading,
    });

    render(<Dashboard />);

    expect(mockStopLoading).toHaveBeenCalledTimes(1);
  });

  it('should keep loading for 3 seconds when fromPaymentSuccess flag is set', async () => {
    const mockStopLoading = jest.fn();
    (useSpinner as jest.Mock).mockReturnValue({
      stopLoading: mockStopLoading,
    });

    sessionStorage.setItem('fromPaymentSuccess', 'true');

    render(<Dashboard />);

    expect(mockStopLoading).not.toHaveBeenCalled();

    jest.advanceTimersByTime(3000);

    expect(mockStopLoading).toHaveBeenCalledTimes(1);

    expect(sessionStorage.getItem('fromPaymentSuccess')).toBeNull();
  });

  it('should keep loading for 3 seconds when freshLogin flag is set', async () => {
    const mockStopLoading = jest.fn();
    (useSpinner as jest.Mock).mockReturnValue({
      stopLoading: mockStopLoading,
    });

    sessionStorage.setItem('freshLogin', 'true');

    render(<Dashboard />);

    expect(mockStopLoading).not.toHaveBeenCalled();

    jest.advanceTimersByTime(3000);

    expect(mockStopLoading).toHaveBeenCalledTimes(1);

    expect(sessionStorage.getItem('freshLogin')).toBeNull();
  });

  it('should handle both flags being set', async () => {
    const mockStopLoading = jest.fn();
    (useSpinner as jest.Mock).mockReturnValue({
      stopLoading: mockStopLoading,
    });

    sessionStorage.setItem('freshLogin', 'true');
    sessionStorage.setItem('fromPaymentSuccess', 'true');

    render(<Dashboard />);

    expect(mockStopLoading).not.toHaveBeenCalled();

    jest.advanceTimersByTime(3000);

    expect(mockStopLoading).toHaveBeenCalledTimes(1);

    expect(sessionStorage.getItem('freshLogin')).toBeNull();
    expect(sessionStorage.getItem('fromPaymentSuccess')).toBeNull();
  });
});
