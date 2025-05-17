import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SuccessPage from '../app/checkout/success/page';
import Dashboard from '../app/dashboard/page';
import { useRouter } from 'next/navigation';
import { useSpinner } from '../contexts/SpinnerContext';
import { useCart } from '../contexts/CartContext';

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

jest.mock('../components/dashboard-layout/DashboardContainer', () => {
  return function DummyDashboardContainer() {
    return <div data-testid="dashboard-container">Dashboard Content</div>;
  };
});

describe('Payment Success to Dashboard Flow', () => {
  beforeEach(() => {
    const mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    const mockSetLoading = jest.fn();
    const mockStopLoading = jest.fn();
    (useSpinner as jest.Mock).mockReturnValue({
      setLoading: mockSetLoading,
      stopLoading: mockStopLoading,
    });

    const mockClearCart = jest.fn();
    (useCart as jest.Mock).mockReturnValue({
      clearCart: mockClearCart,
    });

    window.sessionStorage.clear();

    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should show spinner when navigating from payment success to dashboard', async () => {
    const mockPush = jest.fn().mockImplementation(() => {
      (useRouter as jest.Mock).mockReturnValue({
        push: mockPush,
        pathname: '/dashboard',
      });

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

    render(<SuccessPage />);

    fireEvent.click(screen.getByText('Return to Dashboard'));

    expect(mockSetLoading).toHaveBeenCalledWith(true);

    expect(sessionStorage.getItem('fromPaymentSuccess')).toBe('true');

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });

    jest.advanceTimersByTime(3000);

    expect(mockStopLoading).toHaveBeenCalled();

    expect(sessionStorage.getItem('fromPaymentSuccess')).toBeNull();
  });
});
