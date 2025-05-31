'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Chip,
  Alert,
  Divider,
  TextField,
  FormControlLabel,
  Switch,
  Paper,
} from '@mui/material';
import { useKeycloakUser } from '@/hooks/useKeycloakUser';
import { useAdvancedPermissions } from '@/hooks/useAdvancedPermissions';
import AdvancedFeatureGuard from '@/components/feature-access/AdvancedFeatureGuard';

const AdvancedFeatureDemo: React.FC = () => {
  const { userId } = useKeycloakUser();
  const {
    features,
    featureFlags,
    featureAccess,
    isLoading,
    hasErrors,
    accessibleFeatures,
    checkFeatureAccess,
    trackFeatureUsage,
    createFeatureFlag,
    enableFeatureForUser,
    disableFeatureForUser,
    refresh,
  } = useAdvancedPermissions({ autoRefresh: true, refreshInterval: 60000 });

  const [newFeatureName, setNewFeatureName] = useState('');
  const [newFeatureDescription, setNewFeatureDescription] = useState('');
  const [newFeatureEnabled, setNewFeatureEnabled] = useState(true);
  const [testFeatureName, setTestFeatureName] = useState('Advanced Reporting');

  const handleCreateFeatureFlag = async () => {
    if (!newFeatureName || !newFeatureDescription) return;

    const success = await createFeatureFlag({
      name: newFeatureName,
      description: newFeatureDescription,
      isEnabled: newFeatureEnabled,
      type: 'global',
      priority: 1,
    });

    if (success) {
      setNewFeatureName('');
      setNewFeatureDescription('');
      setNewFeatureEnabled(true);
    }
  };

  const handleTestFeatureAccess = async () => {
    if (!testFeatureName || !userId) return;
    await checkFeatureAccess(testFeatureName);
  };

  const handleTrackUsage = async (featureName: string) => {
    if (!userId) return;
    await trackFeatureUsage(featureName, {
      action: 'demo_usage',
      timestamp: new Date().toISOString(),
    });
  };

  const handleToggleFeatureForUser = async (
    featureName: string,
    enable: boolean
  ) => {
    if (!userId) return;

    if (enable) {
      await enableFeatureForUser(userId, featureName, 'Demo enable');
    } else {
      await disableFeatureForUser(userId, featureName, 'Demo disable');
    }
  };

  if (isLoading) {
    return (
      <Box p={3}>
        <Typography>Loading advanced permissions demo...</Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Advanced Feature Access Control Demo
      </Typography>

      {hasErrors && (
        <Alert severity="error" sx={{ mb: 3 }}>
          There were errors loading permission data. Some features may not work
          correctly.
        </Alert>
      )}

      <Grid container spacing={3}>
        {}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Your Available Features
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                {features.map((feature) => (
                  <Chip
                    key={feature}
                    label={feature}
                    color="primary"
                    variant="outlined"
                    onClick={() => handleTrackUsage(feature)}
                    clickable
                  />
                ))}
              </Box>
              <Typography variant="caption" color="text.secondary">
                Click on a feature to track usage
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Active Feature Flags
              </Typography>
              <Box display="flex" flexDirection="column" gap={1}>
                {featureFlags.map((flag) => (
                  <Paper key={flag.id} sx={{ p: 2 }} variant="outlined">
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Box>
                        <Typography variant="subtitle2">{flag.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {flag.description}
                        </Typography>
                      </Box>
                      <Chip
                        label={flag.isEnabled ? 'Enabled' : 'Disabled'}
                        color={flag.isEnabled ? 'success' : 'default'}
                        size="small"
                      />
                    </Box>
                  </Paper>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Test Feature Access
              </Typography>
              <Box display="flex" gap={2} mb={2}>
                <TextField
                  label="Feature Name"
                  value={testFeatureName}
                  onChange={(e) => setTestFeatureName(e.target.value)}
                  size="small"
                  fullWidth
                />
                <Button
                  variant="contained"
                  onClick={handleTestFeatureAccess}
                  disabled={!testFeatureName}
                >
                  Test Access
                </Button>
              </Box>

              {featureAccess[testFeatureName] && (
                <Alert
                  severity={
                    featureAccess[testFeatureName].hasAccess
                      ? 'success'
                      : 'warning'
                  }
                  sx={{ mt: 2 }}
                >
                  <Typography variant="body2">
                    <strong>Access:</strong>{' '}
                    {featureAccess[testFeatureName].hasAccess
                      ? 'Granted'
                      : 'Denied'}
                  </Typography>
                  {featureAccess[testFeatureName].result && (
                    <>
                      <Typography variant="body2">
                        <strong>Reason:</strong>{' '}
                        {featureAccess[testFeatureName].result!.reason}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Evaluation Time:</strong>{' '}
                        {
                          featureAccess[testFeatureName].result!
                            .evaluationTimeMs
                        }
                        ms
                      </Typography>
                      {featureAccess[testFeatureName].result!.appliedRules
                        .length > 0 && (
                        <Box mt={1}>
                          <Typography variant="caption">
                            Applied Rules:
                          </Typography>
                          <Box
                            display="flex"
                            flexWrap="wrap"
                            gap={0.5}
                            mt={0.5}
                          >
                            {featureAccess[
                              testFeatureName
                            ].result!.appliedRules.map((rule, index) => (
                              <Chip
                                key={index}
                                label={rule}
                                size="small"
                                variant="outlined"
                              />
                            ))}
                          </Box>
                        </Box>
                      )}
                    </>
                  )}
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        {}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Create Feature Flag
              </Typography>
              <Box display="flex" flexDirection="column" gap={2}>
                <TextField
                  label="Feature Name"
                  value={newFeatureName}
                  onChange={(e) => setNewFeatureName(e.target.value)}
                  size="small"
                  fullWidth
                />
                <TextField
                  label="Description"
                  value={newFeatureDescription}
                  onChange={(e) => setNewFeatureDescription(e.target.value)}
                  size="small"
                  fullWidth
                  multiline
                  rows={2}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={newFeatureEnabled}
                      onChange={(e) => setNewFeatureEnabled(e.target.checked)}
                    />
                  }
                  label="Enabled"
                />
                <Button
                  variant="contained"
                  onClick={handleCreateFeatureFlag}
                  disabled={!newFeatureName || !newFeatureDescription}
                >
                  Create Feature Flag
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Advanced Feature Guard Demo
              </Typography>
              <Divider sx={{ my: 2 }} />

              <AdvancedFeatureGuard
                featureName="Advanced Reporting"
                trackUsage={true}
                showUsageInfo={true}
                showAccessReason={true}
                onAccessDenied={(reason) =>
                  console.log('Access denied:', reason)
                }
                onUsageTracked={(usage) => console.log('Usage tracked:', usage)}
              >
                <Alert severity="success">
                  <Typography variant="h6">
                    🎉 Advanced Reporting Feature
                  </Typography>
                  <Typography>
                    You have access to advanced reporting! This content is only
                    visible to users with the proper permissions.
                  </Typography>
                  <Box mt={2}>
                    <Button variant="contained" color="primary">
                      Generate Advanced Report
                    </Button>
                  </Box>
                </Alert>
              </AdvancedFeatureGuard>

              <Box mt={3}>
                <AdvancedFeatureGuard
                  featureName="Premium Analytics"
                  trackUsage={true}
                  showUsageInfo={true}
                  showAccessReason={true}
                >
                  <Alert severity="info">
                    <Typography variant="h6">📊 Premium Analytics</Typography>
                    <Typography>
                      Access to premium analytics dashboard with real-time
                      insights.
                    </Typography>
                  </Alert>
                </AdvancedFeatureGuard>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Box display="flex" gap={2} flexWrap="wrap">
                <Button
                  variant="outlined"
                  onClick={() =>
                    handleToggleFeatureForUser('Advanced Reporting', true)
                  }
                >
                  Enable Advanced Reporting
                </Button>
                <Button
                  variant="outlined"
                  onClick={() =>
                    handleToggleFeatureForUser('Advanced Reporting', false)
                  }
                >
                  Disable Advanced Reporting
                </Button>
                <Button variant="outlined" onClick={refresh}>
                  Refresh Permissions
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdvancedFeatureDemo;
