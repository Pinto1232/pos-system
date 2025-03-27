import { styled } from "@mui/material/styles";
import { Card, Box, Typography, Button } from "@mui/material";

export const StyledCard = styled(Card)(({ theme }) => ({
  position: "relative",
  borderRadius: 16,
  padding: theme.spacing(2),
  backgroundColor: "#fff",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  height: "100%",
}));

export const TopLeftBadge = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: theme.spacing(1),
  left: theme.spacing(1),
  backgroundColor: theme.palette.grey[200],
  borderRadius: 16,
  padding: theme.spacing(0.5, 1),
  fontSize: "0.75rem",
  fontWeight: 500,
  color: theme.palette.text.primary,
}));

export const TopRightIcon = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: theme.spacing(1),
  right: theme.spacing(1),
  width: 24,
  height: 24,
  borderRadius: "50%",
  backgroundColor: theme.palette.grey[200],
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "0.7rem",
  fontWeight: 600,
  color: theme.palette.text.primary,
}));

export const CardTitle = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(4),
  fontWeight: 600,
  fontSize: "1rem",
}));

export const CardSubTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: "0.9rem",
  marginBottom: theme.spacing(2),
}));

export const BottomRightImage = styled("img")(({ theme }) => ({
  position: "absolute",
  bottom: theme.spacing(1),
  right: theme.spacing(1),
  width: 80,
  height: 80,
  objectFit: "cover",
  borderRadius: 8,
}));

export const PriceText = styled(Typography)(() => ({
  fontWeight: "bold",
  fontSize: "1rem",
}));

export const CardButton = styled(Button)(() => ({
  textTransform: "none",
  fontSize: "0.85rem",
  fontWeight: 500,
  position: "absolute",
  bottom: 16,
  right: 16,
  zIndex: 999,
  backgroundColor: "#1E3A8A",
  color: "#fff",
}));

export const InfoLines = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(0.5),
}));

export const BankCardContainer = styled(Box)(({ theme }) => ({
  backgroundColor: "#1E3A8A",
  color: "#fff",
  borderRadius: 16,
  padding: theme.spacing(2),
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
  minHeight: 140,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  width: "300px",
}));

export const BankCardRow = styled(Box)({
  display: "flex",
  flexDirection: "column",
  marginTop: 8,
  alignItems: "start",
});
export const BankCardRowDetail = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 4,
});

export const BankCardNumber = styled(Typography)({
  letterSpacing: "1.5px",
  fontWeight: 600,
});
