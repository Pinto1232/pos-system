import { Box, Typography } from '@mui/material';
import PricingPackagesContainer from '@/components/pricing-packages/PricingPackagesContainer';
import HeroContainer from '@/components/features/HeroContainer';
import FeaturesSlider from '@/components/slider/FeaturesSlider';

export default function Home() {
  const heading = `Packages`;
  return (
    <div>
      <Box>
        <Box textAlign="center" mt={5}>
          <Typography
            sx={{ color: '#000' }}
            variant="h4"
            dangerouslySetInnerHTML={{ __html: heading }}
          />
        </Box>
        <PricingPackagesContainer />
        <HeroContainer />
        <FeaturesSlider />
      </Box>
    </div>
  );
}
