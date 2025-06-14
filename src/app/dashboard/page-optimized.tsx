import { Suspense } from 'react';
import DashboardClient from './DashboardClient';
import { fetchUserSubscriptionData } from './UserSubscriptionFetcher';
import AuthCheck from './AuthCheck';
import ErrorBoundary from './ErrorBoundary';
import { CACHE_TIMES, CACHE_TAGS } from '../cache-constants';
import { fetchDashboardSummary } from './DashboardDataFetcher';
import { Box, Skeleton, Grid, Card, CardContent } from '@mui/material';
import { unstable_cache } from 'next/cache';

function DashboardSkeleton() {
  return (
    <Box sx={{ p: 3 }}>
      {}
      <Box sx={{ mb: 4 }}>
        <Skeleton variant="text" width="200px" height={40} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="300px" height={20} />
      </Box>

      {}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[1, 2, 3, 4].map((i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Card>
              <CardContent>
                <Skeleton
                  variant="text"
                  width="60%"
                  height={20}
                  sx={{ mb: 1 }}
                />
                <Skeleton
                  variant="text"
                  width="80%"
                  height={30}
                  sx={{ mb: 1 }}
                />
                <Skeleton variant="text" width="40%" height={16} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Skeleton
                variant="text"
                width="150px"
                height={20}
                sx={{ mb: 2 }}
              />
              <Skeleton variant="rectangular" width="100%" height={300} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Skeleton
                variant="text"
                width="120px"
                height={20}
                sx={{ mb: 2 }}
              />
              <Skeleton variant="rectangular" width="100%" height={300} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

function DashboardError({
  error,
  retry,
}: {
  error?: Error;
  retry?: () => void;
}) {
  return (
    <Box sx={{ textAlign: 'center', py: 8 }}>
      <h2>Dashboard Temporarily Unavailable</h2>
      <p>We&apos;re having trouble loading your dashboard. Please try again.</p>
      {process.env.NODE_ENV === 'development' && error && (
        <details style={{ marginTop: '1rem', textAlign: 'left' }}>
          <summary>Error Details (Development)</summary>
          <pre
            style={{
              background: '#f5f5f5',
              padding: '1rem',
              borderRadius: '4px',
            }}
          >
            {error.message}
            {error.stack && `\n\nStack:\n${error.stack}`}
          </pre>
        </details>
      )}
      {retry && (
        <button
          onClick={retry}
          style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}
        >
          Try Again
        </button>
      )}
    </Box>
  );
}

const getCachedUserData = unstable_cache(
  async (userId: string) => {
    return await fetchUserSubscriptionData(userId);
  },
  ['user-subscription-data'],
  {
    revalidate: CACHE_TIMES.USER,
    tags: [CACHE_TAGS.USER_SUBSCRIPTION],
  }
);

const getCachedDashboardSummary = unstable_cache(
  async () => {
    return await fetchDashboardSummary();
  },
  ['dashboard-summary'],
  {
    revalidate: CACHE_TIMES.DASHBOARD,
    tags: [CACHE_TAGS.DASHBOARD],
  }
);

export async function generateMetadata() {
  return {
    title: 'Dashboard - Pisval Tech POS',
    description: 'View your business performance and manage your POS system',
    robots: {
      index: false,
      follow: false,
    },
    other: {
      'cache-control': `private, max-age=${CACHE_TIMES.DASHBOARD}, s-maxage=${CACHE_TIMES.DASHBOARD * 2}, stale-while-revalidate=${CACHE_TIMES.DASHBOARD * 3}`,
    },
  };
}

export default async function Dashboard() {
  await AuthCheck();

  const userId = 'default-user';

  return (
    <ErrorBoundary
      cacheTags={[
        CACHE_TAGS.DASHBOARD,
        CACHE_TAGS.USER_SUBSCRIPTION,
        `user-${userId}`,
      ]}
    >
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent userId={userId} />
      </Suspense>
    </ErrorBoundary>
  );
}

async function DashboardContent({ userId }: { userId: string }) {
  try {
    const [userSubscriptionResult, dashboardSummaryResult] =
      await Promise.allSettled([
        getCachedUserData(userId),
        getCachedDashboardSummary(),
      ]);

    const userSubscription =
      userSubscriptionResult.status === 'fulfilled'
        ? userSubscriptionResult.value
        : null;

    const dashboardSummary =
      dashboardSummaryResult.status === 'fulfilled'
        ? dashboardSummaryResult.value
        : null;

    if (userSubscriptionResult.status === 'rejected') {
      console.error(
        'User subscription fetch failed:',
        userSubscriptionResult.reason
      );
    }
    if (dashboardSummaryResult.status === 'rejected') {
      console.error(
        'Dashboard summary fetch failed:',
        dashboardSummaryResult.reason
      );
    }

    return (
      <DashboardClient
        initialSubscriptionData={userSubscription}
        initialDashboardData={dashboardSummary}
      />
    );
  } catch (error) {
    console.error('Error rendering dashboard:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      userId,
      timestamp: new Date().toISOString(),
    });

    return <DashboardError error={error as Error} />;
  }
}

export const dynamic = 'force-dynamic';
export const revalidate = CACHE_TIMES.USER;
export const fetchCache = 'default-cache';
export const preferredRegion = 'auto';

export const runtime = 'nodejs';
