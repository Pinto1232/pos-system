"use client";

import React, { useEffect } from "react";
import { Box, Typography } from "@mui/material";
import PricingPackage from "./PricingPackage";
import { pricingPackageStyles } from "./PricingPackage.styles";
import { usePricingPackage } from "@/hooks/Api/PricingPackages/usePricingPackages";
import { navigateBasedOnRule } from "@/routes/appRoutes";
import { useRouter } from "next/navigation";

const PricingPackagesList: React.FC = () => {
  const router = useRouter();


  const handlePackageClick = (id: string, title: string) => {
    const nextRoute = navigateBasedOnRule("1-PackageSelection", title, parseInt(id));
    console.log(`Navigating to: ${nextRoute}`);
    router.push(nextRoute); // Use the router object to navigate
  };

  const { data, error, isLoading } = usePricingPackage();


  useEffect(() => {
    if (data) {
      console.log("Fetched pricing package data:", data);
    }
  }, [data]);


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
              onClick={() => handlePackageClick(pkg.id.toString(), pkg.title)}
            />
          ))}
      </Box>
    </div>
  );
};

export default PricingPackagesList;
