import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Chip,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Tooltip,
  IconButton,
  Pagination,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import InfoIcon from '@mui/icons-material/Info';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';

interface UserActivity {
  id: number;
  userId: number;
  userName: string;
  email: string;
  activityType: string;
  description: string;
  ipAddress: string;
  timestamp: string;
  status: 'success' | 'failed' | 'warning';
}

const UserActivityMonitor: React.FC = () => {
  console.log('UserActivityMonitor component mounted');

  const [searchQuery, setSearchQuery] = useState('');
  const [activityFilter, setActivityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const { data: activityLogs, isLoading } = useQuery<UserActivity[]>({
    queryKey: ['userActivity'],
    queryFn: async () => {
      try {
        console.log('Attempting to fetch user activity logs from backend API');

        console.log('Using mock data for user activity logs');
        return mockActivityLogs;
      } catch (err) {
        console.error('Error fetching user activity:', JSON.stringify(err, null, 2));
        console.log('Falling back to mock data after error');
        return mockActivityLogs;
      }
    },
  });

  React.useEffect(() => {
    if (activityLogs) {
      console.log('Activity logs data received:', JSON.stringify(activityLogs, null, 2));
      console.log('Data source:', JSON.stringify(activityLogs === mockActivityLogs ? 'Using mock data' : 'Using backend data', null, 2));
    }
  }, [activityLogs]);

  const filteredLogs = React.useMemo(() => {
    if (!activityLogs) return [];

    return activityLogs.filter((log) => {
      const matchesSearch =
        log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.ipAddress.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesActivity = activityFilter === 'all' || log.activityType === activityFilter;

      const matchesStatus = statusFilter === 'all' || log.status === statusFilter;

      return matchesSearch && matchesActivity && matchesStatus;
    });
  }, [activityLogs, searchQuery, activityFilter, statusFilter]);

  const paginatedLogs = React.useMemo(() => {
    const startIndex = (page - 1) * rowsPerPage;
    return filteredLogs.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredLogs, page]);

  const activityTypes = React.useMemo(() => {
    if (!activityLogs) return [];

    const types = new Set<string>();
    activityLogs.forEach((log) => types.add(log.activityType));
    return Array.from(types).sort();
  }, [activityLogs]);

  const handlePageChange = (_event: React.MouseEvent<unknown> | React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage);
  };

  const formatTimestamp = (timestamp: string) => {
    try {
      return format(new Date(timestamp), 'MMM dd, yyyy HH:mm:ss');
    } catch {
      return timestamp;
    }
  };

  const getStatusColor = (status: string): 'success' | 'error' | 'warning' | 'default' => {
    switch (status) {
      case 'success':
        return 'success';
      case 'failed':
        return 'error';
      case 'warning':
        return 'warning';
      default:
        return 'default';
    }
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          p: 3,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h6" gutterBottom>
        User Activity Monitor
      </Typography>

      <Box
        sx={{
          mb: 3,
          display: 'flex',
          gap: 2,
          flexWrap: 'wrap',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexGrow: 1,
            minWidth: '200px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            padding: '0 8px',
          }}
        >
          <SearchIcon
            sx={{
              color: 'text.secondary',
              mr: 1,
            }}
          />
          <TextField
            placeholder="Search user activity..."
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            variant="standard"
            fullWidth
            sx={{ input: { padding: '8px 0' } }}
          />
        </Box>

        <FormControl size="small" sx={{ minWidth: '150px' }}>
          <InputLabel id="activity-filter-label">Activity Type</InputLabel>
          <Select
            labelId="activity-filter-label"
            value={activityFilter}
            label="Activity Type"
            onChange={(e) => setActivityFilter(e.target.value)}
            IconComponent={() => <FilterListIcon fontSize="small" sx={{ mr: 1 }} />}
          >
            <MenuItem value="all">All Activities</MenuItem>
            {activityTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: '120px' }}>
          <InputLabel id="status-filter-label">Status</InputLabel>
          <Select labelId="status-filter-label" value={statusFilter} label="Status" onChange={(e) => setStatusFilter(e.target.value)}>
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="success">Success</MenuItem>
            <MenuItem value="failed">Failed</MenuItem>
            <MenuItem value="warning">Warning</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {filteredLogs.length === 0 ? (
        <Alert severity="info">No activity logs found matching your criteria.</Alert>
      ) : (
        <>
          <TableContainer component={Paper} sx={{ mb: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Activity</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>IP Address</TableCell>
                  <TableCell>Timestamp</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedLogs.map((log) => (
                  <TableRow key={log.id} hover>
                    <TableCell>
                      <Typography variant="body2">{log.userName}</Typography>
                      <Typography variant="caption" color="textSecondary">
                        {log.email}
                      </Typography>
                    </TableCell>
                    <TableCell>{log.activityType}</TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        {log.description}
                        {log.status === 'failed' && (
                          <Tooltip title="This action failed and may require attention">
                            <IconButton size="small">
                              <InfoIcon fontSize="small" color="error" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>{log.ipAddress}</TableCell>
                    <TableCell>{formatTimestamp(log.timestamp)}</TableCell>
                    <TableCell>
                      <Chip label={log.status} color={getStatusColor(log.status)} size="small" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="body2" color="textSecondary">
              Showing {paginatedLogs.length} of {filteredLogs.length} activities
            </Typography>
            <Pagination
              count={Math.ceil(filteredLogs.length / rowsPerPage)}
              page={page}
              onChange={handlePageChange}
              color="primary"
              size="small"
            />
          </Box>
        </>
      )}
    </Box>
  );
};

const mockActivityLogs: UserActivity[] = [
  {
    id: 1,
    userId: 1,
    userName: 'admin',
    email: 'admin@pisvaltech.com',
    activityType: 'Login',
    description: 'User logged in successfully',
    ipAddress: '192.168.1.1',
    timestamp: '2023-10-15T09:30:00Z',
    status: 'success',
  },
  {
    id: 2,
    userId: 2,
    userName: 'manager',
    email: 'manager@pisvaltech.com',
    activityType: 'Permission Change',
    description: 'Changed permissions for role "Cashier"',
    ipAddress: '192.168.1.2',
    timestamp: '2023-10-15T10:15:00Z',
    status: 'success',
  },
  {
    id: 3,
    userId: 3,
    userName: 'cashier',
    email: 'cashier@pisvaltech.com',
    activityType: 'Login',
    description: 'Failed login attempt (incorrect password)',
    ipAddress: '192.168.1.3',
    timestamp: '2023-10-15T11:00:00Z',
    status: 'failed',
  },
  {
    id: 4,
    userId: 1,
    userName: 'admin',
    email: 'admin@pisvaltech.com',
    activityType: 'Role Creation',
    description: 'Created new role "Inventory Manager"',
    ipAddress: '192.168.1.1',
    timestamp: '2023-10-15T11:30:00Z',
    status: 'success',
  },
  {
    id: 5,
    userId: 2,
    userName: 'manager',
    email: 'manager@pisvaltech.com',
    activityType: 'User Assignment',
    description: 'Assigned user "john" to role "Inventory Manager"',
    ipAddress: '192.168.1.2',
    timestamp: '2023-10-15T12:00:00Z',
    status: 'success',
  },
  {
    id: 6,
    userId: 4,
    userName: 'john',
    email: 'john@pisvaltech.com',
    activityType: 'Login',
    description: 'User logged in from new location',
    ipAddress: '203.0.113.1',
    timestamp: '2023-10-15T13:00:00Z',
    status: 'warning',
  },
  {
    id: 7,
    userId: 1,
    userName: 'admin',
    email: 'admin@pisvaltech.com',
    activityType: 'Permission Change',
    description: 'Updated permissions for role "Manager"',
    ipAddress: '192.168.1.1',
    timestamp: '2023-10-15T14:30:00Z',
    status: 'success',
  },
  {
    id: 8,
    userId: 3,
    userName: 'cashier',
    email: 'cashier@pisvaltech.com',
    activityType: 'Login',
    description: 'User logged in successfully',
    ipAddress: '192.168.1.3',
    timestamp: '2023-10-15T15:00:00Z',
    status: 'success',
  },
  {
    id: 9,
    userId: 5,
    userName: 'sarah',
    email: 'sarah@pisvaltech.com',
    activityType: 'Role Assignment',
    description: 'User assigned to role "Cashier"',
    ipAddress: '192.168.1.5',
    timestamp: '2023-10-15T16:00:00Z',
    status: 'success',
  },
  {
    id: 10,
    userId: 2,
    userName: 'manager',
    email: 'manager@pisvaltech.com',
    activityType: 'Permission Change',
    description: 'Failed to update permissions (insufficient privileges)',
    ipAddress: '192.168.1.2',
    timestamp: '2023-10-15T17:00:00Z',
    status: 'failed',
  },
];

export default UserActivityMonitor;
