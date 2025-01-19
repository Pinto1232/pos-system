import React from "react";
import { Card, CardContent, Box, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import StyledButton from "@components/ui/button/StyledButton";
import { PricingPackageProps } from "./PricingPackage.types";
import { pricingPackageStyles } from "./PricingPackage.styles";
import { navigateBasedOnRule } from "@/routes/appRoutes";
import { useRouter } from "next/navigation";

const PricingPackage: React.FC<PricingPackageProps> = ({
  title,
  id,
  price,
  descriptionList,
}) => {
  const router = useRouter();

  const handleBuyNowClick = () => {
    const nextRoute = navigateBasedOnRule("1-PackageSelection", title, id);
    console.log(`Navigating to: ${nextRoute}`);
    try {
      router.push(nextRoute);
    } catch (err: unknown) {
      console.error("Navigation error:", err);
    }
  };

  return (
    <Card sx={pricingPackageStyles.card}>
      <Box sx={pricingPackageStyles.titleBox}>
        <Typography variant="h6" sx={pricingPackageStyles.titleText}>
          {title} - R{price.toFixed(2)}
        </Typography>
      </Box>
      <CardContent>
        {descriptionList.map((desc, index) => (
          <Box key={index} sx={pricingPackageStyles.descriptionBox}>
            <CheckCircleIcon sx={pricingPackageStyles.descriptionIcon} />
            <Typography variant="body2" sx={pricingPackageStyles.descriptionText}>
              {desc}
            </Typography>
          </Box>
        ))}
      </CardContent>
      <Box sx={pricingPackageStyles.buyButtonBox}>
        <StyledButton
          label="Buy now"
          variant="contained"
          color="primary"
          onClick={handleBuyNowClick}
          icon={<ShoppingCartIcon />}
          sx={{ backgroundColor: "#1E3A8A", color: "white", padding: "4px 40px" }}
        />
      </Box>
    </Card>
  );
};

export default PricingPackage;
