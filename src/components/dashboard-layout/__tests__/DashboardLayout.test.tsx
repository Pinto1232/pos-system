import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import DashboardLayout from '../DashboardLayout';
import useKeycloakUser from '@/hooks/useKeycloakUser';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

jest.mock('@/hooks/useKeycloakUser');
jest.mock('@/components/sidebar/Sidebar', () => {
  return function MockSidebar(props: Record<string, unknown>) {
    return (
      <div data-testid="sidebar">
        <div data-testid="sidebar-props">{JSON.stringify(props)}</div>
      </div>
    );
  };
});

jest.mock('@/components/sidebar/Navbar', () => {
  return function MockNavbar(props: Record<string, unknown>) {
    return (
      <div data-testid="navbar">
        <div data-testid="navbar-props">{JSON.stringify(props)}</div>
      </div>
    );
  };
});

jest.mock('@/components/dashboardMain/dashboardMainContainer', () => {
  return function MockDashboardMainContainer(props: { children?: React.ReactNode }) {
    return (
      <div data-testid="dashboard-main-container">
        <div data-testid="dashboard-main-props">{JSON.stringify(props)}</div>
      </div>
    );
  };
});

jest.mock('@/SettingsModal', () => {
  return function MockSettingsModal(props: { open: boolean; onClose: () => void; userId: string; onCustomizationUpdated: () => void }) {
    return (
      <div data-testid="settings-modal">
        <div data-testid="settings-modal-props">{JSON.stringify(props)}</div>
      </div>
    );
  };
});

global.fetch = jest.fn().mockImplementation((url) => {
  if (url.includes('/api/UserCustomization/')) {
    return Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({
          id: 1,
          userId: url.includes('test-user-id') ? 'test-user-id' : 'current-user',
          sidebarColor: '#173A79',
          logoUrl: '/test-logo.jpg',
          navbarColor: '#000000',
          taxSettings: {
            enableTaxCalculation: true,
            defaultTaxRate: 15.0,
          },
          regionalSettings: {
            defaultCurrency: 'ZAR',
            dateFormat: 'DD/MM/YYYY',
          },
        }),
    });
  }
  return Promise.resolve({
    ok: false,
    status: 404,
  });
});

describe('DashboardLayout Component', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    jest.clearAllMocks();

    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn().mockImplementation((key) => {
          if (key === 'sidebarActiveItem') return 'Dashboard';
          return null;
        }),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
      },
      writable: true,
    });
  });

  it('should use the Keycloak user ID for customization', async () => {
    (useKeycloakUser as jest.Mock).mockReturnValue({
      userInfo: {
        name: 'Test User',
        email: 'test@example.com',
        preferred_username: 'testuser',
        sub: 'test-user-id',
      },
      isLoading: false,
      error: null,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <DashboardLayout
          isDrawerOpen={true}
          onDrawerToggle={() => {}}
          backgroundColor="#1E3A8A"
          textColor="#FFFFFF"
          iconColor="#FFFFFF"
          navbarBgColor="#1F2937"
        >
          <div>Test Content</div>
        </DashboardLayout>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(expect.stringMatching(/\/api\/UserCustomization\/test-user-id/));
    });

    const settingsModalProps = screen.getByTestId('settings-modal-props');
    expect(settingsModalProps.textContent).toContain('"userId":"test-user-id"');
  });

  it('should use "current-user" as fallback when no Keycloak user is available', async () => {
    (useKeycloakUser as jest.Mock).mockReturnValue({
      userInfo: null,
      isLoading: false,
      error: null,
    });
    render(
      <QueryClientProvider client={queryClient}>
        <DashboardLayout
          isDrawerOpen={true}
          onDrawerToggle={() => {}}
          backgroundColor="#1E3A8A"
          textColor="#FFFFFF"
          iconColor="#FFFFFF"
          navbarBgColor="#1F2937"
        >
          <div>Test Content</div>
        </DashboardLayout>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(expect.stringMatching(/\/api\/UserCustomization\/current-user/));
    });

    const settingsModalProps = screen.getByTestId('settings-modal-props');
    expect(settingsModalProps.textContent).toContain('"userId":"current-user"');
  });

  it('should not fetch data while user info is loading', async () => {
    (useKeycloakUser as jest.Mock).mockReturnValue({
      userInfo: null,
      isLoading: true,
      error: null,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <DashboardLayout
          isDrawerOpen={true}
          onDrawerToggle={() => {}}
          backgroundColor="#1E3A8A"
          textColor="#FFFFFF"
          iconColor="#FFFFFF"
          navbarBgColor="#1F2937"
        >
          <div>Test Content</div>
        </DashboardLayout>
      </QueryClientProvider>
    );

    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(global.fetch).not.toHaveBeenCalled();
  });
});
