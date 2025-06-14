import React from 'react';

interface NetworkInformation {
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
}

interface PerformanceEventTiming extends PerformanceEntry {
  value: number;
}

export interface PerformanceMetrics {
  fcp?: number;
  lcp?: number;
  fid?: number;
  cls?: number;
  ttfb?: number;
  serverTiming?: Record<string, number>;
  cacheHit?: boolean;
  renderType?: 'static' | 'dynamic' | 'streaming';
}

export interface PageLoadMetrics extends PerformanceMetrics {
  page: string;
  timestamp: number;
  userAgent: string;
  connectionType?: string;
  deviceMemory?: number;
}

class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetrics> = new Map();
  private observers: PerformanceObserver[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeObservers();
    }
  }

  private initializeObservers() {
    try {
      const coreWebVitalsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const value =
            'value' in entry
              ? (entry as PerformanceEventTiming).value
              : entry.duration;
          this.recordMetric(entry.name, value);
        }
      });

      coreWebVitalsObserver.observe({
        entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'],
      });

      const navigationObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            this.recordNavigationMetrics(navEntry);
          }
        }
      });

      navigationObserver.observe({ entryTypes: ['navigation'] });

      const serverTimingObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            this.recordServerTiming(navEntry);
          }
        }
      });

      serverTimingObserver.observe({ entryTypes: ['navigation'] });

      this.observers.push(
        coreWebVitalsObserver,
        navigationObserver,
        serverTimingObserver
      );
    } catch (error) {
      console.warn('Performance monitoring not available:', error);
    }
  }

  private recordMetric(name: string, value: number) {
    const pageName = this.getCurrentPageName();
    const existing = this.metrics.get(pageName) || {};

    switch (name) {
      case 'largest-contentful-paint':
        existing.lcp = value;
        break;
      case 'first-input':
        existing.fid = value;
        break;
      case 'layout-shift':
        existing.cls = (existing.cls || 0) + value;
        break;
      case 'first-contentful-paint':
        existing.fcp = value;
        break;
    }

    this.metrics.set(pageName, existing);
    this.reportMetric(pageName, name, value);
  }

  private recordNavigationMetrics(entry: PerformanceNavigationTiming) {
    const pageName = this.getCurrentPageName();
    const existing = this.metrics.get(pageName) || {};

    existing.ttfb = entry.responseStart - entry.fetchStart;
    existing.fcp = entry.domContentLoadedEventEnd - entry.fetchStart;

    existing.cacheHit =
      entry.transferSize === 0 || entry.transferSize < entry.encodedBodySize;

    this.metrics.set(pageName, existing);
  }

  private recordServerTiming(entry: PerformanceNavigationTiming) {
    const pageName = this.getCurrentPageName();
    const existing = this.metrics.get(pageName) || {};

    const serverTiming: Record<string, number> = {};

    if ('serverTiming' in entry && Array.isArray(entry.serverTiming)) {
      entry.serverTiming.forEach((timing: PerformanceServerTiming) => {
        serverTiming[timing.name] = timing.duration;
      });
    }

    existing.serverTiming = serverTiming;
    this.metrics.set(pageName, existing);
  }

  private getCurrentPageName(): string {
    if (typeof window === 'undefined') return 'server';
    return window.location.pathname;
  }

  private reportMetric(page: string, metric: string, value: number) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] ${page} - ${metric}: ${value.toFixed(2)}ms`);
    }

    if (process.env.NODE_ENV === 'production') {
      this.sendToAnalytics(page, metric, value);
    }
  }

  private async sendToAnalytics(page: string, metric: string, value: number) {
    try {
      await fetch('/api/analytics/performance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          page,
          metric,
          value,
          timestamp: Date.now(),
          userAgent: navigator.userAgent,
          connectionType: (
            navigator as Navigator & { connection?: NetworkInformation }
          ).connection?.effectiveType,
          deviceMemory: (navigator as Navigator & { deviceMemory?: number })
            .deviceMemory,
        }),
      });
    } catch (error) {
      console.warn('Failed to send performance metrics:', error);
    }
  }

  public startMeasurement(name: string) {
    if (typeof window !== 'undefined') {
      performance.mark(`${name}-start`);
    }
  }

  public endMeasurement(name: string) {
    if (typeof window !== 'undefined') {
      performance.mark(`${name}-end`);
      performance.measure(name, `${name}-start`, `${name}-end`);

      const entries = performance.getEntriesByName(name, 'measure');
      if (entries.length > 0) {
        const duration = entries[entries.length - 1].duration;
        this.reportMetric(this.getCurrentPageName(), name, duration);
      }
    }
  }

  public getMetrics(page?: string): PerformanceMetrics | undefined {
    const pageName = page || this.getCurrentPageName();
    return this.metrics.get(pageName);
  }

  public getAllMetrics(): Map<string, PerformanceMetrics> {
    return new Map(this.metrics);
  }

  public clearMetrics() {
    this.metrics.clear();
  }

  public recordCustomMetric(name: string, value: number, page?: string) {
    const pageName = page || this.getCurrentPageName();
    this.reportMetric(pageName, name, value);
  }

  public recordRenderType(
    type: 'static' | 'dynamic' | 'streaming',
    page?: string
  ) {
    const pageName = page || this.getCurrentPageName();
    const existing = this.metrics.get(pageName) || {};
    existing.renderType = type;
    this.metrics.set(pageName, existing);
  }

  public destroy() {
    this.observers.forEach((observer) => observer.disconnect());
    this.observers = [];
    this.metrics.clear();
  }
}

export const performanceMonitor = new PerformanceMonitor();

export function usePerformanceMonitor() {
  const startMeasurement = (name: string) =>
    performanceMonitor.startMeasurement(name);
  const endMeasurement = (name: string) =>
    performanceMonitor.endMeasurement(name);
  const recordCustomMetric = (name: string, value: number) =>
    performanceMonitor.recordCustomMetric(name, value);
  const getMetrics = () => performanceMonitor.getMetrics();

  return {
    startMeasurement,
    endMeasurement,
    recordCustomMetric,
    getMetrics,
  };
}

export async function measureAsyncOperation<T>(
  name: string,
  operation: () => Promise<T>
): Promise<T> {
  const start = Date.now();
  try {
    const result = await operation();
    const duration = Date.now() - start;

    console.log(`[Server Performance] ${name}: ${duration}ms`);

    return result;
  } catch (error) {
    const duration = Date.now() - start;
    console.error(
      `[Server Performance] ${name} failed after ${duration}ms:`,
      error
    );
    throw error;
  }
}

export function trackCachePerformance(
  cacheKey: string,
  hit: boolean,
  duration: number
) {
  if (process.env.NODE_ENV === 'development') {
    console.log(
      `[Cache] ${cacheKey} - ${hit ? 'HIT' : 'MISS'} (${duration}ms)`
    );
  }

  performanceMonitor.recordCustomMetric(
    `cache-${hit ? 'hit' : 'miss'}`,
    duration
  );
}

export function withPerformanceTracking<P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
): React.ComponentType<P> {
  const PerformanceTrackedComponent: React.ComponentType<P> = (props: P) => {
    React.useEffect(() => {
      performanceMonitor.startMeasurement(`component-${componentName}`);

      return () => {
        performanceMonitor.endMeasurement(`component-${componentName}`);
      };
    }, []);

    return React.createElement(Component, props);
  };

  return PerformanceTrackedComponent;
}

export function initializePagePerformance(
  pageName: string,
  renderType: 'static' | 'dynamic' | 'streaming'
) {
  performanceMonitor.recordRenderType(renderType, pageName);
  performanceMonitor.startMeasurement(`page-${pageName}`);
}
