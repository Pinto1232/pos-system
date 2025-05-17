interface PerformanceMetric {
  name: string;
  duration: number;
  timestamp: number;
  type: 'render' | 'api' | 'interaction' | 'resource';
}

const MAX_METRICS = 100;

const metrics: PerformanceMetric[] = [];

export const trackMetric = (name: string, duration: number, type: 'render' | 'api' | 'interaction' | 'resource') => {
  metrics.unshift({
    name,
    duration,
    timestamp: Date.now(),
    type,
  });

  if (metrics.length > MAX_METRICS) {
    metrics.pop();
  }

  if (duration > getThresholdForType(type)) {
    console.warn(`Slow ${type} detected: ${name} took ${duration.toFixed(2)}ms`);
  }
};

const getThresholdForType = (type: string): number => {
  switch (type) {
    case 'render':
      return 50;
    case 'api':
      return 500;
    case 'interaction':
      return 100;
    case 'resource':
      return 1000;
    default:
      return 100;
  }
};

export const getMetrics = () => {
  return [...metrics];
};

export const getMetricsByType = (type: string) => {
  return metrics.filter((metric) => metric.type === type);
};

export const clearMetrics = () => {
  metrics.length = 0;
};

export const measurePerformance = async <T>(
  fn: () => Promise<T> | T,
  name: string,
  type: 'render' | 'api' | 'interaction' | 'resource'
): Promise<T> => {
  const start = performance.now();
  try {
    const result = await fn();
    const duration = performance.now() - start;
    trackMetric(name, duration, type);
    return result;
  } catch (error) {
    const duration = performance.now() - start;
    trackMetric(`${name} (error)`, duration, type);
    throw error;
  }
};

export const createPerformanceHook = () => {
  return {
    trackMetric,
    getMetrics,
    getMetricsByType,
    clearMetrics,
    measurePerformance,
  };
};

export default createPerformanceHook;
