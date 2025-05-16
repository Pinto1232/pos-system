import React from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  FormControlLabel,
  Switch,
  TextField,
  MenuItem,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import RestoreIcon from '@mui/icons-material/Restore';
import DeleteIcon from '@mui/icons-material/Delete';
import BackupIcon from '@mui/icons-material/Backup';

/**
 * Component for system backup settings content
 */
const SystemBackupContent: React.FC = () => {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        System Backup & Restore
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Typography
            variant="subtitle1"
            fontWeight="bold"
          >
            Manual Backup
          </Typography>
          <Button
            variant="contained"
            startIcon={<BackupIcon />}
            sx={{
              textTransform: 'none',
              borderRadius: 2,
            }}
          >
            Create Backup Now
          </Button>
        </Box>
        <Typography
          variant="body2"
          color="text.secondary"
          paragraph
        >
          Create a manual backup of your system
          data. This includes all settings,
          products, customers, and transaction
          history.
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography
          variant="subtitle1"
          fontWeight="bold"
          gutterBottom
        >
          Automatic Backup Settings
        </Typography>
        <Paper
          variant="outlined"
          sx={{ p: 2, borderRadius: 2 }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Enable automatic backups"
            />

            <Box
              sx={{
                display: 'flex',
                gap: 2,
                alignItems: 'center',
              }}
            >
              <Typography variant="body2">
                Backup frequency:
              </Typography>
              <TextField
                select
                defaultValue="daily"
                size="small"
                sx={{ minWidth: 150 }}
              >
                <MenuItem value="hourly">
                  Hourly
                </MenuItem>
                <MenuItem value="daily">
                  Daily
                </MenuItem>
                <MenuItem value="weekly">
                  Weekly
                </MenuItem>
                <MenuItem value="monthly">
                  Monthly
                </MenuItem>
              </TextField>
            </Box>

            <Box
              sx={{
                display: 'flex',
                gap: 2,
                alignItems: 'center',
              }}
            >
              <Typography variant="body2">
                Retention period:
              </Typography>
              <TextField
                select
                defaultValue="30"
                size="small"
                sx={{ minWidth: 150 }}
              >
                <MenuItem value="7">
                  7 days
                </MenuItem>
                <MenuItem value="30">
                  30 days
                </MenuItem>
                <MenuItem value="90">
                  90 days
                </MenuItem>
                <MenuItem value="365">
                  1 year
                </MenuItem>
              </TextField>
            </Box>

            <Box
              sx={{
                display: 'flex',
                gap: 2,
                alignItems: 'center',
              }}
            >
              <Typography variant="body2">
                Backup location:
              </Typography>
              <TextField
                select
                defaultValue="local"
                size="small"
                sx={{ minWidth: 150 }}
              >
                <MenuItem value="local">
                  Local Storage
                </MenuItem>
                <MenuItem value="cloud">
                  Cloud Storage
                </MenuItem>
                <MenuItem value="both">
                  Both
                </MenuItem>
              </TextField>
            </Box>
          </Box>
        </Paper>
      </Box>

      <Box>
        <Typography
          variant="subtitle1"
          fontWeight="bold"
          gutterBottom
        >
          Backup History
        </Typography>
        <TableContainer
          component={Paper}
          variant="outlined"
          sx={{ borderRadius: 2 }}
        >
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Backup Date</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Size</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[
                {
                  date: '2023-06-15 08:00:00',
                  type: 'Automatic',
                  size: '24.5 MB',
                  status: 'Completed',
                },
                {
                  date: '2023-06-14 08:00:00',
                  type: 'Automatic',
                  size: '24.3 MB',
                  status: 'Completed',
                },
                {
                  date: '2023-06-13 15:30:22',
                  type: 'Manual',
                  size: '24.2 MB',
                  status: 'Completed',
                },
                {
                  date: '2023-06-13 08:00:00',
                  type: 'Automatic',
                  size: '24.1 MB',
                  status: 'Completed',
                },
                {
                  date: '2023-06-12 08:00:00',
                  type: 'Automatic',
                  size: '23.9 MB',
                  status: 'Completed',
                },
              ].map((backup, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {backup.date}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={backup.type}
                      size="small"
                      color={
                        backup.type === 'Manual'
                          ? 'primary'
                          : 'default'
                      }
                      variant={
                        backup.type === 'Manual'
                          ? 'filled'
                          : 'outlined'
                      }
                    />
                  </TableCell>
                  <TableCell>
                    {backup.size}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={backup.status}
                      size="small"
                      color={
                        backup.status ===
                        'Completed'
                          ? 'success'
                          : backup.status ===
                              'Failed'
                            ? 'error'
                            : 'warning'
                      }
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent:
                          'flex-end',
                      }}
                    >
                      <IconButton
                        size="small"
                        color="primary"
                      >
                        <DownloadIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="secondary"
                      >
                        <RestoreIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default SystemBackupContent;
