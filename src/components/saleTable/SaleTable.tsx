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
  const isMobile = useMediaQuery(
    theme.breakpoints.down('sm')
  );

  const renderMobileView = () => (
    <Stack spacing={2}>
      {sales.map((sale) => (
        <Card
          key={sale.id}
          sx={{ width: '100%' }}
        >
          <CardContent>
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
                  sx={{ fontWeight: 'bold' }}
                >
                  {sale.id}
                </Typography>
                <Box>
                  <IconButton
                    onClick={() =>
                      onViewDetails(sale.id)
                    }
                    size="small"
                    sx={{ color: 'primary.main' }}
                  >
                    <VisibilityOutlined />
                  </IconButton>
                  <IconButton
                    onClick={() =>
                      onViewReceipt(sale.id)
                    }
                    size="small"
                    sx={{
                      color: 'primary.main',
                      mx: 1,
                    }}
                  >
                    <ReceiptLong />
                  </IconButton>
                  <IconButton
                    onClick={() =>
                      onDelete(sale.id)
                    }
                    size="small"
                    sx={{ color: 'error.main' }}
                  >
                    <Delete />
                  </IconButton>
                </Box>
              </Box>

              <Box>
                <Typography
                  variant="caption"
                  sx={{ color: 'text.secondary' }}
                >
                  Progress
                </Typography>
                <Box
                  sx={{ width: '100%', mt: 0.5 }}
                >
                  <LinearProgress
                    variant="determinate"
                    value={sale.progress}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: '#E0E0E0',
                      '& .MuiLinearProgress-bar':
                        {
                          backgroundColor:
                            '#34D399',
                          borderRadius: 4,
                        },
                    }}
                  />
                </Box>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      color: 'text.secondary',
                    }}
                  >
                    Payment Method
                  </Typography>
                  <Typography variant="body2">
                    {sale.paymentMethod}
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      color: 'text.secondary',
                    }}
                  >
                    Items
                  </Typography>
                  <Typography variant="body2">
                    {`${sale.items.count} (${sale.items.name} x${sale.items.quantity})`}
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      color: 'text.secondary',
                    }}
                  >
                    Cashier
                  </Typography>
                  <Typography variant="body2">
                    {sale.cashier}
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      color: 'text.secondary',
                    }}
                  >
                    Date/Time
                  </Typography>
                  <Typography variant="body2">
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
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              Order / Transaction ID
            </TableCell>
            <TableCell>
              Progress / Fulfillment
            </TableCell>
            <TableCell>Payment Method</TableCell>
            <TableCell>
              Item(s) Purchased
            </TableCell>
            <TableCell>Cashier / User</TableCell>
            <TableCell>Date / Time</TableCell>
            <TableCell align="right">
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sales.map((sale) => (
            <TableRow
              key={sale.id}
              sx={{
                '&:last-child td, &:last-child th':
                  { border: 0 },
              }}
            >
              <TableCell>{sale.id}</TableCell>
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
                      '& .MuiLinearProgress-bar':
                        {
                          backgroundColor:
                            '#34D399',
                          borderRadius: 4,
                        },
                    }}
                  />
                </Box>
              </TableCell>
              <TableCell>
                {sale.paymentMethod}
              </TableCell>
              <TableCell>
                {`${sale.items.count} Items (${sale.items.name} x${sale.items.quantity})`}
              </TableCell>
              <TableCell>
                {sale.cashier}
              </TableCell>
              <TableCell>
                {sale.dateTime}
              </TableCell>
              <TableCell align="right">
                <IconButton
                  onClick={() =>
                    onViewDetails(sale.id)
                  }
                  size="small"
                  sx={{ color: 'primary.main' }}
                >
                  <VisibilityOutlined />
                </IconButton>
                <IconButton
                  onClick={() =>
                    onViewReceipt(sale.id)
                  }
                  size="small"
                  sx={{
                    color: 'primary.main',
                    mx: 1,
                  }}
                >
                  <ReceiptLong />
                </IconButton>
                <IconButton
                  onClick={() =>
                    onDelete(sale.id)
                  }
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

      {isMobile
        ? renderMobileView()
        : renderDesktopView()}

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          mt: 2,
          gap: 1,
        }}
      >
        <Typography
          component="span"
          sx={{ color: 'text.secondary' }}
        >
          0
        </Typography>
        <Typography
          component="span"
          sx={{ color: 'primary.main' }}
        >
          1
        </Typography>
        <Typography
          component="span"
          sx={{ color: 'text.secondary' }}
        >
          2
        </Typography>
        <ChevronRight
          sx={{ color: 'text.secondary' }}
        />
      </Box>
    </Box>
  );
};

export default SaleTable;
