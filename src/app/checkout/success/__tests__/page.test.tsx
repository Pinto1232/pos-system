import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import SuccessPage from '../page';
import { useRouter } from 'next/navigation';
import { useSpinner } from '@/contexts/SpinnerContext';
import { useCart } from '@/contexts/CartContext';

// Mock the necessary hooks and components
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
  // Setup common mocks before each test
  beforeEach(() => {
    // Mock router
    const mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    // Mock spinner context
    const mockSetLoading = jest.fn();
    (useSpinner as jest.Mock).mockReturnValue({
      setLoading: mockSetLoading,
    });

    // Mock cart context
    const mockClearCart = jest.fn();
    (useCart as jest.Mock).mockReturnValue({
      clearCart: mockClearCart,
    });

    // Clear sessionStorage before each test
    window.sessionStorage.clear();
  });

  it('should show the success message', () => {
    render(<SuccessPage />);

    // Check if the success message is displayed
    expect(
      screen.getByText('Payment Successful! 🎉')
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Thank you for your purchase/i
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText('Return to Dashboard')
    ).toBeInTheDocument();
  });

  it('should clear the cart when mounted', () => {
    const mockClearCart = jest.fn();
    (useCart as jest.Mock).mockReturnValue({
      clearCart: mockClearCart,
    });

    render(<SuccessPage />);

    // Check if clearCart was called
    expect(mockClearCart).toHaveBeenCalledTimes(
      1
    );
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
  });
});
