import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import DashboardClient from './DashboardClient';
import DashboardLoading from './DashboardLoading';
import { fetchUserSubscriptionData } from './UserSubscriptionFetcher';
import AuthCheck from './AuthCheck';
import ErrorBoundary from './ErrorBoundary';
import { CACHE_TIMES, CACHE_TAGS } from '../cache-constants';
import { fetchDashboardSummary } from './DashboardDataFetcher';

export const dynamic = 'force-dynamic';
export const revalidate = CACHE_TIMES.DASHBOARD;

export async function generateMetadata() {
  return {
    title: 'Dashboard - Pisval Tech POS',
    description: 'View your business performance and manage your POS system',
    other: {
      'cache-control': `private, max-age=${CACHE_TIMES.DASHBOARD}, s-maxage=${CACHE_TIMES.DASHBOARD * 2}, stale-while-revalidate=${CACHE_TIMES.DASHBOARD * 3}`,
    },
  };
}

export default async function Dashboard() {
  await AuthCheck();

  const userId = 'default-user';

  try {
    const [userSubscription, dashboardSummary] = await Promise.all([
      fetchUserSubscriptionData(userId),
      fetchDashboardSummary(),
    ]);

    return (
      <ErrorBoundary
        cacheTags={[
          CACHE_TAGS.DASHBOARD,
          CACHE_TAGS.USER_SUBSCRIPTION,
          `user-${userId}`,
        ]}
      >
        <Suspense fallback={null}>
          <DashboardClient
            initialSubscriptionData={userSubscription}
            initialDashboardData={dashboardSummary}
          />
        </Suspense>
      </ErrorBoundary>
    );
  } catch (error) {
    console.error('Error rendering dashboard:', JSON.stringify(error, null, 2));
    return notFound();
  }
}
