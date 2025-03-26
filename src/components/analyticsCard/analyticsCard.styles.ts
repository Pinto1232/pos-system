import { styled } from "@mui/material/styles";
import { Card, Typography, Box } from "@mui/material";

export const StyledCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 24,
  backgroundColor: "#fff",
  transition: "background 0.3s ease",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  "&:hover": {
    background: "linear-gradient(135deg, #8EC5FC 0%, #E0C3FC 100%)",
  },
  width: 370,
  height: 255,
  cursor: "pointer",
}));

export const CircleNumber = styled(Box)(({ theme }) => ({
  width: 40,
  height: 40,
  borderRadius: "50%",
  backgroundColor: theme.palette.primary.main,
  color: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "bold",
  marginBottom: theme.spacing(2),
}));

export const Title = styled(Typography)(({ theme }) => ({
  fontWeight: "bold",
  marginBottom: theme.spacing(0.5),
  marginTop: theme.spacing(-1),
}));

export const SubTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(2),
}));

export const BulletList = styled("ul")({
  margin: 0,
  paddingLeft: 0,
  listStyle: "none",
});

export const DataPoint = styled("li")(({ theme }) => ({
  marginBottom: theme.spacing(0.1),
  fontSize: "0.9rem",
  "&::before": {
    content: '"•"',
    marginRight: theme.spacing(0.5),
  },
  "& a": {
    textDecoration: "none",
    color: "#000",
    "&:hover": {
      color: theme.palette.primary.main,
    },
  },
}));

export const Percentage = styled(Typography)(({ theme }) => ({
  fontWeight: "bold",
  fontSize: "1.5rem",
  marginTop: 0,
  top: theme.spacing(2),
  right: theme.spacing(2),
  textAlign: "right",
  zIndex: 1,
  display: "flex",
  alignItems: "baseline",
  "& span:first-of-type": {
    fontSize: "2rem",
  },
  "& span:last-of-type": {
    fontSize: "1rem",
  },
}));

export const ViewDetails = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(2),
  fontSize: "0.9rem",
  fontWeight: 500,
  textAlign: "right",
  cursor: "pointer",
  alignItems: "center",
  justifyItems: "center",
  textDecoration: "none",
  color: theme.palette.primary.main,
  "&:hover": {
    textDecoration: "underline",
  },
}));
