'use client';

import React from 'react';
import { Box, Avatar, Typography, LinearProgress } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { TeamMember } from '../../types';

interface TeamMemberCardProps {
  member: TeamMember;
  totalRevenue: number;
  formatCurrency: (amount: number, currencyCode?: string) => string;
  formatPercentage: (value: number) => string;
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({
  member,
  totalRevenue,
  formatCurrency,
  formatPercentage,
}) => {
  return (
    <Box
      key={member.name}
      sx={{
        p: 0,
        borderRadius: '12px',
        bgcolor: '#ffffff',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
        border: '1px solid rgba(226, 232, 240, 0.7)',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        overflow: 'hidden',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 24px rgba(0, 0, 0, 0.05)',
          borderColor: 'rgba(203, 213, 225, 1)',
          '& .member-avatar': {
            transform: 'scale(1.05)',
          },
        },
      }}
    >
      {}
      <Box
        sx={{
          position: 'relative',
          height: '60px',
          background:
            member.percentage >= 0
              ? 'linear-gradient(to right, rgba(79, 70, 229, 0.08) 0%, rgba(79, 70, 229, 0.03) 100%)'
              : 'linear-gradient(to right, rgba(100, 116, 139, 0.08) 0%, rgba(100, 116, 139, 0.03) 100%)',
          borderBottom: '1px solid rgba(226, 232, 240, 0.5)',
          mb: 4,
        }}
      />

      {}
      <Avatar
        className="member-avatar"
        sx={{
          position: 'absolute',
          top: '30px',
          left: '24px',
          width: '48px',
          height: '48px',
          bgcolor: member.percentage >= 0 ? '#4f46e5' : '#64748b',
          fontSize: '1.1rem',
          fontWeight: 600,
          border: '2px solid #ffffff',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          transition: 'transform 0.3s ease',
          zIndex: 2,
        }}
      >
        {member.name.charAt(0)}
      </Avatar>

      {}
      <Box sx={{ px: 3, pb: 3 }}>
        {}
        <Box sx={{ ml: 7, mb: 3 }}>
          <Typography
            sx={{
              fontWeight: 600,
              color: '#1e293b',
              fontSize: '1rem',
              mb: 0.25,
            }}
          >
            {member.name}
          </Typography>
          <Typography
            sx={{
              color: '#64748b',
              fontSize: '0.8rem',
              fontWeight: 500,
            }}
          >
            Sales Representative
          </Typography>
        </Box>

        {}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 2.5,
            mb: 3,
          }}
        >
          {}
          <Box
            sx={{
              p: 1.5,
              borderRadius: '8px',
              bgcolor: 'rgba(241, 245, 249, 0.5)',
            }}
          >
            <Typography
              sx={{
                color: '#64748b',
                fontSize: '0.7rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                mb: 0.5,
              }}
            >
              Revenue
            </Typography>
            <Typography
              sx={{
                color: '#0f172a',
                fontSize: '1rem',
                fontWeight: 700,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {formatCurrency(member.revenue)}
            </Typography>
          </Box>

          {}
          <Box
            sx={{
              p: 1.5,
              borderRadius: '8px',
              bgcolor: 'rgba(241, 245, 249, 0.5)',
            }}
          >
            <Typography
              sx={{
                color: '#64748b',
                fontSize: '0.7rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                mb: 0.5,
              }}
            >
              Contribution
            </Typography>
            <Typography
              sx={{
                color: '#0f172a',
                fontSize: '1rem',
                fontWeight: 700,
              }}
            >
              {formatPercentage((member.revenue / totalRevenue) * 100)}
            </Typography>
          </Box>
        </Box>

        {}
        <Box sx={{ mb: 0 }}>
          {}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 1.5,
            }}
          >
            <Typography
              sx={{
                color: '#334155',
                fontSize: '0.85rem',
                fontWeight: 600,
              }}
            >
              Performance
            </Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                px: 1.5,
                py: 0.5,
                borderRadius: '16px',
                bgcolor:
                  member.percentage >= 0
                    ? 'rgba(16, 185, 129, 0.1)'
                    : 'rgba(244, 63, 94, 0.1)',
              }}
            >
              {member.percentage >= 0 ? (
                <ArrowUpwardIcon
                  sx={{
                    fontSize: '0.85rem',
                    color: '#10b981',
                  }}
                />
              ) : (
                <ArrowDownwardIcon
                  sx={{
                    fontSize: '0.85rem',
                    color: '#f43f5e',
                  }}
                />
              )}
              <Typography
                sx={{
                  color: member.percentage >= 0 ? '#10b981' : '#f43f5e',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                }}
              >
                {formatPercentage(Math.abs(member.percentage))}
              </Typography>
            </Box>
          </Box>

          {}
          <Box
            sx={{
              position: 'relative',
              mt: 2,
              mb: 1,
            }}
          >
            {}
            <Box
              sx={{
                position: 'absolute',
                left: '30%',
                top: -2,
                bottom: -2,
                width: 2,
                bgcolor: 'rgba(100, 116, 139, 0.3)',
                zIndex: 1,
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  top: -3,
                  left: -3,
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: 'rgba(100, 116, 139, 0.3)',
                },
              }}
            />

            {}
            <LinearProgress
              variant="determinate"
              value={Math.min(Math.abs(member.percentage), 100)}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: 'rgba(226, 232, 240, 0.5)',
                '& .MuiLinearProgress-bar': {
                  backgroundColor:
                    member.percentage >= 0 ? '#10b981' : '#f43f5e',
                  borderRadius: 4,
                },
                position: 'relative',
                zIndex: 2,
              }}
            />

            {}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                mt: 0.5,
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: '#94a3b8',
                  fontSize: '0.7rem',
                  fontWeight: 500,
                }}
              >
                Current: {formatPercentage(Math.abs(member.percentage))}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: '#94a3b8',
                  fontSize: '0.7rem',
                  fontWeight: 500,
                }}
              >
                Target: 30%
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default TeamMemberCard;
