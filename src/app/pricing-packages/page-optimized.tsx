import { Suspense } from 'react';
import { fetchPricingPackagesAction, sortPackagesAction } from './actions';
import PricingPackagesClient from './PricingPackagesClient';
import { Box, Typography, Skeleton } from '@mui/material';
import { unstable_cache } from 'next/cache';
import { CACHE_TIMES, CACHE_TAGS } from '../cache-constants';

const getCachedPricingPackages = unstable_cache(
  async () => {
    const packages = await fetchPricingPackagesAction();
    return await sortPackagesAction(packages);
  },
  ['pricing-packages-sorted'],
  {
    revalidate: CACHE_TIMES.PRICING,
    tags: [CACHE_TAGS.PRICING_PACKAGES],
  }
);

function PricingPackagesLoading() {
  return (
    <Box
      sx={{
        maxWidth: '1600px',
        margin: '0 auto',
        padding: '0 40px',
        width: '100%',
      }}
    >
      <Typography
        variant="h4"
        component="h1"
        sx={{ textAlign: 'center', mb: 4 }}
      >
        Pricing Packages
      </Typography>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-evenly',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        {[1, 2, 3, 4, 5].map((i) => (
          <Box key={i} sx={{ minWidth: 250 }}>
            <Skeleton
              variant="rectangular"
              width={250}
              height={400}
              sx={{ borderRadius: 2, mb: 2 }}
              animation="wave"
            />
            <Skeleton variant="text" width="60%" height={30} />
            <Skeleton variant="text" width="40%" height={20} />
          </Box>
        ))}
      </Box>
    </Box>
  );
}

function PricingPackagesError({ error }: { error?: Error }) {
  return (
    <Box
      sx={{
        maxWidth: '1600px',
        margin: '0 auto',
        padding: '0 40px',
        width: '100%',
      }}
    >
      <Typography
        variant="h4"
        component="h1"
        sx={{ textAlign: 'center', mb: 4 }}
      >
        Pricing Packages
      </Typography>

      <Box sx={{ textAlign: 'center', p: 4 }}>
        <Typography variant="h6" color="error">
          Error loading pricing packages
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          We&apos;re having trouble loading our pricing information. Please try
          again later.
        </Typography>
        {process.env.NODE_ENV === 'development' && error && (
          <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
            Debug: {error.message}
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export async function generateMetadata() {
  try {
    const packages = await getCachedPricingPackages();
    const packageCount = packages.length;

    return {
      title: `Pricing Packages (${packageCount} Plans) - Pisval Tech POS`,
      description: `Choose from ${packageCount} flexible pricing plans designed for businesses of all sizes. Start your free trial today.`,
      openGraph: {
        title: `${packageCount} Pricing Plans - Pisval Tech POS`,
        description: `Discover the perfect plan for your business from our ${packageCount} carefully crafted pricing options.`,
        type: 'website',
      },
      alternates: {
        canonical: '/pricing-packages',
      },
    };
  } catch (error) {
    console.error('Error generating pricing metadata:', error);
    return {
      title: 'Pricing Packages - Pisval Tech POS',
      description: 'Choose the perfect plan for your business needs.',
    };
  }
}

export default async function PricingPackagesPage() {
  try {
    const sortedPackages = await getCachedPricingPackages();

    if (!Array.isArray(sortedPackages) || sortedPackages.length === 0) {
      console.warn('Invalid packages data structure');
      return <PricingPackagesError />;
    }

    return (
      <Suspense fallback={<PricingPackagesLoading />}>
        <PricingPackagesClient initialPackages={sortedPackages} />
      </Suspense>
    );
  } catch (error) {
    console.error('Error in PricingPackagesPage:', error);
    return <PricingPackagesError error={error as Error} />;
  }
}

export async function generateStaticParams() {
  return [{}];
}

export const revalidate = CACHE_TIMES.PRICING;
export const dynamic = 'force-static';
export const fetchCache = 'force-cache';
export const preferredRegion = 'auto';
