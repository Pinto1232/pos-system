// SidebarContainer.tsx
"use client";

import { useState, useCallback } from "react";
import Sidebar from "@/components/ui/sidebar/homeSidebar";

const SidebarContainer = () => {
  const [activeItem, setActiveItem] = useState<string>("");

  const handleItemClick = useCallback((item: string) => {
    setActiveItem(item);
  }, []);

  return (
    <Sidebar
      drawerWidth={250}
      isDrawerOpen={true}
      onDrawerToggle={() => { }}
      activeItem={activeItem}
      handleItemClick={handleItemClick}
      onSectionSelect={handleItemClick}
    />
  );
};

export default SidebarContainer;
