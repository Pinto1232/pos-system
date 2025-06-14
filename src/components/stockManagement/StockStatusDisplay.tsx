import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  LinearProgress,
  Stack,
  Alert,
  Collapse,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  ExpandMore,
  ExpandLess,
  Lock,
  ShoppingCart,
  Assignment,
  Build,
  Add,
  Remove,
} from '@mui/icons-material';
import { useRealTimeStock } from '@/hooks/useRealTimeStock';
import { getStockLevel } from '@/utils/stockManagement';

interface StockStatusDisplayProps {
  productId: number;
  productName: string;
  showActions?: boolean;
  compact?: boolean;
}

const StockStatusDisplay: React.FC<StockStatusDisplayProps> = ({
  productId,
  productName,
  showActions = true,
  compact = false,
}) => {
  const {
    stockInfo,
    reservations,
    isLoading,
    error,
    reserveStock,
    releaseReservation,
    processSale,
    processReturn,
    refreshStockInfo,
  } = useRealTimeStock(productId);

  const [expandedReservations, setExpandedReservations] = useState(false);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'sale' | 'return' | 'reserve'>(
    'sale'
  );
  const [quantity, setQuantity] = useState(1);
  const [orderId, setOrderId] = useState('');
  const [reservedBy, setReservedBy] = useState('');
  const [reservationType, setReservationType] = useState<
    'cart' | 'order' | 'manual'
  >('cart');

  const stockLevel = stockInfo ? getStockLevel(stockInfo.totalStock) : null;

  const getReservationIcon = (type: string) => {
    switch (type) {
      case 'cart':
        return <ShoppingCart fontSize="small" />;
      case 'order':
        return <Assignment fontSize="small" />;
      case 'manual':
        return <Build fontSize="small" />;
      default:
        return <Lock fontSize="small" />;
    }
  };

  const handleAction = async () => {
    if (!stockInfo) return;

    try {
      switch (actionType) {
        case 'sale':
          await processSale({
            productId,
            quantity,
            orderId: orderId || `SALE-${Date.now()}`,
            timestamp: new Date(),
            unitPrice: 0,
            totalAmount: 0,
          });
          break;
        case 'return':
          await processReturn(quantity, orderId || `RETURN-${Date.now()}`);
          break;
        case 'reserve':
          await reserveStock(
            quantity,
            reservedBy || `USER-${Date.now()}`,
            reservationType
          );
          break;
      }
      setActionDialogOpen(false);
      setQuantity(1);
      setOrderId('');
      setReservedBy('');
    } catch (error) {
      console.error('Action failed:', error);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <LinearProgress />
          <Typography variant="body2" sx={{ mt: 1 }}>
            Loading stock information...
          </Typography>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert
        severity="error"
        action={
          <Button size="small" onClick={refreshStockInfo}>
            Retry
          </Button>
        }
      >
        {error}
      </Alert>
    );
  }

  if (!stockInfo) {
    return (
      <Alert severity="info">
        No stock information available for this product.
      </Alert>
    );
  }

  const stockPercentage =
    stockInfo.totalStock > 0
      ? (stockInfo.availableQuantity / stockInfo.totalStock) * 100
      : 0;

  return (
    <Card>
      <CardContent>
        {!compact && (
          <Typography variant="h6" gutterBottom>
            Stock Status - {productName}
          </Typography>
        )}

        {/* Stock Overview */}
        <Stack spacing={2}>
          <Box>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="body1" fontWeight="medium">
                Total Stock: {stockInfo.totalStock} units
              </Typography>
              {stockLevel && (
                <Chip
                  label={stockLevel.message}
                  color={stockLevel.color}
                  size="small"
                />
              )}
            </Stack>

            <Box sx={{ mt: 1 }}>
              <LinearProgress
                variant="determinate"
                value={stockPercentage}
                color={stockLevel?.color || 'primary'}
                sx={{ height: 8, borderRadius: 4 }}
              />
            </Box>
          </Box>

          <Stack direction="row" spacing={2}>
            <Box flex={1}>
              <Typography variant="body2" color="text.secondary">
                Available
              </Typography>
              <Typography variant="h6" color="success.main">
                {stockInfo.availableQuantity}
              </Typography>
            </Box>
            <Box flex={1}>
              <Typography variant="body2" color="text.secondary">
                Reserved
              </Typography>
              <Typography variant="h6" color="warning.main">
                {stockInfo.lockedQuantity}
              </Typography>
            </Box>
          </Stack>

          {}
          {reservations.length > 0 && (
            <Box>
              <Stack
                direction="row"
                alignItems="center"
                onClick={() => setExpandedReservations(!expandedReservations)}
                sx={{ cursor: 'pointer' }}
              >
                <Lock fontSize="small" color="warning" />
                <Typography variant="body2" sx={{ ml: 1, flex: 1 }}>
                  Active Reservations ({reservations.length})
                </Typography>
                {expandedReservations ? <ExpandLess /> : <ExpandMore />}
              </Stack>

              <Collapse in={expandedReservations}>
                <List dense>
                  {reservations.map((reservation) => (
                    <ListItem key={reservation.id}>
                      <ListItemIcon>
                        {getReservationIcon(reservation.reservationType)}
                      </ListItemIcon>
                      <ListItemText
                        primary={`${reservation.quantity} units - ${reservation.reservationType}`}
                        secondary={`By: ${reservation.reservedBy} | Expires: ${reservation.expiresAt.toLocaleString()}`}
                      />
                      <Button
                        size="small"
                        color="warning"
                        onClick={() => releaseReservation(reservation.id)}
                      >
                        Release
                      </Button>
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            </Box>
          )}

          {}
          {showActions && (
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Quick Actions
              </Typography>
              <Stack direction="row" spacing={1}>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<Remove />}
                  onClick={() => {
                    setActionType('sale');
                    setActionDialogOpen(true);
                  }}
                >
                  Sale
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={() => {
                    setActionType('return');
                    setActionDialogOpen(true);
                  }}
                >
                  Return
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<Lock />}
                  onClick={() => {
                    setActionType('reserve');
                    setActionDialogOpen(true);
                  }}
                >
                  Reserve
                </Button>
              </Stack>
            </Box>
          )}
        </Stack>
      </CardContent>

      {}
      <Dialog
        open={actionDialogOpen}
        onClose={() => setActionDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {actionType === 'sale' && 'Process Sale'}
          {actionType === 'return' && 'Process Return'}
          {actionType === 'reserve' && 'Reserve Stock'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Quantity"
              type="number"
              value={quantity}
              onChange={(e) =>
                setQuantity(Math.max(1, parseInt(e.target.value) || 1))
              }
              fullWidth
            />

            {(actionType === 'sale' || actionType === 'return') && (
              <TextField
                label="Order ID"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder={`${actionType.toUpperCase()}-${Date.now()}`}
                fullWidth
              />
            )}

            {actionType === 'reserve' && (
              <>
                <TextField
                  label="Reserved By"
                  value={reservedBy}
                  onChange={(e) => setReservedBy(e.target.value)}
                  placeholder={`USER-${Date.now()}`}
                  fullWidth
                />
                <FormControl fullWidth>
                  <InputLabel>Reservation Type</InputLabel>
                  <Select
                    value={reservationType}
                    onChange={(e) =>
                      setReservationType(
                        e.target.value as 'cart' | 'order' | 'manual'
                      )
                    }
                    label="Reservation Type"
                  >
                    <MenuItem value="cart">Shopping Cart</MenuItem>
                    <MenuItem value="order">Order</MenuItem>
                    <MenuItem value="manual">Manual</MenuItem>
                  </Select>
                </FormControl>
              </>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setActionDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAction} variant="contained">
            {actionType === 'sale' && 'Process Sale'}
            {actionType === 'return' && 'Process Return'}
            {actionType === 'reserve' && 'Reserve Stock'}
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default StockStatusDisplay;
