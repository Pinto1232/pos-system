import React from 'react';
import {
  Chip,
  Tooltip,
  Box,
  Typography,
  Alert,
  AlertTitle,
  Badge,
} from '@mui/material';
import {
  Warning as WarningIcon,
  Error as ErrorIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { StockLevel } from '@/utils/stockManagement';

interface StockWarningProps {
  stockLevel: StockLevel;
  variant?: 'chip' | 'alert' | 'badge';
  showIcon?: boolean;
  size?: 'small' | 'medium';
}

const StockWarning: React.FC<StockWarningProps> = ({
  stockLevel,
  variant = 'chip',
  showIcon = true,
  size = 'small',
}) => {
  const getIcon = () => {
    switch (stockLevel.level) {
      case 'out_of_stock':
        return <ErrorIcon />;
      case 'low_stock':
        return <WarningIcon />;
      case 'normal':
        return <CheckCircleIcon />;
      case 'high_stock':
        return <InfoIcon />;
      default:
        return null;
    }
  };

  const getIconColor = () => {
    switch (stockLevel.color) {
      case 'error':
        return '#f44336';
      case 'warning':
        return '#ff9800';
      case 'success':
        return '#4caf50';
      case 'info':
        return '#2196f3';
      default:
        return '#757575';
    }
  };

  if (variant === 'chip') {
    const icon = showIcon ? getIcon() : null;
    const chipProps = {
      label: stockLevel.message,
      color: stockLevel.color,
      size: size,
      sx: {
        fontWeight: stockLevel.severity === 'critical' ? 'bold' : 'normal',
        animation:
          stockLevel.severity === 'critical' ? 'pulse 2s infinite' : 'none',
        '@keyframes pulse': {
          '0%': { opacity: 1 },
          '50%': { opacity: 0.7 },
          '100%': { opacity: 1 },
        },
      },
      ...(icon && { icon }),
    };

    return (
      <Tooltip title={`Stock Status: ${stockLevel.message}`} arrow>
        <Chip {...chipProps} />
      </Tooltip>
    );
  }

  if (variant === 'alert') {
    return (
      <Alert
        severity={stockLevel.color}
        icon={showIcon ? getIcon() : false}
        sx={{
          mb: 1,
          '& .MuiAlert-message': {
            width: '100%',
          },
        }}
      >
        <AlertTitle sx={{ mb: 0 }}>
          {stockLevel.level === 'out_of_stock'
            ? 'Out of Stock'
            : stockLevel.level === 'low_stock'
              ? 'Low Stock Alert'
              : 'Stock Status'}
        </AlertTitle>
        {stockLevel.message}
      </Alert>
    );
  }

  if (variant === 'badge') {
    return (
      <Badge
        color={stockLevel.color}
        variant="dot"
        sx={{
          '& .MuiBadge-badge': {
            animation:
              stockLevel.severity === 'critical' ? 'pulse 2s infinite' : 'none',
            '@keyframes pulse': {
              '0%': { transform: 'scale(1)' },
              '50%': { transform: 'scale(1.2)' },
              '100%': { transform: 'scale(1)' },
            },
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {showIcon && (
            <Box
              component="span"
              sx={{
                color: getIconColor(),
                display: 'flex',
                alignItems: 'center',
                fontSize: size === 'small' ? '16px' : '20px',
              }}
            >
              {getIcon()}
            </Box>
          )}
          <Typography
            variant={size === 'small' ? 'caption' : 'body2'}
            color="text.secondary"
            sx={{
              fontWeight:
                stockLevel.severity === 'critical' ? 'bold' : 'normal',
            }}
          >
            {stockLevel.message}
          </Typography>
        </Box>
      </Badge>
    );
  }

  return null;
};

export default StockWarning;
