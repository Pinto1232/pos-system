interface RenderData {
  componentName: string;
  renderCount: number;
  totalTime: number;
  averageTime: number;
  lastRenderTime: number;
  propsChanges: number;
}

interface PerformanceReport {
  totalComponents: number;
  slowComponents: RenderData[];
  frequentRenderers: RenderData[];
  recommendations: string[];
  summary: {
    totalRenders: number;
    totalTime: number;
    averageRenderTime: number;
  };
}

class PerformanceAnalyzer {
  private readonly renderData: Map<string, RenderData> = new Map();
  private readonly isEnabled: boolean = process.env.NODE_ENV === 'development';

  recordRender(
    componentName: string,
    renderTime: number,
    propsChanged: boolean = false
  ) {
    if (!this.isEnabled) return;

    const existing = this.renderData.get(componentName);

    if (existing) {
      existing.renderCount += 1;
      existing.totalTime += renderTime;
      existing.averageTime = existing.totalTime / existing.renderCount;
      existing.lastRenderTime = renderTime;
      if (propsChanged) {
        existing.propsChanges += 1;
      }
    } else {
      this.renderData.set(componentName, {
        componentName,
        renderCount: 1,
        totalTime: renderTime,
        averageTime: renderTime,
        lastRenderTime: renderTime,
        propsChanges: propsChanged ? 1 : 0,
      });
    }
  }

  generateReport(): PerformanceReport {
    const components = Array.from(this.renderData.values());

    const slowComponents = components
      .filter((c) => c.averageTime > 16)
      .sort((a, b) => b.averageTime - a.averageTime)
      .slice(0, 10);

    const frequentRenderers = components
      .filter((c) => c.renderCount > 10)
      .sort((a, b) => b.renderCount - a.renderCount)
      .slice(0, 10);

    const recommendations: string[] = [];

    if (slowComponents.length > 0) {
      recommendations.push(
        `🐌 ${slowComponents.length} components are rendering slowly (>16ms). Consider using React.memo, useMemo, or useCallback.`
      );
    }

    if (frequentRenderers.length > 0) {
      recommendations.push(
        `🔄 ${frequentRenderers.length} components are re-rendering frequently (>10 times). Check for unnecessary prop changes or missing memoization.`
      );
    }

    const highPropsChangeComponents = components.filter(
      (c) => c.renderCount > 5 && c.propsChanges / c.renderCount > 0.8
    );

    if (highPropsChangeComponents.length > 0) {
      recommendations.push(
        `📝 ${highPropsChangeComponents.length} components have high prop change ratios. Consider memoizing props or using stable references.`
      );
    }

    const totalRenders = components.reduce((sum, c) => sum + c.renderCount, 0);
    const totalTime = components.reduce((sum, c) => sum + c.totalTime, 0);
    const averageRenderTime = totalRenders > 0 ? totalTime / totalRenders : 0;

    return {
      totalComponents: components.length,
      slowComponents,
      frequentRenderers,
      recommendations,
      summary: {
        totalRenders,
        totalTime,
        averageRenderTime,
      },
    };
  }

  printReport() {
    if (!this.isEnabled) return;

    const report = this.generateReport();

    console.group('📊 Performance Analysis Report');

    console.log(`📈 Summary:`);
    console.log(`  • Total Components Tracked: ${report.totalComponents}`);
    console.log(`  • Total Renders: ${report.summary.totalRenders}`);
    console.log(`  • Total Time: ${report.summary.totalTime.toFixed(2)}ms`);
    console.log(
      `  • Average Render Time: ${report.summary.averageRenderTime.toFixed(2)}ms`
    );

    if (report.slowComponents.length > 0) {
      console.group('🐌 Slow Components (>16ms average):');
      report.slowComponents.forEach((c) => {
        console.log(
          `  • ${c.componentName}: ${c.averageTime.toFixed(2)}ms avg (${c.renderCount} renders)`
        );
      });
      console.groupEnd();
    }

    if (report.frequentRenderers.length > 0) {
      console.group('🔄 Frequent Re-renderers (>10 renders):');
      report.frequentRenderers.forEach((c) => {
        console.log(
          `  • ${c.componentName}: ${c.renderCount} renders (${c.averageTime.toFixed(2)}ms avg)`
        );
      });
      console.groupEnd();
    }

    if (report.recommendations.length > 0) {
      console.group('💡 Recommendations:');
      report.recommendations.forEach((rec) => console.log(`  ${rec}`));
      console.groupEnd();
    }

    console.groupEnd();
  }

  clear() {
    this.renderData.clear();
  }

  getComponentData(componentName: string): RenderData | undefined {
    return this.renderData.get(componentName);
  }

  getAllData(): RenderData[] {
    return Array.from(this.renderData.values());
  }
}

export const performanceAnalyzer = new PerformanceAnalyzer();

export const recordRender = (
  componentName: string,
  renderTime: number,
  propsChanged?: boolean
) => {
  performanceAnalyzer.recordRender(componentName, renderTime, propsChanged);
};

export const printPerformanceReport = () => {
  performanceAnalyzer.printReport();
};

export const clearPerformanceData = () => {
  performanceAnalyzer.clear();
};

if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  setInterval(() => {
    const report = performanceAnalyzer.generateReport();
    if (report.totalComponents > 0) {
      performanceAnalyzer.printReport();
    }
  }, 30000);
}

export default performanceAnalyzer;
