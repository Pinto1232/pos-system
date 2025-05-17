'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard-layout/DashboardLayout';
import Sidebar from '@/components/sidebar/Sidebar';
import DashboardMain from '@/components/dashboardMain/dashboardMain';
const DashboardContainer = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);

  const [activeSection, setActiveSection] = useState<string>('Dashboard');

  const handleDrawerToggle = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleSectionSelect = (section: string) => {
    setActiveSection(section);
  };

  return (
    <DashboardLayout
      isDrawerOpen={isDrawerOpen}
      onDrawerToggle={handleDrawerToggle}
      backgroundColor="#1E3A8A"
      textColor="#FFFFFF"
      iconColor="#FFFFFF"
      navbarBgColor="#1F2937"
    >
      <DashboardMain activeSection={activeSection} />
    </DashboardLayout>
  );
};

export default DashboardContainer;
