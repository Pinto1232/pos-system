import { Box } from '@mui/material';
import { fetchPricingPackagesAction } from '@/app/pricing-packages/actions';
import { Suspense } from 'react';
import { CACHE_TIMES } from '@/app/cache-constants';
import PricingPackagesContainer from '@/components/pricing-packages/PricingPackagesContainer';
import RegistrationHandler from '@/components/auth/RegistrationHandler';
import ErrorAlert from '@/components/ui/errorAlert/ErrorAlert';
import { getServerTranslations } from '@/utils/serverTranslation';
import HomeTranslations from '@/components/home/HomeTranslations';

import {
  LazyHeroContainer,
  LazyTestimonialContainer,
  LazyFeaturesSlider,
  DeferredContentLoader,
} from '@/components/performance/ClientDynamicImports';

export const revalidate = 3600; 
export const fetchCache = 'force-cache';

export async function generateMetadata() {
  const translations = await getServerTranslations('common');

  return {
    title: `Pisval Tech POS - ${translations.home?.chooseYourPlan || 'Choose Your Plan'}`,
    description:
      translations.home?.planDescription ||
      'Choose the perfect package that suits your business needs. Our flexible pricing options are designed to scale with your growth.',
    other: {
      'cache-control': `public, max-age=${CACHE_TIMES.SEMI_STATIC}, s-maxage=${CACHE_TIMES.SEMI_STATIC * 2}, stale-while-revalidate=${CACHE_TIMES.SEMI_STATIC * 3}`,
    },
  };
}

export default async function Home() {
  const fetchedPackages = await fetchPricingPackagesAction();

  const initialPackages = fetchedPackages.map((pkg) => ({
    ...pkg,
    id: typeof pkg.id === 'string' ? parseInt(pkg.id, 10) : pkg.id,
  }));

  return (
    <div>
      <RegistrationHandler />
      <ErrorAlert />

      <Box>
        <HomeTranslations />

        {}
        <Suspense fallback={null}>
          <PricingPackagesContainer initialPackages={initialPackages} />
        </Suspense>

        {}
        <Suspense fallback={null}>
          <LazyHeroContainer />
        </Suspense>

        {}
        <Box id="deferred-content">
          <DeferredContentLoader>
            <LazyTestimonialContainer />
            <LazyFeaturesSlider />
          </DeferredContentLoader>
        </Box>
      </Box>
    </div>
  );
}
