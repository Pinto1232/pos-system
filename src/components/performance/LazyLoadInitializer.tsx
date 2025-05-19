'use client';

import { useEffect } from 'react';
import { initLazyLoad, initImageLazyLoading } from '@/utils/lazyLoadObserver';
import { optimizeFonts } from '@/utils/fontOptimization';
import { loadScriptsInParallel } from '@/utils/scriptOptimization';

export default function LazyLoadInitializer() {
  useEffect(() => {
    initLazyLoad('deferred-content', () => {
      console.log('Deferred content is now visible and loading');
    });

    initImageLazyLoading();

    try {
      const fontFamily = getComputedStyle(document.body).fontFamily;

      if (fontFamily.includes('Arial') || fontFamily.includes('sans-serif')) {
        console.log('Using system fonts, skipping font optimization');
      } else {
        console.log('Using Next.js font optimization');
      }
    } catch (error) {
      console.warn('Font optimization error:', error);
    }

    setTimeout(() => {
      console.log('Would load non-critical scripts here');
    }, 3000);

    return () => {};
  }, []);

  return null;
}
