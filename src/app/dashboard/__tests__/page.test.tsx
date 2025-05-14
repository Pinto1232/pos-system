import React from 'react';
import {
  render,
  waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import Dashboard from '../page';
import { useSpinner } from '@/contexts/SpinnerContext';

// Mock the necessary hooks and components
jest.mock('@/contexts/SpinnerContext', () => ({
  useSpinner: jest.fn(() => ({
    stopLoading: jest.fn(),
  })),
}));

jest.mock(
  '@/components/dashboard-layout/DashboardContainer',
  () => {
    return function DummyDashboardContainer() {
      return (
        <div data-testid="dashboard-container">
          Dashboard Content
        </div>
      );
    };
  }
);

describe('Dashboard Page', () => {
  // Setup common mocks before each test
  beforeEach(() => {
    // Mock spinner context
    const mockStopLoading = jest.fn();
    (useSpinner as jest.Mock).mockReturnValue({
      stopLoading: mockStopLoading,
    });

    // Clear sessionStorage before each test
    window.sessionStorage.clear();

    // Clear all timers
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

    // Check if stopLoading was called immediately
    expect(mockStopLoading).toHaveBeenCalledTimes(
      1
    );
  });

  it('should keep loading for 3 seconds when fromPaymentSuccess flag is set', async () => {
    const mockStopLoading = jest.fn();
    (useSpinner as jest.Mock).mockReturnValue({
      stopLoading: mockStopLoading,
    });

    // Set the flag in sessionStorage
    sessionStorage.setItem(
      'fromPaymentSuccess',
      'true'
    );

    render(<Dashboard />);

    // Check that stopLoading hasn't been called yet
    expect(
      mockStopLoading
    ).not.toHaveBeenCalled();

    // Fast-forward time by 3 seconds
    jest.advanceTimersByTime(3000);

    // Now stopLoading should have been called
    expect(mockStopLoading).toHaveBeenCalledTimes(
      1
    );

    // Check that the flag was removed from sessionStorage
    expect(
      sessionStorage.getItem('fromPaymentSuccess')
    ).toBeNull();
  });

  it('should keep loading for 3 seconds when freshLogin flag is set', async () => {
    const mockStopLoading = jest.fn();
    (useSpinner as jest.Mock).mockReturnValue({
      stopLoading: mockStopLoading,
    });

    // Set the flag in sessionStorage
    sessionStorage.setItem('freshLogin', 'true');

    render(<Dashboard />);

    // Check that stopLoading hasn't been called yet
    expect(
      mockStopLoading
    ).not.toHaveBeenCalled();

    // Fast-forward time by 3 seconds
    jest.advanceTimersByTime(3000);

    // Now stopLoading should have been called
    expect(mockStopLoading).toHaveBeenCalledTimes(
      1
    );

    // Check that the flag was removed from sessionStorage
    expect(
      sessionStorage.getItem('freshLogin')
    ).toBeNull();
  });

  it('should handle both flags being set', async () => {
    const mockStopLoading = jest.fn();
    (useSpinner as jest.Mock).mockReturnValue({
      stopLoading: mockStopLoading,
    });

    // Set both flags in sessionStorage
    sessionStorage.setItem('freshLogin', 'true');
    sessionStorage.setItem(
      'fromPaymentSuccess',
      'true'
    );

    render(<Dashboard />);

    // Check that stopLoading hasn't been called yet
    expect(
      mockStopLoading
    ).not.toHaveBeenCalled();

    // Fast-forward time by 3 seconds
    jest.advanceTimersByTime(3000);

    // Now stopLoading should have been called
    expect(mockStopLoading).toHaveBeenCalledTimes(
      1
    );

    // Check that both flags were removed from sessionStorage
    expect(
      sessionStorage.getItem('freshLogin')
    ).toBeNull();
    expect(
      sessionStorage.getItem('fromPaymentSuccess')
    ).toBeNull();
  });
});
