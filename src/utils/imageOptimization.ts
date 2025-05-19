import { ImageProps } from 'next/image';

export function getOptimizedImageProps(
  src: string,
  alt: string,
  options?: {
    width?: number;
    height?: number;
    priority?: boolean;
    quality?: number;
    className?: string;
    sizes?: string;
    style?: React.CSSProperties;
  }
): Partial<ImageProps> {
  const {
    width,
    height,
    priority = false,
    quality = 80,
    className,
    sizes,
    style,
  } = options || {};

  const defaultSizes =
    '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';

  return {
    src,
    alt,
    width: width || 1920,
    height: height || 1080,
    priority,
    quality,
    className,
    sizes: sizes || defaultSizes,
    style: {
      objectFit: 'cover',
      ...style,
    },
    loading: priority ? 'eager' : 'lazy',
  };
}

export function shouldPrioritizeImage(
  index: number,
  isAboveFold: boolean = false
): boolean {
  return index < 2 || isAboveFold;
}

export function getPlaceholderImage(
  width: number = 100,
  height: number = 100,
  text: string = 'Loading...'
): string {
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}' viewBox='0 0 ${width} ${height}'%3E%3Crect width='100%25' height='100%25' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='system-ui, sans-serif' font-size='14' fill='%23888888'%3E${text}%3C/text%3E%3C/svg%3E`;
}

export function getBlurDataURL(color: string = '#f0f0f0'): string {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 5">
      <filter id="b" color-interpolation-filters="sRGB">
        <feGaussianBlur stdDeviation="1" />
      </filter>
      <rect width="100%" height="100%" fill="${color}"/>
      <rect width="100%" height="100%" filter="url(#b)" opacity="0.5" />
    </svg>
  `;

  const toBase64 = (str: string) =>
    typeof window === 'undefined'
      ? Buffer.from(str).toString('base64')
      : window.btoa(str);

  return `data:image/svg+xml;base64,${toBase64(svg)}`;
}
