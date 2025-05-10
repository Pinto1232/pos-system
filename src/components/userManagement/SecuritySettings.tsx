'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  Paper,
  Grid,
  Alert,
  Snackbar,
} from '@mui/material';
import { SecuritySettings as SecuritySettingsType } from '@/types/userManagement';

interface SecuritySettingsProps {
  settings: SecuritySettingsType;
  onUpdateSettings: (settings: SecuritySettingsType) => void;
}

const SecuritySettings: React.FC<SecuritySettingsProps> = ({
  settings,
  onUpdateSettings,
}) => {
  const [formData, setFormData] = useState<SecuritySettingsType>(settings);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const [section, field] = name.split('.');
    
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section as keyof SecuritySettingsType],
        [field]: parseInt(value, 10) || 0,
      },
    }));
  };

  const handleSwitchChange = (name: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    const [section, field] = name.split('.');
    
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section as keyof SecuritySettingsType],
        [field]: checked,
      },
    }));
  };

  const handleSave = () => {
    onUpdateSettings(formData);
    setShowSuccess(true);
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
          Security Settings
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Configure security policies for your organization. These settings affect all users.
        </Typography>
      </Box>

      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        <Paper sx={{ p: 3, mb: 3, border: '1px solid #e0e0e0' }} elevation={0}>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2 }}>
            Password Policy
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography>Minimum Password Length</Typography>
                <TextField
                  name="passwordPolicy.minLength"
                  type="number"
                  size="small"
                  value={formData.passwordPolicy.minLength}
                  onChange={handleNumberChange}
                  InputProps={{ inputProps: { min: 6, max: 20 } }}
                  sx={{ width: 100 }}
                />
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography>Password Expiry (days)</Typography>
                <TextField
                  name="passwordPolicy.expiryDays"
                  type="number"
                  size="small"
                  value={formData.passwordPolicy.expiryDays}
                  onChange={handleNumberChange}
                  InputProps={{ inputProps: { min: 30, max: 365 } }}
                  sx={{ width: 100 }}
                />
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.passwordPolicy.requireSpecialChars}
                    onChange={handleSwitchChange('passwordPolicy.requireSpecialChars')}
                    color="primary"
                  />
                }
                label="Require Special Characters"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.passwordPolicy.twoFactorEnabled}
                    onChange={handleSwitchChange('passwordPolicy.twoFactorEnabled')}
                    color="primary"
                  />
                }
                label="Two-Factor Authentication"
              />
            </Grid>
          </Grid>
          
          {formData.passwordPolicy.twoFactorEnabled && (
            <Alert severity="info" sx={{ mt: 2 }}>
              Two-factor authentication requires users to provide a second form of verification when logging in.
            </Alert>
          )}
        </Paper>
        
        <Paper sx={{ p: 3, mb: 3, border: '1px solid #e0e0e0' }} elevation={0}>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2 }}>
            Session Management
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography>Auto Logout After Inactivity (minutes)</Typography>
                <TextField
                  name="sessionSettings.autoLogoutMinutes"
                  type="number"
                  size="small"
                  value={formData.sessionSettings.autoLogoutMinutes}
                  onChange={handleNumberChange}
                  InputProps={{ inputProps: { min: 5, max: 120 } }}
                  sx={{ width: 100 }}
                />
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography>Maximum Concurrent Sessions</Typography>
                <TextField
                  name="sessionSettings.maxConcurrentSessions"
                  type="number"
                  size="small"
                  value={formData.sessionSettings.maxConcurrentSessions}
                  onChange={handleNumberChange}
                  InputProps={{ inputProps: { min: 1, max: 5 } }}
                  sx={{ width: 100 }}
                />
              </Box>
            </Grid>
          </Grid>
        </Paper>
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            sx={{ borderRadius: 2, textTransform: 'none' }}
          >
            Save Security Settings
          </Button>
        </Box>
      </Box>
      
      <Snackbar
        open={showSuccess}
        autoHideDuration={6000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setShowSuccess(false)} severity="success" sx={{ width: '100%' }}>
          Security settings updated successfully
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SecuritySettings;
