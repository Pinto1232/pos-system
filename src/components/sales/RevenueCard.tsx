import React from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Chip,
    Select,
    MenuItem,
    SelectChangeEvent,
    Divider,
    Tooltip
} from '@mui/material';
import {
    TrendingUp as TrendingUpIcon,
    AttachMoney as AttachMoneyIcon,
    ShowChart as ShowChartIcon,
    ExpandMore as ExpandMoreIcon
} from '@mui/icons-material';

interface RevenueCardProps {
    totalRevenue: number;
    previousRevenue: number;
    growthPercentage: number;
    growthValue: number;
    timeframe: {
        current: string;
        previous: string;
    };
    onTimeframeChange: (newTimeframe: string) => void;
}

const RevenueCard: React.FC<RevenueCardProps> = ({
    totalRevenue,
    previousRevenue,
    growthPercentage,
    growthValue,
    timeframe,
    onTimeframeChange
}) => (
    <Card
        elevation={2}
        sx={{
            borderRadius: 3,
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #ffffff 0%, #f9f9f9 100%)',
            position: 'relative',
            transition: 'all 0.3s ease',
            '&:hover': {
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                transform: 'translateY(-4px)'
            }
        }}
    >
        <Box
            sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '6px',
                background: 'linear-gradient(90deg, #1976d2 0%, #dc004e 100%)'
            }}
        />
        <CardContent sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Box display="flex" alignItems="center">
                    <AttachMoneyIcon sx={{ color: '#1976d2', mr: 1 }} />
                    <Typography variant="h6" fontWeight="600" color="#1976d2">
                        Revenue
                    </Typography>
                </Box>
                <Tooltip title="Revenue trend is positive">
                    <ShowChartIcon sx={{ color: '#4caf50' }} />
                </Tooltip>
            </Box>

            <Box display="flex" alignItems="baseline" mb={2}>
                <Typography variant="h3" component="div" fontWeight="bold" sx={{ color: '#333' }}>
                    ${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </Typography>
                <Box ml={2} display="flex" flexDirection="column">
                    <Chip
                        icon={<TrendingUpIcon />}
                        label={`${growthPercentage}%`}
                        size="small"
                        sx={{
                            mb: 0.5,
                            bgcolor: '#4caf50',
                            color: 'white',
                            fontWeight: 'bold',
                            '& .MuiChip-icon': { color: 'white' }
                        }}
                    />
                    <Chip
                        label={`+$${growthValue.toLocaleString('en-US')}`}
                        size="small"
                        sx={{
                            bgcolor: 'rgba(76, 175, 80, 0.1)',
                            color: '#4caf50',
                            fontWeight: 'bold'
                        }}
                    />
                </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box component="span" sx={{ fontWeight: 'medium', color: '#666', mr: 0.5 }}>vs prev.</Box>
                    ${previousRevenue.toLocaleString('en-US')}
                    <Box component="span" sx={{ mx: 0.5, color: '#666', fontStyle: 'italic' }}>
                        {timeframe.previous}
                    </Box>
                </Typography>
                <Select
                    value={timeframe.current}
                    onChange={(e: SelectChangeEvent) => onTimeframeChange(e.target.value)}
                    size="small"
                    IconComponent={ExpandMoreIcon}
                    sx={{
                        height: 32,
                        fontSize: '0.85rem',
                        '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(0, 0, 0, 0.12)' },
                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#1976d2' },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#1976d2' }
                    }}
                >
                    <MenuItem value="Sep 1 - Nov 30, 2023">Sep 1 - Nov 30, 2023</MenuItem>
                    <MenuItem value="Jun 1 - Aug 31, 2023">Jun 1 - Aug 31, 2023</MenuItem>
                    <MenuItem value="Mar 1 - May 31, 2023">Mar 1 - May 31, 2023</MenuItem>
                </Select>
            </Box>
        </CardContent>
    </Card>
);

export default RevenueCard;