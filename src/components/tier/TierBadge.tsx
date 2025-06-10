import React from 'react';
import { Chip, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';

interface TierBadgeProps {
  tierLevel: number;
  tierName: string;
  tierDescription?: string;
  size?: 'small' | 'medium';
}

const StyledChip = styled(Chip)<{ tierlevel: number }>(({
  theme,
  tierlevel,
}) => {
  const getTierColor = (level: number) => {
    switch (level) {
      case 1:
        return {
          backgroundColor:
            theme.palette.mode === 'dark' ? '#2e7d32' : '#4caf50',
          color: theme.palette.common.white,
        };
      case 2:
        return {
          backgroundColor:
            theme.palette.mode === 'dark' ? '#1976d2' : '#2196f3',
          color: theme.palette.common.white,
        };
      case 3:
        return {
          backgroundColor:
            theme.palette.mode === 'dark' ? '#7b1fa2' : '#9c27b0',
          color: theme.palette.common.white,
        };
      case 4:
        return {
          backgroundColor:
            theme.palette.mode === 'dark' ? '#d32f2f' : '#f44336',
          color: theme.palette.common.white,
        };
      case 5:
        return {
          backgroundColor:
            theme.palette.mode === 'dark' ? '#f57c00' : '#ff9800',
          color: theme.palette.common.white,
        };
      default:
        return {
          backgroundColor: theme.palette.grey[500],
          color: theme.palette.common.white,
        };
    }
  };

  return {
    ...getTierColor(tierlevel),
    fontWeight: 600,
    fontSize: '0.75rem',
    '&:hover': {
      ...getTierColor(tierlevel),
      opacity: 0.8,
    },
  };
});

const TierBadge: React.FC<TierBadgeProps> = ({
  tierLevel,
  tierName,
  tierDescription,
  size = 'small',
}) => {
  const badge = (
    <StyledChip
      tierlevel={tierLevel}
      label={`Tier ${tierLevel}: ${tierName}`}
      size={size}
      variant="filled"
    />
  );

  if (tierDescription) {
    return (
      <Tooltip title={tierDescription} arrow placement="top">
        {badge}
      </Tooltip>
    );
  }

  return badge;
};

export default TierBadge;
