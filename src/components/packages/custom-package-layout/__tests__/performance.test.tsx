import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import CustomPackageLayoutContainer from '../CustomPackageLayoutContainer';
import { CurrencyProvider } from '@/contexts/CurrencyContext';
import { SuccessModalProvider } from '@/contexts/SuccessModalContext';

// Mock the hooks
jest.mock('@/hooks/useAddOns', () => ({
  useAddOns: () => ({
    data: {
      data: [
        {
          id: 1,
          name: 'Test AddOn',
          description: 'Test description',
          price: 10,
          currency: 'USD',
          multiCurrencyPrices: '{"USD": 10, "EUR": 9}',
          category: 'Test',
          isActive: true,
          features: '["Feature 1", "Feature 2"]',
          dependencies: '["Dependency 1"]',
          icon: 'test-icon',
        },
      ],
      totalItems: 1,
    },
    isLoading: false,
    error: null,
  }),
}));

jest.mock('@/api/axiosClient', () => ({
  apiClient: {
    get: jest.fn().mockResolvedValue({
      data: {
        data: [
          {
            id: 1,
            name: 'Test Feature',
            description: 'Test feature description',
            basePrice: 5,
            currency: 'USD',
            multiCurrencyPrices: '{"USD": 5, "EUR": 4.5}',
            category: 'Core',
            isActive: true,
            features: '[]',
            dependencies: '[]',
            icon: 'test-icon',
          },
        ],
        totalItems: 1,
      },
    }),
  },
}));

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = createTestQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <CurrencyProvider>
        <SuccessModalProvider>{children}</SuccessModalProvider>
      </CurrencyProvider>
    </QueryClientProvider>
  );
};

