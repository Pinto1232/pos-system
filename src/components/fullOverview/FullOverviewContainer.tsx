import React from "react";
import { Box, Grid, Typography, IconButton } from "@mui/material";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import FullOverviewCard from "./FullOverviewCard";
import { FullOverviewCardProps } from "./fullOverviewCard.types";

const FullOverviewContainer: React.FC = () => {
  const cardsData: FullOverviewCardProps[] = [
    {
      variant: "overview",
      topLeftLabel: "Notification",
      topRightIcon: "ℹ",
      title: "Full Overview",
      subTitle: "Sales Overview & Analytics Sales Overview & Analytics",
      details: [],
      price: "R300.00",
      ctaText: "Check more",
      imageUrl: "/card.jpg",
    },
    {
      variant: "overview",
      topLeftLabel: "FullOverview",
      topRightIcon: "📁",
      title: "Full Overview",
      subTitle: "Sales Overview & Analytics Sales Overview & Analytics",
      details: [],
      price: "R300.00",
      ctaText: "Check more",
      imageUrl: "/card.jpg",
    },
    {
      variant: "bankCard",
      title: "Your Card",
      ctaText: "Add Card",
      bankName: "Afrik Bank",
      bankType: "Debit",
      cardNumber: "4242 4242 4242 4242",
      cardHolder: "Pinto Manuel",
      cardExpire: "03/25",
      totalBalance: "R240.00",
      cost: "R239.00",
      receipts: "R239.00",
      BankCardRowDetail: "R1.00",
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          mt: -3,
        }}
      >
        <Typography variant="h5" sx={{
          fontWeight: "bold",
          color: "#000"
        }}
        >
          Full Overview
        </Typography>
        <IconButton>
          <ViewModuleIcon />
        </IconButton>
      </Box>
      <Grid container spacing={3}>
        {cardsData.map((item, idx) => (
          <Grid item xs={12} sm={6} md={4} key={idx}>
            <FullOverviewCard {...item} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default FullOverviewContainer;
