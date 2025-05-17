import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  Grid,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface PackageManagementContentProps {
  packages: any[] | undefined;
  subscription: any;
  availableFeatures: string[];
  enableAdditionalPackage: (packageId: number) => Promise<void>;
  disableAdditionalPackage: (packageId: number) => Promise<void>;
}

const PackageManagementContent: React.FC<PackageManagementContentProps> = ({
  packages,
  subscription,
  availableFeatures,
  enableAdditionalPackage,
  disableAdditionalPackage,
}) => {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Package Management
      </Typography>

      <Paper
        variant="outlined"
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 2,
          bgcolor: '#f8f8f8',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">
              Current Subscription
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Your current active subscription package
            </Typography>
          </Box>
          <Chip
            label="Active"
            color="success"
            size="small"
            icon={<CheckCircleIcon />}
          />
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              bgcolor: '#173A79',
              color: 'white',
              fontWeight: 'bold',
              minWidth: '100px',
              textAlign: 'center',
            }}
          >
            {subscription?.package?.title || 'Starter'}
          </Box>
          <Box>
            <Typography variant="body2">
              Started:{' '}
              {new Date(
                subscription?.startDate || Date.now()
              ).toLocaleDateString()}
            </Typography>
            <Typography variant="body2">
              Next billing:{' '}
              {new Date(
                Date.now() + 30 * 24 * 60 * 60 * 1000
              ).toLocaleDateString()}
            </Typography>
          </Box>
        </Box>
      </Paper>

      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
        Available Packages
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Upgrade your subscription or add additional packages to access more
        features
      </Typography>

      <Grid container spacing={2}>
        {(packages || []).map((pkg) => (
          <Grid item xs={12} sm={6} md={3} key={pkg.id}>
            <Card
              variant="outlined"
              sx={{
                borderRadius: 2,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderColor:
                  pkg.id === subscription?.pricingPackageId
                    ? '#173A79'
                    : undefined,
                boxShadow:
                  pkg.id === subscription?.pricingPackageId
                    ? '0 0 0 2px rgba(23, 58, 121, 0.2)'
                    : undefined,
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {pkg.title}
                </Typography>
                <Typography variant="h5" color="primary" gutterBottom>
                  ${pkg.price}/mo
                </Typography>
                <Box sx={{ mt: 2 }}>
                  {pkg.description
                    .split(';')
                    .map((feature: string, index: number) => (
                      <Box
                        key={index}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          mb: 1,
                        }}
                      >
                        <CheckCircleIcon color="success" fontSize="small" />
                        <Typography variant="body2">{feature}</Typography>
                      </Box>
                    ))}
                </Box>
              </CardContent>
              <CardActions>
                {pkg.id === subscription?.pricingPackageId ? (
                  <Button
                    fullWidth
                    variant="contained"
                    disabled
                    sx={{
                      textTransform: 'none',
                      borderRadius: 2,
                    }}
                  >
                    Current Plan
                  </Button>
                ) : subscription?.additionalPackages?.includes(pkg.id) ? (
                  <Button
                    fullWidth
                    variant="outlined"
                    color="error"
                    onClick={() => disableAdditionalPackage(pkg.id)}
                    sx={{
                      textTransform: 'none',
                      borderRadius: 2,
                    }}
                  >
                    Disable
                  </Button>
                ) : (
                  <Button
                    fullWidth
                    variant="outlined"
                    color="primary"
                    onClick={() => enableAdditionalPackage(pkg.id)}
                    sx={{
                      textTransform: 'none',
                      borderRadius: 2,
                    }}
                  >
                    {pkg.id > subscription?.pricingPackageId
                      ? 'Upgrade'
                      : 'Enable'}
                  </Button>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PackageManagementContent;
