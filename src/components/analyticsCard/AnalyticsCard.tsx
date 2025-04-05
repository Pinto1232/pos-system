import React from 'react';
import { Box, Button, useTheme } from '@mui/material';
import { FaStar, FaHeart, FaCheck, FaBell, FaSmile } from 'react-icons/fa';
import {
  StyledCard,
  CircleNumber,
  Title,
  BulletList,
  DataPoint,
  Percentage,
  ViewDetails,
} from './analyticsCard.styles';
import { AnalyticsCardProps } from './analyticsCard.types';

const AnalyticsCard: React.FC<AnalyticsCardProps> = ({
  circleText,
  title,
  dataPoints,
  percentage,
}) => {
  const theme = useTheme();
  const buttonColors = ['#006D77', '#1E3A8A', '#52B788', '#1F2937', '#F59E0B'];
  const buttonIcons = [FaStar, FaHeart, FaCheck, FaBell, FaSmile];

  return (
    <StyledCard
      sx={{
        width: { xs: '100%', sm: 370 },
        height: { xs: 'auto', sm: 315 },
        p: { xs: 2, sm: 3 },
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
        background: 'linear-gradient(145deg, #ffffff, #f8f9fa)',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 1,
        }}
      >
        <CircleNumber
          sx={{
            width: { xs: 40, sm: 60 },
            height: { xs: 40, sm: 60 },
            mb: { xs: 1, sm: 2 },
            background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
            boxShadow: '0 4px 10px rgba(124, 58, 237, 0.3)',
            fontSize: { xs: '1rem', sm: '1.25rem' },
            fontWeight: 700,
          }}
        >
          {circleText}
        </CircleNumber>

        <Percentage
          sx={{
            fontSize: { xs: '1.25rem', sm: '1.5rem' },
            '& span:first-of-type': {
              fontSize: { xs: '1.75rem', sm: '2rem' },
              fontWeight: 800,
              background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            },
          }}
        >
          <span>{percentage.replace('%', '')}</span>
          <span>%</span>
        </Percentage>
      </Box>

      <Title
        variant="h6"
        sx={{
          fontSize: { xs: '1.1rem', sm: '1.25rem' },
          mt: { xs: 0, sm: -1 },
          mb: { xs: 1, sm: 0.5 },
          fontWeight: 700,
          letterSpacing: '-0.01em',
        }}
      >
        {title}
      </Title>

      <BulletList
        sx={{
          pl: { xs: 2, sm: 3 },
          mb: { xs: 1, sm: 2 },
        }}
      >
        {dataPoints.map((point, index) => (
          <DataPoint
            key={index}
            sx={{
              fontSize: { xs: '0.875rem', sm: '0.9rem' },
            }}
          >
            <a href="#">{point}</a>
          </DataPoint>
        ))}
      </BulletList>

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 1.5, sm: 0 },
          mt: { xs: 1, sm: 2 },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            gap: '1px',
            width: '100%',
            order: { xs: 2, sm: 1 },
          }}
        >
          {Array.from({ length: 5 }, (_, i) => {
            const Icon = buttonIcons[i];
            return (
              <Button
                key={i}
                size="small"
                sx={{
                  flex: 1,
                  minWidth: { xs: 'auto', sm: 34 },
                  height: { xs: 36, sm: 28 },
                  p: { xs: '4px', sm: 0 },
                  bgcolor: buttonColors[i],
                  color: '#fff',
                  gap: { xs: '2px', sm: '6px' },
                  fontSize: { xs: '0.75rem', sm: '10px' },
                  borderRadius: '8px',
                  margin: '0 1px',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: buttonColors[i],
                    opacity: 0.9,
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
                  },
                }}
              >
                <Icon size={theme.breakpoints.up('sm') ? 12 : 14} />
                <Box
                  component="span"
                  sx={{ display: { xs: 'none', sm: 'inline' } }}
                >
                  {i}
                </Box>
              </Button>
            );
          })}
        </Box>

        <Box
          sx={{
            width: '100%',
            textAlign: { xs: 'center', sm: 'right' },
            order: { xs: 1, sm: 2 },
          }}
        >
          <a href="#">
            <ViewDetails
              sx={{
                fontSize: { xs: '0.875rem', sm: '0.9rem' },
                mt: { xs: 0, sm: 2 },
                fontWeight: 600,
                transition: 'all 0.2s ease',
                '&:hover': {
                  color: '#4F46E5',
                  transform: 'translateX(3px)',
                },
              }}
            >
              View Details ➔
            </ViewDetails>
          </a>
        </Box>
      </Box>
    </StyledCard>
  );
};

export default AnalyticsCard;
