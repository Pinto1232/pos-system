import { SxProps } from "@mui/material";

export const pricingPackageStyles = {
  card: {
    width: 299,
    maxWidth: 299,
    maxHeight: 545,
    paddingBottom: "27%",
    margin: "8px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#D1D5DB",
  } as SxProps,
  titleBox: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#1F2937",
    padding: "8px",
    borderRadius: "5px 5px 0 0",
  } as SxProps,
  titleText: {
    fontWeight: "bold",
    color: "#fff",
    marginLeft: "8px",
    fontFamily: "Inter, sans-serif",
  } as SxProps,
  descriptionBox: {
    display: "flex",
    alignItems: "flex-start", // Align icon and text at the top
    gap: "8px", // Space between icon and text
    marginBottom: "16px", // Space between description items
  } as SxProps,
  descriptionIcon: {
    fontSize: "20px", // Icon size
    color: "#1F2937", // Match theme color
    flexShrink: 0, // Prevent icon from shrinking
  } as SxProps,
  descriptionText: {
    color: "#333",
    fontSize: "13px",
    fontFamily: "Inter, sans-serif",
    lineHeight: "1.5", // Consistent spacing between text lines
  } as SxProps,
  buyButtonBox: {
    display: "flex",
    justifyContent: "center",
    paddingBottom: "16px",
    fontSize: "17px",
    borderRadius: "4px",
  } as SxProps,
  buyButton: {
    backgroundColor: "#1E3A8A",
    color: "white",
    padding: "4px 40px",
  } as SxProps,
  icon: {
    fontSize: "23px",
    color: "#fff",
  } as SxProps,
  heading: {
    textAlign: "center",
    marginBottom: "16px",
    color: "#000",
    fontWeight: "bold",
    marginTop: "17px",
    fontFamily: "Inter, sans-serif",
    fontSize: "27px",
  } as SxProps,
};
