import React from 'react';
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
  Chip,
  Button,
  TextField,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import HistoryIcon from '@mui/icons-material/History';

interface ChangeHistoryContentProps {
  changeHistory: {
    timestamp: Date;
    setting: string;
    oldValue: unknown;
    newValue: unknown;
  }[];
}

/**
 * Component for change history settings content
 */
const ChangeHistoryContent: React.FC<ChangeHistoryContentProps> = ({
  changeHistory,
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  
  const filteredHistory = changeHistory.filter(
    (item) => 
      item.setting.toLowerCase().includes(searchQuery.toLowerCase()) ||
      new Date(item.timestamp).toLocaleString().toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          Change History
        </Typography>
        <TextField
          placeholder="Search changes..."
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
            sx: { borderRadius: 2 }
          }}
          sx={{ width: 250 }}
        />
      </Box>
      
      {changeHistory.length === 0 ? (
        <Paper
          variant="outlined"
          sx={{
            p: 4,
            borderRadius: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
            bgcolor: '#f9f9f9',
          }}
        >
          <HistoryIcon sx={{ fontSize: 48, color: '#aaa' }} />
          <Typography variant="h6" color="text.secondary">
            No Changes Recorded Yet
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center">
            Changes to settings will be recorded here for auditing purposes.
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Timestamp</TableCell>
                <TableCell>Setting</TableCell>
                <TableCell>Changed By</TableCell>
                <TableCell>Changes</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredHistory.map((change, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {new Date(change.timestamp).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={change.setting}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>Current User</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Typography variant="caption" color="text.secondary">
                        From: {JSON.stringify(change.oldValue).substring(0, 30)}
                        {JSON.stringify(change.oldValue).length > 30 ? '...' : ''}
                      </Typography>
                      <Typography variant="caption" color="primary">
                        To: {JSON.stringify(change.newValue).substring(0, 30)}
                        {JSON.stringify(change.newValue).length > 30 ? '...' : ''}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      size="small"
                      variant="outlined"
                      sx={{
                        textTransform: 'none',
                        borderRadius: 2,
                      }}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              
              {/* Add some example historical changes */}
              {filteredHistory.length > 0 && (
                <>
                  <TableRow>
                    <TableCell>
                      {new Date(Date.now() - 86400000).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label="General Settings"
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>Admin User</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Typography variant="caption" color="text.secondary">
                          From: {"{ \"sidebarColor\": \"#000000\" }"}
                        </Typography>
                        <Typography variant="caption" color="primary">
                          To: {"{ \"sidebarColor\": \"#173A79\" }"}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        size="small"
                        variant="outlined"
                        sx={{
                          textTransform: 'none',
                          borderRadius: 2,
                        }}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                  
                  <TableRow>
                    <TableCell>
                      {new Date(Date.now() - 172800000).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label="Tax Settings"
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>Manager User</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Typography variant="caption" color="text.secondary">
                          From: {"{ \"defaultTaxRate\": 14.0 }"}
                        </Typography>
                        <Typography variant="caption" color="primary">
                          To: {"{ \"defaultTaxRate\": 15.0 }"}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        size="small"
                        variant="outlined"
                        sx={{
                          textTransform: 'none',
                          borderRadius: 2,
                        }}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                </>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Button
          variant="outlined"
          sx={{
            textTransform: 'none',
            borderRadius: 2,
          }}
        >
          Export Change History
        </Button>
      </Box>
    </Box>
  );
};

export default ChangeHistoryContent;
