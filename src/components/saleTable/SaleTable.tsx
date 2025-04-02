import React from 'react';
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    IconButton,
    LinearProgress,
    Link,
} from '@mui/material';
import { VisibilityOutlined, ReceiptLong, Delete, ChevronRight } from '@mui/icons-material';
import { SaleTableProps } from './types';

const SaleTable: React.FC<SaleTableProps> = ({
    sales,
    onViewDetails,
    onViewReceipt,
    onDelete,
}) => {
    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', color: '#000' }}>
                    Overall Full Overview
                </Typography>
                <Link href="#" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: '#000' }}>
                    View all my data
                    <ChevronRight />
                </Link>
            </Box>
            <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Order / Transaction ID</TableCell>
                            <TableCell>Progress / Fulfillment</TableCell>
                            <TableCell>Payment Method</TableCell>
                            <TableCell>Item(s) Purchased</TableCell>
                            <TableCell>Cashier / User</TableCell>
                            <TableCell>Date / Time</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sales.map((sale) => (
                            <TableRow key={sale.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell>{sale.id}</TableCell>
                                <TableCell>
                                    <Box sx={{ width: '100%', maxWidth: 150 }}>
                                        <LinearProgress
                                            variant="determinate"
                                            value={sale.progress}
                                            sx={{
                                                height: 8,
                                                borderRadius: 4,
                                                backgroundColor: '#E0E0E0',
                                                '& .MuiLinearProgress-bar': {
                                                    backgroundColor: '#34D399',
                                                    borderRadius: 4,
                                                },
                                            }}
                                        />
                                    </Box>
                                </TableCell>
                                <TableCell>{sale.paymentMethod}</TableCell>
                                <TableCell>
                                    {`${sale.items.count} Items (${sale.items.name} x${sale.items.quantity})`}
                                </TableCell>
                                <TableCell>{sale.cashier}</TableCell>
                                <TableCell>{sale.dateTime}</TableCell>
                                <TableCell align="right">
                                    <IconButton
                                        onClick={() => onViewDetails(sale.id)}
                                        size="small"
                                        sx={{ color: 'primary.main' }}
                                    >
                                        <VisibilityOutlined />
                                    </IconButton>
                                    <IconButton
                                        onClick={() => onViewReceipt(sale.id)}
                                        size="small"
                                        sx={{ color: 'primary.main', mx: 1 }}
                                    >
                                        <ReceiptLong />
                                    </IconButton>
                                    <IconButton
                                        onClick={() => onDelete(sale.id)}
                                        size="small"
                                        sx={{ color: 'error.main' }}
                                    >
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 1 }}>
                <Typography component="span" sx={{ color: 'text.secondary' }}>0</Typography>
                <Typography component="span" sx={{ color: 'primary.main' }}>1</Typography>
                <Typography component="span" sx={{ color: 'text.secondary' }}>2</Typography>
                <ChevronRight sx={{ color: 'text.secondary' }} />
            </Box>
        </Box>
    );
};

export default SaleTable; 