'use client';

interface FontDefinition {
  family: string;
  url: string;
  weight?: string | number;
  style?: string;
  display?: 'auto' | 'block' | 'swap' | 'fallback' | 'optional';
}

export function preloadFonts(fonts: FontDefinition[]): void {
  if (typeof window === 'undefined') return;

  fonts.forEach((font) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = font.url;
    link.as = 'font';
    link.type = 'font/woff2';
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
}

export function injectFontFace(fonts: FontDefinition[]): void {
  if (typeof window === 'undefined') return;

  const style = document.createElement('style');
  let css = '';

  fonts.forEach((font) => {
    css += `
      @font-face {
        font-family: '${font.family}';
        src: url('${font.url}') format('woff2');
        font-weight: ${font.weight || 'normal'};
        font-style: ${font.style || 'normal'};
        font-display: ${font.display || 'swap'};
      }
    `;
  });

  style.appendChild(document.createTextNode(css));
  document.head.appendChild(style);
}

export function optimizeFonts(fonts: FontDefinition[]): void {
  if (typeof window === 'undefined') return;

  const criticalFonts = fonts.filter((font) => font.display !== 'optional');
  if (criticalFonts.length > 0) {
    preloadFonts(criticalFonts);
  }

  injectFontFace(fonts);

  const nonCriticalFonts = fonts.filter((font) => font.display === 'optional');
  if (nonCriticalFonts.length > 0) {
    setTimeout(() => {
      preloadFonts(nonCriticalFonts);
    }, 2000);
  }
}

export default {
  preloadFonts,
  injectFontFace,
  optimizeFonts,
};
