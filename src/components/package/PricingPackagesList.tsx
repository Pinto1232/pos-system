"use client";

import React, { useEffect } from "react";
import { Box, Typography } from "@mui/material";
import PricingPackage from "./PricingPackage";
import { pricingPackageStyles } from "./PricingPackage.styles";
import { usePricingPackage } from "@/hooks/Api/PricingPackages/usePricingPackages";
import { useRouter } from "next/navigation";

const PricingPackagesList: React.FC = () => {
  const { data, error, isLoading } = usePricingPackage();
  const router = useRouter();

  useEffect(() => {
    if (data) {
      console.log("Fetched pricing package data:", data);
    }
  }, [data]);

  const handlePackageClick = (id: number, title: string) => {
    switch (title) {
      case "Custom":
        router.push(`/app/subscription/customization/${id}`);
        console.log("Navigating to:", `/app/subscription/customization/${id}`);

        break;
      case "Starter":
        router.push(`/app/subscription/detail-revision/${id}`);
        break;
      default:
        router.push(`/app/subscription/packages/${id}`);
        break;
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <Typography variant="h4" sx={pricingPackageStyles.heading}>
        Select Your Plan
      </Typography>

      <Box display="flex" justifyContent="center" alignItems="center" flexWrap="wrap">
        {data &&
          data.map((pkg) => (
            <PricingPackage
              key={pkg.id}
              id={pkg.id}
              title={pkg.title}
              description={pkg.description}
              descriptionList={pkg.descriptionList}
              extraDescription={pkg.extraDescription}
              icon={pkg.icon}
              price={pkg.price}
              testPeriodDays={pkg.testPeriodDays}
              onClick={() => handlePackageClick(pkg.id, pkg.title)}
            />
          ))}
      </Box>
    </div>
  );
};

export default PricingPackagesList;
