"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";

const DashboardContainer = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);

  useEffect(() => {
    console.log("User redirected to dashboard successfully.");
  }, []);

  const handleDrawerToggle = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <DashboardLayout
      isDrawerOpen={isDrawerOpen}
      onDrawerToggle={handleDrawerToggle}
      backgroundColor="#1E3A8A" 
      textColor="#FFFFFF" // Set the desired text color
      iconColor="#FFFFFF" // Set the desired icon color
      navbarBgColor="#1F2937" // Set the desired Navbar background color
    />
  );
};

export default DashboardContainer;
