import React from "react";
import { Card, CardContent, Box, Typography } from "@mui/material";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { pricingPackageStyles } from "./PricingPackage.styles";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import StyledButton from "@components/ui/button/StyledButton";




interface PricingPackageProps {
  title: string;
  description: string[];
  onClick: () => void;
}

const PricingPackage: React.FC<PricingPackageProps> = ({
  title,
  description,
  onClick,
}) => {
  return (
    <Card sx={pricingPackageStyles.card}>
      <Box sx={pricingPackageStyles.titleBox}>
        <InsertDriveFileIcon sx={pricingPackageStyles.icon} />
        <Typography variant="h6" sx={pricingPackageStyles.titleText}>
          {title}
        </Typography>
      </Box>
      <CardContent>
        {description.map((desc, index) => (
          <Box key={index} display="flex" alignItems="center">
            <CheckCircleIcon
              sx={{ fontSize: "16px", color: "#1F293", marginRight: "8px" }}
            />
            <Typography variant="body2" sx={pricingPackageStyles.description}>
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
          onClick={onClick}
          icon={<ShoppingCartIcon />}
          sx={{ backgroundColor: "#1E3A8A", color: "white", padding: "4px 40px" }}
        />
      </Box>
    </Card>
  );
};

export default PricingPackage;
