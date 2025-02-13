"use client";

import { useState, useCallback } from "react";
import Navbar from "@/components/ui/navbar/Navbar";

const NavbarContainer = () => {
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = useCallback((open: boolean) => () => {
    setDrawerOpen(open);
  }, []);

  return (
    <Navbar
      title="Pisval Tech"
      testPeriod={12}
      menuItems={["Dashboard", "Settings", "Support", "Logout"]}
      isDrawerOpen={isDrawerOpen}
      toggleDrawer={toggleDrawer}
    />
  );
};

export default NavbarContainer;
