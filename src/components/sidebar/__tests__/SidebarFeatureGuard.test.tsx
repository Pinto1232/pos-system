import React from 'react';
import { render, screen } from '@testing-library/react';
import SidebarFeatureGuard from '../SidebarFeatureGuard';
import { useUserSubscription } from '@/contexts/UserSubscriptionContext';

jest.mock('@/contexts/UserSubscriptionContext', () => ({
  useUserSubscription: jest.fn(),
}));

describe('SidebarFeatureGuard', () => {
  const mockUseUserSubscription = useUserSubscription as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders children when user has feature access', () => {
    mockUseUserSubscription.mockReturnValue({
      hasFeatureAccess: () => true,
      subscription: {
        package: { title: 'Starter' },
      },
      availableFeatures: ['Dashboard'],
    });

    render(
      <SidebarFeatureGuard featureName="Dashboard">
        <div data-testid="child-component">Child Component</div>
      </SidebarFeatureGuard>
    );

    expect(screen.getByTestId('child-component')).toBeInTheDocument();

    expect(screen.queryByTestId('lock-icon')).not.toBeInTheDocument();
  });

  it('renders disabled version when hasFeatureAccess returns false', () => {
    mockUseUserSubscription.mockReturnValue({
      hasFeatureAccess: () => false,
      subscription: {
        package: { title: 'Starter' },
      },
      availableFeatures: ['Dashboard'],
    });

    render(
      <SidebarFeatureGuard featureName="Dashboard">
        <div data-testid="child-component">Child Component</div>
      </SidebarFeatureGuard>
    );

    expect(screen.getByText('Child Component')).toBeInTheDocument();

    expect(screen.getByTestId('lock-icon')).toBeInTheDocument();
  });

  it('renders tooltip with upgrade information when feature is locked', () => {
    mockUseUserSubscription.mockReturnValue({
      hasFeatureAccess: () => false,
      subscription: {
        package: { title: 'Starter' },
      },
      availableFeatures: ['Products List'],
    });

    render(
      <SidebarFeatureGuard featureName="Dashboard">
        <div data-testid="child-component">Child Component</div>
      </SidebarFeatureGuard>
    );

    expect(screen.getByText('Child Component')).toBeInTheDocument();

    expect(screen.getByTestId('lock-icon')).toBeInTheDocument();

    const lockedItem = screen.getByText('Child Component').closest('div');
    expect(lockedItem).toHaveStyle({
      opacity: '0.6',
      cursor: 'pointer',
      position: 'relative',
    });
  });
});
