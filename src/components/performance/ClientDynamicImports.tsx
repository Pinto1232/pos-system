'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

export const LazyHeroContainer = dynamic(
  () => import('@/components/features/HeroContainer'),
  { loading: () => null, ssr: false }
);

export const LazyTestimonialContainer = dynamic(
  () => import('@/components/testimonial/TestimonialContainer'),
  { loading: () => null, ssr: false }
);

export const LazyFeaturesSlider = dynamic(
  () => import('@/components/slider/FeaturesSlider'),
  { loading: () => null, ssr: false }
);

export function DeferredContentLoader({
  children,
}: {
  children: React.ReactNode;
}) {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (window.scrollY > 100) {
      setShouldLoad(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );

    const target = document.getElementById('deferred-content');
    if (target) {
      observer.observe(target);
    } else {
      const timer = setTimeout(() => {
        setShouldLoad(true);
      }, 3000);

      return () => clearTimeout(timer);
    }

    return () => observer.disconnect();
  }, []);

  return shouldLoad ? <>{children}</> : null;
}
