"use client";

import React, { useEffect } from "react";

const Dashboard = () => {
  useEffect(() => {
    console.log("User redirected to dashboard successfully.");
  }, []);

  return (
    <div>
      <h1>Welcome to Your Dashboard</h1>
      <p>This is your protected area after authentication.</p>
    </div>
  );
};

export default Dashboard;
