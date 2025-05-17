import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import DashboardClient from './DashboardClient';
import DashboardLoading from './DashboardLoading';
import { fetchUserSubscriptionData } from './UserSubscriptionFetcher';
import AuthCheck from './AuthCheck';
import ErrorBoundary from './ErrorBoundary';
import { CACHE_TIMES, CACHE_TAGS } from '../cache-constants';

export const revalidate = CACHE_TIMES.DASHBOARD;

export default async function Dashboard() {
  await AuthCheck();

  const userId = 'default-user';

  try {
    const userSubscription = await fetchUserSubscriptionData(userId);

    return (
      <ErrorBoundary
        cacheTags={[
          CACHE_TAGS.DASHBOARD,
          CACHE_TAGS.USER_SUBSCRIPTION,
          `user-${userId}`,
        ]}
      >
        <Suspense fallback={<DashboardLoading />}>
          <DashboardClient initialSubscriptionData={userSubscription} />
        </Suspense>
      </ErrorBoundary>
    );
  } catch (error) {
    console.error('Error rendering dashboard:', JSON.stringify(error, null, 2));
    return notFound();
  }
}
