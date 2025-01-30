"use client";

import React, { useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";
import { pricingPackageStyles } from "@/components/package/PricingPackage.styles";
import { usePricingPackage } from "@/hooks/Api/PricingPackages/usePricingPackages";
import PricingPackage from "@/components/package/PricingPackage";
import { useRouter } from "next/navigation";
import { useKeycloak } from "@react-keycloak/web";
import { PricingPackage as PricingPackageType } from "@/types/types.js";
const PricingPackagesList: React.FC = () => {
  const router = useRouter();
  const { keycloak, initialized } = useKeycloak();

  useEffect(() => {
    if (initialized && !keycloak.authenticated) {
      keycloak.login({ redirectUri: window.location.href });
    }
  }, [keycloak, initialized]);

  const { data, error, isLoading } = usePricingPackage();
  console.log("My data", data);

  const handlePackageClick = (id: string, title: string) => {
    if (!keycloak.authenticated) {
      keycloak.login({ redirectUri: window.location.href });
      return;
    }
    
    const nextRoute = navigateBasedOnRule("1-PackageSelection", title, parseInt(id));
    router.push(nextRoute);
  };

  if (!initialized) {
    return <Box>Initializing authentication...</Box>;
  }

  if (isLoading) {
    return <Box>Loading packages...</Box>;
  }

  if (error) {
    return (
      <Box>
        Error loading packages: {error.message}
        <Button onClick={() => keycloak.login()}>Login</Button>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" sx={pricingPackageStyles.heading}>
        Select Your Plan
      </Typography>

      <Box display="flex" justifyContent="center" alignItems="center" flexWrap="wrap">
        {data?.map((pkg: PricingPackageType) => ( // Add explicit type annotation
          <PricingPackage
            key={pkg.id}
            {...pkg}
            onClick={() => handlePackageClick(pkg.id.toString(), pkg.title)}
          />
        ))}
      </Box>
    </Box>
  );
};

// Implement proper navigation logic
function navigateBasedOnRule(step: string, title: string, id: number): string {
  return `/package-selection/${id}?step=${encodeURIComponent(step)}&title=${encodeURIComponent(title)}`;
}

export default PricingPackagesList;