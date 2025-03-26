import React from "react";
import { Box, Typography } from "@mui/material";
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
} from "./fullOverviewCard.styles";
import { FullOverviewCardProps } from "./fullOverviewCard.types";

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
  } = props;

  if (variant === "bankCard") {
    return (
      <StyledCard>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#000' }}>
            {title}
          </Typography>
          {ctaText && (
            <CardButton variant="outlined" size="small">
              {ctaText}
            </CardButton>
          )}
        </Box>
        <BankCardContainer>
          <BankCardRow>
            <Typography variant="subtitle2">{bankName}</Typography>
            <Typography variant="subtitle2">{bankType}</Typography>
          </BankCardRow>
          <BankCardNumber variant="body1">{cardNumber}</BankCardNumber>
          <BankCardRow>
            <Typography variant="body2">{cardHolder}</Typography>
            <Typography variant="body2">{cardExpire}</Typography>
          </BankCardRow>
        </BankCardContainer>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
          Total balance {totalBalance}
        </Typography>
        <InfoLines>
          <Typography variant="body2">Cost {cost}</Typography>
          <Typography variant="body2">Receipts {receipts}</Typography>
        </InfoLines>
      </StyledCard>
    );
  }

  return (
    <StyledCard>
      {topLeftLabel && <TopLeftBadge>{topLeftLabel}</TopLeftBadge>}
      {topRightIcon && <TopRightIcon>{topRightIcon}</TopRightIcon>}
      <CardTitle>{title}</CardTitle>
      {subTitle && <CardSubTitle>{subTitle}</CardSubTitle>}
      {details && details.length > 0 && (
        <InfoLines>
          {details.map((line, i) => (
            <Typography variant="body2" key={i}>
              {line}
            </Typography>
          ))}
        </InfoLines>
      )}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", mt: 2 }}>
        {price && <PriceText>{price}</PriceText>}
        {ctaText && (
          <CardButton variant="text" color="primary">
            {ctaText}
          </CardButton>
        )}
      </Box>
      {imageUrl && (
        <BottomRightImage
          src={imageUrl}
          alt="preview"
          style={{
            transform: "rotate(20deg)",
            width: "190px",
            height: "175px",
            marginRight: "-40px",
            top: 150,
            left: 360,
            right: 0,
            objectFit: "cover",
            borderRadius: 8,
            zIndex: 1
          }}
        />
      )}
    </StyledCard>
  );
};

export default FullOverviewCard;
