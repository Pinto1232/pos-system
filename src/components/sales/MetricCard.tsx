import React from 'react';
import { Box, Card, CardContent, Typography, Chip } from '@mui/material';

interface MetricCardProps {
    title: string;
    value: string | number;
    subtitle: React.ReactNode | string;
    subtitleValue?: {
        value: string;
        color: string;
    };
    bgColor?: string;
    color?: string;
    iconRight?: React.ReactNode;
}

const MetricCard: React.FC<MetricCardProps> = ({
    title,
    value,
    subtitle,
    subtitleValue,
    bgColor,
    color,
    iconRight
}) => (
    <Card
        elevation={0}
        sx={{
            bgcolor: bgColor,
            color: color || 'inherit',
            height: 240,
            width: 144,
            borderRadius: 2,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            border: '1px solid',
            borderColor: 'rgba(0, 0, 0, 0.08)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
            '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
            }
        }}
    >
        <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', p: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography
                    variant="subtitle2"
                    color={color || 'text.secondary'}
                    sx={{
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        letterSpacing: '0.1px'
                    }}
                >
                    {title}
                </Typography>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    bgcolor: 'rgba(255, 255, 255, 0.2)'
                }}>
                    {iconRight}
                </Box>
            </Box>
            <Typography
                variant="h5"
                component="div"
                fontWeight="bold"
                sx={{
                    my: 1.5,
                    fontSize: '1.9rem',
                    color: '#595959fa'
                }}
            >
                {value}
            </Typography>
            <Box display="flex" alignItems="center">
                <Typography
                    variant="body2"
                    component="div"
                    color={subtitleValue?.color || 'inherit'}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: '0.75rem',
                        color: "#000"
                    }}
                >
                    {subtitle}
                    {subtitleValue?.value && (
                        <Chip
                            label={subtitleValue.value}
                            size="small"
                            sx={{
                                ml: 1,
                                height: 20,
                                fontSize: '0.7rem',
                                bgcolor: 'rgba(255, 255, 255, 0.2)',
                                color: subtitleValue.color
                            }}
                        />
                    )}
                </Typography>
            </Box>
        </CardContent>
    </Card>
);

export default MetricCard;