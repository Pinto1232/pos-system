import React from 'react';
import { Box, Typography } from '@mui/material';
import PricingPackage from './PricingPackage';
import { pricingPackageStyles } from './PricingPackage.styles';
import { usePricingPackage } from '@/hooks/Api/PricingPackages/usePricingPackages';




const PricingPackagesList: React.FC = () => {
  const { data, error, isLoading } = usePricingPackage();

  if (isLoading) {
    //return <div>Loading...pinto</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  console.log("Pricing Packages Data:", data);
  console.log("Error:", error);

   const handlePackageClick = (title: string) => {
   console.log(`You clicked the ${title} package`);
  };

  return (
    <div>
      <Typography variant="h4" sx={pricingPackageStyles.heading}>
        Select Your Plan
      </Typography>

      <Box display="flex" justifyContent="center" alignItems="center" flexWrap="wrap">
        {data && data.map((pkg) => (
          <PricingPackage
            key={pkg.id}
            title={pkg.title}
            description={pkg.description.split(';')} 
            price={pkg.price}
            onClick={() => handlePackageClick(pkg.title)}
          />
        ))}
      </Box>
    </div>
  );
};

export default PricingPackagesList;