import React from "react";
import { Box, Divider, Typography, Chip, Tooltip, LinearProgress, Button } from "@mui/material";
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
  BankCardContainer,
  BankCardRow,
  BankCardNumber,
  BankCardHeader,
  StatusIndicator,
} from "./fullOverviewCard.styles";
import { FullOverviewCardProps } from "./fullOverviewCard.types";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningIcon from "@mui/icons-material/Warning";
import ErrorIcon from "@mui/icons-material/Error";
import InfoIcon from "@mui/icons-material/Info";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const FullOverviewCard: React.FC<FullOverviewCardProps> = (props) => {
  const {
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
    notificationIcon,
    onClick,
    isActive,
    tags,
    status,
  } = props;

  const renderNotificationIcon = () => {
    switch (notificationType) {
      case "success":
        return <CheckCircleIcon sx={{ color: "#ffffff" }} />;
      case "warning":
        return <WarningIcon sx={{ color: "#ffffff" }} />;
      case "error":
        return <ErrorIcon sx={{ color: "#EF4444" }} />;
      case "info":
        return <InfoIcon sx={{ color: "#3B82F6" }} />;
      default:
        return null;
    }
  };

  const renderTrend = () => {
    if (!trend) return null;
    const Icon = trend.direction === "up" ? TrendingUpIcon : TrendingDownIcon;
    const color = trend.direction === "up" ? "#10B981" : "#EF4444";

    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Icon sx={{ color }} />
        <Typography variant="body2" sx={{ color, fontWeight: 600 }}>
          {trend.value}%
        </Typography>
      </Box>
    );
  };

  const renderStatusIndicator = () => {
    if (!status) return null;
    const color = status === "active" ? "#10B981" : status === "pending" ? "#F59E0B" : "#EF4444";

    return (
      <Tooltip title={status.charAt(0).toUpperCase() + status.slice(1)}>
        <StatusIndicator
          sx={{
            "&::before": {
              background: color,
              opacity: 0.2,
            },
            "&::after": {
              background: color,
            },
          }}
        />
      </Tooltip>
    );
  };

  const renderChart = () => {
    if (!chartData) return null;

    const maxValue = Math.max(...chartData.values);
    const minValue = Math.min(...chartData.values);
    const range = maxValue - minValue;
    const barHeight = 100; // Maximum height of bars in pixels

    return (
      <Box sx={{ mt: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: barHeight }}>
          {chartData.values.map((value, index) => {
            const height = ((value - minValue) / range) * barHeight;
            return (
              <Tooltip key={index} title={`${chartData.labels[index]}: ${value}`}>
                <Box
                  sx={{
                    width: '30px',
                    height: `${height}px`,
                    background: 'linear-gradient(to top, #4F46E5, #7C3AED)',
                    borderRadius: '4px 4px 0 0',
                    transition: 'height 0.3s ease',
                    '&:hover': {
                      background: 'linear-gradient(to top, #4338CA, #6D28D9)',
                    },
                  }}
                />
              </Tooltip>
            );
          })}
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
          {chartData.labels.map((label, index) => (
            <Typography
              key={index}
              variant="caption"
              sx={{
                width: '30px',
                textAlign: 'center',
                color: '#6B7280',
                fontSize: '0.7rem',
              }}
            >
              {label}
            </Typography>
          ))}
        </Box>
      </Box>
    );
  };

  const renderGrowthMetric = (label: string, value: string, icon: React.ReactNode) => (
    <Box sx={{
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      p: 1,
      background: 'rgba(79, 70, 229, 0.05)',
      borderRadius: '8px',
      transition: 'all 0.3s ease',
      width: '100%',
      gap: 1,
      '&:hover': {
        background: 'rgba(79, 70, 229, 0.1)',
        transform: 'translateY(-2px)',
      }
    }}>
      <Box sx={{
        width: 24,
        height: 24,
        borderRadius: '6px',
        background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        flexShrink: 0
      }}>
        {icon}
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <Typography variant="body2" sx={{
          color: '#6B7280',
          fontSize: '0.7rem',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {label}
        </Typography>
        <Typography variant="body2" sx={{
          fontWeight: 600,
          color: '#1F2937',
          fontSize: '0.8rem',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {value}
        </Typography>
      </Box>
    </Box>
  );

  if (variant === "bankCard") {
    return (
      <StyledCard onClick={onClick} sx={{ cursor: onClick ? "pointer" : "default" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 700,
              color: "#1F2937",
              fontSize: "1.1rem",
              letterSpacing: "-0.01em",
            }}
          >
            {title}
          </Typography>
          {ctaText && (
            <CardButton variant="outlined" size="small">
              {ctaText}
            </CardButton>
          )}
        </Box>
        <BankCardContainer>
          <BankCardHeader>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{bankName}</Typography>
            <Typography variant="subtitle2" sx={{ opacity: 0.9 }}>{bankType}</Typography>
          </BankCardHeader>
          <BankCardNumber variant="body1">{cardNumber}</BankCardNumber>
          <BankCardRow>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>{cardHolder}</Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>{cardExpire}</Typography>
          </BankCardRow>
        </BankCardContainer>
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 700,
            mb: 1.5,
            fontSize: "1rem",
            letterSpacing: "0.01em",
            color: "#1F2937"
          }}
        >
          Total balance {totalBalance}
        </Typography>
        <InfoLines sx={{ mt: 1 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
              fontSize: "0.9rem",
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              py: 0.5
            }}
          >
            <span>Cost</span> <span>{cost}</span>
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
              fontSize: "0.9rem",
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              py: 0.5
            }}
          >
            <span>Receipts</span> <span>{receipts}</span>
          </Typography>
          {BankCardRowDetail && (
            <Typography
              variant="body2"
              sx={{
                fontWeight: 500,
                fontSize: "0.9rem",
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                py: 0.5
              }}
            >
              <span>Details</span> <span>{BankCardRowDetail}</span>
            </Typography>
          )}
        </InfoLines>
      </StyledCard>
    );
  }

  if (variant === "notification") {
    return (
      <StyledCard onClick={onClick} sx={{
        cursor: onClick ? "pointer" : "default",
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
          background: notificationType === "success"
            ? "linear-gradient(90deg, #86efac, #4ade80)"
            : notificationType === "warning"
              ? "linear-gradient(90deg, #fca5a5, #f87171)"
              : notificationType === "error"
                ? "linear-gradient(90deg, #fecaca, #f87171)"
                : "linear-gradient(90deg, #6b7280, #9ca3af)",
        },
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
          '& .card-content': {
            transform: 'scale(1.02)',
          }
        }
      }}>
        <Box className="card-content" sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
          height: "100%",
          transition: 'transform 0.3s ease',
        }}>
          {/* Header Section */}
          <Box sx={{
            display: "flex",
            alignItems: "flex-start",
            gap: 1,
            width: "100%",
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: -8,
              left: 0,
              right: 0,
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.1), transparent)',
            }
          }}>
            <Box sx={{
              width: 36,
              height: 36,
              borderRadius: '10px',
              background: notificationType === "success"
                ? "linear-gradient(135deg, #86efac, #4ade80)"
                : notificationType === "warning"
                  ? "linear-gradient(135deg, #fca5a5, #f87171)"
                  : notificationType === "error"
                    ? "linear-gradient(135deg, #fecaca, #f87171)"
                    : "linear-gradient(135deg, #6b7280, #9ca3af)",
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
              }
            }}>
              {renderNotificationIcon()}
            </Box>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <CardTitle sx={{
                    color: notificationType === "success"
                      ? "#166534"
                      : notificationType === "warning"
                        ? "#991b1b"
                        : notificationType === "error"
                          ? "#991b1b"
                          : "#1f2937",
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
                      background: notificationType === "success"
                        ? "linear-gradient(90deg, #86efac, transparent)"
                        : notificationType === "warning"
                          ? "linear-gradient(90deg, #fca5a5, transparent)"
                          : notificationType === "error"
                            ? "linear-gradient(90deg, #fecaca, transparent)"
                            : "linear-gradient(90deg, #6b7280, transparent)",
                      transform: 'scaleX(0)',
                      transformOrigin: 'left',
                      transition: 'transform 0.3s ease',
                    },
                    '&:hover::after': {
                      transform: 'scaleX(1)',
                    }
                  }}>
                    {title}
                  </CardTitle>
                  {renderStatusIndicator()}
                </Box>
                {notificationTime && (
                  <Typography variant="caption" sx={{
                    color: notificationType === "success"
                      ? "#166534"
                      : notificationType === "warning"
                        ? "#991b1b"
                        : notificationType === "error"
                          ? "#991b1b"
                          : "#6b7280",
                    fontSize: '0.65rem',
                    fontWeight: 500,
                    background: notificationType === "success"
                      ? "rgba(34, 197, 94, 0.1)"
                      : notificationType === "warning"
                        ? "rgba(248, 113, 113, 0.1)"
                        : notificationType === "error"
                          ? "rgba(248, 113, 113, 0.1)"
                          : "rgba(107, 114, 128, 0.1)",
                    px: 1,
                    py: 0.5,
                    borderRadius: '6px',
                    backdropFilter: 'blur(4px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    }
                  }}>
                    {notificationTime}
                  </Typography>
                )}
              </Box>
              {subTitle && (
                <CardSubTitle sx={{
                  color: notificationType === "success"
                    ? "#166534"
                    : notificationType === "warning"
                      ? "#991b1b"
                      : notificationType === "error"
                        ? "#991b1b"
                        : "#6b7280",
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  opacity: 0.8
                }}>
                  {subTitle}
                </CardSubTitle>
              )}
            </Box>
          </Box>

          {/* Tags Section */}
          {tags && tags.length > 0 && (
            <Box sx={{
              display: 'flex',
              gap: 0.75,
              flexWrap: 'wrap',
              mt: 1
            }}>
              {tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  size="small"
                  sx={{
                    background: notificationType === "success"
                      ? "rgba(34, 197, 94, 0.1)"
                      : notificationType === "warning"
                        ? "rgba(248, 113, 113, 0.1)"
                        : notificationType === "error"
                          ? "rgba(248, 113, 113, 0.1)"
                          : "rgba(107, 114, 128, 0.1)",
                    color: notificationType === "success"
                      ? "#166534"
                      : notificationType === "warning"
                        ? "#991b1b"
                        : notificationType === "error"
                          ? "#991b1b"
                          : "#6b7280",
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
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              background: notificationType === "success"
                ? "rgba(34, 197, 94, 0.05)"
                : notificationType === "warning"
                  ? "rgba(248, 113, 113, 0.05)"
                  : notificationType === "error"
                    ? "rgba(248, 113, 113, 0.05)"
                    : "rgba(107, 114, 128, 0.05)",
              p: 1.5,
              borderRadius: '10px',
              border: notificationType === "success"
                ? "1px solid rgba(34, 197, 94, 0.1)"
                : notificationType === "warning"
                  ? "1px solid rgba(248, 113, 113, 0.1)"
                  : notificationType === "error"
                    ? "1px solid rgba(248, 113, 113, 0.1)"
                    : "1px solid rgba(107, 114, 128, 0.1)",
              backdropFilter: 'blur(8px)',
              flex: 1
            }}>
              <Box sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 1,
                width: '100%'
              }}>
                {details.map((line, i) => (
                  <Box key={i} sx={{
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
                    }
                  }}>
                    <Typography variant="caption" sx={{
                      color: notificationType === "success"
                        ? "#166534"
                        : notificationType === "warning"
                          ? "#991b1b"
                          : notificationType === "error"
                            ? "#991b1b"
                            : "#6b7280",
                      fontSize: '0.6rem',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      opacity: 0.8,
                      mb: 0.25
                    }}>
                      {line.split(":")[0]}
                    </Typography>
                    <Typography variant="body2" sx={{
                      color: notificationType === "success"
                        ? "#166534"
                        : notificationType === "warning"
                          ? "#991b1b"
                          : notificationType === "error"
                            ? "#991b1b"
                            : "#1f2937",
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      lineHeight: 1.2,
                      wordBreak: 'break-word'
                    }}>
                      {line.split(":")[1]}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          {/* Action Buttons */}
          <Box sx={{
            display: 'flex',
            gap: 1,
            mt: 'auto',
            pt: 1.5
          }}>
            <Button
              variant="contained"
              size="small"
              sx={{
                background: notificationType === "success"
                  ? "linear-gradient(135deg, #22c55e, #4ade80)"
                  : notificationType === "warning"
                    ? "linear-gradient(135deg, #f87171, #ef4444)"
                    : notificationType === "error"
                      ? "linear-gradient(135deg, #f87171, #ef4444)"
                      : "linear-gradient(135deg, #6b7280, #9ca3af)",
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
                  background: notificationType === "success"
                    ? "linear-gradient(135deg, #16a34a, #22c55e)"
                    : notificationType === "warning"
                      ? "linear-gradient(135deg, #dc2626, #ef4444)"
                      : notificationType === "error"
                        ? "linear-gradient(135deg, #dc2626, #ef4444)"
                        : "linear-gradient(135deg, #4b5563, #6b7280)",
                }
              }}
            >
              {notificationType === "success" ? "View Order" :
                notificationType === "warning" ? "Restock Now" :
                  notificationType === "error" ? "Retry Payment" : "View Details"}
            </Button>
            <Button
              variant="outlined"
              size="small"
              sx={{
                borderColor: notificationType === "success"
                  ? "rgba(34, 197, 94, 0.3)"
                  : notificationType === "warning"
                    ? "rgba(248, 113, 113, 0.3)"
                    : notificationType === "error"
                      ? "rgba(248, 113, 113, 0.3)"
                      : "rgba(107, 114, 128, 0.3)",
                color: notificationType === "success"
                  ? "#166534"
                  : notificationType === "warning"
                    ? "#991b1b"
                    : notificationType === "error"
                      ? "#991b1b"
                      : "#6b7280",
                textTransform: 'none',
                fontSize: '0.8rem',
                fontWeight: 500,
                px: 2,
                py: 0.75,
                borderRadius: '4px',
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  borderColor: notificationType === "success"
                    ? "#22c55e"
                    : notificationType === "warning"
                      ? "#f87171"
                      : notificationType === "error"
                        ? "#f87171"
                        : "#6b7280",
                  background: notificationType === "success"
                    ? "rgba(34, 197, 94, 0.05)"
                    : notificationType === "warning"
                      ? "rgba(248, 113, 113, 0.05)"
                      : notificationType === "error"
                        ? "rgba(248, 113, 113, 0.05)"
                        : "rgba(107, 114, 128, 0.05)",
                }
              }}
            >
              {notificationType === "success" ? "Track Order" :
                notificationType === "warning" ? "View Details" :
                  notificationType === "error" ? "Contact Support" : "Learn More"}
            </Button>
          </Box>
        </Box>
      </StyledCard>
    );
  }

  if (variant === "analytics") {
    return (
      <StyledCard onClick={onClick} sx={{ cursor: onClick ? "pointer" : "default" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <CardTitle>{title}</CardTitle>
            {renderStatusIndicator()}
          </Box>
          {renderTrend()}
        </Box>
        {subTitle && <CardSubTitle>{subTitle}</CardSubTitle>}
        {renderChart()}
        <Box sx={{
          mt: 2,
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 1
        }}>
          {renderGrowthMetric("Monthly Growth", "+12.5%", <TrendingUpIcon sx={{ fontSize: 14 }} />)}
          {renderGrowthMetric("Quarterly Growth", "+8.2%", <TrendingUpIcon sx={{ fontSize: 14 }} />)}
          {renderGrowthMetric("Yearly Growth", "+15.3%", <TrendingUpIcon sx={{ fontSize: 14 }} />)}
          {renderGrowthMetric("Best Performing", "Electronics (+25%)", <LocalOfferIcon sx={{ fontSize: 14 }} />)}
          {renderGrowthMetric("Top Product", "Smartphone X", <ShoppingCartIcon sx={{ fontSize: 14 }} />)}
          {renderGrowthMetric("Revenue per Customer", "R850", <PeopleIcon sx={{ fontSize: 14 }} />)}
        </Box>
        {tags && tags.length > 0 && (
          <Box sx={{ mt: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
            {tags.map((tag, i) => (
              <Chip
                key={i}
                label={tag}
                size="small"
                sx={{
                  background: "rgba(79, 70, 229, 0.1)",
                  color: "#4F46E5",
                  fontWeight: 500,
                }}
              />
            ))}
          </Box>
        )}
      </StyledCard>
    );
  }

  return (
    <StyledCard onClick={onClick} sx={{ cursor: onClick ? "pointer" : "default" }}>
      {topLeftLabel && <TopLeftBadge>{topLeftLabel}</TopLeftBadge>}
      {topRightIcon && <TopRightIcon>{topRightIcon}</TopRightIcon>}
      <Box sx={{ display: "flex", alignItems: "center" }}>
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
                fontSize: "0.9rem",
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <span>{line.split(":")[0]}:</span>
              <span style={{ fontWeight: 600 }}>{line.split(":")[1]}</span>
            </Typography>
          ))}
        </InfoLines>
      )}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
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
          width: "100%",
          opacity: 0.6,
          background: "linear-gradient(to right, rgba(79, 70, 229, 0.1), rgba(124, 58, 237, 0.3), rgba(79, 70, 229, 0.1))"
        }}
        flexItem
      />
      {imageUrl && (
        <BottomRightImage
          src={imageUrl}
          alt="preview"
          style={{
            transform: "rotate(15deg)",
            width: "190px",
            height: "175px",
            marginRight: "-30px",
            top: 150,
            left: 360,
            right: 0,
            objectFit: "cover",
            borderRadius: 24,
            zIndex: 1,
            filter: "drop-shadow(0 10px 15px rgba(0, 0, 0, 0.1))"
          }}
        />
      )}
      {tags && tags.length > 0 && (
        <Box sx={{ mt: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
          {tags.map((tag, i) => (
            <Chip
              key={i}
              label={tag}
              size="small"
              sx={{
                background: "rgba(79, 70, 229, 0.1)",
                color: "#4F46E5",
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