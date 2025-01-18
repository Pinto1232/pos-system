"use client";

import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useRouter } from "next/navigation";

const SubscriptionPage: React.FC = () => {
  const router = useRouter();

  const handleNavigateToPackages = () => {
    router.push("/subscription/package-selection"); 
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Typography variant="h5" component="h2">
        Welcome to the Subscription Portal
      </Typography>
      <Typography variant="body1">
        Select and manage your subscription packages. Start by exploring the available options.
      </Typography>
      <Button variant="contained" color="primary" onClick={handleNavigateToPackages}>
        Explore Packages
      </Button>
    </Box>
  );
};

export default SubscriptionPage;
