"use client";

import { useState, useCallback } from "react";
import Sidebar from "@/components/ui/sidebar/Sidebar";

const SidebarContainer = () => {
  const [activeItem, setActiveItem] = useState<string>("");

  const handleItemClick = useCallback((item: string) => {
    setActiveItem(prev => (prev === item ? "" : item));
  }, []);

  return (
    <Sidebar
      activeItem={activeItem}
      handleItemClick={handleItemClick}
    />
  );
};

export default SidebarContainer;
