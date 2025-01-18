"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { usePricingPackage } from "@/hooks/Api/PricingPackages/usePricingPackages";

const DetailRevision: React.FC = () => {
  const { data } = usePricingPackage();
  const router = useRouter();
  const { id } = router.query;

  const packageDetails = data?.find((pkg) => pkg.id === Number(id));

  if (!packageDetails) {
    return <div>Package not found</div>;
  }

  const descriptionList = packageDetails.description.split(";"); // Parse descriptionList

  return (
    <Box display="flex" flexDirection="column" alignItems="center" padding={4}>
      <Typography variant="h4" gutterBottom>
        {packageDetails.title} Package Details
      </Typography>
      <Typography variant="body1" gutterBottom>
        {packageDetails.extraDescription}
      </Typography>
      <Box
        component="img"
        src={`/assets/icons/${packageDetails.icon}`} // Use icon field
        alt={`${packageDetails.title} icon`}
        sx={{ width: 100, height: 100, marginBottom: 2 }}
      />
      <ul>
        {descriptionList.map((desc, index) => (
          <li key={index}>
            <Typography variant="body2">{desc}</Typography>
          </li>
        ))}
      </ul>
      <Typography variant="h6" gutterBottom>
        Price: ${packageDetails.price.toFixed(2)}
      </Typography>
      <Typography variant="body2" color="textSecondary">
        Test Period: {packageDetails.testPeriodDays} days
      </Typography>
    </Box>
  );
};

export default DetailRevision;
