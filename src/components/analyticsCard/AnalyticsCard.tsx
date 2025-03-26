import React from "react";
import { Box, Button } from "@mui/material";
import { FaStar, FaHeart, FaCheck, FaBell, FaSmile } from "react-icons/fa"; // Import icons
import {
    StyledCard,
    CircleNumber,
    Title,
    BulletList,
    DataPoint,
    Percentage,
    ViewDetails,
} from "./analyticsCard.styles";
import { AnalyticsCardProps } from "./analyticsCard.types";

const AnalyticsCard: React.FC<AnalyticsCardProps> = ({
    circleText,
    title,
    dataPoints,
    percentage,
}) => {
    const buttonColors = ["#006D77", "#1E3A8A", "#52B788", "#1F2937", "#F59E0B"];
    const buttonIcons = [FaStar, FaHeart, FaCheck, FaBell, FaSmile];

    return (
        <StyledCard>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: -1, }}>
                <CircleNumber>{circleText}</CircleNumber>
                <Percentage>
                    <span>{percentage.replace("%", "")}</span>
                    <span>%</span>
                </Percentage>
            </Box>
            <Title variant="h6">{title}</Title>
            <BulletList>
                {dataPoints.map((point, index) => (
                    <DataPoint key={index}>
                        <a href="#">{point}</a>
                    </DataPoint>
                ))}
            </BulletList>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2 }}>
                <Box sx={{ display: "flex", gap: "1px" }}> 
                    {Array.from({ length: 5 }, (_, i) => {
                        const Icon = buttonIcons[i];
                        return (
                            <Button
                                key={i}
                                size="small"
                                sx={{
                                    minWidth: "34px",
                                    height: "28px",
                                    padding: 0,
                                    backgroundColor: buttonColors[i],
                                    color: "#fff",
                                    border: "none",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "6px",
                                    "&:hover": {
                                        backgroundColor: buttonColors[i],
                                        opacity: 0.8,
                                    },
                                }}
                            >
                                <Icon size={12} />
                                <span style={{ fontSize: "10px" }}>{i}</span>
                            </Button>
                        );
                    })}
                </Box>
                <Box>
                    <a href="#">
                        <ViewDetails>
                            View Details ➔
                        </ViewDetails>
                    </a>
                </Box>

            </Box>
        </StyledCard>
    );
};

export default AnalyticsCard;
