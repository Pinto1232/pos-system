"use client";

import DashboardContainer from "@/components/dashboard-layout/DashboardContainer";
import React, { useEffect } from "react";

const Dashboard = () => {
  useEffect(() => {
    console.log("User redirected to dashboard successfully.");
  }, []);

  return (
    <div>
      <DashboardContainer />
    </div>
  );
};

export default Dashboard;
