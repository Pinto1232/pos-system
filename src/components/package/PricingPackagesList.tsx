"use client"; // Ensure Next.js renders this on the client

import React, { useEffect, useState } from "react";
import { Box, Button, Typography, CircularProgress } from "@mui/material";
import { usePricingPackage } from "@/hooks/Api/PricingPackages/usePricingPackages";
import PricingPackage from "@/components/package/PricingPackage";
import { useRouter } from "next/navigation";
import { useKeycloak } from "@react-keycloak/web";
import { PricingPackage as PricingPackageType } from "@/types/types.js";

const PricingPackagesList: React.FC = () => {
  const router = useRouter();
  const { keycloak, initialized } = useKeycloak();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Ensure component runs only on the client
  }, []);

  const { data, error, isLoading } = usePricingPackage();
  console.log("data", data);

  if (!isClient) {
    return <p>Loading authentication...</p>;
  }

  if (!initialized) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
        <Typography variant="body1" ml={2}>
          Initializing authentication...
        </Typography>
      </Box>
    );
  }

  if (!keycloak.authenticated) {
    keycloak.login({ redirectUri: window.location.href });
    return null;
  }

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
        <Typography variant="body1" ml={2}>
          Loading packages...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Typography variant="body1" color="error">
          Error loading packages: {error.message}
        </Typography>
        <Button onClick={() => keycloak.login()}>Login</Button>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4">Select Your Plan</Typography>
      <Box display="flex" justifyContent="center" alignItems="center" flexWrap="wrap">
        {data?.map((pkg: PricingPackageType) => (
          <PricingPackage
            key={pkg.id}
            {...pkg}
            onClick={() => {
              if (!keycloak.authenticated) {
                keycloak.login({ redirectUri: window.location.href });
                return;
              }
              router.push(`/package-selection/${pkg.id}`);
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default PricingPackagesList;
