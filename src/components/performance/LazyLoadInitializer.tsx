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
        
        optimizeFonts([
          {
            family: 'Inter',
            url: '/fonts/inter-var.woff2',
            display: 'swap',
          },
          {
            family: 'Roboto',
            url: '/fonts/roboto-regular.woff2',
            weight: 400,
            display: 'optional',
          },
        ]);
      }
    } catch (error) {
      console.warn('Font optimization error:', error);
    }

    
    setTimeout(() => {
      loadScriptsInParallel([
        {
          src: '/scripts/analytics.js',
          options: {
            strategy: 'lazyOnload',
            id: 'analytics-script',
          },
        },
        {
          src: '/scripts/feedback.js',
          options: {
            strategy: 'lazyOnload',
            id: 'feedback-script',
          },
        },
      ])
        .then(() => {
          console.log('Non-critical scripts loaded successfully');
        })
        .catch((error) => {
          console.error('Error loading non-critical scripts:', error);
        });
    }, 3000);

    return () => {};
  }, []);

  return null;
}
