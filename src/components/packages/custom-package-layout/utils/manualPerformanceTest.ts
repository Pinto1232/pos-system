import React from 'react';

interface PerformanceTestResult {
  testName: string;
  renderCount: number;
  averageRenderTime: number;
  totalTime: number;
  memoryUsage?: number;
  passed: boolean;
  details: string;
}

interface PerformanceMemory {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}

interface PerformanceWithMemory extends Performance {
  memory: PerformanceMemory;
}

export class PerformanceBenchmark {
  private results: PerformanceTestResult[] = [];
  private startTime: number = 0;
  private renderTimes: number[] = [];

  startTest(testName: string) {
    console.group(`🚀 Starting Performance Test: ${testName}`);
    this.startTime = performance.now();
    this.renderTimes = [];
  }

  recordRender() {
    const renderTime = performance.now() - this.startTime;
    this.renderTimes.push(renderTime);
    this.startTime = performance.now();
  }

  endTest(
    testName: string,
    expectedMaxRenders: number = 5
  ): PerformanceTestResult {
    const totalTime = this.renderTimes.reduce((sum, time) => sum + time, 0);
    const averageRenderTime = totalTime / this.renderTimes.length;
    const renderCount = this.renderTimes.length;

    const passed = renderCount <= expectedMaxRenders && averageRenderTime < 16;

    const result: PerformanceTestResult = {
      testName,
      renderCount,
      averageRenderTime,
      totalTime,
      passed,
      details: `Renders: ${renderCount}/${expectedMaxRenders}, Avg: ${averageRenderTime.toFixed(2)}ms`,
    };

    this.results.push(result);

    console.log(`📊 Test Results:`, result);
    console.groupEnd();

    return result;
  }

  getResults(): PerformanceTestResult[] {
    return this.results;
  }

  generateReport(): string {
    const passedTests = this.results.filter((r) => r.passed).length;
    const totalTests = this.results.length;

    let report = `\n📈 Performance Test Report\n`;
    report += `${'='.repeat(50)}\n`;
    report += `Tests Passed: ${passedTests}/${totalTests}\n\n`;

    this.results.forEach((result) => {
      const status = result.passed ? '✅' : '❌';
      report += `${status} ${result.testName}\n`;
      report += `   ${result.details}\n`;
      if (!result.passed) {
        report += `   ⚠️  Performance issue detected\n`;
      }
      report += `\n`;
    });

    return report;
  }
}

export const usePerformanceMeasurement = (componentName: string) => {
  const renderCount = React.useRef(0);
  const renderTimes = React.useRef<number[]>([]);
  const startTime = React.useRef<number | null>(null);

  if (!startTime.current) {
    startTime.current = performance.now();
  }

  React.useEffect(() => {
    renderCount.current += 1;

    if (startTime.current) {
      const renderTime = performance.now() - startTime.current;
      renderTimes.current.push(renderTime);

      if (process.env.NODE_ENV === 'development') {
        console.log(
          `⏱️ ${componentName} render #${renderCount.current}: ${renderTime.toFixed(2)}ms`
        );

        if (renderTime > 16) {
          console.warn(
            `🐌 Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms`
          );
        }

        if (renderCount.current > 10) {
          console.warn(
            `🔄 Excessive re-renders in ${componentName}: ${renderCount.current} renders`
          );
        }
      }
    }

    startTime.current = null;
  });

  return {
    renderCount: renderCount.current,
    averageRenderTime:
      renderTimes.current.length > 0
        ? renderTimes.current.reduce((sum, time) => sum + time, 0) /
          renderTimes.current.length
        : 0,
    lastRenderTime: renderTimes.current[renderTimes.current.length - 1] || 0,
  };
};

export const performanceTestScenarios = {
  modalOpening: {
    name: 'Modal Opening',
    description: 'Measure time from modal trigger to fully rendered',
    expectedMaxRenders: 3,
    expectedMaxTime: 100,
  },

  featureToggle: {
    name: 'Feature Toggle',
    description: 'Measure re-renders when toggling features',
    expectedMaxRenders: 2,
    expectedMaxTime: 50,
  },

  addOnSelection: {
    name: 'Add-On Selection',
    description: 'Measure re-renders when selecting add-ons',
    expectedMaxRenders: 2,
    expectedMaxTime: 50,
  },

  pricingCalculation: {
    name: 'Pricing Calculation',
    description: 'Measure time for pricing updates',
    expectedMaxRenders: 1,
    expectedMaxTime: 20,
  },

  stepNavigation: {
    name: 'Step Navigation',
    description: 'Measure re-renders during step changes',
    expectedMaxRenders: 2,
    expectedMaxTime: 30,
  },

  rapidInteractions: {
    name: 'Rapid Interactions',
    description: 'Measure performance under rapid user interactions',
    expectedMaxRenders: 10,
    expectedMaxTime: 200,
  },
};

export const manualTestInstructions = `
🧪 Manual Performance Testing Instructions

1. Open the Custom Pro package modal
2. Open browser DevTools (F12)
3. Go to Console tab
4. Look for performance logs starting with ⏱️

Expected Results After Optimization:
✅ Modal opening: < 3 renders, < 100ms
✅ Feature toggles: < 2 renders, < 50ms
✅ Add-on selection: < 2 renders, < 50ms
✅ Pricing updates: < 1 render, < 20ms
✅ Step navigation: < 2 renders, < 30ms
✅ No warnings about slow renders (🐌)
✅ No warnings about excessive re-renders (🔄)

Performance Issues to Watch For:
❌ Render times > 16ms (60fps target)
❌ More than 5 re-renders for simple interactions
❌ Pricing calculations on every keystroke
❌ Object recreation warnings
❌ Memory leaks during extended use

Test Scenarios:
1. Open modal → Check initial render performance
2. Toggle 5 features rapidly → Check re-render count
3. Select/deselect add-ons → Check pricing update speed
4. Navigate through all steps → Check step transition performance
5. Rapid clicking/typing → Check debouncing and stability
6. Leave modal open for 5 minutes → Check for memory leaks
`;

export const logPerformanceSummary = () => {
  if (process.env.NODE_ENV === 'development') {
    console.group('📊 Custom Package Modal Performance Summary');
    console.log(manualTestInstructions);
    console.groupEnd();
  }
};

export const trackMemoryUsage = () => {
  if ('memory' in performance) {
    const memory = (performance as PerformanceWithMemory).memory;
    return {
      used: Math.round(memory.usedJSHeapSize / 1048576),
      total: Math.round(memory.totalJSHeapSize / 1048576),
      limit: Math.round(memory.jsHeapSizeLimit / 1048576),
    };
  }
  return null;
};

const performanceTestUtils = {
  PerformanceBenchmark,
  usePerformanceMeasurement,
  performanceTestScenarios,
  manualTestInstructions,
  logPerformanceSummary,
  trackMemoryUsage,
};

export default performanceTestUtils;
