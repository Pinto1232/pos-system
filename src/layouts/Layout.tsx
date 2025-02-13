"use client";

import NavbarContainer from "@/components/ui/navbar/NavbarContainer";
import SidebarContainer from "@/components/ui/sidebar/SidebarContainer";
import { SidebarProvider } from "@/contexts/SidebarContext";


const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <NavbarContainer />
      <SidebarContainer />
      <main>{children}</main>
    </SidebarProvider>
  );
};

export default Layout;
