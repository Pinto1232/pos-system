import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SuccessPage from '../page';
import { useRouter } from 'next/navigation';
import { useSpinner } from '@/contexts/SpinnerContext';
import { useCart } from '@/contexts/CartContext';

jest.mock('@/contexts/SpinnerContext', () => ({
  useSpinner: jest.fn(() => ({
    setLoading: jest.fn(),
  })),
}));

jest.mock('@/contexts/CartContext', () => ({
  useCart: jest.fn(() => ({
    clearCart: jest.fn(),
  })),
}));

describe('SuccessPage Component', () => {
  beforeEach(() => {
    const mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    const mockSetLoading = jest.fn();
    (useSpinner as jest.Mock).mockReturnValue({
      setLoading: mockSetLoading,
    });

    const mockClearCart = jest.fn();
    (useCart as jest.Mock).mockReturnValue({
      clearCart: mockClearCart,
    });

    window.sessionStorage.clear();
  });

  it('should show the success message', () => {
    render(<SuccessPage />);

    expect(screen.getByText('Payment Successful! 🎉')).toBeInTheDocument();
    expect(
      screen.getByText(/Thank you for your purchase/i)
    ).toBeInTheDocument();
    expect(screen.getByText('Return to Dashboard')).toBeInTheDocument();
  });

  it('should clear the cart when mounted', () => {
    const mockClearCart = jest.fn();
    (useCart as jest.Mock).mockReturnValue({
      clearCart: mockClearCart,
    });

    render(<SuccessPage />);

    expect(mockClearCart).toHaveBeenCalledTimes(1);
  });

  it('should show spinner and set sessionStorage when clicking Return to Dashboard', async () => {
    const mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    const mockSetLoading = jest.fn();
    (useSpinner as jest.Mock).mockReturnValue({
      setLoading: mockSetLoading,
    });

    render(<SuccessPage />);

    fireEvent.click(screen.getByText('Return to Dashboard'));

    expect(mockSetLoading).toHaveBeenCalledWith(true);

    expect(sessionStorage.getItem('fromPaymentSuccess')).toBe('true');

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });
  });
});
