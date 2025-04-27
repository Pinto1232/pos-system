'use client';

import { usePathname } from 'next/navigation';
import FooterContainer from '@/components/footer/FooterContainer';
import LazyJumbotron from '@/components/jumbotron/Jumbotron';
import PackageSelectionModal from '@/components/packages/PackageSelectionModal';
import NavbarContainer from '@/components/ui/navbar/NavbarContainer';
import SidebarContainer from '@/components/ui/sidebar/homeSidebarContainer';
import { PackageSelectionProvider } from '@/contexts/PackageSelectionContext';
import { SidebarProvider } from '@/contexts/SidebarContext';
import { SpinnerProvider } from '@/contexts/SpinnerContext';
import { TestPeriodProvider } from '@/contexts/TestPeriodContext';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import ErrorBoundary from '@/components/ui/errorBoundary/ErrorBoundary';

const queryClient = new QueryClient();

const Layout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const pathname = usePathname();
  const isDashboard = pathname === '/dashboard';

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <SpinnerProvider>
          <PackageSelectionProvider>
            <SidebarProvider>
              <TestPeriodProvider>
                {!isDashboard && (
                  <>
                    <NavbarContainer />
                    <LazyJumbotron
                      heading="Pisval Tech Point of Sale System"
                      subheading="Empower Your Business with Fast, Secure, and Seamless Point of Sale Solutions"
                      backgroundImage="/pos_banner.jpg"
                      overlayColor="linear-gradient(to bottom, rgba(0,0,100,0.6), rgba(0,0,100,0.1))"
                    />
                    <SidebarContainer />
                  </>
                )}
                <main>{children}</main>
                <PackageSelectionModal />
                {!isDashboard && (
                  <FooterContainer />
                )}
              </TestPeriodProvider>
            </SidebarProvider>
          </PackageSelectionProvider>
        </SpinnerProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default Layout;
