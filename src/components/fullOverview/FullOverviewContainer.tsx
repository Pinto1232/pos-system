import React from "react";
import { Box, Grid, Typography, IconButton } from "@mui/material";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import FullOverviewCard from "./FullOverviewCard";
import { FullOverviewCardProps } from "./fullOverviewCard.types";

const FullOverviewContainer: React.FC = () => {
  const cardsData: FullOverviewCardProps[] = [
    {
      variant: "overview",
      topLeftLabel: "Featured",
      topRightIcon: "⭐",
      title: "Sales Overview",
      subTitle: "Track your sales performance and analytics",
      details: [
        "Total Sales: R15,000",
        "Average Order: R500",
        "Conversion Rate: 3.2%",
        "New Customers: 45",
        "Returning Customers: 120",
        "Average Basket Size: 3 items",
      ],
      price: "R300.00",
      ctaText: "View Details",
      imageUrl: "/sales-chart.jpg",
      tags: ["Sales", "Analytics", "Performance", "Customers"],
      status: "active",
      onClick: () => console.log("Sales overview clicked"),
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
      onClick: () => console.log("Bank card clicked"),
    },
    {
      variant: "analytics",
      title: "Revenue Growth",
      subTitle: "Monthly revenue analysis with detailed breakdown",
      trend: {
        value: 12.5,
        direction: "up",
      },
      chartData: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        values: [100, 200, 150, 300, 250, 400],
      },
      details: [
        "Monthly Growth: +12.5%",
        "Quarterly Growth: +8.2%",
        "Yearly Growth: +15.3%",
        "Best Performing: Electronics (+25%)",
        "Top Product: Smartphone X",
        "Revenue per Customer: R850",
      ],
      tags: ["Revenue", "Growth", "Analysis", "Trends", "Forecast"],
      status: "active",
      onClick: () => console.log("Analytics clicked"),
    },
    {
      variant: "notification",
      title: "New Order Received",
      subTitle: "Order #12345 has been placed",
      notificationType: "success",
      notificationTime: "2m ago",
      details: [
        "Customer: John Doe",
        "Amount: R500.00",
        "Items: 3",
      ],
      onClick: () => console.log("Notification clicked"),
    },
    {
      variant: "notification",
      title: "Low Stock Alert",
      subTitle: "Product XYZ is running low",
      notificationType: "warning",
      notificationTime: "5m ago",
      details: [
        "Current Stock: 5 units",
        "Reorder Point: 10 units",
        "Last Restock: 2 weeks ago",
      ],
      onClick: () => console.log("Stock alert clicked"),
    },
    {
      variant: "analytics",
      title: "Customer Satisfaction",
      subTitle: "Customer feedback analysis",
      trend: {
        value: 8.2,
        direction: "down",
      },
      chartData: {
        labels: ["Q1", "Q2", "Q3", "Q4"],
        values: [85, 90, 82, 75],
      },
      tags: ["Customer", "Feedback", "Satisfaction"],
      onClick: () => console.log("Customer analytics clicked"),
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
