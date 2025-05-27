



interface RenderMetrics {
  componentName: string;
  renderCount: number;
  lastRenderTime: number;
}

class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private renderMetrics: Map<string, RenderMetrics> = new Map();
  private isEnabled: boolean = process.env.NODE_ENV === 'development';

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  trackRender(componentName: string): void {
    if (!this.isEnabled) return;

    const now = performance.now();
    const existing = this.renderMetrics.get(componentName);

    if (existing) {
      existing.renderCount++;
      existing.lastRenderTime = now;
    } else {
      this.renderMetrics.set(componentName, {
        componentName,
        renderCount: 1,
        lastRenderTime: now,
      });
    }
  }

  getMetrics(): RenderMetrics[] {
    return Array.from(this.renderMetrics.values());
  }

  getRenderCount(componentName: string): number {
    return this.renderMetrics.get(componentName)?.renderCount || 0;
  }

  reset(): void {
    this.renderMetrics.clear();
  }

  logMetrics(): void {
    if (!this.isEnabled) return;

    console.group('🚀 Performance Metrics');
    this.getMetrics().forEach((metric) => {
      const status = metric.renderCount > 5 ? '⚠️' : '✅';
      console.log(
        `${status} ${metric.componentName}: ${metric.renderCount} renders`
      );
    });
    console.groupEnd();
  }
}

export const performanceMonitor = PerformanceMonitor.getInstance();




export function useRenderTracker(componentName: string): void {
  if (process.env.NODE_ENV === 'development') {
    performanceMonitor.trackRender(componentName);
  }
}




export function withRenderTracking<P extends object>(
  Component: React.ComponentType<P>,
  componentName?: string
): React.ComponentType<P> {
  const WrappedComponent = (props: P) => {
    const name =
      componentName || Component.displayName || Component.name || 'Unknown';
    useRenderTracker(name);
    return <Component {...props} />;
  };

  WrappedComponent.displayName = `withRenderTracking(${Component.displayName || Component.name})`;
  return WrappedComponent;
}
