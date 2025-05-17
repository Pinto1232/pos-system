import React from 'react';
import { Box, Typography, TextField, Button, Switch, FormControlLabel, Grid, MenuItem } from '@mui/material';

const EmailSettingsContent: React.FC = () => {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Email & Notification Settings
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          SMTP Configuration
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField label="SMTP Server" fullWidth defaultValue="smtp.example.com" size="small" margin="normal" />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField label="SMTP Port" fullWidth defaultValue="587" size="small" margin="normal" type="number" />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField label="Username" fullWidth defaultValue="notifications@pisvaltech.com" size="small" margin="normal" />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField label="Password" fullWidth defaultValue="********" size="small" margin="normal" type="password" />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField select label="Encryption" fullWidth defaultValue="tls" size="small" margin="normal">
              <MenuItem value="none">None</MenuItem>
              <MenuItem value="ssl">SSL</MenuItem>
              <MenuItem value="tls">TLS</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField label="From Email" fullWidth defaultValue="no-reply@pisvaltech.com" size="small" margin="normal" />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="outlined"
              sx={{
                mt: 1,
                textTransform: 'none',
                borderRadius: 2,
              }}
            >
              Test Connection
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Notification Settings
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControlLabel control={<Switch defaultChecked />} label="Send order confirmation emails to customers" />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel control={<Switch defaultChecked />} label="Send low inventory alerts to staff" />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel control={<Switch defaultChecked />} label="Send daily sales summary to managers" />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel control={<Switch />} label="Send promotional emails to customers" />
          </Grid>
        </Grid>
      </Box>

      <Box>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Email Templates
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField select label="Select Template" fullWidth defaultValue="order_confirmation" size="small" margin="normal">
              <MenuItem value="order_confirmation">Order Confirmation</MenuItem>
              <MenuItem value="receipt">Receipt</MenuItem>
              <MenuItem value="password_reset">Password Reset</MenuItem>
              <MenuItem value="welcome">Welcome Email</MenuItem>
              <MenuItem value="inventory_alert">Inventory Alert</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Template Content"
              fullWidth
              multiline
              rows={6}
              defaultValue={`<h1>Order Confirmation</h1>
<p>Dear {{customer_name}},</p>
<p>Thank you for your order. Your order number is <strong>{{order_number}}</strong>.</p>
<p>Order Details:</p>
<ul>
  {{#each items}}
  <li>{{this.quantity}}x {{this.name}} - {{this.price}}</li>
  {{/each}}
</ul>
<p>Total: {{total}}</p>
<p>Thank you for your business!</p>`}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                sx={{
                  textTransform: 'none',
                  borderRadius: 2,
                }}
              >
                Preview
              </Button>
              <Button
                variant="contained"
                sx={{
                  textTransform: 'none',
                  borderRadius: 2,
                }}
              >
                Save Template
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default EmailSettingsContent;
