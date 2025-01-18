"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import { PropsWithChildren } from "react";

const SubscriptionLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <Box sx={{ padding: "20px", backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <Box sx={{ marginBottom: "20px", borderBottom: "1px solid #ccc" }}>
        <Typography variant="h4" component="h1" sx={{ marginBottom: "10px" }}>
          Subscription Management
        </Typography>
        <Typography variant="body2">
          Manage your subscription options, packages, and more.
        </Typography>
      </Box>
      {children}
    </Box>
  );
};

export default SubscriptionLayout;
