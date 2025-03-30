import React from 'react';
import { Box, Typography } from '@mui/material';

interface DashboardHeaderProps {
    title: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ title }) => (
    <Box mb={3}>
        <Typography variant="h4" color="text.secondary" gutterBottom>
            {title}
        </Typography>
    </Box>
);

export default DashboardHeader;