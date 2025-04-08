'use client';

import React, {
  useState,
  useEffect,
} from 'react';
import DashboardLayout from '@/components/dashboard-layout/DashboardLayout';
import Sidebar from '@/components/sidebar/Sidebar';
import DashboardMain from '@/components/dashboardMain/dashboardMain';
import { useSpinner } from '@/contexts/SpinnerContext';

const DashboardContainer = () => {
  const [isDrawerOpen, setIsDrawerOpen] =
    useState(true);
  const [activeSection, setActiveSection] =
    useState<string>('Dashboard');
  const { setLoading } = useSpinner();

  useEffect(() => {
    // Stop the spinner when dashboard mounts
    setLoading(false);
    console.log(
      'User redirected to dashboard successfully.'
    );
  }, [setLoading]);

  const handleDrawerToggle = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleSectionSelect = (
    section: string
  ) => {
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
      <div style={{ display: 'flex' }}>
        <Sidebar
          drawerWidth={240}
          isDrawerOpen={isDrawerOpen}
          onSectionSelect={handleSectionSelect}
          handleItemClick={handleSectionSelect}
        />
        <DashboardMain
          activeSection={activeSection}
        />
      </div>
    </DashboardLayout>
  );
};

export default DashboardContainer;
