'use client';

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { prefetchCommonData } from '@/utils/cacheUtils';
import { usePathname } from 'next/navigation';

/**
 * Component that prefetches data for common routes
 * This helps improve the user experience by loading data before it's needed
 */
export default function DataPrefetcher() {
  const queryClient = useQueryClient();
  const pathname = usePathname();

  useEffect(() => {
    // Prefetch common data when the component mounts
    prefetchCommonData(queryClient).catch(
      (error) => {
        console.error(
          'Error prefetching data:',
          error
        );
      }
    );

    // Set up a listener for route changes
    const handleRouteChange = () => {
      // Prefetch data based on the current route
      if (!pathname) {
        return; // Skip if pathname is null
      }

      if (pathname === '/') {
        // Prefetch data for the home page
        // This is already covered by prefetchCommonData
      } else if (
        pathname.startsWith('/dashboard')
      ) {
        // Prefetch dashboard-specific data
        fetch('/api/dashboard/summary')
          .then((res) => {
            // Check if response is OK before parsing JSON
            if (!res.ok) {
              throw new Error(
                `API returned status: ${res.status}`
              );
            }
            return res.json();
          })
          .then((data) => {
            if (data) {
              queryClient.setQueryData(
                ['dashboardSummary'],
                data
              );
            }
          })
          .catch((error) => {
            console.error(
              'Error prefetching dashboard data:',
              error
            );
            // Don't throw the error further, just log it
            // This prevents the error from breaking the app
          });
      }
    };

    // Call the handler once on mount
    handleRouteChange();

    // No cleanup needed as this is a one-time operation
  }, [queryClient, pathname]);

  // This component doesn't render anything
  return null;
}
