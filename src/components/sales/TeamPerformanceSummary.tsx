import React from 'react';
import { Grid, Box, Avatar, Typography } from '@mui/material';
import { TeamMember } from '@/components/sales/types';

interface TeamPerformanceSummaryProps {
    teamPerformance: TeamMember[];
    formatCurrency: (value: number) => string;
}

const TeamPerformanceSummary: React.FC<TeamPerformanceSummaryProps> = ({ teamPerformance, formatCurrency }) => (
    <Grid container spacing={2}>
        {teamPerformance.slice(0, 3).map((member, index) => (
            <Grid item xs={4} key={index}>
                <Box display="flex" alignItems="center">
                    <Avatar sx={{ mr: 1 }}>{member.name.charAt(0)}</Avatar>
                    <Typography>{formatCurrency(member.revenue)}</Typography>
                    <Typography variant="body2" color="text.secondary" ml={1}>
                        {member.percentage}%
                    </Typography>
                </Box>
            </Grid>
        ))}
    </Grid>
);

export default TeamPerformanceSummary;