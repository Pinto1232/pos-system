import React from "react";
import { Box, Grid, Typography, IconButton } from "@mui/material";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import FullOverviewCard from "./FullOverviewCard";
import { FullOverviewCardProps } from "./fullOverviewCard.types";

const FullOverviewContainer: React.FC = () => {
  const cardsData: FullOverviewCardProps[] = [
    {
      variant: "notification",
      title: "New Order Received",
      subTitle: "Order #12345 has been placed successfully",
      details: [
        "Customer: John Doe",
        "Amount: R500.00",
        "Items: 3",
        "Payment Method: Credit Card",
        "Delivery Address: 123 Main St, City",
        "Estimated Delivery: 2-3 business days"
      ],
      notificationType: "success",
      notificationTime: "2 mins ago",
      tags: ["New", "Priority"],
      status: "active"
    },
    {
      variant: "notification",
      title: "Low Stock Alert",
      subTitle: "Product inventory is running low",
      details: [
        "Product: Premium Widget",
        "Current Stock: 5 units",
        "Minimum Required: 20 units",
        "Last Restock: 7 days ago",
        "Sales Rate: 10 units/day",
        "Time to Depletion: 12 hours"
      ],
      notificationType: "warning",
      notificationTime: "5 mins ago",
      tags: ["Urgent", "Inventory"],
      status: "pending"
    },
    {
      variant: "notification",
      title: "Payment Failed",
      subTitle: "Transaction #67890 could not be processed",
      details: [
        "Order ID: #67890",
        "Amount: R750.00",
        "Customer: Jane Smith",
        "Error Code: 402",
        "Reason: Insufficient Funds",
        "Retry Attempts: 2/3"
      ],
      notificationType: "error",
      notificationTime: "10 mins ago",
      tags: ["Payment", "Failed"],
      status: "inactive"
    },
    {
      variant: "notification",
      title: "System Update",
      subTitle: "New features available in your dashboard",
      details: [
        "Version: 2.1.0",
        "Release Date: Today",
        "New Features: 5",
        "Bug Fixes: 12",
        "Performance Improvements: 3",
        "Security Updates: 2"
      ],
      notificationType: "info",
      notificationTime: "15 mins ago",
      tags: ["Update", "System"],
      status: "active"
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
      <Grid container spacing={1.5}>
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
