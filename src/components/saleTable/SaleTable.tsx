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
  Card,
  CardContent,
  Stack,
  useMediaQuery,
  useTheme,
  Chip,
} from '@mui/material';
import {
  VisibilityOutlined,
  ReceiptLong,
  Delete,
  ChevronRight,
} from '@mui/icons-material';
import { SaleTableProps } from './types';

const SaleTable: React.FC<SaleTableProps> = ({
  sales,
  onViewDetails,
  onViewReceipt,
  onDelete,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const renderMobileView = () => (
    <Stack spacing={2}>
      {sales.map((sale) => (
        <Card
          key={sale.id}
          sx={{
            width: '100%',
            borderRadius: '12px',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.04)',
            overflow: 'hidden',
          }}
        >
          <CardContent sx={{ p: 2 }}>
            <Stack spacing={2}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 600,
                    color: '#1E2A3B',
                  }}
                >
                  {sale.id}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton
                    onClick={() => onViewDetails(sale.id)}
                    size="small"
                    sx={{
                      color: '#3b82f6',
                      backgroundColor: '#f8f9fa',
                      border: '1px solid #e0e0e0',
                      borderRadius: '6px',
                      padding: '6px',
                      '&:hover': {
                        backgroundColor: '#f0f2f5',
                        borderColor: '#3b82f6',
                      },
                    }}
                  >
                    <VisibilityOutlined fontSize="small" />
                  </IconButton>
                  <IconButton
                    onClick={() => onViewReceipt(sale.id)}
                    size="small"
                    sx={{
                      color: '#3b82f6',
                      backgroundColor: '#f8f9fa',
                      border: '1px solid #e0e0e0',
                      borderRadius: '6px',
                      padding: '6px',
                      '&:hover': {
                        backgroundColor: '#f0f2f5',
                        borderColor: '#3b82f6',
                      },
                    }}
                  >
                    <ReceiptLong fontSize="small" />
                  </IconButton>
                  <IconButton
                    onClick={() => onDelete(sale.id)}
                    size="small"
                    sx={{
                      color: '#d32f2f',
                      backgroundColor: '#f8f9fa',
                      border: '1px solid #e0e0e0',
                      borderRadius: '6px',
                      padding: '6px',
                      '&:hover': {
                        backgroundColor: '#fee2e2',
                        borderColor: '#d32f2f',
                      },
                    }}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </Box>
              </Box>

              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: '#64748b',
                    fontWeight: 500,
                    fontSize: '0.75rem',
                  }}
                >
                  Progress
                </Typography>
                <Box sx={{ width: '100%', mt: 0.5 }}>
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
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      mt: 0.5,
                    }}
                  >
                    <Chip
                      label={`${sale.progress}%`}
                      size="small"
                      sx={{
                        height: '20px',
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        backgroundColor:
                          sale.progress >= 100
                            ? '#d1fae5'
                            : sale.progress >= 75
                              ? '#bfdbfe'
                              : sale.progress >= 50
                                ? '#fef3c7'
                                : sale.progress >= 25
                                  ? '#fed7aa'
                                  : '#fecaca',
                        color:
                          sale.progress >= 100
                            ? '#065f46'
                            : sale.progress >= 75
                              ? '#1e40af'
                              : sale.progress >= 50
                                ? '#92400e'
                                : sale.progress >= 25
                                  ? '#9a3412'
                                  : '#b91c1c',
                        border:
                          sale.progress >= 100
                            ? '1px solid #a7f3d0'
                            : sale.progress >= 75
                              ? '1px solid #93c5fd'
                              : sale.progress >= 50
                                ? '1px solid #fde68a'
                                : sale.progress >= 25
                                  ? '1px solid #fdba74'
                                  : '1px solid #fca5a5',
                      }}
                    />
                  </Box>
                </Box>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px',
                  p: 1.5,
                }}
              >
                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#64748b',
                      fontWeight: 500,
                      fontSize: '0.75rem',
                      display: 'block',
                      mb: 0.5,
                    }}
                  >
                    Payment Method
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 500,
                      color: '#1E2A3B',
                    }}
                  >
                    {sale.paymentMethod}
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#64748b',
                      fontWeight: 500,
                      fontSize: '0.75rem',
                      display: 'block',
                      mb: 0.5,
                    }}
                  >
                    Items
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 500,
                      color: '#1E2A3B',
                    }}
                  >
                    {`${sale.items.count} (${sale.items.name} x${sale.items.quantity})`}
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px',
                  p: 1.5,
                  mt: 1,
                }}
              >
                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#64748b',
                      fontWeight: 500,
                      fontSize: '0.75rem',
                      display: 'block',
                      mb: 0.5,
                    }}
                  >
                    Cashier
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 500,
                      color: '#1E2A3B',
                    }}
                  >
                    {sale.cashier}
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#64748b',
                      fontWeight: 500,
                      fontSize: '0.75rem',
                      display: 'block',
                      mb: 0.5,
                    }}
                  >
                    Date/Time
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 500,
                      color: '#1E2A3B',
                    }}
                  >
                    {sale.dateTime}
                  </Typography>
                </Box>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );

  const renderDesktopView = () => (
    <TableContainer
      component={Paper}
      sx={{
        backgroundColor: '#fff',
        borderRadius: '8px 8px 0 0',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.04)',
        overflow: 'hidden',
      }}
    >
      <Table>
        <TableHead sx={{ backgroundColor: '#f8f9fa' }}>
          <TableRow>
            <TableCell
              sx={{
                fontWeight: 600,
                color: '#1E2A3B',
                fontSize: '0.875rem',
                py: 2,
                px: 2.5,
                borderBottom: '1px solid #E0E0E0',
              }}
            >
              Order / Transaction ID
            </TableCell>
            <TableCell
              sx={{
                fontWeight: 600,
                color: '#1E2A3B',
                fontSize: '0.875rem',
                py: 2,
                px: 2.5,
                borderBottom: '1px solid #E0E0E0',
              }}
            >
              Progress / Fulfillment
            </TableCell>
            <TableCell
              sx={{
                fontWeight: 600,
                color: '#1E2A3B',
                fontSize: '0.875rem',
                py: 2,
                px: 2.5,
                borderBottom: '1px solid #E0E0E0',
              }}
            >
              Payment Method
            </TableCell>
            <TableCell
              sx={{
                fontWeight: 600,
                color: '#1E2A3B',
                fontSize: '0.875rem',
                py: 2,
                px: 2.5,
                borderBottom: '1px solid #E0E0E0',
              }}
            >
              Item(s) Purchased
            </TableCell>
            <TableCell
              sx={{
                fontWeight: 600,
                color: '#1E2A3B',
                fontSize: '0.875rem',
                py: 2,
                px: 2.5,
                borderBottom: '1px solid #E0E0E0',
              }}
            >
              Cashier / User
            </TableCell>
            <TableCell
              sx={{
                fontWeight: 600,
                color: '#1E2A3B',
                fontSize: '0.875rem',
                py: 2,
                px: 2.5,
                borderBottom: '1px solid #E0E0E0',
              }}
            >
              Date / Time
            </TableCell>
            <TableCell
              sx={{
                fontWeight: 600,
                color: '#1E2A3B',
                fontSize: '0.875rem',
                py: 2,
                px: 2.5,
                borderBottom: '1px solid #E0E0E0',
              }}
              align="right"
            >
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sales.map((sale) => (
            <TableRow
              key={sale.id}
              sx={{
                '&:last-child td, &:last-child th': { border: 0 },
                '&:hover': {
                  backgroundColor: '#F8F9FA',
                },
                '& td': {
                  borderBottom: '1px solid #E0E0E0',
                  color: '#1E2A3B',
                  fontSize: '14px',
                  padding: '16px',
                },
              }}
            >
              <TableCell>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: '#1E2A3B',
                  }}
                >
                  {sale.id}
                </Typography>
              </TableCell>
              <TableCell>
                <Box
                  sx={{
                    width: '100%',
                    maxWidth: 150,
                  }}
                >
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
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      mt: 0.5,
                    }}
                  >
                    <Chip
                      label={`${sale.progress}%`}
                      size="small"
                      sx={{
                        height: '20px',
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        backgroundColor:
                          sale.progress >= 100
                            ? '#d1fae5'
                            : sale.progress >= 75
                              ? '#bfdbfe'
                              : sale.progress >= 50
                                ? '#fef3c7'
                                : sale.progress >= 25
                                  ? '#fed7aa'
                                  : '#fecaca',
                        color:
                          sale.progress >= 100
                            ? '#065f46'
                            : sale.progress >= 75
                              ? '#1e40af'
                              : sale.progress >= 50
                                ? '#92400e'
                                : sale.progress >= 25
                                  ? '#9a3412'
                                  : '#b91c1c',
                        border:
                          sale.progress >= 100
                            ? '1px solid #a7f3d0'
                            : sale.progress >= 75
                              ? '1px solid #93c5fd'
                              : sale.progress >= 50
                                ? '1px solid #fde68a'
                                : sale.progress >= 25
                                  ? '1px solid #fdba74'
                                  : '1px solid #fca5a5',
                      }}
                    />
                  </Box>
                </Box>
              </TableCell>
              <TableCell>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 500,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {sale.paymentMethod}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 500,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {`${sale.items.count} Items (${sale.items.name} x${sale.items.quantity})`}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 500,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {sale.cashier}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 500,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {sale.dateTime}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: 1,
                  }}
                >
                  <IconButton
                    onClick={() => onViewDetails(sale.id)}
                    size="small"
                    sx={{
                      color: '#3b82f6',
                      backgroundColor: '#f8f9fa',
                      border: '1px solid #e0e0e0',
                      borderRadius: '6px',
                      padding: '8px',
                      '&:hover': {
                        backgroundColor: '#f0f2f5',
                        borderColor: '#3b82f6',
                      },
                    }}
                  >
                    <VisibilityOutlined fontSize="small" />
                  </IconButton>
                  <IconButton
                    onClick={() => onViewReceipt(sale.id)}
                    size="small"
                    sx={{
                      color: '#3b82f6',
                      backgroundColor: '#f8f9fa',
                      border: '1px solid #e0e0e0',
                      borderRadius: '6px',
                      padding: '8px',
                      '&:hover': {
                        backgroundColor: '#f0f2f5',
                        borderColor: '#3b82f6',
                      },
                    }}
                  >
                    <ReceiptLong fontSize="small" />
                  </IconButton>
                  <IconButton
                    onClick={() => onDelete(sale.id)}
                    size="small"
                    sx={{
                      color: '#d32f2f',
                      backgroundColor: '#f8f9fa',
                      border: '1px solid #e0e0e0',
                      borderRadius: '6px',
                      padding: '8px',
                      '&:hover': {
                        backgroundColor: '#fee2e2',
                        borderColor: '#d32f2f',
                      },
                    }}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box sx={{ width: '100%' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography
          variant="h5"
          component="h2"
          sx={{
            fontWeight: 'bold',
            color: '#000',
          }}
        >
          Overall Full Overview
        </Typography>
        <Link
          href="#"
          sx={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            color: '#000',
          }}
        >
          View all my data
          <ChevronRight />
        </Link>
      </Box>

      {isMobile ? renderMobileView() : renderDesktopView()}

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          mt: 0,
          gap: 1,
          alignItems: 'center',
          backgroundColor: '#ffffff',
          padding: '12px 16px',
          borderRadius: '0 0 8px 8px',
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.04)',
          marginTop: '-1px',
          borderTop: '1px solid #E0E0E0',
        }}
      >
        <Typography
          component="span"
          sx={{
            color: '#64748b',
            fontSize: '0.875rem',
            fontWeight: 500,
            padding: '4px 8px',
            borderRadius: '4px',
          }}
        >
          0
        </Typography>
        <Typography
          component="span"
          sx={{
            color: '#fff',
            backgroundColor: '#3b82f6',
            fontSize: '0.875rem',
            fontWeight: 500,
            padding: '4px 10px',
            borderRadius: '4px',
          }}
        >
          1
        </Typography>
        <Typography
          component="span"
          sx={{
            color: '#64748b',
            fontSize: '0.875rem',
            fontWeight: 500,
            padding: '4px 8px',
            borderRadius: '4px',
          }}
        >
          2
        </Typography>
        <IconButton
          size="small"
          sx={{
            color: '#64748b',
            backgroundColor: '#f8f9fa',
            border: '1px solid #e0e0e0',
            borderRadius: '6px',
            padding: '4px',
            '&:hover': {
              backgroundColor: '#f0f2f5',
              borderColor: '#3b82f6',
            },
          }}
        >
          <ChevronRight fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
};

export default SaleTable;
