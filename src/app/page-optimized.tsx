import { Box, Skeleton } from '@mui/material';
import { fetchPricingPackagesAction } from '@/app/pricing-packages/actions-optimized';
import { Suspense } from 'react';
import { CACHE_TIMES } from '@/app/cache-constants';
import PricingPackagesContainer from '@/components/pricing-packages/PricingPackagesContainer';
import RegistrationHandler from '@/components/auth/RegistrationHandler';
import ErrorAlert from '@/components/ui/errorAlert/ErrorAlert';
import { getServerTranslations } from '@/utils/serverTranslation';
import HomeTranslations from '@/components/home/HomeTranslations';
import { unstable_cache } from 'next/cache';

import {
  LazyHeroContainer,
  LazyTestimonialContainer,
  LazyFeaturesSlider,
  DeferredContentLoader,
} from '@/components/performance/ClientDynamicImports';

const getCachedHomeData = unstable_cache(
  async () => {
    const [packages, translations] = await Promise.all([
      fetchPricingPackagesAction(),
      getServerTranslations('common'),
    ]);

    const processedPackages = packages.map((pkg) => ({
      ...pkg,
      id: typeof pkg.id === 'string' ? parseInt(pkg.id, 10) : pkg.id,
      type: pkg.type as
        | 'starter-plus'
        | 'growth-pro'
        | 'enterprise-elite'
        | 'custom-pro'
        | 'premium-plus',
    }));

    return {
      packages: processedPackages,
      translations,
    };
  },
  ['home-page-data'],
  {
    revalidate: CACHE_TIMES.SEMI_STATIC,
    tags: ['home-data', 'pricing-packages', 'translations'],
  }
);

export async function generateMetadata() {
  try {
    const { translations } = await getCachedHomeData();

    return {
      title: `Pisval Tech POS - ${translations.home?.chooseYourPlan || 'Choose Your Plan'}`,
      description:
        translations.home?.planDescription ||
        'Choose the perfect package that suits your business needs. Our flexible pricing options are designed to scale with your growth.',
      keywords: [
        'POS system',
        'point of sale',
        'business management',
        'retail software',
        'pricing plans',
        'business solution',
      ],
      openGraph: {
        title: `Pisval Tech POS - ${translations.home?.chooseYourPlan || 'Choose Your Plan'}`,
        description:
          translations.home?.planDescription ||
          'Choose the perfect package that suits your business needs.',
        type: 'website',
        images: [
          {
            url: '/images/og-home.jpg',
            width: 1200,
            height: 630,
            alt: 'Pisval Tech POS - Choose Your Plan',
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: `Pisval Tech POS - ${translations.home?.chooseYourPlan || 'Choose Your Plan'}`,
        description:
          translations.home?.planDescription ||
          'Choose the perfect package that suits your business needs.',
      },
      alternates: {
        canonical: '/',
      },
      other: {
        'cache-control': `public, max-age=${CACHE_TIMES.SEMI_STATIC}, s-maxage=${CACHE_TIMES.SEMI_STATIC * 2}, stale-while-revalidate=${CACHE_TIMES.SEMI_STATIC * 3}`,
      },
    };
  } catch (error) {
    console.error('Error generating home metadata:', error);
    return {
      title: 'Pisval Tech POS - Choose Your Plan',
      description: 'Choose the perfect package that suits your business needs.',
    };
  }
}

function PricingPackagesLoading() {
  return (
    <Box sx={{ py: 4 }}>
      <Skeleton
        variant="text"
        width="300px"
        height={40}
        sx={{ mx: 'auto', mb: 3 }}
      />
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}
      >
        {[1, 2, 3, 4].map((i) => (
          <Skeleton
            key={i}
            variant="rectangular"
            width={250}
            height={400}
            sx={{ borderRadius: 2 }}
          />
        ))}
      </Box>
    </Box>
  );
}

function HeroLoading() {
  return (
    <Box sx={{ py: 8, textAlign: 'center' }}>
      <Skeleton
        variant="text"
        width="60%"
        height={80}
        sx={{ mx: 'auto', mb: 2 }}
      />
      <Skeleton
        variant="text"
        width="40%"
        height={40}
        sx={{ mx: 'auto', mb: 4 }}
      />
      <Skeleton
        variant="rectangular"
        width={200}
        height={50}
        sx={{ mx: 'auto' }}
      />
    </Box>
  );
}

function DeferredContentLoading() {
  return (
    <Box sx={{ py: 4 }}>
      <Skeleton
        variant="text"
        width="300px"
        height={40}
        sx={{ mx: 'auto', mb: 3 }}
      />
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 4 }}>
        {[1, 2, 3].map((i) => (
          <Skeleton
            key={i}
            variant="rectangular"
            width={300}
            height={200}
            sx={{ borderRadius: 2 }}
          />
        ))}
      </Box>
    </Box>
  );
}

async function PricingPackagesSection() {
  try {
    const { packages } = await getCachedHomeData();
    return <PricingPackagesContainer initialPackages={packages} />;
  } catch (error) {
    console.error('Error loading pricing packages:', error);
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <p>Unable to load pricing packages. Please try again later.</p>
      </Box>
    );
  }
}

export default async function Home() {
  return (
    <div>
      {}
      <RegistrationHandler />
      <ErrorAlert />
      <HomeTranslations />

      <Box>
        {}
        <Suspense fallback={<PricingPackagesLoading />}>
          <PricingPackagesSection />
        </Suspense>

        {}
        <Suspense fallback={<HeroLoading />}>
          <LazyHeroContainer />
        </Suspense>

        {}
        <Box id="deferred-content">
          <Suspense fallback={<DeferredContentLoading />}>
            <DeferredContentLoader>
              <LazyTestimonialContainer />
              <LazyFeaturesSlider />
            </DeferredContentLoader>
          </Suspense>
        </Box>
      </Box>
    </div>
  );
}

export const revalidate = CACHE_TIMES.SEMI_STATIC;
export const fetchCache = 'force-cache';
export const dynamic = 'force-static';
export const preferredRegion = 'auto';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#000000',
};
