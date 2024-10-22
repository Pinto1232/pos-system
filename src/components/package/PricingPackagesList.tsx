import React from 'react';
import { Box, Typography } from '@mui/material';
import PricingPackage from './PricingPackage';
import { pricingPackageStyles } from './PricingPackage.styles';

const packagesData = [
  {
    title: 'Starter',
    description: [
      'Selecione os módulos e recursos que main.',
      'Selecione os módulos e recursos que main.',
      'Selecione os módulos e recursos que main.',
    ],
  },
  {
    title: 'Growth',
    description: [
      'Selecione os módulos e recursos que main.',
      'Selecione os módulos e recursos que main.',
      'Selecione os módulos e recursos que main.',
    ],
  },
  {
    title: 'Pro',
    description: [
      'Selecione os módulos e recursos que main.',
      'Selecione os módulos e recursos que main.',
      'Selecione os módulos e recursos que main.',
    ],
  },
  {
    title: 'Enterprise',
    description: [
      'Selecione os módulos e recursos que main.',
      'Selecione os módulos e recursos que main.',
      'Selecione os módulos e recursos que main.',
    ],
  },
];

const PricingPackagesList: React.FC = () => {
  const handlePackageClick = (title: string) => {
    console.log(`You clicked the ${title} package`);
  };

  return (
    <div>
      <Typography variant="h4" sx={pricingPackageStyles.heading}>
        Select Your Plan
      </Typography>

      <Box display="flex" justifyContent="center" alignItems="center" flexWrap="wrap">
        {packagesData.map((pkg) => (
          <PricingPackage
            key={pkg.title}
            title={pkg.title}
            description={pkg.description}
            onClick={() => handlePackageClick(pkg.title)}
          />
        ))}
      </Box>
    </div>
  );
};

export default PricingPackagesList;