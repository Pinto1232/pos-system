import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import SuccessPage from '../app/checkout/success/page';
import Dashboard from '../app/dashboard/page';
import { useRouter } from 'next/navigation';
import { useSpinner } from '../contexts/SpinnerContext';
import { useCart } from '../contexts/CartContext';

// Mock the necessary hooks and components
jest.mock('../contexts/SpinnerContext', () => ({
  useSpinner: jest.fn(() => ({
    setLoading: jest.fn(),
    stopLoading: jest.fn(),
  })),
}));

jest.mock('../contexts/CartContext', () => ({
  useCart: jest.fn(() => ({
    clearCart: jest.fn(),
  })),
}));

jest.mock(
  '../components/dashboard-layout/DashboardContainer',
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

describe('Payment Success to Dashboard Flow', () => {
  // Setup common mocks before each test
  beforeEach(() => {
    // Mock router
    const mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    // Mock spinner context
    const mockSetLoading = jest.fn();
    const mockStopLoading = jest.fn();
    (useSpinner as jest.Mock).mockReturnValue({
      setLoading: mockSetLoading,
      stopLoading: mockStopLoading,
    });

    // Mock cart context
    const mockClearCart = jest.fn();
    (useCart as jest.Mock).mockReturnValue({
      clearCart: mockClearCart,
    });

    // Clear sessionStorage before each test
    window.sessionStorage.clear();

    // Clear all timers
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should show spinner when navigating from payment success to dashboard', async () => {
    // Setup mocks
    const mockPush = jest
      .fn()
      .mockImplementation(() => {
        // Simulate navigation by changing what useRouter returns
        (useRouter as jest.Mock).mockReturnValue({
          push: mockPush,
          pathname: '/dashboard',
        });

        // Re-render the Dashboard component to simulate navigation
        render(<Dashboard />);
      });

    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      pathname: '/checkout/success',
    });

    const mockSetLoading = jest.fn();
    const mockStopLoading = jest.fn();
    (useSpinner as jest.Mock).mockReturnValue({
      setLoading: mockSetLoading,
      stopLoading: mockStopLoading,
    });

    // Render the success page
    render(<SuccessPage />);

    // Click the Return to Dashboard button
    fireEvent.click(
      screen.getByText('Return to Dashboard')
    );

    // Check if the spinner was shown
    expect(mockSetLoading).toHaveBeenCalledWith(
      true
    );

    // Check if the sessionStorage flag was set
    expect(
      sessionStorage.getItem('fromPaymentSuccess')
    ).toBe('true');

    // Wait for the navigation to be triggered
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith(
        '/dashboard'
      );
    });

    // Fast-forward time by 3 seconds to simulate the dashboard loading
    jest.advanceTimersByTime(3000);

    // Now stopLoading should have been called
    expect(mockStopLoading).toHaveBeenCalled();

    // Check that the flag was removed from sessionStorage
    expect(
      sessionStorage.getItem('fromPaymentSuccess')
    ).toBeNull();
  });
});
