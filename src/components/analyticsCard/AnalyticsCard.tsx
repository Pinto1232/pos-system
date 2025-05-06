import React from 'react';
import {
  Box,
  Button,
  useTheme,
} from '@mui/material';
import {
  FaStar,
  FaHeart,
  FaCheck,
  FaBell,
  FaSmile,
} from 'react-icons/fa';
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

const AnalyticsCard: React.FC<
  AnalyticsCardProps
> = ({
  circleText,
  title,
  dataPoints,
  percentage,
}) => {
    const theme = useTheme();
    const buttonColors = [
      '#006D77',
      '#1E3A8A',
      '#52B788',
      '#1F2937',
      '#F59E0B',
    ];
    const buttonIcons = [
      FaStar,
      FaHeart,
      FaCheck,
      FaBell,
      FaSmile,
    ];

    return (
      <StyledCard
        sx={{
          width: { xs: '100%', sm: 370 },
          height: { xs: 'auto', sm: 315 },
          p: { xs: 2.5, sm: 3 },
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.05)',
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid rgba(230, 232, 240, 0.8)',
          transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
          overflow: 'visible',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 28px rgba(0, 0, 0, 0.08)',
            borderColor: 'rgba(210, 215, 235, 1)',
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: {
              xs: 'flex-start',
              sm: 'center',
            },
            flexDirection: {
              xs: 'column',
              sm: 'row',
            },
            gap: 1,
          }}
        >
          <CircleNumber
            sx={{
              width: { xs: 40, sm: 48 },
              height: { xs: 40, sm: 48 },
              mb: { xs: 0.5, sm: 1 },
              background: 'linear-gradient(135deg, #4338ca, #6366f1)',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.25)',
              fontSize: {
                xs: '0.9rem',
                sm: '1.1rem',
              },
              fontWeight: 700,
              border: '2px solid rgba(255, 255, 255, 0.8)',
            }}
          >
            {circleText}
          </CircleNumber>

          <Percentage
            sx={{
              fontSize: {
                xs: '1.1rem',
                sm: '1.3rem',
              },
              color: '#64748b',
              '& span:first-of-type': {
                fontSize: {
                  xs: '1.5rem',
                  sm: '1.8rem',
                },
                fontWeight: 700,
                color: '#1e293b',
                mr: 0.5,
              },
              '& span:last-of-type': {
                fontSize: {
                  xs: '0.9rem',
                  sm: '1rem',
                },
                fontWeight: 500,
                color: '#64748b',
              },
            }}
          >
            <span>
              {percentage.replace('%', '')}
            </span>
            <span>%</span>
          </Percentage>
        </Box>

        <Title
          variant="h6"
          sx={{
            fontSize: {
              xs: '1rem',
              sm: '1.1rem',
            },
            mt: { xs: 0.5, sm: 0.5 },
            mb: { xs: 1, sm: 1 },
            fontWeight: 600,
            letterSpacing: '-0.01em',
            color: '#1e293b',
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: '-6px',
              left: 0,
              width: '36px',
              height: '3px',
              borderRadius: '2px',
              background: 'linear-gradient(90deg, #6366f1, #a5b4fc)',
            }
          }}
        >
          {title}
        </Title>

        <BulletList
          sx={{
            pl: { xs: 2, sm: 2.5 },
            mb: { xs: 1, sm: 1 },
            mt: { xs: 1, sm: 1 },
            maxHeight: '90px', // Reduced height to fit better
            overflowY: 'auto',
            overflowX: 'hidden',
            '&::-webkit-scrollbar': {
              width: '3px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#e2e8f0',
              borderRadius: '10px',
            },
          }}
        >
          {dataPoints.map((point, index) => (
            <DataPoint
              key={index}
              sx={{
                fontSize: {
                  xs: '0.8rem',
                  sm: '0.85rem',
                },
                mb: 0.8, // Reduced margin bottom
                py: 0.2, // Added vertical padding
                color: '#475569',
                lineHeight: 1.4, // Tighter line height
                '&::before': {
                  color: '#6366f1',
                },
                '& a': {
                  color: '#475569',
                  fontWeight: 500,
                  '&:hover': {
                    color: '#4338ca',
                  }
                }
              }}
            >
              <a href="#">{point}</a>
            </DataPoint>
          ))}
        </BulletList>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5,
            mt: 'auto',
            pt: 1.5,
            borderTop: '1px solid #f1f5f9',
          }}
        >
          {/* Action buttons row */}
          <Box
            sx={{
              display: 'flex',
              gap: '4px',
              width: '100%',
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
                    minWidth: {
                      xs: 'auto',
                      sm: 34,
                    },
                    height: { xs: 28, sm: 26 },
                    p: { xs: '2px', sm: '2px 4px' },
                    bgcolor: 'transparent',
                    color: buttonColors[i],
                    border: `1px solid ${buttonColors[i]}`,
                    gap: { xs: '4px', sm: '6px' },
                    fontSize: {
                      xs: '0.75rem',
                      sm: '0.7rem',
                    },
                    borderRadius: '6px',
                    margin: '0 2px',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: `${buttonColors[i]}10`,
                      transform: 'translateY(-2px)',
                      boxShadow: `0 4px 8px ${buttonColors[i]}20`,
                    },
                  }}
                >
                  <Icon
                    size={
                      theme.breakpoints.up('sm')
                        ? 14
                        : 16
                    }
                  />
                  <Box
                    component="span"
                    sx={{
                      display: {
                        xs: 'none',
                        sm: 'inline',
                      },
                      fontWeight: 600,
                    }}
                  >
                    {i + 1}
                  </Box>
                </Button>
              );
            })}
          </Box>

          {/* View Details button - centered and contained within card */}
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              mb: 1, // Add bottom margin to ensure it's not too close to the edge
            }}
          >
            <a href="#" style={{ textDecoration: 'none' }}>
              <ViewDetails
                sx={{
                  fontSize: {
                    xs: '0.875rem',
                    sm: '0.9rem',
                  },
                  fontWeight: 600,
                  color: '#4f46e5',
                  transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  backgroundColor: 'rgba(79, 70, 229, 0.08)',
                  border: '1px solid rgba(79, 70, 229, 0.2)',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.02)',
                  '&:hover': {
                    color: '#4338ca',
                    transform: 'translateX(3px)',
                    backgroundColor: 'rgba(79, 70, 229, 0.12)',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)',
                    border: '1px solid rgba(79, 70, 229, 0.3)',
                  },
                  '&::after': {
                    content: '"→"',
                    marginLeft: '6px',
                    transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                    fontSize: '1.1rem',
                  },
                  '&:hover::after': {
                    marginLeft: '10px',
                    transform: 'translateX(2px)',
                  }
                }}
              >
                View Details
              </ViewDetails>
            </a>
          </Box>
        </Box>
      </StyledCard>
    );
  };

export default AnalyticsCard;
