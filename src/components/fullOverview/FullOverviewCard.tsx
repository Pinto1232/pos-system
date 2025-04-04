import React from "react";
import { Box, Divider, Typography, Chip, Tooltip, LinearProgress } from "@mui/material";
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
  BankCardRowDetail,
} from "./fullOverviewCard.styles";
import { FullOverviewCardProps } from "./fullOverviewCard.types";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningIcon from "@mui/icons-material/Warning";
import ErrorIcon from "@mui/icons-material/Error";
import InfoIcon from "@mui/icons-material/Info";
import CircleIcon from "@mui/icons-material/Circle";

const FullOverviewCard: React.FC<FullOverviewCardProps> = (props) => {
  const {
    variant,
    topLeftLabel,
    topRightIcon,
    title,
    subTitle,
    price,
    ctaText,
    details,
    imageUrl,
    bankName,
    bankType,
    cardNumber,
    cardHolder,
    cardExpire,
    totalBalance,
    cost,
    receipts,
    BankCardRowDetail: bankCardRowDetailText,
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
        return <CheckCircleIcon sx={{ color: "#10B981" }} />;
      case "warning":
        return <WarningIcon sx={{ color: "#F59E0B" }} />;
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
        <CircleIcon sx={{
          color,
          fontSize: "0.8rem",
          ml: 1,
        }} />
      </Tooltip>
    );
  };

  const renderChartPreview = () => {
    if (!chartData) return null;

    const maxValue = Math.max(...chartData.values);
    const minValue = Math.min(...chartData.values);
    const range = maxValue - minValue;

    return (
      <Box sx={{
        mt: 2,
        height: 100,
        display: "flex",
        alignItems: "flex-end",
        gap: 1,
        px: 1,
      }}>
        {chartData.values.map((value, index) => {
          const height = ((value - minValue) / range) * 80;
          return (
            <Box
              key={index}
              sx={{
                flex: 1,
                height: `${height}px`,
                background: "linear-gradient(to top, #4F46E5, #7C3AED)",
                borderRadius: "4px 4px 0 0",
                position: "relative",
                transition: "height 0.3s ease",
                "&:hover": {
                  background: "linear-gradient(to top, #4338CA, #6D28D9)",
                },
              }}
            >
              <Tooltip title={`${chartData.labels[index]}: ${value}`}>
                <Box sx={{ height: "100%" }} />
              </Tooltip>
            </Box>
          );
        })}
      </Box>
    );
  };

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
          <BankCardRowDetail>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{bankName}</Typography>
            <Typography variant="subtitle2" sx={{ opacity: 0.9 }}>{bankType}</Typography>
          </BankCardRowDetail>
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
          {bankCardRowDetailText && (
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
              <span>Details</span> <span>{bankCardRowDetailText}</span>
            </Typography>
          )}
        </InfoLines>
      </StyledCard>
    );
  }

  if (variant === "notification") {
    return (
      <StyledCard onClick={onClick} sx={{ cursor: onClick ? "pointer" : "default" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {renderNotificationIcon()}
          <Box sx={{ flex: 1 }}>
            <CardTitle>{title}</CardTitle>
            {subTitle && <CardSubTitle>{subTitle}</CardSubTitle>}
          </Box>
          {notificationTime && (
            <Typography variant="caption" sx={{ color: "#6B7280" }}>
              {notificationTime}
            </Typography>
          )}
        </Box>
        {details && details.length > 0 && (
          <InfoLines>
            {details.map((line, i) => (
              <Typography
                variant="body2"
                key={i}
                sx={{
                  py: 0.5,
                  fontWeight: 500,
                  fontSize: "0.9rem"
                }}
              >
                {line}
              </Typography>
            ))}
          </InfoLines>
        )}
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
        {renderChartPreview()}
        {details && details.length > 0 && (
          <InfoLines sx={{ mt: 2 }}>
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