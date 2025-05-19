'use client';

import React from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { TeamMember } from '../../types';
import TeamMemberCard from './TeamMemberCard';

interface TeamPerformanceProps {
  teamMembers: TeamMember[];
  totalRevenue: number;
  formatCurrency: (amount: number, currencyCode?: string) => string;
  formatPercentage: (value: number) => string;
}

const TeamPerformance: React.FC<TeamPerformanceProps> = ({
  teamMembers,
  totalRevenue,
  formatCurrency,
  formatPercentage,
}) => {
  return (
    <Box sx={{ mt: 6, mb: 3 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 4,
          pb: 1,
          borderBottom: '1px solid rgba(226, 232, 240, 0.6)',
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: '#334155',
            fontSize: '0.9rem',
            fontWeight: 600,
            position: 'relative',
            paddingLeft: '12px',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: '50%',
              left: 0,
              transform: 'translateY(-50%)',
              width: '4px',
              height: '16px',
              background: '#4f46e5',
              borderRadius: '2px',
            },
          }}
        >
          Team Performance
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: '#64748b',
            fontSize: '0.75rem',
            fontWeight: 500,
          }}
        >
          {teamMembers.length} Members
        </Typography>
      </Box>

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={3}
        sx={{
          '& > *': {
            flex: 1,
            minWidth: {
              xs: '100%',
              sm: '200px',
            },
          },
        }}
      >
        {teamMembers.map((member: TeamMember) => (
          <TeamMemberCard
            key={member.name}
            member={member}
            totalRevenue={totalRevenue}
            formatCurrency={formatCurrency}
            formatPercentage={formatPercentage}
          />
        ))}
      </Stack>
    </Box>
  );
};

export default TeamPerformance;
