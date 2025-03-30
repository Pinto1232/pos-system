import React from "react";
import { Box, Divider, Typography } from "@mui/material";
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
  } = props;

  if (variant === "bankCard") {
    return (
      <StyledCard>
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

  return (
    <StyledCard>
      {topLeftLabel && <TopLeftBadge>{topLeftLabel}</TopLeftBadge>}
      {topRightIcon && <TopRightIcon>{topRightIcon}</TopRightIcon>}
      <CardTitle>{title}</CardTitle>
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
                fontSize: "0.9rem"
              }}
            >
              {line}
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
    </StyledCard>
  );
};

export default FullOverviewCard;