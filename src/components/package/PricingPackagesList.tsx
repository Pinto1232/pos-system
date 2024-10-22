import React from 'react';
import { Box, Typography } from '@mui/material';
import PricingPackage from './PricingPackage';
import { pricingPackageStyles } from './PricingPackage.styles';

const packagesData = [
  {
    title: 'Starter',
    description: [
      "Select the essential modules and features for your business.",
      "Ideal for small businesses or those new to POS systems.",
      "Provides basic functionalities for efficient sales and inventory management.",
      "User-friendly interface designed for quick setup and ease of use.",
      "Includes basic reporting tools to track sales and inventory levels.",
      "Affordable pricing to help small businesses get started with minimal investment."
    ],
  },
  {
    title: 'Growth',
    description: [
      "Expand your business capabilities with advanced modules and features.",
      "Designed for growing businesses looking to enhance their POS system.",
      "Offers enhanced functionalities for better sales and inventory management.",
      "Includes advanced reporting tools to gain deeper insights into business performance.",
      "Supports integration with additional third-party services for extended functionality.",
      "Flexible pricing options to accommodate the needs of expanding businesses."
    ],
  },
  {
    title: 'Pro',
    description: [
      "Access premium features tailored for professional business operations.",
      "Includes comprehensive tools for detailed sales and inventory analysis.",
      "Offers priority support to ensure seamless business operations.",
      "Advanced customization options to fit specific business needs.",
      "Integrates with a wide range of third-party applications for enhanced functionality.",
      "Designed for businesses seeking a robust and scalable POS solution."
    ],
  },
  {
    title: 'Enterprise',
    description: [
      "Tailored for large-scale businesses with complex operational needs.",
      "Provides enterprise-grade security and compliance features.",
      "Offers dedicated account management and 24/7 support.",
      "Customizable solutions to integrate with existing enterprise systems.",
      "Advanced analytics and reporting for strategic decision-making.",
      "Scalable infrastructure to support high transaction volumes."
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