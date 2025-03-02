// src/layouts/Layout.tsx
import FooterContainer from "@/components/footer/FooterContainer";
import LazyJumbotron from "@/components/jumbotron/Jumbotron";
import PackageSelectionModal from "@/components/package-modal/PackageSelectionModal";
import NavbarContainer from "@/components/ui/navbar/NavbarContainer";
import SidebarContainer from "@/components/ui/sidebar/SidebarContainer";
import { PackageSelectionProvider } from "@/contexts/PackageSelectionContext";
import { SidebarProvider } from "@/contexts/SidebarContext";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <PackageSelectionProvider>
      <SidebarProvider>
        <NavbarContainer />
        <LazyJumbotron
          heading="Point of Sale System"
          subheading="Empower Your Business with Fast, Secure, and Seamless Point of Sale Solutions"
          backgroundImage="/pos_banner.jpg"
          overlayColor="linear-gradient(to bottom, rgba(0,0,100,0.6), rgba(0,0,100,0.1))" 
        />
        <SidebarContainer />
        <main>{children}</main>
        <PackageSelectionModal />
        <FooterContainer />
      </SidebarProvider>
    </PackageSelectionProvider>
  );
};

export default Layout;