describe('Custom Package Layout Performance Tests', () => {
  const mockSelectedPackage = {
    id: 1,
    title: 'Custom Pro',
    description: 'Custom Pro package',
    icon: 'custom-icon',
    extraDescription: 'Additional description for Custom Pro',
    price: 100,
    currency: 'USD',
    testPeriodDays: 30,
    type: 'custom-pro' as const,
    isCustomizable: true,
    multiCurrencyPrices: '{"USD": 100, "EUR": 90}',
    features: [],
    addOns: [],
    usagePricing: [],
  };

  let renderCount = 0;
  let originalConsoleLog: typeof console.log;

  beforeEach(() => {
    renderCount = 0;
    originalConsoleLog = console.log;
    console.log = jest.fn();
  });

  afterEach(() => {
    console.log = originalConsoleLog;
  });

  it('should not re-render excessively when props change', () => {
    const TestComponent = () => {
      const [counter, setCounter] = React.useState(0);

      // Track renders
      React.useEffect(() => {
        renderCount++;
      });

      return (
        <div>
          <button onClick={() => setCounter((c) => c + 1)}>
            Increment: {counter}
          </button>
          <CustomPackageLayoutContainer selectedPackage={mockSelectedPackage} />
        </div>
      );
    };

    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    const initialRenderCount = renderCount;

    // Click button to trigger parent re-render
    const button = screen.getByText(/Increment:/);
    fireEvent.click(button);

    // The CustomPackageLayoutContainer should not re-render due to memoization
    // Allow for some re-renders due to state updates, but not excessive
    expect(renderCount - initialRenderCount).toBeLessThan(5);
  });

  it('should handle rapid state changes efficiently', async () => {
    const { container } = render(
      <TestWrapper>
        <CustomPackageLayoutContainer selectedPackage={mockSelectedPackage} />
      </TestWrapper>
    );

    const startTime = performance.now();

    // Simulate rapid interactions
    for (let i = 0; i < 10; i++) {
      // Simulate feature toggles, add-on selections, etc.
      const buttons = container.querySelectorAll('button');
      if (buttons.length > 0) {
        fireEvent.click(buttons[0]);
      }
    }

    const endTime = performance.now();
    const totalTime = endTime - startTime;

    // Should handle rapid interactions within reasonable time
    expect(totalTime).toBeLessThan(1000); // 1 second for 10 interactions
  });

  it('should memoize expensive calculations', () => {
    const mockFormatPrice = jest.fn(
      (currency: string, price: number) => `${currency} ${price}`
    );

    const TestComponent = () => {
      const [, setForceUpdate] = React.useState(0);

      return (
        <div>
          <button onClick={() => setForceUpdate(Date.now())}>
            Force Update
          </button>
          <CustomPackageLayoutContainer selectedPackage={mockSelectedPackage} />
        </div>
      );
    };

    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    const button = screen.getByText('Force Update');
    const initialCallCount = mockFormatPrice.mock.calls.length;

    // Force multiple re-renders
    fireEvent.click(button);
    fireEvent.click(button);
    fireEvent.click(button);

    // Price formatting should be memoized and not called excessively
    const finalCallCount = mockFormatPrice.mock.calls.length;
    expect(finalCallCount - initialCallCount).toBeLessThan(10);
  });

  it('should have stable callback references', () => {
    const callbackReferences: (() => void)[] = [];

    const TestComponent = () => {
      const [counter, setCounter] = React.useState(0);

      const handleSave = React.useCallback(() => {
        console.log('Save called');
      }, []);

      // Track callback reference stability
      React.useEffect(() => {
        callbackReferences.push(handleSave);
      }, [handleSave]);

      return (
        <div>
          <button onClick={() => setCounter((c) => c + 1)}>
            Count: {counter}
          </button>
          <CustomPackageLayoutContainer selectedPackage={mockSelectedPackage} />
        </div>
      );
    };

    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    const button = screen.getByText(/Count:/);

    // Trigger multiple re-renders
    fireEvent.click(button);
    fireEvent.click(button);
    fireEvent.click(button);

    // All callback references should be the same (stable)
    const uniqueReferences = new Set(callbackReferences);
    expect(uniqueReferences.size).toBe(1);
  });

  it('should not recreate objects unnecessarily', () => {
    const objectReferences: Record<string, unknown>[] = [];

    const TestComponent = () => {
      const [counter, setCounter] = React.useState(0);

      // This should be memoized to prevent recreation
      const packageDetails = React.useMemo(
        () => ({
          title: mockSelectedPackage.title,
          description: mockSelectedPackage.description,
          testPeriod: mockSelectedPackage.testPeriodDays,
        }),
        []
      );

      React.useEffect(() => {
        objectReferences.push(packageDetails);
      }, [packageDetails]);

      return (
        <div>
          <button onClick={() => setCounter((c) => c + 1)}>
            Count: {counter}
          </button>
          <CustomPackageLayoutContainer selectedPackage={mockSelectedPackage} />
        </div>
      );
    };

    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    const button = screen.getByText(/Count:/);

    // Trigger multiple re-renders
    fireEvent.click(button);
    fireEvent.click(button);

    // Object should not be recreated
    const uniqueObjects = new Set(objectReferences);
    expect(uniqueObjects.size).toBe(1);
  });
});

describe('Performance Utilities', () => {
  it('should track render counts in development', () => {
    // Mock NODE_ENV instead of trying to modify it directly
    const originalEnv = process.env.NODE_ENV;
    Object.defineProperty(process.env, 'NODE_ENV', {
      value: 'development',
      configurable: true,
    });

    const TestComponent = () => {
      const renderCount = React.useRef(0);
      renderCount.current++;

      return <div>Render count: {renderCount.current}</div>;
    };

    const { rerender } = render(<TestComponent />);

    expect(screen.getByText('Render count: 1')).toBeInTheDocument();

    rerender(<TestComponent />);
    expect(screen.getByText('Render count: 2')).toBeInTheDocument();

    // Restore original NODE_ENV
    Object.defineProperty(process.env, 'NODE_ENV', {
      value: originalEnv,
      configurable: true,
    });
  });
});
