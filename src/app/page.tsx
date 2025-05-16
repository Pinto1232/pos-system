import { Box, Typography } from '@mui/material';
import PricingPackagesContainer from '@/components/pricing-packages/PricingPackagesContainer';
import HeroContainer from '@/components/features/HeroContainer';
import TestimonialContainer from '@/components/testimonial/TestimonialContainer';
import FeaturesSlider from '@/components/slider/FeaturesSlider';
import RegistrationHandler from '@/components/auth/RegistrationHandler';
import ErrorAlert from '@/components/ui/errorAlert/ErrorAlert';

export default function Home() {
  const heading = `Choose Your Plan`;
  const description =
    'Choose the perfect package that suits your business needs. Our flexible pricing options are designed to scale with your growth.';

  return (
    <div>
      {/* Handle registration redirects */}
      <RegistrationHandler />

      {/* Display error messages from URL */}
      <ErrorAlert />

      <Box>
        <Box textAlign="center" mt={5}>
          <Typography
            sx={{
              color: '#000',
              marginBottom: '0.5rem',
              fontWeight: 600,
              fontSize: '2.5rem',
              letterSpacing: '-0.02em',
            }}
            variant="h4"
            dangerouslySetInnerHTML={{
              __html: heading,
            }}
          />
          <Typography
            sx={{
              color: '#4b5563',
              maxWidth: '600px',
              margin: '0 auto',
              marginBottom: '0.2rem',
              fontSize: '1.1rem',
              lineHeight: 1.6,
              fontWeight: 400,
            }}
          >
            {description}
          </Typography>
        </Box>
        <PricingPackagesContainer />
        <HeroContainer />
        <TestimonialContainer />
        <FeaturesSlider />
      </Box>
    </div>
  );
}
