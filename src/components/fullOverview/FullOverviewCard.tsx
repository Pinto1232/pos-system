import React from 'react';
import { Box, Divider, Typography, Chip, Tooltip, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  StyledCard,
  TopLeftBadge,
  TopRightIcon,
  CardTitle,
  CardSubTitle,
  BottomRightImage,
  PriceText,
  CardButton,
  InfoLines,
  StatusIndicator,
} from './fullOverviewCard.styles';
import { FullOverviewCardProps } from './fullOverviewCard.types';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';

const CardContent = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  background: 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(10px)',
  borderRadius: '12px',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
});

const CardHeader = styled(Box)({
  padding: '16px',
  background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.05), rgba(124, 58, 237, 0.05))',
  borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
});

const CardBody = styled(Box)({
  padding: '16px',
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
});

const CardFooter = styled(Box)({
  padding: '16px',
  background: 'rgba(249, 250, 251, 0.8)',
  borderTop: '1px solid rgba(0, 0, 0, 0.05)',
});

const DetailRow = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '8px',
  borderRadius: '8px',
  background: 'rgba(249, 250, 251, 0.5)',
  transition: 'all 0.2s ease',
  '&:hover': {
    background: 'rgba(249, 250, 251, 0.8)',
    transform: 'translateX(4px)',
  },
});

const TagWrapper = styled(Box)({
  display: 'flex',
  gap: '8px',
  flexWrap: 'wrap',
});

const StyledTag = styled(Chip)({
  background: 'rgba(79, 70, 229, 0.08)',
  color: '#4F46E5',
  fontWeight: 500,
  fontSize: '0.75rem',
  height: '24px',
  '& .MuiChip-label': {
    padding: '0 8px',
  },
  '&:hover': {
    background: 'rgba(79, 70, 229, 0.12)',
  },
});

