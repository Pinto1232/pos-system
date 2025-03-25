"use client";

import React, { useState, useEffect } from "react";
import DashboardContainer from "@/components/dashboard-layout/DashboardContainer";
import Navbar from "@/components/sidebar/Navbar";
import Sidebar from "@/components/sidebar/Sidebar";

const Dashboard = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const drawerWidth = 240;

  const handleDrawerToggle = () => {
    setIsDrawerOpen((prev) => !prev); 
  };

  useEffect(() => {
    console.log("User redirected to dashboard successfully.");
  }, []);

  return (
    <div>
      <Navbar
        drawerWidth={drawerWidth}
        onDrawerToggle={handleDrawerToggle}
        backgroundColor="#173A79"
      />
      <Sidebar
        drawerWidth={drawerWidth}
        isDrawerOpen={isDrawerOpen}
        onDrawerToggle={handleDrawerToggle}
        onSectionSelect={(section) => console.log(`Section selected: ${section}`)}
        handleItemClick={(item) => console.log(`Item clicked: ${item}`)}
      />

      <DashboardContainer />
    </div>
  );
};

export default Dashboard;
