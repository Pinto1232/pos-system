import React from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Grid,
  Paper,
  Switch,
  FormControlLabel,
  Divider,
  IconButton,
  InputAdornment,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import RefreshIcon from '@mui/icons-material/Refresh';

const ApiIntegrationsContent: React.FC = () => {
  const [showApiKey, setShowApiKey] = React.useState(false);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        API & Third-Party Integrations
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          API Access
        </Typography>
        <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControlLabel control={<Switch defaultChecked />} label="Enable API Access" />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="API Key"
                fullWidth
                value="sk_live_51KjTygH7NbkJdF5gH7NbkJdF5gH7NbkJdF5g"
                type={showApiKey ? 'text' : 'password'}
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowApiKey(!showApiKey)} edge="end">
                        {showApiKey ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                      <IconButton edge="end">
                        <ContentCopyIcon />
                      </IconButton>
                      <IconButton edge="end">
                        <RefreshIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Typography variant="caption" color="text.secondary">
                This key provides full access to your API. Keep it secure and never share it publicly.
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  mt: 1,
                }}
              >
                <Button
                  variant="outlined"
                  sx={{
                    textTransform: 'none',
                    borderRadius: 2,
                  }}
                >
                  Regenerate Key
                </Button>
                <Button
                  variant="outlined"
                  sx={{
                    textTransform: 'none',
                    borderRadius: 2,
                  }}
                >
                  View API Documentation
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Payment Gateways
        </Typography>
        <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                  }}
                >
                  <Box
                    component="img"
                    src="/stripe-logo.png"
                    alt="Stripe"
                    sx={{
                      width: 40,
                      height: 40,
                      objectFit: 'contain',
                    }}
                  />
                  <Typography variant="subtitle1">Stripe</Typography>
                </Box>
                <FormControlLabel control={<Switch defaultChecked />} label="Enabled" />
              </Box>
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="API Key"
                    fullWidth
                    defaultValue="sk_test_51KjTygH7NbkJdF5gH7NbkJdF5gH7NbkJdF5g"
                    type="password"
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField label="Webhook Secret" fullWidth defaultValue="whsec_12345abcdef" type="password" size="small" />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                  }}
                >
                  <Box
                    component="img"
                    src="/paypal-logo.png"
                    alt="PayPal"
                    sx={{
                      width: 40,
                      height: 40,
                      objectFit: 'contain',
                    }}
                  />
                  <Typography variant="subtitle1">PayPal</Typography>
                </Box>
                <FormControlLabel control={<Switch />} label="Enabled" />
              </Box>
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField label="Client ID" fullWidth defaultValue="" size="small" disabled />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField label="Client Secret" fullWidth defaultValue="" type="password" size="small" disabled />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      <Box>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Third-Party Services
        </Typography>
        <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                  }}
                >
                  <Box
                    component="img"
                    src="/google-analytics-logo.png"
                    alt="Google Analytics"
                    sx={{
                      width: 40,
                      height: 40,
                      objectFit: 'contain',
                    }}
                  />
                  <Typography variant="subtitle1">Google Analytics</Typography>
                </Box>
                <FormControlLabel control={<Switch defaultChecked />} label="Enabled" />
              </Box>
              <Divider sx={{ my: 2 }} />
              <TextField label="Tracking ID" fullWidth defaultValue="UA-123456789-1" size="small" />
            </Grid>

            <Grid item xs={12}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                  }}
                >
                  <Box
                    component="img"
                    src="/mailchimp-logo.png"
                    alt="Mailchimp"
                    sx={{
                      width: 40,
                      height: 40,
                      objectFit: 'contain',
                    }}
                  />
                  <Typography variant="subtitle1">Mailchimp</Typography>
                </Box>
                <FormControlLabel control={<Switch />} label="Enabled" />
              </Box>
              <Divider sx={{ my: 2 }} />
              <TextField label="API Key" fullWidth defaultValue="" size="small" disabled />
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Box>
  );
};

export default ApiIntegrationsContent;