const FullOverviewCard: React.FC<FullOverviewCardProps & { viewMode: 'grid' | 'list' }> = ({
  variant,
  topLeftLabel,
  topRightIcon,
  title,
  subTitle,
  details,
  price,
  ctaText,
  imageUrl,
  bankName,
  bankType,
  cardNumber,
  cardHolder,
  cardExpire,
  totalBalance,
  cost,
  receipts,
  BankCardRowDetail,
  trend,
  chartData,
  notificationType,
  notificationTime,
  onClick,
  tags,
  status,
  viewMode,
}) => {
  const renderNotificationIcon = () => {
    switch (notificationType) {
      case 'success':
        return <CheckCircleIcon sx={{ color: '#ffffff' }} />;
      case 'warning':
        return <WarningIcon sx={{ color: '#ffffff' }} />;
      case 'error':
        return <ErrorIcon sx={{ color: '#EF4444' }} />;
      case 'info':
        return <InfoIcon sx={{ color: '#3B82F6' }} />;
      default:
        return null;
    }
  };

  const renderStatusIndicator = () => {
    if (!status) return null;
    const color = status === 'active' ? '#10B981' : status === 'pending' ? '#F59E0B' : '#EF4444';

    return (
      <Tooltip title={status.charAt(0).toUpperCase() + status.slice(1)}>
        <StatusIndicator
          sx={{
            '&::before': {
              background: color,
              opacity: 0.2,
            },
            '&::after': {
              background: color,
            },
          }}
        />
      </Tooltip>
    );
  };

  if (viewMode === 'list') {
    return (
      <StyledCard>
        <CardContent>
          <CardHeader>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: '#1F2937',
                    marginBottom: 0.5,
                  }}
                >
                  {title}
                </Typography>
                {subTitle && (
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#6B7280',
                      fontSize: '0.875rem',
                    }}
                  >
                    {subTitle}
                  </Typography>
                )}
              </Box>
              {topRightIcon && <TopRightIcon>{topRightIcon}</TopRightIcon>}
            </Box>
          </CardHeader>
          <CardBody>
            {details &&
              details.map((detail, index) => (
                <DetailRow key={index}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#4B5563',
                      fontSize: '0.875rem',
                    }}
                  >
                    {detail}
                  </Typography>
                </DetailRow>
              ))}
          </CardBody>
          <CardFooter>
            <TagWrapper>
              {tags && tags.map((tag, index) => <StyledTag key={index} label={tag} size="small" />)}
            </TagWrapper>
          </CardFooter>
        </CardContent>
      </StyledCard>
    );
  }

  if (variant === 'bankCard') {
    return (
      <StyledCard
        onClick={onClick}
        sx={{
          cursor: onClick ? 'pointer' : 'default',
          background: 'linear-gradient(145deg, #ffffff, #f8f9fa)',
          boxShadow: '0 3px 8px rgba(0, 0, 0, 0.04)',
          transition: 'all 0.3s ease',
          p: { xs: 1, sm: 1.25, md: 1.5 },
          borderRadius: { xs: '6px', sm: '7px', md: '8px' },
          position: 'relative',
          overflow: 'hidden',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.06)',
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: { xs: 0.75, sm: 0.875, md: 1 },
            height: '100%',
          }}
        >
          {/* Header Section */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: { xs: 0.25, sm: 0.375, md: 0.5 },
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontSize: { xs: '0.8rem', sm: '0.85rem', md: '0.9rem' },
                fontWeight: 700,
                color: '#1F2937',
              }}
            >
              {title}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: { xs: 0.25, sm: 0.375, md: 0.5 },
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: '#6B7280',
                  fontSize: { xs: '0.6rem', sm: '0.625rem', md: '0.65rem' },
                  fontWeight: 500,
                  background: 'rgba(107, 114, 128, 0.1)',
                  px: { xs: 0.4, sm: 0.45, md: 0.5 },
                  py: { xs: 0.2, sm: 0.225, md: 0.25 },
                  borderRadius: { xs: '3px', sm: '3.5px', md: '4px' },
                }}
              >
                {bankType}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: '#6B7280',
                  fontSize: { xs: '0.6rem', sm: '0.625rem', md: '0.65rem' },
                  fontWeight: 500,
                  background: 'rgba(107, 114, 128, 0.1)',
                  px: { xs: 0.4, sm: 0.45, md: 0.5 },
                  py: { xs: 0.2, sm: 0.225, md: 0.25 },
                  borderRadius: { xs: '3px', sm: '3.5px', md: '4px' },
                }}
              >
                {bankName}
              </Typography>
            </Box>
          </Box>

          {/* Card Preview */}
          <Box
            sx={{
              background: 'linear-gradient(105deg, #000, #3B82F6)',
              borderRadius: { xs: '6px', sm: '7px', md: '8px' },
              p: { xs: 1, sm: 1.25, md: 1.5 },
              color: '#fff',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                right: 0,
                width: { xs: '60px', sm: '65px', md: '70px' },
                height: { xs: '60px', sm: '65px', md: '70px' },
                background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                borderRadius: '50%',
              },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: { xs: 0.75, sm: 0.875, md: 1 },
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontSize: { xs: '0.75rem', sm: '0.775rem', md: '0.8rem' },
                  fontWeight: 600,
                  color: 'rgba(255, 255, 255, 0.9)',
                }}
              >
                {bankName}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: { xs: '0.6rem', sm: '0.625rem', md: '0.65rem' },
                }}
              >
                {bankType}
              </Typography>
            </Box>
            <Typography
              variant="h5"
              sx={{
                letterSpacing: { xs: '1px', sm: '1.25px', md: '1.5px' },
                fontWeight: 700,
                fontSize: { xs: '0.8rem', sm: '0.85rem', md: '0.9rem' },
                mb: { xs: 0.75, sm: 0.875, md: 1 },
                color: '#fff',
              }}
            >
              {cardNumber}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: { xs: '0.6rem', sm: '0.625rem', md: '0.65rem' },
                    mb: 0.25,
                    display: 'block',
                  }}
                >
                  Card Holder
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#fff',
                    fontSize: { xs: '0.7rem', sm: '0.725rem', md: '0.75rem' },
                    fontWeight: 600,
                  }}
                >
                  {cardHolder}
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: { xs: '0.6rem', sm: '0.625rem', md: '0.65rem' },
                    mb: 0.25,
                    display: 'block',
                  }}
                >
                  Expires
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#fff',
                    fontSize: { xs: '0.7rem', sm: '0.725rem', md: '0.75rem' },
                    fontWeight: 600,
                  }}
                >
                  {cardExpire}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Balance Section */}
          <Box
            sx={{
              background: 'rgba(107, 114, 128, 0.05)',
              borderRadius: { xs: '4px', sm: '5px', md: '6px' },
              p: { xs: 0.75, sm: 0.875, md: 1 },
              mt: { xs: 0.25, sm: 0.375, md: 0.5 },
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                color: '#6B7280',
                fontSize: { xs: '0.7rem', sm: '0.725rem', md: '0.75rem' },
                fontWeight: 600,
                mb: { xs: 0.25, sm: 0.375, md: 0.5 },
              }}
            >
              Total Balance
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: '#1F2937',
                fontSize: { xs: '1rem', sm: '1.05rem', md: '1.1rem' },
                fontWeight: 700,
                mb: { xs: 0.75, sm: 0.875, md: 1 },
              }}
            >
              {totalBalance}
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: { xs: 0.5, sm: 0.625, md: 0.75 },
              }}
            >
              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: '#6B7280',
                    fontSize: { xs: '0.6rem', sm: '0.625rem', md: '0.65rem' },
                    display: 'block',
                    mb: 0.25,
                  }}
                >
                  Cost
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#1F2937',
                    fontSize: { xs: '0.7rem', sm: '0.725rem', md: '0.75rem' },
                    fontWeight: 600,
                  }}
                >
                  {cost}
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: '#6B7280',
                    fontSize: { xs: '0.6rem', sm: '0.625rem', md: '0.65rem' },
                    display: 'block',
                    mb: 0.25,
                  }}
                >
                  Receipts
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#1F2937',
                    fontSize: { xs: '0.7rem', sm: '0.725rem', md: '0.75rem' },
                    fontWeight: 600,
                  }}
                >
                  {receipts}
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: '#6B7280',
                    fontSize: { xs: '0.6rem', sm: '0.625rem', md: '0.65rem' },
                    display: 'block',
                    mb: 0.25,
                  }}
                >
                  Details
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#1F2937',
                    fontSize: { xs: '0.7rem', sm: '0.725rem', md: '0.75rem' },
                    fontWeight: 600,
                  }}
                >
                  {BankCardRowDetail}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Action Button */}
          <Button
            variant="contained"
            size="small"
            sx={{
              background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
              color: '#fff',
              textTransform: 'none',
              fontSize: { xs: '0.7rem', sm: '0.725rem', md: '0.75rem' },
              fontWeight: 600,
              px: { xs: 1.25, sm: 1.375, md: 1.5 },
              py: { xs: 0.4, sm: 0.45, md: 0.5 },
              borderRadius: { xs: '3px', sm: '3.5px', md: '4px' },
              boxShadow: '0 2px 6px rgba(79, 70, 229, 0.2)',
              transition: 'all 0.2s ease',
              mt: 'auto',
              '&:hover': {
                transform: 'translateY(-1px)',
                boxShadow: '0 3px 8px rgba(79, 70, 229, 0.3)',
                background: 'linear-gradient(135deg, #4338CA, #6D28D9)',
              },
            }}
          >
            {ctaText}
          </Button>
        </Box>
      </StyledCard>
    );
  }

  if (variant === 'notification') {
    return (
      <StyledCard
        onClick={onClick}
        sx={{
          cursor: onClick ? 'pointer' : 'default',
          background: 'linear-gradient(145deg, #ffffff, #f8f9fa)',
          boxShadow: '0 6px 15px rgba(0, 0, 0, 0.08)',
          transition: 'all 0.3s ease',
          p: 1.5,
          borderRadius: '10px',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background:
              notificationType === 'success'
                ? 'linear-gradient(90deg, #86efac, #4ade80)'
                : notificationType === 'warning'
                  ? 'linear-gradient(90deg, #fca5a5, #f87171)'
                  : notificationType === 'error'
                    ? 'linear-gradient(90deg, #fecaca, #f87171)'
                    : 'linear-gradient(90deg, #6b7280, #9ca3af)',
          },
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
            '& .card-content': {
              transform: 'scale(1.02)',
            },
          },
        }}
      >
        <Box
          className="card-content"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            height: '100%',
            transition: 'transform 0.3s ease',
          }}
        >
          {/* Header Section */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 1,
              width: '100%',
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -8,
                left: 0,
                right: 0,
                height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.1), transparent)',
              },
            }}
          >
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '10px',
                background:
                  notificationType === 'success'
                    ? 'linear-gradient(135deg, #86efac, #4ade80)'
                    : notificationType === 'warning'
                      ? 'linear-gradient(135deg, #fca5a5, #f87171)'
                      : notificationType === 'error'
                        ? 'linear-gradient(135deg, #fecaca, #f87171)'
                        : 'linear-gradient(135deg, #6b7280, #9ca3af)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                position: 'relative',
                flexShrink: 0,
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0))',
                },
              }}
            >
              {renderNotificationIcon()}
            </Box>
            <Box sx={{ flex: 1 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 0.5,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <CardTitle
                    sx={{
                      color:
                        notificationType === 'success'
                          ? '#166534'
                          : notificationType === 'warning'
                            ? '#991b1b'
                            : notificationType === 'error'
                              ? '#991b1b'
                              : '#1f2937',
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      letterSpacing: '-0.01em',
                      position: 'relative',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: -2,
                        left: 0,
                        width: '100%',
                        height: '2px',
                        background:
                          notificationType === 'success'
                            ? 'linear-gradient(90deg, #86efac, transparent)'
                            : notificationType === 'warning'
                              ? 'linear-gradient(90deg, #fca5a5, transparent)'
                              : notificationType === 'error'
                                ? 'linear-gradient(90deg, #fecaca, transparent)'
                                : 'linear-gradient(90deg, #6b7280, transparent)',
                        transform: 'scaleX(0)',
                        transformOrigin: 'left',
                        transition: 'transform 0.3s ease',
                      },
                      '&:hover::after': {
                        transform: 'scaleX(1)',
                      },
                    }}
                  >
                    {title}
                  </CardTitle>
                  {renderStatusIndicator()}
                </Box>
                {notificationTime && (
                  <Typography
                    variant="caption"
                    sx={{
                      color:
                        notificationType === 'success'
                          ? '#166534'
                          : notificationType === 'warning'
                            ? '#991b1b'
                            : notificationType === 'error'
                              ? '#991b1b'
                              : '#6b7280',
                      fontSize: '0.65rem',
                      fontWeight: 500,
                      background:
                        notificationType === 'success'
                          ? 'rgba(34, 197, 94, 0.1)'
                          : notificationType === 'warning'
                            ? 'rgba(248, 113, 113, 0.1)'
                            : notificationType === 'error'
                              ? 'rgba(248, 113, 113, 0.1)'
                              : 'rgba(107, 114, 128, 0.1)',
                      px: 1,
                      py: 0.5,
                      borderRadius: '6px',
                      backdropFilter: 'blur(4px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        transform: 'scale(1.05)',
                      },
                    }}
                  >
                    {notificationTime}
                  </Typography>
                )}
              </Box>
              {subTitle && (
                <CardSubTitle
                  sx={{
                    color:
                      notificationType === 'success'
                        ? '#166534'
                        : notificationType === 'warning'
                          ? '#991b1b'
                          : notificationType === 'error'
                            ? '#991b1b'
                            : '#6b7280',
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    opacity: 0.8,
                  }}
                >
                  {subTitle}
                </CardSubTitle>
              )}
            </Box>
          </Box>

          {/* Tags Section */}
          {tags && tags.length > 0 && (
            <Box
              sx={{
                display: 'flex',
                gap: 0.75,
                flexWrap: 'wrap',
                mt: 1,
              }}
            >
              {tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  size="small"
                  sx={{
                    background:
                      notificationType === 'success'
                        ? 'rgba(34, 197, 94, 0.1)'
                        : notificationType === 'warning'
                          ? 'rgba(248, 113, 113, 0.1)'
                          : notificationType === 'error'
                            ? 'rgba(248, 113, 113, 0.1)'
                            : 'rgba(107, 114, 128, 0.1)',
                    color:
                      notificationType === 'success'
                        ? '#166534'
                        : notificationType === 'warning'
                          ? '#991b1b'
                          : notificationType === 'error'
                            ? '#991b1b'
                            : '#6b7280',
                    fontSize: '0.65rem',
                    fontWeight: 600,
                    height: '20px',
                    backdropFilter: 'blur(4px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-1px)',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    },
                    '& .MuiChip-label': {
                      px: 1,
                    },
                  }}
                />
              ))}
            </Box>
          )}

          {/* Details Section */}
          {details && details.length > 0 && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                background:
                  notificationType === 'success'
                    ? 'rgba(34, 197, 94, 0.05)'
                    : notificationType === 'warning'
                      ? 'rgba(248, 113, 113, 0.05)'
                      : notificationType === 'error'
                        ? 'rgba(248, 113, 113, 0.05)'
                        : 'rgba(107, 114, 128, 0.05)',
                p: 1.5,
                borderRadius: '10px',
                border:
                  notificationType === 'success'
                    ? '1px solid rgba(34, 197, 94, 0.1)'
                    : notificationType === 'warning'
                      ? '1px solid rgba(248, 113, 113, 0.1)'
                      : notificationType === 'error'
                        ? '1px solid rgba(248, 113, 113, 0.1)'
                        : '1px solid rgba(107, 114, 128, 0.1)',
                backdropFilter: 'blur(8px)',
                flex: 1,
              }}
            >
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: 1,
                  width: '100%',
                }}
              >
                {details.map((line, i) => (
                  <Box
                    key={i}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 0.25,
                      p: 1,
                      background: 'rgba(255, 255, 255, 0.7)',
                      borderRadius: '6px',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      transition: 'all 0.2s ease',
                      minHeight: '60px',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                        background: 'rgba(255, 255, 255, 0.9)',
                      },
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color:
                          notificationType === 'success'
                            ? '#166534'
                            : notificationType === 'warning'
                              ? '#991b1b'
                              : notificationType === 'error'
                                ? '#991b1b'
                                : '#6b7280',
                        fontSize: '0.6rem',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        opacity: 0.8,
                        mb: 0.25,
                      }}
                    >
                      {line.split(':')[0]}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color:
                          notificationType === 'success'
                            ? '#166534'
                            : notificationType === 'warning'
                              ? '#991b1b'
                              : notificationType === 'error'
                                ? '#991b1b'
                                : '#1f2937',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        lineHeight: 1.2,
                        wordBreak: 'break-word',
                      }}
                    >
                      {line.split(':')[1]}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          {/* Action Buttons */}
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              mt: 'auto',
              pt: 1.5,
            }}
          >
            <Button
              variant="contained"
              size="small"
              sx={{
                background:
                  notificationType === 'success'
                    ? 'linear-gradient(135deg, #22c55e, #4ade80)'
                    : notificationType === 'warning'
                      ? 'linear-gradient(135deg, #f87171, #ef4444)'
                      : notificationType === 'error'
                        ? 'linear-gradient(135deg, #f87171, #ef4444)'
                        : 'linear-gradient(135deg, #6b7280, #9ca3af)',
                color: '#fff',
                textTransform: 'none',
                fontSize: '0.8rem',
                fontWeight: 600,
                px: 2,
                py: 0.75,
                borderRadius: '4px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)',
                  background:
                    notificationType === 'success'
                      ? 'linear-gradient(135deg, #16a34a, #22c55e)'
                      : notificationType === 'warning'
                        ? 'linear-gradient(135deg, #dc2626, #ef4444)'
                        : notificationType === 'error'
                          ? 'linear-gradient(135deg, #dc2626, #ef4444)'
                          : 'linear-gradient(135deg, #4b5563, #6b7280)',
                },
              }}
            >
              {notificationType === 'success'
                ? 'View Order'
                : notificationType === 'warning'
                  ? 'Restock Now'
                  : notificationType === 'error'
                    ? 'Retry Payment'
                    : 'View Details'}
            </Button>
            <Button
              variant="outlined"
              size="small"
              sx={{
                borderColor:
                  notificationType === 'success'
                    ? 'rgba(34, 197, 94, 0.3)'
                    : notificationType === 'warning'
                      ? 'rgba(248, 113, 113, 0.3)'
                      : notificationType === 'error'
                        ? 'rgba(248, 113, 113, 0.3)'
                        : 'rgba(107, 114, 128, 0.3)',
                color:
                  notificationType === 'success'
                    ? '#166534'
                    : notificationType === 'warning'
                      ? '#991b1b'
                      : notificationType === 'error'
                        ? '#991b1b'
                        : '#6b7280',
                textTransform: 'none',
                fontSize: '0.8rem',
                fontWeight: 500,
                px: 2,
                py: 0.75,
                borderRadius: '4px',
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  borderColor:
                    notificationType === 'success'
                      ? '#22c55e'
                      : notificationType === 'warning'
                        ? '#f87171'
                        : notificationType === 'error'
                          ? '#f87171'
                          : '#6b7280',
                  background:
                    notificationType === 'success'
                      ? 'rgba(34, 197, 94, 0.05)'
                      : notificationType === 'warning'
                        ? 'rgba(248, 113, 113, 0.05)'
                        : notificationType === 'error'
                          ? 'rgba(248, 113, 113, 0.05)'
                          : 'rgba(107, 114, 128, 0.05)',
                },
              }}
            >
              {notificationType === 'success'
                ? 'Track Order'
                : notificationType === 'warning'
                  ? 'View Details'
                  : notificationType === 'error'
                    ? 'Contact Support'
                    : 'Learn More'}
            </Button>
          </Box>
        </Box>
      </StyledCard>
    );
  }

  if (variant === 'analytics') {
    return (
      <StyledCard
        onClick={onClick}
        sx={{
          cursor: onClick ? 'pointer' : 'default',
          background: 'linear-gradient(145deg, #ffffff, #f8f9fa)',
          boxShadow: '0 3px 8px rgba(0, 0, 0, 0.04)',
          transition: 'all 0.3s ease',
          p: { xs: 1, sm: 1.25, md: 1.5 },
          borderRadius: { xs: '6px', sm: '7px', md: '8px' },
          position: 'relative',
          overflow: 'hidden',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.06)',
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: { xs: 0.75, sm: 0.875, md: 1 },
            height: '100%',
          }}
        >
          {/* Header Section */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: { xs: 0.25, sm: 0.375, md: 0.5 },
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontSize: { xs: '0.8rem', sm: '0.85rem', md: '0.9rem' },
                fontWeight: 700,
                color: '#1F2937',
              }}
            >
              {title}
            </Typography>
            {trend && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  color: trend.direction === 'up' ? '#10B981' : '#EF4444',
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: { xs: '0.6rem', sm: '0.625rem', md: '0.65rem' },
                    fontWeight: 600,
                  }}
                >
                  {trend.direction === 'up' ? '↑' : '↓'} {trend.value}%
                </Typography>
              </Box>
            )}
          </Box>

          {subTitle && (
            <Typography
              variant="body2"
              sx={{
                color: '#6B7280',
                fontSize: { xs: '0.65rem', sm: '0.675rem', md: '0.7rem' },
                mb: { xs: 0.5, sm: 0.625, md: 0.75 },
              }}
            >
              {subTitle}
            </Typography>
          )}

          {/* Chart Section */}
          {chartData && (
            <Box
              sx={{
                height: { xs: 80, sm: 90, md: 100 },
                position: 'relative',
                mb: { xs: 0.75, sm: 0.875, md: 1 },
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  height: '100%',
                  gap: { xs: 0.5, sm: 0.625, md: 0.75 },
                }}
              >
                {chartData.values.map((value, index) => {
                  const maxValue = Math.max(...chartData.values);
                  const height = (value / maxValue) * 100;
                  return (
                    <Box
                      key={index}
                      sx={{
                        flex: 1,
                        height: `${height}%`,
                        background: 'linear-gradient(to top, #4F46E5, #7C3AED)',
                        borderRadius: { xs: '2px', sm: '3px', md: '4px' },
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.05)',
                          background: 'linear-gradient(to top, #4338CA, #6D28D9)',
                        },
                      }}
                    />
                  );
                })}
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  mt: 0.5,
                }}
              >
                {chartData.labels.map((label, index) => (
                  <Typography
                    key={index}
                    variant="caption"
                    sx={{
                      fontSize: { xs: '0.55rem', sm: '0.575rem', md: '0.6rem' },
                      color: '#6B7280',
                      textAlign: 'center',
                      flex: 1,
                    }}
                  >
                    {label}
                  </Typography>
                ))}
              </Box>
            </Box>
          )}

          {/* Metrics Grid */}
          {details && (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: { xs: 0.5, sm: 0.625, md: 0.75 },
              }}
            >
              {details.map((detail, index) => (
                <Box
                  key={index}
                  sx={{
                    background: 'rgba(107, 114, 128, 0.05)',
                    borderRadius: { xs: '4px', sm: '5px', md: '6px' },
                    p: { xs: 0.5, sm: 0.625, md: 0.75 },
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-1px)',
                      background: 'rgba(107, 114, 128, 0.08)',
                    },
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#6B7280',
                      fontSize: { xs: '0.6rem', sm: '0.625rem', md: '0.65rem' },
                      display: 'block',
                      mb: 0.25,
                    }}
                  >
                    {detail.split(':')[0]}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#1F2937',
                      fontSize: { xs: '0.7rem', sm: '0.725rem', md: '0.75rem' },
                      fontWeight: 600,
                    }}
                  >
                    {detail.split(':')[1]}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}

          {/* Tags */}
          {tags && tags.length > 0 && (
            <Box
              sx={{
                display: 'flex',
                gap: 0.5,
                mt: 'auto',
                pt: { xs: 0.5, sm: 0.625, md: 0.75 },
              }}
            >
              {tags.map((tag, index) => (
                <Typography
                  key={index}
                  variant="caption"
                  sx={{
                    color: '#4F46E5',
                    fontSize: { xs: '0.6rem', sm: '0.625rem', md: '0.65rem' },
                    background: 'rgba(79, 70, 229, 0.1)',
                    px: { xs: 0.4, sm: 0.45, md: 0.5 },
                    py: { xs: 0.2, sm: 0.225, md: 0.25 },
                    borderRadius: { xs: '3px', sm: '3.5px', md: '4px' },
                  }}
                >
                  {tag}
                </Typography>
              ))}
            </Box>
          )}
        </Box>
      </StyledCard>
    );
  }

  return (
    <StyledCard onClick={onClick} sx={{ cursor: onClick ? 'pointer' : 'default' }}>
      {topLeftLabel && <TopLeftBadge>{topLeftLabel}</TopLeftBadge>}
      {topRightIcon && <TopRightIcon>{topRightIcon}</TopRightIcon>}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <CardTitle>{title}</CardTitle>
        {renderStatusIndicator()}
      </Box>
      {subTitle && <CardSubTitle>{subTitle}</CardSubTitle>}
      {details && details.length > 0 && (
        <InfoLines>
          {details.map((line, i) => (
            <Typography
              variant="body2"
              key={i}
              sx={{
                py: 0.5,
                fontWeight: 500,
                fontSize: '0.9rem',
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
              }}
            >
              <span>{line.split(':')[0]}:</span>
              <span style={{ fontWeight: 600 }}>{line.split(':')[1]}</span>
            </Typography>
          ))}
        </InfoLines>
      )}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          mt: 2,
        }}
      >
        {price && <PriceText>{price}</PriceText>}
        {ctaText && (
          <CardButton variant="text" color="primary">
            {ctaText}
          </CardButton>
        )}
      </Box>
      <Divider
        sx={{
          mt: 2,
          mb: 2,
          width: '100%',
          opacity: 0.6,
          background:
            'linear-gradient(to right, rgba(79, 70, 229, 0.1), rgba(124, 58, 237, 0.3), rgba(79, 70, 229, 0.1))',
        }}
        flexItem
      />
      {imageUrl && (
        <BottomRightImage
          src={imageUrl}
          alt="preview"
          style={{
            transform: 'rotate(15deg)',
            width: '190px',
            height: '175px',
            marginRight: '-30px',
            top: 150,
            left: 360,
            right: 0,
            objectFit: 'cover',
            borderRadius: 24,
            zIndex: 1,
            filter: 'drop-shadow(0 10px 15px rgba(0, 0, 0, 0.1))',
          }}
        />
      )}
      {tags && tags.length > 0 && (
        <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {tags.map((tag, i) => (
            <Chip
              key={i}
              label={tag}
              size="small"
              sx={{
                background: 'rgba(79, 70, 229, 0.1)',
                color: '#4F46E5',
                fontWeight: 500,
              }}
            />
          ))}
        </Box>
      )}
    </StyledCard>
  );
};

export default FullOverviewCard;
