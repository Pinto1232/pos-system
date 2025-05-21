'use client';

import { useEffect } from 'react';


interface PerformanceEntryWithProcessingStart extends PerformanceEntry {
  processingStart: number;
}

interface LayoutShiftEntry extends PerformanceEntry {
  hadRecentInput: boolean;
  value: number;
}

export default function PerformanceMonitor() {
  useEffect(() => {
    if (
      typeof window === 'undefined' ||
      !('PerformanceObserver' in window) ||
      process.env.NODE_ENV !== 'production'
    ) {
      return;
    }

    const reportMetric = (name: string, value: number) => {
      console.log(`[Performance] ${name}: ${value.toFixed(2)}`);
    };

    try {
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        const lcp = lastEntry.startTime;
        reportMetric('LCP', lcp);
      });

      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
    } catch (e) {
      console.error('LCP observer error:', e);
    }

    try {
      const fidObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach((entry) => {
          
          const typedEntry = entry as PerformanceEntryWithProcessingStart;
          const fid = typedEntry.processingStart - typedEntry.startTime;
          reportMetric('FID', fid);
        });
      });

      fidObserver.observe({ type: 'first-input', buffered: true });
    } catch (e) {
      console.error('FID observer error:', e);
    }

    try {
      let clsValue = 0;
      const clsEntries: PerformanceEntry[] = [];

      const clsObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();

        entries.forEach((entry) => {
          
          const layoutShiftEntry = entry as LayoutShiftEntry;
          if (!layoutShiftEntry.hadRecentInput) {
            clsValue += layoutShiftEntry.value;
            clsEntries.push(entry);
          }
        });

        reportMetric('CLS', clsValue);
      });

      clsObserver.observe({ type: 'layout-shift', buffered: true });
    } catch (e) {
      console.error('CLS observer error:', e);
    }

    try {
      const navigationObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;

            const ttfb = navEntry.responseStart - navEntry.requestStart;
            reportMetric('TTFB', ttfb);

            const dcl = navEntry.domContentLoadedEventEnd - navEntry.fetchStart;
            reportMetric('DCL', dcl);

            const load = navEntry.loadEventEnd - navEntry.fetchStart;
            reportMetric('Load', load);
          }
        });
      });

      navigationObserver.observe({ type: 'navigation', buffered: true });
    } catch (e) {
      console.error('Navigation observer error:', e);
    }

    try {
      const resourceObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'resource') {
            const resourceEntry = entry as PerformanceResourceTiming;

            if (resourceEntry.duration > 1000) {
              console.warn(
                `Slow resource: ${resourceEntry.name} took ${resourceEntry.duration.toFixed(2)}ms`
              );
            }
          }
        });
      });

      resourceObserver.observe({ type: 'resource', buffered: true });
    } catch (e) {
      console.error('Resource observer error:', e);
    }

    return () => {};
  }, []);

  return null;
}
