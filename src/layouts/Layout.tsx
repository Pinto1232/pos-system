'use client';

import { usePathname } from 'next/navigation';
import FooterContainer from '@/components/footer/FooterContainer';
import LazyJumbotron from '@/components/jumbotron/Jumbotron';
import PackageSelectionModal from '@/components/packages/PackageSelectionModal';
import NavbarContainer from '@/components/ui/navbar/NavbarContainer';
import NavbarSpacer from '@/components/ui/navbar/NavbarSpacer';
import SidebarContainer from '@/components/ui/sidebar/homeSidebarContainer';
import { PackageSelectionProvider } from '@/contexts/PackageSelectionContext';
import { SidebarProvider } from '@/contexts/SidebarContext';
import { SpinnerProvider } from '@/contexts/SpinnerContext';
import { TestPeriodProvider } from '@/contexts/TestPeriodContext';
import SuccessModalProvider from '@/contexts/SuccessModalContext';
import ChatbotContainer from '@/components/ui/chatbot/ChatbotContainer';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ErrorBoundary from '@/components/ui/errorBoundary/ErrorBoundary';
import { useTranslationContext, TranslatedText } from '@/i18n';

const queryClient = new QueryClient();

const Layout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname() || '';
  const { t, currentLanguage } = useTranslationContext();

  // Debug translations
  console.log('Current language:', currentLanguage);
  console.log('Translation test - app.fullName:', t('app.fullName'));
  console.log(
    'Translation test - app.marketingTagline:',
    t('app.marketingTagline')
  );

  
  const isDashboard = pathname === '/dashboard';
  const isHomePage = pathname === '/';
  const isCheckout =
    pathname.includes('/checkout') && !pathname.includes('/checkout/success');
  const isCheckoutSuccess = pathname.includes('/checkout/success');

  const renderLayout = () => {
    if (isDashboard) {
      return <main className="dashboard-layout">{children}</main>;
    }

    if (isHomePage) {
      return (
        <>
          <NavbarContainer />
          <NavbarSpacer />
          <LazyJumbotron
            heading={
              <TranslatedText
                i18nKey="app.fullName"
                defaultValue="Pisval Tech Point of Sale System"
              />
            }
            subheading={
              <TranslatedText
                i18nKey="app.marketingTagline"
                defaultValue="Empower Your Business with Fast, Secure, and Seamless Point of Sale Solutions"
              />
            }
            backgroundImage="/pos_banner.jpg"
            overlayColor="linear-gradient(to bottom, rgba(0,0,100,0.6), rgba(0,0,100,0.1))"
          />
          <SidebarContainer />
          <main className="home-layout">{children}</main>
          <FooterContainer />
        </>
      );
    }

    if (isCheckout) {
      return (
        <>
          <NavbarContainer />
          <NavbarSpacer />
          <main className="checkout-layout">{children}</main>
          <FooterContainer />
        </>
      );
    }

    if (isCheckoutSuccess) {
      return (
        <>
          <NavbarContainer />
          <NavbarSpacer />
          <LazyJumbotron
            heading={
              <TranslatedText
                i18nKey="app.fullName"
                defaultValue="Pisval Tech Point of Sale System"
              />
            }
            subheading={
              <TranslatedText
                i18nKey="app.marketingTagline"
                defaultValue="Empower Your Business with Fast, Secure, and Seamless Point of Sale Solutions"
              />
            }
            backgroundImage="/pos_banner.jpg"
            overlayColor="linear-gradient(to bottom, rgba(0,0,100,0.6), rgba(0,0,100,0.1))"
          />
          <SidebarContainer />
          <main className="checkout-success-layout">{children}</main>
          <FooterContainer />
        </>
      );
    }

    return (
      <>
        <NavbarContainer />
        <NavbarSpacer />
        <main className="default-layout">{children}</main>
        <FooterContainer />
      </>
    );
  };

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <SpinnerProvider>
          <SuccessModalProvider>
            <PackageSelectionProvider>
              <SidebarProvider>
                <TestPeriodProvider>
                  {renderLayout()}
                  <PackageSelectionModal />
                  <ChatbotContainer />
                </TestPeriodProvider>
              </SidebarProvider>
            </PackageSelectionProvider>
          </SuccessModalProvider>
        </SpinnerProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default Layout;
