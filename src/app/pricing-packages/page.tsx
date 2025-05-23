import { Suspense } from 'react';
import { fetchPricingPackagesAction, sortPackagesAction } from './actions';
import PricingPackagesClient from './PricingPackagesClient';
import { Box, Typography, Skeleton } from '@mui/material';

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

function PricingPackagesError() {
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
      </Box>
    </Box>
  );
}

export default async function PricingPackagesPage() {
  try {
    const packages = await fetchPricingPackagesAction();

    const sortedPackages = sortPackagesAction(packages);

    return (
      <Suspense fallback={<PricingPackagesLoading />}>
        <PricingPackagesClient initialPackages={sortedPackages} />
      </Suspense>
    );
  } catch (error) {
    console.error(
      'Error in PricingPackagesPage:',
      JSON.stringify(error, null, 2)
    );
    return <PricingPackagesError />;
  }
}

export async function generateStaticParams() {
  return [{}];
}

export const revalidate = 3600;
