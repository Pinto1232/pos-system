"use client";

import { useState, useCallback } from "react";
import Sidebar from "@/components/ui/sidebar/Sidebar";

const SidebarContainer = () => {
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<string>("");

  const toggleDrawer = useCallback((open: boolean) => () => {
    setDrawerOpen(open);
  }, []);

  const handleItemClick = useCallback((item: string) => {
    setActiveItem(prev => (prev === item ? "" : item));
  }, []);

  return (
    <Sidebar
      isOpen={isDrawerOpen}
      toggleDrawer={toggleDrawer}
      activeItem={activeItem}
      handleItemClick={handleItemClick}
    />
  );
};

export default SidebarContainer;
