import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import DashboardClient from './DashboardClient';
import DashboardLoading from './DashboardLoading';
import { fetchUserSubscriptionData } from './UserSubscriptionFetcher';
import AuthCheck from './AuthCheck';
import ErrorBoundary from './ErrorBoundary';
import {
  CACHE_TIMES,
  CACHE_TAGS,
} from '../cache-constants';

// Configure ISR with revalidation using centralized cache configuration
export const revalidate = CACHE_TIMES.DASHBOARD; // Revalidate based on dashboard cache time

/**
 * Server Component for the Dashboard page
 * This component fetches data on the server and passes it to client components
 */
export default async function Dashboard() {
  // Check authentication on the server
  // This will redirect to login if not authenticated
  await AuthCheck();

  // In a real app with server-side auth, you would get the user ID from the session
  // For now, use a default user ID
  // The AuthCheck component already validates authentication
  const userId = 'default-user';

  try {
    // Fetch user subscription data on the server
    const userSubscription =
      await fetchUserSubscriptionData(userId);

    // Render the dashboard with suspense for better loading experience
    // and error boundary for error handling with cache integration
    return (
      <ErrorBoundary
        cacheTags={[
          CACHE_TAGS.DASHBOARD,
          CACHE_TAGS.USER_SUBSCRIPTION,
          `user-${userId}`,
        ]}
      >
        <Suspense fallback={<DashboardLoading />}>
          <DashboardClient
            initialSubscriptionData={
              userSubscription
            }
          />
        </Suspense>
      </ErrorBoundary>
    );
  } catch (error) {
    console.error(
      'Error rendering dashboard:',
      error
    );
    return notFound();
  }
}
