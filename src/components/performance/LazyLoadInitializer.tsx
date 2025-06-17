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

    setTimeout(async () => {
      const scriptsToLoad: {
        src: string;
        options: {
          strategy: 'lazyOnload' | 'beforeInteractive' | 'afterInteractive';
          id: string;
        };
      }[] = [
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
      ];

      
      const availableScripts: typeof scriptsToLoad = [];
      for (const script of scriptsToLoad) {
        try {
          const response = await fetch(script.src, { method: 'HEAD' });
          if (response.ok) {
            availableScripts.push(script);
          }
        } catch {
          console.debug(`Script not available: ${script.src}`);
        }
      }

      if (availableScripts.length > 0) {
        loadScriptsInParallel(availableScripts)
          .then((loadedScripts) => {
            console.log(
              `Successfully loaded ${loadedScripts.length} non-critical scripts`
            );
          })
          .catch((error) => {
            console.warn(
              'Some non-critical scripts failed to load. This is not critical for app functionality.',
              {
                error: error.message || error,
                scriptsAttempted: availableScripts.map((s) => s.src),
              }
            );
          });
      } else {
        console.debug('No non-critical scripts found to load');
      }
    }, 3000);

    return () => {};
  }, []);

  return null;
}
