import React from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Chip,
    IconButton,
    Tooltip
} from '@mui/material';
import {
    ArrowUpward as ArrowUpwardIcon,
    ShowChart as ShowChartIcon
} from '@mui/icons-material';

const SalesDynamicChart: React.FC = () => (
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
            },
            p: 0
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
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
                <Box>
                    <Box display="flex" alignItems="baseline">
                        <Typography
                            variant="h3"
                            component="div"
                            fontWeight="bold"
                            sx={{
                                color: '#333',
                                background: 'linear-gradient(90deg, #1976d2, #dc004e)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}
                        >
                            45.3%
                        </Typography>
                        <Typography
                            variant="h5"
                            component="span"
                            sx={{
                                ml: 1.5,
                                color: 'text.secondary',
                                fontWeight: 500
                            }}
                        >
                            $71,048
                        </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" mt={0.5}>
                        <ShowChartIcon sx={{ color: '#1976d2', fontSize: '1rem', mr: 1 }} />
                        <Typography
                            variant="subtitle1"
                            sx={{
                                fontWeight: 500,
                                letterSpacing: '0.5px',
                                color: '#666'
                            }}
                        >
                            Sales dynamic
                        </Typography>
                    </Box>
                </Box>
                <Tooltip title="Sales are trending upward">
                    <IconButton
                        sx={{
                            bgcolor: 'rgba(25, 118, 210, 0.1)',
                            '&:hover': {
                                bgcolor: 'rgba(25, 118, 210, 0.2)'
                            },
                            transition: 'all 0.2s ease'
                        }}
                    >
                        <ArrowUpwardIcon sx={{ color: '#4caf50' }} />
                    </IconButton>
                </Tooltip>
            </Box>

            <Box height={180} sx={{ mb: 2, position: 'relative', mx: -1 }}>
                <Box sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    '& > div': {
                        height: '1px',
                        backgroundColor: 'rgba(0, 0, 0, 0.05)'
                    }
                }}>
                    <Box />
                    <Box />
                    <Box sx={{ backgroundColor: 'rgba(0, 0, 0, 0.1) !important' }} />
                    <Box />
                    <Box />
                </Box>

                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            width: '90%',
                            height: 60,
                            background: 'linear-gradient(90deg, #1976d2 0%, #dc004e 100%)',
                            clipPath: 'polygon(0 50%, 10% 40%, 20% 60%, 30% 45%, 40% 55%, 50% 30%, 60% 60%, 70% 45%, 80% 55%, 90% 25%, 100% 50%)',
                            filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))',
                            opacity: 0.8,
                            transition: 'all 0.3s ease',
                            animation: 'pulse 2s infinite'
                        },
                        '@keyframes pulse': {
                            '0%': {
                                opacity: 0.7,
                            },
                            '50%': {
                                opacity: 0.9,
                            },
                            '100%': {
                                opacity: 0.7,
                            }
                        }
                    }}
                />

                {[10, 20, 30, 40, 50, 60, 70, 80, 90].map((pos, i) => (
                    <Box
                        key={i}
                        sx={{
                            position: 'absolute',
                            top: i % 2 === 0 ? '40%' : i % 3 === 0 ? '30%' : '55%',
                            left: `${pos}%`,
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            backgroundColor: i === 4 ? '#dc004e' : '#1976d2',
                            boxShadow: i === 4 ? '0 0 8px rgba(220, 0, 78, 0.6)' : '0 0 6px rgba(25, 118, 210, 0.6)',
                            zIndex: 2,
                            transform: i === 4 ? 'scale(1.5)' : 'scale(1)',
                            '&:hover': {
                                transform: 'scale(2)',
                                cursor: 'pointer'
                            },
                            transition: 'transform 0.2s ease'
                        }}
                    />
                ))}

                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        position: 'absolute',
                        bottom: -10,
                        left: '5%',
                        right: '5%',
                        px: 2
                    }}
                >
                    {['W 1', 'W 3', 'W 5', 'W 7', 'W 9', 'W 11'].map((week, index) => (
                        <Box
                            key={index}
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center'
                            }}
                        >
                            <Box
                                sx={{
                                    height: 12,
                                    width: 1,
                                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                                    mb: 0.5
                                }}
                            />
                            <Typography
                                variant="caption"
                                sx={{
                                    color: 'text.secondary',
                                    fontWeight: 500,
                                    fontSize: '0.7rem'
                                }}
                            >
                                {week}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            </Box>

            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    mt: 3,
                    pt: 2,
                    borderTop: '1px solid rgba(0, 0, 0, 0.05)'
                }}
            >
                <Chip
                    label="Current period"
                    size="small"
                    sx={{
                        mr: 1,
                        bgcolor: 'rgba(25, 118, 210, 0.1)',
                        color: '#1976d2',
                        fontWeight: 500,
                        fontSize: '0.7rem',
                        height: 24
                    }}
                />
                <Chip
                    label="Target"
                    size="small"
                    sx={{
                        bgcolor: 'rgba(220, 0, 78, 0.1)',
                        color: '#dc004e',
                        fontWeight: 500,
                        fontSize: '0.7rem',
                        height: 24
                    }}
                />
            </Box>
        </CardContent>
    </Card>
);

export default SalesDynamicChart;