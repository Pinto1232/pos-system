import React, { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Collapse,
  Paper,
  Typography,
  Link,
} from '@mui/material';
import {
  checkBackendStatus,
  getTroubleshootingSteps,
  BackendStatus,
} from '@/utils/backendChecker';
import InfoIcon from '@mui/icons-material/Info';
import axios from 'axios';

interface BackendStatusCheckerProps {
  onStatusChange?: (status: BackendStatus) => void;
  showWhenRunning?: boolean;
}

const BackendStatusChecker: React.FC<BackendStatusCheckerProps> = ({
  onStatusChange,
  showWhenRunning = false,
}) => {
  const [status, setStatus] = useState<BackendStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  const checkStatus = async () => {
    setLoading(true);
    try {
      try {
        console.log('Checking backend status via local health API endpoint');
        const response = await axios.get('/api/health', { timeout: 3000 });

        if (
          response.data.status === 'ok' &&
          response.data.backend.status === 'online'
        ) {
          const healthStatus: BackendStatus = {
            isRunning: true,
            url: response.data.backend.url,
            statusCode: 200,
          };

          setStatus(healthStatus);
          if (onStatusChange) {
            onStatusChange(healthStatus);
          }
        } else {
          throw new Error(response.data.backend.error || 'Backend is offline');
        }
      } catch (error) {
        const healthApiError =
          error instanceof Error ? error.message : String(error);
        console.log(
          'Health API check failed, falling back to direct backend check:',
          JSON.stringify(healthApiError, null, 2)
        );

        const result = await checkBackendStatus();
        setStatus(result);
        if (onStatusChange) {
          onStatusChange(result);
        }
      }
    } catch (error) {
      console.error(
        'Error checking backend status:',
        JSON.stringify(error, null, 2)
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkStatus();

    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !status) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          p: 2,
        }}
      >
        <CircularProgress size={24} />
        <Typography variant="body2" sx={{ ml: 2 }}>
          Checking backend connection...
        </Typography>
      </Box>
    );
  }

  if (!status) {
    return null;
  }

  if (status.isRunning && !showWhenRunning) {
    return null;
  }

  return (
    <Box sx={{ mb: 3 }}>
      {status.isRunning ? (
        <Alert severity="success">
          Backend server is running at {status.url}
        </Alert>
      ) : (
        <>
          <Alert
            severity="error"
            action={
              <Button
                color="inherit"
                size="small"
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? 'Hide' : 'Show'} Details
              </Button>
            }
            icon={<InfoIcon />}
          >
            <Box>
              <Typography variant="body1" fontWeight="bold">
                Backend server is not running or not accessible at {status.url}
              </Typography>
              <Typography variant="body2">
                Using mock data for demonstration. The application will continue
                to work with sample data.
              </Typography>
            </Box>
          </Alert>

          <Collapse in={expanded}>
            <Paper
              elevation={3}
              sx={{
                mt: 1,
                p: 3,
                borderRadius: 2,
                background: 'linear-gradient(to bottom, #ffffff, #f9f9f9)',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mb: 2,
                  pb: 1.5,
                  borderBottom: '1px solid #eaeaea',
                }}
              >
                <Box
                  component="span"
                  sx={{
                    mr: 1.5,
                    color: 'primary.main',
                    fontSize: '1.5rem',
                  }}
                >
                  🔧
                </Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: 'primary.main',
                  }}
                >
                  Troubleshooting Steps
                </Typography>
              </Box>

              <Box sx={{ pl: 1 }}>
                {getTroubleshootingSteps(status).map(
                  (step: string, index: number) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        mb: 1.5,
                        p: 1,
                        borderRadius: 1,
                        '&:hover': {
                          bgcolor: 'rgba(0, 0, 0, 0.03)',
                        },
                      }}
                    >
                      <Box
                        component="span"
                        sx={{
                          minWidth: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          bgcolor: 'primary.main',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 1.5,
                          fontSize: '0.875rem',
                          fontWeight: 'bold',
                        }}
                      >
                        {index + 1}
                      </Box>
                      <Typography variant="body1" sx={{ pt: 0.25 }}>
                        {step}
                      </Typography>
                    </Box>
                  )
                )}
              </Box>

              <Box
                sx={{
                  mt: 3,
                  p: 2,
                  bgcolor: 'info.light',
                  borderRadius: 1,
                  color: 'info.dark',
                  display: 'flex',
                  alignItems: 'flex-start',
                }}
              >
                <InfoIcon sx={{ mr: 1, mt: 0.25 }} />
                <Typography variant="body2">
                  The application is currently using mock data, so you can
                  continue to use it for demonstration purposes. To use real
                  data, please ensure the backend server is running.
                </Typography>
              </Box>

              <Box
                sx={{
                  mt: 3,
                  pt: 2,
                  display: 'flex',
                  justifyContent: 'space-between',
                  borderTop: '1px solid #eaeaea',
                }}
              >
                <Button
                  variant="contained"
                  onClick={checkStatus}
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : null}
                  sx={{
                    borderRadius: 2,
                    px: 3,
                  }}
                >
                  {loading ? 'Checking...' : 'Check Again'}
                </Button>
                <Link
                  href="http://localhost:5107/swagger/index.html"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="outlined"
                    sx={{
                      borderRadius: 2,
                      px: 3,
                    }}
                  >
                    Open Swagger UI
                  </Button>
                </Link>
              </Box>
            </Paper>
          </Collapse>
        </>
      )}
    </Box>
  );
};

export default BackendStatusChecker;
