import { Box, Typography } from '@mui/material';
import { fetchPricingPackagesAction } from '@/app/pricing-packages/actions';
import { Suspense } from 'react';
import { CACHE_TAGS, CACHE_TIMES } from '@/app/cache-constants';
import PricingPackagesContainer from '@/components/pricing-packages/PricingPackagesContainer';
import RegistrationHandler from '@/components/auth/RegistrationHandler';
import ErrorAlert from '@/components/ui/errorAlert/ErrorAlert';

import {
  LazyHeroContainer,
  LazyTestimonialContainer,
  LazyFeaturesSlider,
  DeferredContentLoader,
} from '@/components/performance/ClientDynamicImports';

export const revalidate = CACHE_TIMES.SEMI_STATIC;
export const fetchCache = 'force-cache';

export async function generateMetadata() {
  return {
    title: 'Pisval Tech POS - Choose Your Plan',
    description:
      'Choose the perfect package that suits your business needs. Our flexible pricing options are designed to scale with your growth.',
    other: {
      'cache-control': `public, max-age=${CACHE_TIMES.SEMI_STATIC}, s-maxage=${CACHE_TIMES.SEMI_STATIC * 2}, stale-while-revalidate=${CACHE_TIMES.SEMI_STATIC * 3}`,
    },
  };
}

export default async function Home() {
  const initialPackages = await fetchPricingPackagesAction();

  const heading = `Choose Your Plan`;
  const description =
    'Choose the perfect package that suits your business needs. Our flexible pricing options are designed to scale with your growth.';

  return (
    <div>
      <RegistrationHandler />
      <ErrorAlert />

      <Box>
        <Box textAlign="center" mt={5}>
          <Typography
            sx={{
              color: '#000',
              marginBottom: '0.5rem',
              fontWeight: 600,
              fontSize: '2.5rem',
              letterSpacing: '-0.02em',
            }}
            variant="h4"
            dangerouslySetInnerHTML={{
              __html: heading,
            }}
          />
          <Typography
            sx={{
              color: '#4b5563',
              maxWidth: '600px',
              margin: '0 auto',
              marginBottom: '0.2rem',
              fontSize: '1.1rem',
              lineHeight: 1.6,
              fontWeight: 400,
            }}
          >
            {description}
          </Typography>
        </Box>

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
