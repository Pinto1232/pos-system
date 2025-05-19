import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
  Grid,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Paper,
  Chip,
  IconButton,
  CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

interface CreateRoleModalProps {
  open: boolean;
  onClose: () => void;
  newRoleName: string;
  setNewRoleName: (name: string) => void;
  newRoleDescription: string;
  setNewRoleDescription: (description: string) => void;
  selectedTemplate: string;
  setSelectedTemplate: (template: string) => void;
  configurePermissionsAfter: boolean;
  setConfigurePermissionsAfter: (configure: boolean) => void;
  roleNameError: string;
  createRolePending: boolean;
  handleCreateRole: () => void;
  getTemplatePermissions: (template: string) => string[];
}

const CreateRoleModal: React.FC<CreateRoleModalProps> = ({
  open,
  onClose,
  newRoleName,
  setNewRoleName,
  newRoleDescription,
  setNewRoleDescription,
  selectedTemplate,
  setSelectedTemplate,
  configurePermissionsAfter,
  setConfigurePermissionsAfter,
  roleNameError,
  createRolePending,
  handleCreateRole,
  getTemplatePermissions,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(23, 58, 121, 0.2)',
          background:
            'linear-gradient(135deg, rgba(23, 58, 121, 0.1) 0%, rgba(23, 58, 121, 0.05) 100%)',
          border: '1px solid rgba(23, 58, 121, 0.1)',
          backdropFilter: 'blur(4px)',
        },
      }}
    >
      <Box
        sx={{
          p: 2,
          background: 'linear-gradient(135deg, #173A79 0%, #2a5cbb 100%)',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box>
          <Typography variant="h6" component="div" fontWeight="bold">
            Create New Role
          </Typography>
          <Typography
            variant="body2"
            component="div"
            sx={{
              opacity: 0.85,
              mb: 0,
            }}
          >
            Define custom roles with specific permissions
          </Typography>
        </Box>
        <IconButton
          edge="end"
          color="inherit"
          onClick={onClose}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent
        sx={{
          p: 3,
          background: 'rgba(255, 255, 255, 0.8)',
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              <Typography variant="subtitle1" fontWeight="bold">
                Role Information
              </Typography>
              <TextField
                label="Role Name"
                placeholder="Enter role name"
                fullWidth
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
                error={!!roleNameError}
                helperText={
                  roleNameError || 'Choose a descriptive name for this role'
                }
                autoFocus
              />
              <TextField
                label="Description"
                placeholder="Enter role description"
                fullWidth
                multiline
                rows={3}
                value={newRoleDescription}
                onChange={(e) => setNewRoleDescription(e.target.value)}
                helperText="Describe the purpose and responsibilities of this role"
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                height: '100%',
              }}
            >
              <Typography variant="subtitle1" fontWeight="bold">
                Role Template
              </Typography>
              <TextField
                select
                label="Start with template"
                fullWidth
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                helperText="Optionally start with predefined permissions"
              >
                <MenuItem value="">
                  <em>None (Start from scratch)</em>
                </MenuItem>
                <MenuItem value="manager">Manager Template</MenuItem>
                <MenuItem value="cashier">Cashier Template</MenuItem>
                <MenuItem value="inventory">Inventory Staff Template</MenuItem>
              </TextField>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mt: 'auto',
                  pt: 2,
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={configurePermissionsAfter}
                      onChange={(e) =>
                        setConfigurePermissionsAfter(e.target.checked)
                      }
                    />
                  }
                  label="Configure permissions after creation"
                />
              </Box>
            </Box>
          </Grid>
        </Grid>

        {}
        {selectedTemplate && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Template Permissions Preview
            </Typography>
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                maxHeight: '200px',
                overflow: 'auto',
                bgcolor: '#f9f9f9',
              }}
            >
              <Grid container spacing={1}>
                {getTemplatePermissions(selectedTemplate).map((permission) => (
                  <Grid
                    item
                    xs={6}
                    sm={4}
                    key={`${selectedTemplate}-${permission}`}
                  >
                    <Chip
                      label={permission}
                      size="small"
                      sx={{
                        bgcolor: 'rgba(23, 58, 121, 0.1)',
                        color: '#173A79',
                        fontWeight: 500,
                        mb: 1,
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Box>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          p: 2,
          borderTop: '1px solid rgba(23, 58, 121, 0.1)',
          bgcolor: 'rgba(249, 249, 249, 0.9)',
        }}
      >
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            mr: 1,
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          startIcon={createRolePending ? null : <AddIcon />}
          onClick={handleCreateRole}
          disabled={!newRoleName.trim() || createRolePending}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            bgcolor: '#173A79',
            '&:hover': {
              bgcolor: '#2a5cbb',
            },
            minWidth: '120px',
          }}
        >
          {createRolePending ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            'Create Role'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateRoleModal;
