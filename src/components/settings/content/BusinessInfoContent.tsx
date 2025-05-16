import React from 'react';
import { Box, Typography, TextField, Grid } from '@mui/material';

/**
 * Component for business information settings content
 */
const BusinessInfoContent: React.FC = () => {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Business Information
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            label="Business Name"
            fullWidth
            defaultValue="Pisval Tech"
            size="small"
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Registration Number"
            fullWidth
            defaultValue="REG123456789"
            size="small"
            margin="normal"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Address"
            fullWidth
            multiline
            rows={2}
            defaultValue="123 Business Street, Business District"
            size="small"
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="City"
            fullWidth
            defaultValue="Johannesburg"
            size="small"
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Postal Code"
            fullWidth
            defaultValue="2000"
            size="small"
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Country"
            fullWidth
            defaultValue="South Africa"
            size="small"
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Phone Number"
            fullWidth
            defaultValue="+27 12 345 6789"
            size="small"
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Email"
            fullWidth
            defaultValue="contact@pisvaltech.com"
            size="small"
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Website"
            fullWidth
            defaultValue="www.pisvaltech.com"
            size="small"
            margin="normal"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default BusinessInfoContent;
