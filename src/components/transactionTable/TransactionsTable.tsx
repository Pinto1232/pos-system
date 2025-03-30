import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    IconButton,
    Typography,
    Box,
    LinearProgress,
    Stack,
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

interface Transaction {
    id: string;
    paymentMethod: string;
    items: string;
    cashier: string;
    date: string;
}

interface TransactionsTableProps {
    transactions: Transaction[];
}

const TransactionsTable: React.FC<TransactionsTableProps> = ({ transactions }) => {
    return (
        <Box sx={{ width: '100%' }}>
            {/* Header with title and view all link */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5" component="h2" fontWeight="bold" color='#000'>
                    Transaction Full Overview
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                    <Typography variant="h5" fontWeight="bold" sx={{ mr: 1, color: '#000' }}>
                        View all my data
                    </Typography>
                    <ArrowForwardIcon />
                </Box>
            </Box>

            {/* Table */}
            <Table sx={{
                background: '#fff',
                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
                borderRadius: '12px',
                overflow: 'hidden',
            }}>
                <TableHead>
                    <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                        <TableCell sx={{ fontWeight: 600, py: 2 }}>Order / Transaction ID</TableCell>
                        <TableCell sx={{ fontWeight: 600, py: 2 }}>Progress / Fulfillment</TableCell>
                        <TableCell sx={{ fontWeight: 600, py: 2 }}>Payment Method</TableCell>
                        <TableCell sx={{ fontWeight: 600, py: 2 }}>Item(s) Purchased</TableCell>
                        <TableCell sx={{ fontWeight: 600, py: 2 }}>Cashier / User</TableCell>
                        <TableCell sx={{ fontWeight: 600, py: 2 }}>Date / Time</TableCell>
                        <TableCell sx={{ fontWeight: 600, py: 2 }}>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {transactions.map((transaction) => (
                        <TableRow
                            key={transaction.id}
                            hover
                            sx={{
                                '&:hover': {
                                    backgroundColor: '#f5f9ff'
                                },
                                borderBottom: '1px solid #f0f0f0'
                            }}
                        >
                            <TableCell sx={{ py: 2 }}>
                                <Typography fontWeight="bold">{transaction.id}</Typography>
                            </TableCell>
                            <TableCell sx={{ py: 2 }}>
                                <Box sx={{ width: '100%', maxWidth: 120 }}>
                                    <LinearProgress
                                        variant="determinate"
                                        value={
                                            transaction.id === 'INV-2025-0012' ? 75 :
                                                transaction.id === 'INV-2025-0002' ? 45 :
                                                    transaction.id === 'INV-2024-0412' ? 60 : 85
                                        }
                                        sx={{
                                            height: 8,
                                            borderRadius: 4,
                                            backgroundColor: '#e0e0e0',
                                            '& .MuiLinearProgress-bar': {
                                                backgroundColor: '#4caf50',
                                                borderRadius: 4,
                                            }
                                        }}
                                    />
                                </Box>
                            </TableCell>
                            <TableCell sx={{ py: 2 }}>{transaction.paymentMethod}</TableCell>
                            <TableCell sx={{ py: 2 }}>{transaction.items}</TableCell>
                            <TableCell sx={{ py: 2 }}>{transaction.cashier}</TableCell>
                            <TableCell sx={{ py: 2 }}>{transaction.date}</TableCell>
                            <TableCell sx={{ py: 2 }}>
                                <IconButton aria-label="info" size="small" sx={{ color: '#2196f3' }}>
                                    <InfoOutlinedIcon fontSize="small" />
                                </IconButton>
                                <IconButton aria-label="view" size="small" sx={{ color: '#2196f3' }}>
                                    <VisibilityOutlinedIcon fontSize="small" />
                                </IconButton>
                                <IconButton aria-label="delete" size="small" sx={{ color: '#f44336' }}>
                                    <CloseIcon fontSize="small" />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Pagination */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, alignItems: 'center' }}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="body2" color="text.secondary">0</Typography>
                    <Typography variant="body2" color="text.primary" fontWeight="bold">1</Typography>
                    <Typography variant="body2" color="text.secondary">2</Typography>
                    <IconButton size="small">
                        <NavigateNextIcon fontSize="small" />
                    </IconButton>
                </Stack>
            </Box>
        </Box>
    );
};

export default TransactionsTable;