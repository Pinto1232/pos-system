import React from 'react';
import {
    TableRow,
    TableCell,
    Box,
    Avatar,
    Typography,
    Chip,
    IconButton,
    Tooltip
} from '@mui/material';
import {
    KeyboardArrowDown as KeyboardArrowDownIcon,
    Star as StarIcon,
    ArrowUpward as ArrowUpwardIcon
} from '@mui/icons-material';
import { TeamMember } from '@/components/sales/types';

interface TeamMemberRowProps {
    member: TeamMember;
    formatCurrency: (value: number) => string;
    onViewDetails: (memberId: string) => void;
}

const TeamMemberRow: React.FC<TeamMemberRowProps> = ({ member, formatCurrency, onViewDetails }) => {
    const getColorForMember = (name: string) => {
        const colors = ['#1976d2', '#e91e63', '#9c27b0', '#4caf50', '#ff9800'];
        const index = name.charCodeAt(0) % colors.length;
        return colors[index];
    };

    const memberColor = getColorForMember(member.name);
    const isHighPerformer = (member.revenue > 150000);

    return (
        <TableRow
            sx={{
                transition: 'all 0.2s ease',
                position: 'relative',
                '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.02)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                    '& .action-button': {
                        opacity: 1,
                        transform: 'translateX(0)',
                    }
                },
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    top: '10%',
                    height: '80%',
                    width: '3px',
                    backgroundColor: memberColor,
                    borderRadius: '0 4px 4px 0',
                    opacity: 0.7,
                }
            }}
        >
            <TableCell sx={{ py: 2 }}>
                <Box display="flex" alignItems="center">
                    <Box sx={{ position: 'relative' }}>
                        <Avatar
                            sx={{
                                width: 40,
                                height: 40,
                                background: `linear-gradient(135deg, ${memberColor} 0%, ${memberColor}99 100%)`,
                                boxShadow: `0 4px 8px ${memberColor}33`,
                                mr: 2,
                                fontWeight: 'bold',
                                fontSize: '1rem',
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    transform: 'scale(1.05)',
                                    boxShadow: `0 6px 12px ${memberColor}66`,
                                }
                            }}
                        >
                            {member.name.charAt(0)}
                        </Avatar>
                        {isHighPerformer && (
                            <Box
                                sx={{
                                    position: 'absolute',
                                    bottom: -2,
                                    right: 12,
                                    width: 14,
                                    height: 14,
                                    borderRadius: '50%',
                                    bgcolor: '#4caf50',
                                    border: '2px solid white',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                }}
                            />
                        )}
                    </Box>
                    <Box>
                        <Typography
                            variant="subtitle1"
                            fontWeight="600"
                            sx={{
                                color: '#333',
                                lineHeight: 1.2
                            }}
                        >
                            {member.name}
                        </Typography>
                        <Typography
                            variant="caption"
                            sx={{
                                color: 'text.secondary',
                                display: 'flex',
                                alignItems: 'center'
                            }}
                        >
                            {isHighPerformer ? 'Top performer' : 'Sales representative'}
                            {isHighPerformer && (
                                <StarIcon
                                    sx={{
                                        ml: 0.5,
                                        fontSize: '0.8rem',
                                        color: '#f9a825'
                                    }}
                                />
                            )}
                        </Typography>
                    </Box>
                </Box>
            </TableCell>

            <TableCell>
                <Typography
                    variant="subtitle2"
                    fontWeight="bold"
                    sx={{
                        background: `linear-gradient(90deg, ${memberColor}, ${memberColor}99)`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontSize: '1rem'
                    }}
                >
                    {formatCurrency(member.revenue)}
                </Typography>
            </TableCell>

            <TableCell>
                <Chip
                    label={member.leads}
                    sx={{
                        background: `linear-gradient(135deg, ${memberColor} 0%, ${memberColor}99 100%)`,
                        color: 'white',
                        fontWeight: 'bold',
                        boxShadow: `0 2px 5px ${memberColor}33`,
                        '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: `0 4px 8px ${memberColor}66`,
                        },
                        transition: 'all 0.2s ease'
                    }}
                />
            </TableCell>

            <TableCell>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        bgcolor: 'rgba(0, 0, 0, 0.04)',
                        mx: 'auto'
                    }}
                >
                    <Typography fontWeight="medium">
                        {member.meetings}
                    </Typography>
                </Box>
            </TableCell>

            <TableCell>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <Typography
                        fontWeight="medium"
                        sx={{
                            color: member.winRate && member.winRate > 0.8 ? '#4caf50' : 'inherit'
                        }}
                    >
                        {member.winRate}
                    </Typography>
                    {member.winRate && member.winRate > 0.8 && (
                        <ArrowUpwardIcon
                            sx={{
                                ml: 0.5,
                                fontSize: '1rem',
                                color: '#4caf50'
                            }}
                        />
                    )}
                </Box>
            </TableCell>

            <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Chip
                        label={`${member.winPercentage}%`}
                        size="small"
                        sx={{
                            bgcolor: 'rgba(76, 175, 80, 0.1)',
                            color: '#4caf50',
                            fontWeight: 'bold',
                            mr: 1
                        }}
                    />
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            bgcolor: 'rgba(0, 0, 0, 0.04)',
                            borderRadius: 1,
                            px: 1,
                            py: 0.5
                        }}
                    >
                        <Typography
                            variant="caption"
                            fontWeight="medium"
                            sx={{ color: '#f44336' }}
                        >
                            {member.lost}
                        </Typography>
                        <Typography variant="caption" sx={{ mx: 0.5, color: 'text.secondary' }}>
                            /
                        </Typography>
                        <Typography
                            variant="caption"
                            fontWeight="medium"
                            sx={{ color: '#4caf50' }}
                        >
                            {member.deals}
                        </Typography>
                    </Box>
                </Box>
            </TableCell>

            <TableCell align="right">
                <Tooltip title={`View ${member.name}'s details`}>
                    <IconButton
                        size="small"
                        onClick={() => onViewDetails(member.name)}
                        className="action-button"
                        sx={{
                            bgcolor: 'rgba(25, 118, 210, 0.1)',
                            color: memberColor,
                            transition: 'all 0.3s ease',
                            opacity: 0.8,
                            transform: 'translateX(5px)',
                            '&:hover': {
                                bgcolor: 'rgba(25, 118, 210, 0.2)',
                                transform: 'scale(1.1)',
                            }
                        }}
                    >
                        <KeyboardArrowDownIcon />
                    </IconButton>
                </Tooltip>
            </TableCell>
        </TableRow>
    );
};

export default TeamMemberRow;