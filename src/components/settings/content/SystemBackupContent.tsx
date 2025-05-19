import React, { useState } from 'react';
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
  Tooltip,
  Divider,
  Card,
  CardContent,
  alpha,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import RestoreIcon from '@mui/icons-material/Restore';
import DeleteIcon from '@mui/icons-material/Delete';
import BackupIcon from '@mui/icons-material/Backup';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import StorageIcon from '@mui/icons-material/Storage';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import HistoryIcon from '@mui/icons-material/History';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const SystemBackupContent: React.FC = () => {
  const [autoBackupEnabled, setAutoBackupEnabled] = useState(true);
  const [backupFrequency, setBackupFrequency] = useState('daily');
  const [retentionPeriod, setRetentionPeriod] = useState('30');
  const [backupLocation, setBackupLocation] = useState('local');

  return (
    <Box sx={{ p: 2 }}>
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          fontSize: '1.25rem',
          fontWeight: 600,
          color: '#173A79',
          mb: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <BackupIcon sx={{ fontSize: 28 }} />
        System Backup & Restore
      </Typography>

      <Box sx={{ mb: 4 }}>
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
            sx={{
              fontWeight: 600,
              fontSize: '1.1rem',
              color: '#333',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <StorageIcon sx={{ color: '#173A79' }} />
            Manual Backup
          </Typography>
          <Button
            variant="contained"
            startIcon={<BackupIcon />}
            sx={{
              textTransform: 'none',
              borderRadius: 8,
              px: 3,
              py: 1,
              bgcolor: '#173A79',
              '&:hover': {
                bgcolor: '#0f2d6a',
                boxShadow: '0 4px 12px rgba(23, 58, 121, 0.3)',
              },
              boxShadow: 'none',
              fontWeight: 500,
            }}
          >
            Create Backup Now
          </Button>
        </Box>
        <Typography
          variant="body2"
          sx={{
            color: '#666',
            fontSize: '0.9rem',
            lineHeight: 1.5,
          }}
          paragraph
        >
          Create a manual backup of your system data. This includes all
          settings, products, customers, and transaction history.
        </Typography>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 600,
            fontSize: '1.1rem',
            color: '#333',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mb: 2,
          }}
        >
          <AutorenewIcon sx={{ color: '#173A79' }} />
          Automatic Backup Settings
        </Typography>

        <Card
          elevation={0}
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
            background:
              'linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(240,245,255,0.9) 100%)',
            border: '1px solid rgba(23, 58, 121, 0.1)',
            boxShadow: '0 4px 20px rgba(23, 58, 121, 0.08)',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 8px 30px rgba(23, 58, 121, 0.12)',
              transform: 'translateY(-2px)',
            },
          }}
        >
          <CardContent sx={{ p: 0 }}>
            {}
            <Box
              sx={{
                p: 2.5,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid rgba(23, 58, 121, 0.08)',
                background: autoBackupEnabled
                  ? 'linear-gradient(145deg, rgba(23, 58, 121, 0.05) 0%, rgba(23, 58, 121, 0.1) 100%)'
                  : 'transparent',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography
                  sx={{
                    fontWeight: 600,
                    color: autoBackupEnabled ? '#173A79' : '#666',
                    fontSize: '1rem',
                  }}
                >
                  Enable Automatic Backups
                </Typography>
                <Tooltip title="Automatically create backups of your system data based on your preferred schedule">
                  <InfoOutlinedIcon
                    sx={{ fontSize: 18, color: '#999', cursor: 'help' }}
                  />
                </Tooltip>
              </Box>
              <Switch
                checked={autoBackupEnabled}
                onChange={(e) => setAutoBackupEnabled(e.target.checked)}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: '#173A79',
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: '#173A79',
                  },
                }}
              />
            </Box>

            {}
            <Box
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
                opacity: autoBackupEnabled ? 1 : 0.6,
                pointerEvents: autoBackupEnabled ? 'auto' : 'none',
              }}
            >
              {}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    width: '180px',
                  }}
                >
                  <AccessTimeIcon sx={{ color: '#173A79', fontSize: 20 }} />
                  <Typography
                    sx={{
                      fontWeight: 500,
                      color: '#444',
                      fontSize: '0.95rem',
                    }}
                  >
                    Backup Frequency
                  </Typography>
                </Box>
                <TextField
                  select
                  value={backupFrequency}
                  onChange={(e) => setBackupFrequency(e.target.value)}
                  size="small"
                  sx={{
                    minWidth: 180,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '& fieldset': {
                        borderColor: 'rgba(23, 58, 121, 0.2)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(23, 58, 121, 0.4)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#173A79',
                      },
                    },
                  }}
                >
                  <MenuItem value="hourly">Hourly</MenuItem>
                  <MenuItem value="daily">Daily</MenuItem>
                  <MenuItem value="weekly">Weekly</MenuItem>
                  <MenuItem value="monthly">Monthly</MenuItem>
                </TextField>
              </Box>

              {}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    width: '180px',
                  }}
                >
                  <HistoryIcon sx={{ color: '#173A79', fontSize: 20 }} />
                  <Typography
                    sx={{
                      fontWeight: 500,
                      color: '#444',
                      fontSize: '0.95rem',
                    }}
                  >
                    Retention Period
                  </Typography>
                </Box>
                <TextField
                  select
                  value={retentionPeriod}
                  onChange={(e) => setRetentionPeriod(e.target.value)}
                  size="small"
                  sx={{
                    minWidth: 180,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '& fieldset': {
                        borderColor: 'rgba(23, 58, 121, 0.2)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(23, 58, 121, 0.4)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#173A79',
                      },
                    },
                  }}
                >
                  <MenuItem value="7">7 days</MenuItem>
                  <MenuItem value="30">30 days</MenuItem>
                  <MenuItem value="90">90 days</MenuItem>
                  <MenuItem value="365">1 year</MenuItem>
                </TextField>
              </Box>

              {}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    width: '180px',
                  }}
                >
                  <CloudUploadIcon sx={{ color: '#173A79', fontSize: 20 }} />
                  <Typography
                    sx={{
                      fontWeight: 500,
                      color: '#444',
                      fontSize: '0.95rem',
                    }}
                  >
                    Backup Location
                  </Typography>
                </Box>
                <TextField
                  select
                  value={backupLocation}
                  onChange={(e) => setBackupLocation(e.target.value)}
                  size="small"
                  sx={{
                    minWidth: 180,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '& fieldset': {
                        borderColor: 'rgba(23, 58, 121, 0.2)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(23, 58, 121, 0.4)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#173A79',
                      },
                    },
                  }}
                >
                  <MenuItem value="local">Local Storage</MenuItem>
                  <MenuItem value="cloud">Cloud Storage</MenuItem>
                  <MenuItem value="both">Both (Local & Cloud)</MenuItem>
                </TextField>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      <Box>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 600,
            fontSize: '1.1rem',
            color: '#333',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mb: 2,
          }}
        >
          <HistoryIcon sx={{ color: '#173A79' }} />
          Backup History
        </Typography>

        <Card
          elevation={0}
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
            border: '1px solid rgba(23, 58, 121, 0.1)',
            boxShadow: '0 4px 20px rgba(23, 58, 121, 0.08)',
          }}
        >
          <TableContainer sx={{ borderRadius: 0 }}>
            <Table size="medium">
              <TableHead>
                <TableRow
                  sx={{
                    background:
                      'linear-gradient(145deg, rgba(23, 58, 121, 0.03) 0%, rgba(23, 58, 121, 0.08) 100%)',
                  }}
                >
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      color: '#173A79',
                      fontSize: '0.9rem',
                      py: 1.5,
                      borderBottom: '1px solid rgba(23, 58, 121, 0.1)',
                    }}
                  >
                    Backup Date
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      color: '#173A79',
                      fontSize: '0.9rem',
                      py: 1.5,
                      borderBottom: '1px solid rgba(23, 58, 121, 0.1)',
                    }}
                  >
                    Type
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      color: '#173A79',
                      fontSize: '0.9rem',
                      py: 1.5,
                      borderBottom: '1px solid rgba(23, 58, 121, 0.1)',
                    }}
                  >
                    Size
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      color: '#173A79',
                      fontSize: '0.9rem',
                      py: 1.5,
                      borderBottom: '1px solid rgba(23, 58, 121, 0.1)',
                    }}
                  >
                    Status
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      fontWeight: 600,
                      color: '#173A79',
                      fontSize: '0.9rem',
                      py: 1.5,
                      borderBottom: '1px solid rgba(23, 58, 121, 0.1)',
                    }}
                  >
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
                  <TableRow
                    key={index}
                    sx={{
                      '&:nth-of-type(odd)': {
                        backgroundColor: 'rgba(23, 58, 121, 0.02)',
                      },
                      '&:hover': {
                        backgroundColor: 'rgba(23, 58, 121, 0.05)',
                      },
                      transition: 'background-color 0.2s ease',
                    }}
                  >
                    <TableCell
                      sx={{
                        py: 1.5,
                        color: '#444',
                        fontSize: '0.9rem',
                        borderBottom:
                          index === 4
                            ? 'none'
                            : '1px solid rgba(23, 58, 121, 0.05)',
                      }}
                    >
                      {backup.date}
                    </TableCell>
                    <TableCell
                      sx={{
                        py: 1.5,
                        borderBottom:
                          index === 4
                            ? 'none'
                            : '1px solid rgba(23, 58, 121, 0.05)',
                      }}
                    >
                      <Chip
                        label={backup.type}
                        size="small"
                        sx={{
                          fontWeight: 500,
                          fontSize: '0.8rem',
                          borderRadius: '4px',
                          backgroundColor:
                            backup.type === 'Manual'
                              ? 'rgba(23, 58, 121, 0.1)'
                              : 'rgba(23, 58, 121, 0.05)',
                          color: backup.type === 'Manual' ? '#173A79' : '#666',
                          border:
                            backup.type === 'Manual'
                              ? '1px solid rgba(23, 58, 121, 0.2)'
                              : '1px solid rgba(23, 58, 121, 0.1)',
                          '.MuiChip-label': {
                            px: 1,
                          },
                        }}
                      />
                    </TableCell>
                    <TableCell
                      sx={{
                        py: 1.5,
                        color: '#444',
                        fontSize: '0.9rem',
                        borderBottom:
                          index === 4
                            ? 'none'
                            : '1px solid rgba(23, 58, 121, 0.05)',
                      }}
                    >
                      {backup.size}
                    </TableCell>
                    <TableCell
                      sx={{
                        py: 1.5,
                        borderBottom:
                          index === 4
                            ? 'none'
                            : '1px solid rgba(23, 58, 121, 0.05)',
                      }}
                    >
                      <Chip
                        label={backup.status}
                        size="small"
                        sx={{
                          fontWeight: 500,
                          fontSize: '0.8rem',
                          borderRadius: '4px',
                          backgroundColor:
                            backup.status === 'Completed'
                              ? 'rgba(76, 175, 80, 0.1)'
                              : backup.status === 'Failed'
                                ? 'rgba(244, 67, 54, 0.1)'
                                : 'rgba(255, 152, 0, 0.1)',
                          color:
                            backup.status === 'Completed'
                              ? '#2e7d32'
                              : backup.status === 'Failed'
                                ? '#d32f2f'
                                : '#ed6c02',
                          border:
                            backup.status === 'Completed'
                              ? '1px solid rgba(76, 175, 80, 0.2)'
                              : backup.status === 'Failed'
                                ? '1px solid rgba(244, 67, 54, 0.2)'
                                : '1px solid rgba(255, 152, 0, 0.2)',
                          '.MuiChip-label': {
                            px: 1,
                          },
                        }}
                      />
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        py: 1.5,
                        borderBottom:
                          index === 4
                            ? 'none'
                            : '1px solid rgba(23, 58, 121, 0.05)',
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'flex-end',
                          gap: 0.5,
                        }}
                      >
                        <Tooltip title="Download backup">
                          <IconButton
                            size="small"
                            sx={{
                              color: '#173A79',
                              '&:hover': {
                                backgroundColor: 'rgba(23, 58, 121, 0.1)',
                              },
                            }}
                          >
                            <DownloadIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Restore from backup">
                          <IconButton
                            size="small"
                            sx={{
                              color: '#9c27b0',
                              '&:hover': {
                                backgroundColor: 'rgba(156, 39, 176, 0.1)',
                              },
                            }}
                          >
                            <RestoreIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete backup">
                          <IconButton
                            size="small"
                            sx={{
                              color: '#f44336',
                              '&:hover': {
                                backgroundColor: 'rgba(244, 67, 54, 0.1)',
                              },
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Box>
    </Box>
  );
};

export default SystemBackupContent;
