'use client';

interface LazyLoadOptions {
  rootMargin?: string;
  threshold?: number | number[];
  once?: boolean;
}

export function createLazyLoadObserver(
  selector: string,
  callback: (element: Element) => void,
  options: LazyLoadOptions = {}
): IntersectionObserver | null {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return null;
  }

  const { rootMargin = '100px', threshold = 0, once = true } = options;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          callback(entry.target);
          if (once) {
            observer.unobserve(entry.target);
          }
        }
      });
    },
    { rootMargin, threshold }
  );

  document.querySelectorAll(selector).forEach((element) => {
    observer.observe(element);
  });

  return observer;
}

export function initLazyLoad(
  elementId: string,
  onVisible: () => void,
  options: LazyLoadOptions = {}
): void {
  if (typeof window === 'undefined') return;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setupObserver();
    });
  } else {
    setupObserver();
  }

  function setupObserver() {
    const element = document.getElementById(elementId);
    if (!element) return;

    const { rootMargin = '200px', threshold = 0, once = true } = options;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            onVisible();
            if (once) {
              observer.unobserve(entry.target);
            }
          }
        });
      },
      { rootMargin, threshold }
    );

    observer.observe(element);
  }
}

export function initImageLazyLoading(): void {
  if (typeof window === 'undefined') return;

  const loadImage = (img: HTMLImageElement) => {
    const src = img.dataset.src;
    if (src) {
      img.src = src;
      img.removeAttribute('data-src');
      img.classList.add('loaded');
    }
  };

  const imageObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          loadImage(entry.target as HTMLImageElement);
          imageObserver.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '200px 0px' }
  );

  const lazyImages = document.querySelectorAll('img[data-src]');
  lazyImages.forEach((img) => {
    imageObserver.observe(img);
  });
}

const lazyLoadObserver = {
  createLazyLoadObserver,
  initLazyLoad,
  initImageLazyLoading,
};

export default lazyLoadObserver;
