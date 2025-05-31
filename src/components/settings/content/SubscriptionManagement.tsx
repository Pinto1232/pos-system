import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Grid,
  Divider,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  CreditCard,
  Download,
  Pause,
  PlayArrow,
  Cancel,
  Refresh,
  SwapHoriz,
  History,
} from '@mui/icons-material';
import { useKeycloakUser } from '@/hooks/useKeycloakUser';
import SubscriptionManagementService from '@/services/subscriptionManagementService';
import { SubscriptionDetails, BillingHistoryItem } from '@/types/settingsTypes';

interface SubscriptionManagementProps {
  onSnackbar: (
    message: string,
    severity: 'success' | 'error' | 'info' | 'warning'
  ) => void;
}

const SubscriptionManagement: React.FC<SubscriptionManagementProps> = ({
  onSnackbar,
}) => {
  const { userId } = useKeycloakUser();
  const [subscription, setSubscription] = useState<SubscriptionDetails | null>(
    null
  );
  const [billingHistory, setBillingHistory] = useState<BillingHistoryItem[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showBillingHistory, setShowBillingHistory] = useState(false);
  const [showPlanChange, setShowPlanChange] = useState(false);
  const [availablePackages, setAvailablePackages] = useState<any[]>([]);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    message: string;
    action: () => void;
  }>({
    open: false,
    title: '',
    message: '',
    action: () => {},
  });

  useEffect(() => {
    if (userId) {
      loadSubscriptionData();
    }
  }, [userId]);

  const loadSubscriptionData = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const [subscriptionData, historyData] = await Promise.all([
        SubscriptionManagementService.getSubscriptionDetails(userId),
        SubscriptionManagementService.getBillingHistory(userId, 5),
      ]);

      setSubscription(subscriptionData);
      setBillingHistory(historyData);
    } catch (error) {
      console.error('Error loading subscription data:', error);
      onSnackbar('Failed to load subscription data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadAvailablePackages = async () => {
    try {
      const packages =
        await SubscriptionManagementService.getAvailablePackages();
      setAvailablePackages(packages);
    } catch (error) {
      console.error('Error loading packages:', error);
      onSnackbar('Failed to load available packages', 'error');
    }
  };

  const handlePlanChange = async (newPackageId: number) => {
    if (!userId) return;

    try {
      setActionLoading(true);
      await SubscriptionManagementService.changePlan({
        userId,
        newPackageId,
        prorated: true,
      });

      await loadSubscriptionData();
      setShowPlanChange(false);
      onSnackbar('Plan changed successfully', 'success');
    } catch (error) {
      console.error('Error changing plan:', error);
      onSnackbar(
        error instanceof Error ? error.message : 'Failed to change plan',
        'error'
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleAction = async (
    action: () => Promise<any>,
    successMessage: string
  ) => {
    try {
      setActionLoading(true);
      await action();
      await loadSubscriptionData();
      onSnackbar(successMessage, 'success');
    } catch (error) {
      console.error('Action failed:', error);
      onSnackbar(
        error instanceof Error ? error.message : 'Action failed',
        'error'
      );
    } finally {
      setActionLoading(false);
      setConfirmDialog({ ...confirmDialog, open: false });
    }
  };

  const pauseSubscription = () => {
    if (!userId) return;
    setConfirmDialog({
      open: true,
      title: 'Pause Subscription',
      message:
        'Are you sure you want to pause your subscription? You will lose access to premium features.',
      action: () =>
        handleAction(
          () => SubscriptionManagementService.pauseSubscription({ userId }),
          'Subscription paused successfully'
        ),
    });
  };

  const resumeSubscription = () => {
    if (!userId) return;
    handleAction(
      () => SubscriptionManagementService.resumeSubscription({ userId }),
      'Subscription resumed successfully'
    );
  };

  const cancelSubscription = () => {
    if (!userId) return;
    setConfirmDialog({
      open: true,
      title: 'Cancel Subscription',
      message:
        'Are you sure you want to cancel your subscription? It will remain active until the end of your current billing period.',
      action: () =>
        handleAction(
          () => SubscriptionManagementService.cancelSubscription(userId, false),
          'Subscription will be canceled at the end of the billing period'
        ),
    });
  };

  const reactivateSubscription = () => {
    if (!userId) return;
    handleAction(
      () => SubscriptionManagementService.reactivateSubscription({ userId }),
      'Subscription reactivated successfully'
    );
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!subscription) {
    return (
      <Box p={3}>
        <Alert severity="info">
          No active subscription found. Please purchase a subscription to access
          premium features.
        </Alert>
      </Box>
    );
  }

  const statusInfo = SubscriptionManagementService.getStatusDisplay(
    subscription.status
  );
  const canModify = SubscriptionManagementService.canModifySubscription(
    subscription.status
  );
  const canPause = SubscriptionManagementService.canPauseSubscription(
    subscription.status
  );
  const canResume = SubscriptionManagementService.canResumeSubscription(
    subscription.status
  );
  const canReactivate = SubscriptionManagementService.canReactivateSubscription(
    subscription.status,
    subscription.cancelAtPeriodEnd
  );

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Subscription Management
      </Typography>

      {}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Typography variant="h6" gutterBottom>
                Current Plan: {subscription.package.title}
              </Typography>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Chip
                  label={statusInfo.text}
                  sx={{ backgroundColor: statusInfo.color, color: 'white' }}
                />
                {subscription.cancelAtPeriodEnd && (
                  <Chip label="Canceling at period end" color="warning" />
                )}
              </Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {SubscriptionManagementService.formatCurrency(
                  subscription.package.price,
                  subscription.currency
                )}{' '}
                / month
              </Typography>
              {subscription.nextBillingDate && (
                <Typography variant="body2" color="text.secondary">
                  Next billing:{' '}
                  {SubscriptionManagementService.formatDate(
                    subscription.nextBillingDate
                  )}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12} md={4}>
              <Box display="flex" flexDirection="column" gap={1}>
                {canPause && (
                  <Button
                    variant="outlined"
                    startIcon={<Pause />}
                    onClick={pauseSubscription}
                    disabled={actionLoading}
                    size="small"
                  >
                    Pause
                  </Button>
                )}
                {canResume && (
                  <Button
                    variant="contained"
                    startIcon={<PlayArrow />}
                    onClick={resumeSubscription}
                    disabled={actionLoading}
                    size="small"
                  >
                    Resume
                  </Button>
                )}
                {canReactivate && (
                  <Button
                    variant="contained"
                    startIcon={<Refresh />}
                    onClick={reactivateSubscription}
                    disabled={actionLoading}
                    size="small"
                  >
                    Reactivate
                  </Button>
                )}
                {canModify && (
                  <Button
                    variant="outlined"
                    startIcon={<SwapHoriz />}
                    onClick={() => {
                      setShowPlanChange(true);
                      if (availablePackages.length === 0) {
                        loadAvailablePackages();
                      }
                    }}
                    disabled={actionLoading}
                    size="small"
                  >
                    Change Plan
                  </Button>
                )}
                {canModify && !subscription.cancelAtPeriodEnd && (
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<Cancel />}
                    onClick={cancelSubscription}
                    disabled={actionLoading}
                    size="small"
                  >
                    Cancel
                  </Button>
                )}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {}
      {subscription.paymentMethod && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Payment Method
            </Typography>
            <Box display="flex" alignItems="center" gap={2}>
              <CreditCard />
              <Box>
                <Typography variant="body1">
                  {subscription.paymentMethod.card?.brand.toUpperCase()} ending
                  in {subscription.paymentMethod.card?.last4}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Expires {subscription.paymentMethod.card?.expMonth}/
                  {subscription.paymentMethod.card?.expYear}
                </Typography>
              </Box>
              <Button variant="outlined" size="small" sx={{ ml: 'auto' }}>
                Update
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {}
      <Card>
        <CardContent>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h6">Recent Billing History</Typography>
            <Button
              variant="outlined"
              startIcon={<History />}
              onClick={() => setShowBillingHistory(true)}
              size="small"
            >
              View All
            </Button>
          </Box>
          {billingHistory.length > 0 ? (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell align="center">Invoice</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {billingHistory.slice(0, 3).map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        {SubscriptionManagementService.formatDate(item.date)}
                      </TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell align="right">
                        {SubscriptionManagementService.formatCurrency(
                          item.amount,
                          item.currency
                        )}
                      </TableCell>
                      <TableCell align="center">
                        {item.invoicePdf && (
                          <Tooltip title="Download Invoice">
                            <IconButton
                              size="small"
                              onClick={() =>
                                window.open(item.invoicePdf, '_blank')
                              }
                            >
                              <Download />
                            </IconButton>
                          </Tooltip>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No billing history available
            </Typography>
          )}
        </CardContent>
      </Card>

      {}
      <Dialog
        open={showPlanChange}
        onClose={() => setShowPlanChange(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Change Subscription Plan</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Select a new plan. Changes will be prorated and take effect
            immediately.
          </Typography>
          <Box mt={2}>
            {availablePackages.length > 0 ? (
              availablePackages
                .filter((pkg) => pkg.id !== subscription?.package.id)
                .map((pkg) => (
                  <Card
                    key={pkg.id}
                    sx={{
                      mb: 2,
                      cursor: 'pointer',
                      '&:hover': { boxShadow: 2 },
                    }}
                    onClick={() => handlePlanChange(pkg.id)}
                  >
                    <CardContent>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Box>
                          <Typography variant="h6">{pkg.title}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {pkg.description}
                          </Typography>
                        </Box>
                        <Typography variant="h6" color="primary">
                          {SubscriptionManagementService.formatCurrency(
                            pkg.price,
                            subscription?.currency || 'USD'
                          )}
                          <Typography variant="caption" display="block">
                            /month
                          </Typography>
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                ))
            ) : (
              <Box display="flex" justifyContent="center" p={2}>
                <Button
                  onClick={loadAvailablePackages}
                  disabled={actionLoading}
                >
                  {actionLoading ? (
                    <CircularProgress size={20} />
                  ) : (
                    'Load Available Plans'
                  )}
                </Button>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPlanChange(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {}
      <Dialog
        open={showBillingHistory}
        onClose={() => setShowBillingHistory(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Billing History</DialogTitle>
        <DialogContent>
          {billingHistory.length > 0 ? (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="center">Invoice</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {billingHistory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        {SubscriptionManagementService.formatDate(item.date)}
                      </TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell align="right">
                        {SubscriptionManagementService.formatCurrency(
                          item.amount,
                          item.currency
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={item.status}
                          color={item.status === 'paid' ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        {item.invoicePdf && (
                          <Tooltip title="Download Invoice">
                            <IconButton
                              size="small"
                              onClick={() =>
                                window.open(item.invoicePdf, '_blank')
                              }
                            >
                              <Download />
                            </IconButton>
                          </Tooltip>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No billing history available
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowBillingHistory(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {}
      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ ...confirmDialog, open: false })}
      >
        <DialogTitle>{confirmDialog.title}</DialogTitle>
        <DialogContent>
          <Typography>{confirmDialog.message}</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setConfirmDialog({ ...confirmDialog, open: false })}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmDialog.action}
            variant="contained"
            disabled={actionLoading}
          >
            {actionLoading ? <CircularProgress size={20} /> : 'Confirm'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SubscriptionManagement;
