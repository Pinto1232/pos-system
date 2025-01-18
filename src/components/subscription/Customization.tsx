"use client";

import React from "react";
import { Box, Typography, Button } from "@mui/material";

const Customization: React.FC = () => {
  const handleSubmit = () => {
    console.log("Customization submitted");
    // Implement further logic here
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" padding={4}>
      <Typography variant="h4" gutterBottom>
        Customize Your Package
      </Typography>
      <Typography variant="body1" gutterBottom>
        Add or remove features to fit your business needs.
      </Typography>
      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Submit Customization
      </Button>
    </Box>
  );
};

export default Customization;
