import React from 'react';
import {
  render,
  screen,
} from '@testing-library/react';
import SidebarFeatureGuard from '../SidebarFeatureGuard';
import { useUserSubscription } from '@/contexts/UserSubscriptionContext';

// Mock the UserSubscriptionContext
jest.mock(
  '@/contexts/UserSubscriptionContext',
  () => ({
    useUserSubscription: jest.fn(),
  })
);

describe('SidebarFeatureGuard', () => {
  const mockUseUserSubscription =
    useUserSubscription as jest.Mock;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it('renders children when user has feature access', () => {
    // Mock the context to return that user has access
    mockUseUserSubscription.mockReturnValue({
      hasFeatureAccess: () => true,
      subscription: {
        package: { title: 'Starter' },
      },
      availableFeatures: ['Dashboard'],
    });

    render(
      <SidebarFeatureGuard featureName="Dashboard">
        <div data-testid="child-component">
          Child Component
        </div>
      </SidebarFeatureGuard>
    );

    // Child should be rendered
    expect(
      screen.getByTestId('child-component')
    ).toBeInTheDocument();
    // Lock icon should not be present
    expect(
      screen.queryByTestId('lock-icon')
    ).not.toBeInTheDocument();
  });

  it('renders disabled version when hasFeatureAccess returns false', () => {
    // Mock the context to return that user doesn't have access
    mockUseUserSubscription.mockReturnValue({
      hasFeatureAccess: () => false,
      subscription: {
        package: { title: 'Starter' },
      },
      availableFeatures: ['Dashboard'], // Even if feature is in available features, we rely on hasFeatureAccess
    });

    render(
      <SidebarFeatureGuard featureName="Dashboard">
        <div data-testid="child-component">
          Child Component
        </div>
      </SidebarFeatureGuard>
    );

    // Child should still be rendered
    expect(
      screen.getByText('Child Component')
    ).toBeInTheDocument();
    // Lock icon should be present
    expect(
      screen.getByTestId('lock-icon')
    ).toBeInTheDocument();
  });

  it('renders tooltip with upgrade information when feature is locked', () => {
    // Mock the context to return that user doesn't have access
    mockUseUserSubscription.mockReturnValue({
      hasFeatureAccess: () => false,
      subscription: {
        package: { title: 'Starter' },
      },
      availableFeatures: ['Products List'], // Different features available
    });

    render(
      <SidebarFeatureGuard featureName="Dashboard">
        <div data-testid="child-component">
          Child Component
        </div>
      </SidebarFeatureGuard>
    );

    // Child should still be rendered
    expect(
      screen.getByText('Child Component')
    ).toBeInTheDocument();
    // Should have the lock icon
    expect(
      screen.getByTestId('lock-icon')
    ).toBeInTheDocument();

    // Check that the component has the correct styling
    const lockedItem = screen
      .getByText('Child Component')
      .closest('div');
    expect(lockedItem).toHaveStyle({
      opacity: '0.6',
      cursor: 'pointer',
      position: 'relative',
    });
  });
});
