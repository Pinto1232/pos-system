'use client';

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { prefetchCommonData } from '@/utils/cacheUtils';
import { usePathname } from 'next/navigation';

export default function DataPrefetcher() {
  const queryClient = useQueryClient();
  const pathname = usePathname();

  useEffect(() => {
    prefetchCommonData(queryClient).catch((error) => {
      console.error('Error prefetching data:', JSON.stringify(error, null, 2));
    });

    const handleRouteChange = () => {
      if (!pathname) {
        return;
      }

      if (pathname === '/') {
      } else if (pathname.startsWith('/dashboard')) {
        fetch('/api/dashboard/summary')
          .then((res) => {
            if (!res.ok) {
              throw new Error(`API returned status: ${res.status}`);
            }
            return res.json();
          })
          .then((data) => {
            if (data) {
              queryClient.setQueryData(['dashboardSummary'], data);
            }
          })
          .catch((error) => {
            console.error('Error prefetching dashboard data:', JSON.stringify(error, null, 2));
          });
      }
    };

    handleRouteChange();
  }, [queryClient, pathname]);

  return null;
}
