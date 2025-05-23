import React from 'react';
import { Box, Button } from '@mui/material';
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
  const buttonColors = ['#006D77', '#1E3A8A', '#52B788', '#1F2937', '#F59E0B'];
  const buttonIcons = [FaStar, FaHeart, FaCheck, FaBell, FaSmile];

  return (
    <StyledCard
      sx={{
        width: '100%',
        height: {
          xs: 'auto',
          sm: 'auto',
          md: 'auto',
        },
        minHeight: {
          xs: 'auto',
          sm: 320,
          md: 320,
        },
        p: { xs: 2, sm: 2.5, md: 3 },
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        background: '#ffffff',
        borderRadius: '12px',
        border: '1px solid rgba(230, 232, 240, 0.8)',
        transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.08)',
          borderColor: 'rgba(210, 215, 235, 1)',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          mb: 1.5,
        }}
      >
        <CircleNumber
          sx={{
            width: { xs: 36, sm: 40, md: 44 },
            height: { xs: 36, sm: 40, md: 44 },
            mb: 0,
            background: 'linear-gradient(135deg, #4338ca, #6366f1)',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.25)',
            fontSize: {
              xs: '0.85rem',
              sm: '0.9rem',
              md: '1rem',
            },
            fontWeight: 700,
            border: '2px solid rgba(255, 255, 255, 0.8)',
            flexShrink: 0,
          }}
        >
          {circleText}
        </CircleNumber>

        <Percentage
          sx={{
            fontSize: {
              xs: '1rem',
              sm: '1.1rem',
              md: '1.2rem',
            },
            color: '#64748b',
            textAlign: 'right',
            flexShrink: 0,
            '& span:first-of-type': {
              fontSize: {
                xs: '1.3rem',
                sm: '1.5rem',
                md: '1.7rem',
              },
              fontWeight: 700,
              color: '#1e293b',
              mr: 0.5,
            },
            '& span:last-of-type': {
              fontSize: {
                xs: '0.8rem',
                sm: '0.9rem',
                md: '1rem',
              },
              fontWeight: 500,
              color: '#64748b',
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
          fontSize: {
            xs: '0.95rem',
            sm: '1rem',
            md: '1.05rem',
          },
          mt: 1,
          mb: 1.5,
          fontWeight: 600,
          letterSpacing: '-0.01em',
          color: '#1e293b',
          position: 'relative',
          height: '1.5em',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          width: '100%',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: '-6px',
            left: 0,
            width: '36px',
            height: '3px',
            borderRadius: '2px',
            background: 'linear-gradient(90deg, #6366f1, #a5b4fc)',
          },
        }}
      >
        {title}
      </Title>

      <BulletList
        sx={{
          pl: { xs: 1.5, sm: 2, md: 2.5 },
          mb: 1.5,
          mt: 1,
          maxHeight: '80px',
          overflowY: 'auto',
          overflowX: 'hidden',
          width: '100%',
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
                xs: '0.75rem',
                sm: '0.8rem',
                md: '0.85rem',
              },
              mb: 0.6,
              py: 0.2,
              color: '#475569',
              lineHeight: 1.3,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '100%',
              '&::before': {
                color: '#6366f1',
              },
              '& a': {
                color: '#475569',
                fontWeight: 500,
                textDecoration: 'none',
                '&:hover': {
                  color: '#4338ca',
                },
              },
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
          gap: 1,
          mt: 'auto',
          pt: 1.5,
          borderTop: '1px solid #f1f5f9',
          width: '100%',
        }}
      >
        {}
        <Box
          sx={{
            display: 'flex',
            gap: '2px',
            width: '100%',
            justifyContent: 'space-between',
          }}
        >
          {Array.from({ length: 5 }, (_, i) => {
            const Icon = buttonIcons[i];
            return (
              <Button
                key={i}
                size="small"
                sx={{
                  flex: '1 1 0',
                  minWidth: 'auto',
                  height: {
                    xs: 24,
                    sm: 26,
                    md: 28,
                  },
                  p: {
                    xs: '1px',
                    sm: '2px',
                    md: '2px 4px',
                  },
                  bgcolor: 'transparent',
                  color: buttonColors[i],
                  border: `1px solid ${buttonColors[i]}`,
                  fontSize: {
                    xs: '0.65rem',
                    sm: '0.7rem',
                    md: '0.75rem',
                  },
                  borderRadius: '4px',
                  margin: '0 1px',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: `${buttonColors[i]}10`,
                    transform: 'translateY(-2px)',
                    boxShadow: `0 4px 8px ${buttonColors[i]}20`,
                  },
                }}
              >
                <Icon size={12} />
                <Box
                  component="span"
                  sx={{
                    display: {
                      xs: 'none',
                      md: 'inline',
                    },
                    fontWeight: 600,
                    ml: 0.5,
                  }}
                >
                  {i + 1}
                </Box>
              </Button>
            );
          })}
        </Box>

        {}
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            mt: 1,
          }}
        >
          <a
            href="#"
            style={{
              textDecoration: 'none',
              width: '100%',
              textAlign: 'center',
            }}
          >
            <ViewDetails
              sx={{
                fontSize: {
                  xs: '0.75rem',
                  sm: '0.8rem',
                  md: '0.85rem',
                },
                fontWeight: 600,
                color: '#4f46e5',
                transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '4px 10px',
                borderRadius: '16px',
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
                  marginLeft: '4px',
                  transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                  fontSize: '1rem',
                },
                '&:hover::after': {
                  marginLeft: '8px',
                  transform: 'translateX(2px)',
                },
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
