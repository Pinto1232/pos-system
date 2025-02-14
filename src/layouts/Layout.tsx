// src/layouts/Layout.tsx
import FooterContainer from "@/components/footer/FooterContainer";
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
        <SidebarContainer />
        <main>{children}</main>
        {/* Render the modal here once */}
        <PackageSelectionModal />
        <FooterContainer /> 
      </SidebarProvider>
    </PackageSelectionProvider>
  );
};

export default Layout;
