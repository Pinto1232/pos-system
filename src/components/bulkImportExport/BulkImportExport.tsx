'use client';

import React, { useState, useRef } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Alert,
  LinearProgress,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  useTheme,
  useMediaQuery,
  Fade,
  Grow,
  Paper,
  Stack,
  Fab,
  Tooltip,
  Backdrop,
} from '@mui/material';
import {
  CloudUpload,
  CloudDownload,
  FileDownload,
  CheckCircle,
  Error,
  Info,
  Warning,
  Close,
  Description,
  TableChart,
  Speed,
  Security,
  Insights,
  AutoAwesome,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

interface ImportResult {
  success: boolean;
  message: string;
  details?: {
    total: number;
    successful: number;
    failed: number;
    errors?: string[];
  };
}

interface ExportOptions {
  format: 'csv' | 'xlsx' | 'json';
  category: string;
  dateRange: 'all' | 'last30' | 'last90' | 'custom';
  customStartDate?: string;
  customEndDate?: string;
}

const getErrorMessage = (error: unknown): string => {
  if (error && typeof error === 'object' && 'message' in error) {
    return String((error as { message: unknown }).message);
  }
  if (typeof error === 'string') return error;
  return 'An unknown error occurred';
};

const BulkImportExport: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [exportProgress, setExportProgress] = useState(0);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'csv',
    category: 'all',
    dateRange: 'all',
  });
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];

      const syntheticEvent = {
        target: {
          files: [file],
          value: '',
          name: '',
          type: 'file',
        },
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      handleFileUpload(syntheticEvent);
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setImportProgress(0);
    setImportResult(null);

    try {
      const progressInterval = setInterval(() => {
        setImportProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 500);

      await new Promise((resolve) => setTimeout(resolve, 3000));

      setImportProgress(100);

      const mockResult: ImportResult = {
        success: true,
        message: 'Import completed successfully',
        details: {
          total: 150,
          successful: 145,
          failed: 5,
          errors: [
            'Row 12: Invalid price format',
            'Row 35: Missing required field "name"',
            'Row 87: Duplicate SKU',
            'Row 102: Invalid category',
            'Row 133: Price exceeds maximum limit',
          ],
        },
      };

      setImportResult(mockResult);
    } catch (error) {
      setImportResult({
        success: false,
        message: 'Import failed: ' + getErrorMessage(error),
      });
    } finally {
      setImporting(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleExport = async () => {
    setExporting(true);
    setExportProgress(0);

    try {
      // Simulate export progress
      const progressInterval = setInterval(() => {
        setExportProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 15;
        });
      }, 300);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setExportProgress(100);

      // Simulate file download
      const blob = new Blob(['Sample exported data...'], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `products_export_${new Date().toISOString().split('T')[0]}.${exportOptions.format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setExporting(false);
      setExportDialogOpen(false);
      setExportProgress(0);
    }
  };

  const handleDownloadTemplate = () => {
    const csvContent =
      'Name,SKU,Price,Category,Stock,Description\nSample Product,SKU001,29.99,Electronics,100,Sample description';
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'product_import_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <Box
      sx={{
        p: isMobile ? 2 : 4,
        maxWidth: '1400px',
        mx: 'auto',
        background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.grey[50]} 100%)`,
        minHeight: '100vh',
      }}
    >
      <Fade in={true} timeout={800}>
        <Box>
          <Box
            sx={{
              textAlign: 'center',
              mb: 5,
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '200px',
                height: '200px',
                background: `radial-gradient(circle, ${theme.palette.primary.main}15 0%, transparent 70%)`,
                borderRadius: '50%',
                zIndex: -1,
              },
            }}
          >
            <Typography
              variant={isMobile ? 'h3' : 'h2'}
              sx={{
                fontWeight: 700,
                background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2,
                textShadow: '0 2px 10px rgba(0,0,0,0.1)',
              }}
            >
              {t('bulkImportExport.title', 'Bulk Import/Export')}
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{
                fontWeight: 400,
                maxWidth: '600px',
                mx: 'auto',
                lineHeight: 1.6,
              }}
            >
              Effortlessly manage your product data with our powerful import and
              export tools
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {}
            <Grid item xs={12} md={6}>
              <Card
                elevation={3}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                sx={{
                  height: '100%',
                  border: dragActive
                    ? `2px dashed ${theme.palette.primary.main}`
                    : `2px dashed transparent`,
                  backgroundColor: dragActive
                    ? `${theme.palette.primary.main}08`
                    : 'inherit',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  '&::before': dragActive
                    ? {
                        content: '"Drop your file here"',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: `${theme.palette.primary.main}15`,
                        fontSize: '1.2rem',
                        fontWeight: 600,
                        color: theme.palette.primary.main,
                        zIndex: 10,
                        borderRadius: 1,
                      }
                    : {},
                }}
              >
                <CardContent sx={{ position: 'relative' }}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <CloudUpload
                      sx={{ mr: 1, color: theme.palette.primary.main }}
                    />
                    <Typography variant="h6" fontWeight={600}>
                      {t('bulkImportExport.import.title', 'Import Products')}
                    </Typography>
                  </Box>

                  <Typography variant="body2" color="text.secondary" mb={3}>
                    {t(
                      'bulkImportExport.import.description',
                      'Upload a CSV or Excel file to import products in bulk'
                    )}
                  </Typography>

                  <Box mb={2}>
                    <Button
                      variant="outlined"
                      startIcon={<Description />}
                      onClick={handleDownloadTemplate}
                      fullWidth={isMobile}
                      sx={{ mb: 2 }}
                    >
                      {t(
                        'bulkImportExport.downloadTemplate',
                        'Download Template'
                      )}
                    </Button>
                  </Box>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept=".csv,.xlsx,.xls"
                    style={{ display: 'none' }}
                  />

                  <Button
                    variant="contained"
                    startIcon={<CloudUpload />}
                    onClick={() => fileInputRef.current?.click()}
                    disabled={importing}
                    fullWidth
                    size="large"
                    sx={{
                      py: 2,
                      borderRadius: 3,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
                      boxShadow: `0 8px 24px ${theme.palette.primary.main}30`,
                      textTransform: 'none',
                      '&:hover': {
                        background: `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.primary.main} 90%)`,
                        transform: 'translateY(-2px)',
                        boxShadow: `0 12px 32px ${theme.palette.primary.main}40`,
                      },
                      '&:active': {
                        transform: 'translateY(0px)',
                      },
                      '&:disabled': {
                        background: theme.palette.grey[300],
                        color: theme.palette.grey[600],
                        transform: 'none',
                      },
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  >
                    {importing
                      ? t('bulkImportExport.importing', 'Importing...')
                      : t(
                          'bulkImportExport.selectFile',
                          'Select File to Import'
                        )}
                  </Button>

                  {importing && (
                    <Box mt={2}>
                      <LinearProgress
                        variant="determinate"
                        value={importProgress}
                        sx={{ mb: 1 }}
                      />
                      <Typography variant="body2" textAlign="center">
                        {importProgress}%{' '}
                        {t('bulkImportExport.complete', 'Complete')}
                      </Typography>
                    </Box>
                  )}

                  {importResult && (
                    <Alert
                      severity={importResult.success ? 'success' : 'error'}
                      sx={{ mt: 2 }}
                      action={
                        <IconButton
                          size="small"
                          onClick={() => setImportResult(null)}
                        >
                          <Close fontSize="inherit" />
                        </IconButton>
                      }
                    >
                      <Typography variant="body2" fontWeight={600}>
                        {importResult.message}
                      </Typography>
                      {importResult.details && (
                        <Box mt={1}>
                          <Typography variant="body2">
                            Total: {importResult.details.total} | Success:{' '}
                            {importResult.details.successful} | Failed:{' '}
                            {importResult.details.failed}
                          </Typography>
                          {importResult.details.errors &&
                            importResult.details.errors.length > 0 && (
                              <Box mt={1}>
                                <Typography variant="body2" fontWeight={600}>
                                  Errors:
                                </Typography>
                                <List dense>
                                  {importResult.details.errors
                                    .slice(0, 3)
                                    .map((error, index) => (
                                      <ListItem key={index} sx={{ py: 0 }}>
                                        <ListItemIcon sx={{ minWidth: 24 }}>
                                          <Error
                                            fontSize="small"
                                            color="error"
                                          />
                                        </ListItemIcon>
                                        <ListItemText
                                          primary={error}
                                          primaryTypographyProps={{
                                            variant: 'body2',
                                          }}
                                        />
                                      </ListItem>
                                    ))}
                                  {importResult.details.errors.length > 3 && (
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                      sx={{ ml: 3 }}
                                    >
                                      +{importResult.details.errors.length - 3}{' '}
                                      more errors...
                                    </Typography>
                                  )}
                                </List>
                              </Box>
                            )}
                        </Box>
                      )}
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {}
            <Grid item xs={12} md={6}>
              <Card
                elevation={3}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <CardContent
                  sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}
                >
                  <Box display="flex" alignItems="center" mb={2}>
                    <CloudDownload
                      sx={{ mr: 1, color: theme.palette.secondary.main }}
                    />
                    <Typography variant="h6" fontWeight={600}>
                      {t('bulkImportExport.export.title', 'Export Products')}
                    </Typography>
                  </Box>

                  <Typography variant="body2" color="text.secondary" mb={3}>
                    {t(
                      'bulkImportExport.export.description',
                      'Export your products data in various formats'
                    )}
                  </Typography>

                  <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<FileDownload />}
                    onClick={() => setExportDialogOpen(true)}
                    disabled={exporting}
                    fullWidth
                    size="large"
                    sx={{
                      py: 2,
                      borderRadius: 3,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      background: `linear-gradient(45deg, ${theme.palette.secondary.main} 30%, ${theme.palette.secondary.dark} 90%)`,
                      boxShadow: `0 8px 24px ${theme.palette.secondary.main}30`,
                      textTransform: 'none',
                      '&:hover': {
                        background: `linear-gradient(45deg, ${theme.palette.secondary.dark} 30%, ${theme.palette.secondary.main} 90%)`,
                        transform: 'translateY(-2px)',
                        boxShadow: `0 12px 32px ${theme.palette.secondary.main}40`,
                      },
                      '&:active': {
                        transform: 'translateY(0px)',
                      },
                      '&:disabled': {
                        background: theme.palette.grey[300],
                        color: theme.palette.grey[600],
                        transform: 'none',
                      },
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  >
                    {exporting
                      ? t('bulkImportExport.exporting', 'Exporting...')
                      : t('bulkImportExport.export.button', 'Export Products')}
                  </Button>

                  {exporting && (
                    <Box mt={2}>
                      <LinearProgress
                        variant="determinate"
                        value={exportProgress}
                        color="secondary"
                        sx={{ mb: 1 }}
                      />
                      <Typography variant="body2" textAlign="center">
                        {exportProgress}%{' '}
                        {t('bulkImportExport.complete', 'Complete')}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {}
            <Grid item xs={12}>
              <Grow in={true} timeout={1400}>
                <Card
                  elevation={0}
                  sx={{
                    background: `linear-gradient(135deg, ${theme.palette.grey[50]} 0%, ${theme.palette.grey[100]} 100%)`,
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 3,
                    mt: 2,
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box display="flex" alignItems="center" mb={4}>
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: '50%',
                          background: `linear-gradient(45deg, ${theme.palette.info.main}15 0%, ${theme.palette.info.main}25 100%)`,
                          mr: 2,
                        }}
                      >
                        <Info
                          sx={{ fontSize: 32, color: theme.palette.info.main }}
                        />
                      </Box>
                      <Box>
                        <Typography variant="h5" fontWeight={700}>
                          {t(
                            'bulkImportExport.info.title',
                            'Important Information'
                          )}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Guidelines and best practices
                        </Typography>
                      </Box>
                    </Box>

                    <Grid container spacing={4}>
                      <Grid item xs={12} md={6}>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 3,
                            backgroundColor: 'rgba(255,255,255,0.7)',
                            borderRadius: 2,
                            border: `1px solid ${theme.palette.primary.main}20`,
                          }}
                        >
                          <Typography
                            variant="h6"
                            gutterBottom
                            color="primary"
                            sx={{ fontWeight: 600, mb: 2 }}
                          >
                            {t(
                              'bulkImportExport.info.import',
                              'Import Guidelines'
                            )}
                          </Typography>
                          <List dense>
                            <ListItem sx={{ py: 1, px: 0 }}>
                              <ListItemIcon sx={{ minWidth: 36 }}>
                                <CheckCircle
                                  fontSize="medium"
                                  color="success"
                                />
                              </ListItemIcon>
                              <ListItemText
                                primary={t(
                                  'bulkImportExport.info.supportedFormats',
                                  'Supported formats: CSV, XLSX, XLS'
                                )}
                                primaryTypographyProps={{
                                  variant: 'body1',
                                  sx: { fontWeight: 500 },
                                }}
                              />
                            </ListItem>
                            <ListItem sx={{ py: 1, px: 0 }}>
                              <ListItemIcon sx={{ minWidth: 36 }}>
                                <Warning fontSize="medium" color="warning" />
                              </ListItemIcon>
                              <ListItemText
                                primary={t(
                                  'bulkImportExport.info.maxFileSize',
                                  'Maximum file size: 10MB'
                                )}
                                primaryTypographyProps={{
                                  variant: 'body1',
                                  sx: { fontWeight: 500 },
                                }}
                              />
                            </ListItem>
                            <ListItem sx={{ py: 1, px: 0 }}>
                              <ListItemIcon sx={{ minWidth: 36 }}>
                                <Info fontSize="medium" color="info" />
                              </ListItemIcon>
                              <ListItemText
                                primary={t(
                                  'bulkImportExport.info.duplicateHandling',
                                  'Duplicates will be skipped'
                                )}
                                primaryTypographyProps={{
                                  variant: 'body1',
                                  sx: { fontWeight: 500 },
                                }}
                              />
                            </ListItem>
                          </List>
                        </Paper>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 3,
                            backgroundColor: 'rgba(255,255,255,0.7)',
                            borderRadius: 2,
                            border: `1px solid ${theme.palette.secondary.main}20`,
                          }}
                        >
                          <Typography
                            variant="h6"
                            gutterBottom
                            color="secondary"
                            sx={{ fontWeight: 600, mb: 2 }}
                          >
                            {t(
                              'bulkImportExport.info.export',
                              'Export Options'
                            )}
                          </Typography>
                          <List dense>
                            <ListItem sx={{ py: 1, px: 0 }}>
                              <ListItemIcon sx={{ minWidth: 36 }}>
                                <TableChart
                                  fontSize="medium"
                                  color="secondary"
                                />
                              </ListItemIcon>
                              <ListItemText
                                primary={t(
                                  'bulkImportExport.info.exportFormats',
                                  'Available formats: CSV, Excel, JSON'
                                )}
                                primaryTypographyProps={{
                                  variant: 'body1',
                                  sx: { fontWeight: 500 },
                                }}
                              />
                            </ListItem>
                            <ListItem sx={{ py: 1, px: 0 }}>
                              <ListItemIcon sx={{ minWidth: 36 }}>
                                <CheckCircle
                                  fontSize="medium"
                                  color="success"
                                />
                              </ListItemIcon>
                              <ListItemText
                                primary={t(
                                  'bulkImportExport.info.filterOptions',
                                  'Filter by category and date range'
                                )}
                                primaryTypographyProps={{
                                  variant: 'body1',
                                  sx: { fontWeight: 500 },
                                }}
                              />
                            </ListItem>
                            <ListItem sx={{ py: 1, px: 0 }}>
                              <ListItemIcon sx={{ minWidth: 36 }}>
                                <Info fontSize="medium" color="info" />
                              </ListItemIcon>
                              <ListItemText
                                primary={t(
                                  'bulkImportExport.info.includeImages',
                                  'Images are exported as URLs'
                                )}
                                primaryTypographyProps={{
                                  variant: 'body1',
                                  sx: { fontWeight: 500 },
                                }}
                              />
                            </ListItem>
                          </List>
                        </Paper>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grow>
            </Grid>

            {}
            <Grid item xs={12}>
              <Grow in={true} timeout={1600}>
                <Box sx={{ mt: 4, mb: 2 }}>
                  <Typography
                    variant="h4"
                    align="center"
                    sx={{
                      fontWeight: 700,
                      mb: 4,
                      background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    Why Choose Our Import/Export System?
                  </Typography>

                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={3}>
                      <Card
                        elevation={0}
                        sx={{
                          textAlign: 'center',
                          p: 3,
                          background:
                            'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                          border: `1px solid ${theme.palette.divider}`,
                          borderRadius: 3,
                          transition: 'all 0.3s ease-in-out',
                          '&:hover': {
                            transform: 'translateY(-8px)',
                            boxShadow: `0 12px 32px ${theme.palette.primary.main}20`,
                          },
                        }}
                      >
                        <Box
                          sx={{
                            p: 2,
                            borderRadius: '50%',
                            background: `linear-gradient(45deg, ${theme.palette.primary.main}15 0%, ${theme.palette.primary.main}25 100%)`,
                            width: 80,
                            height: 80,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mx: 'auto',
                            mb: 2,
                          }}
                        >
                          <Speed
                            sx={{
                              fontSize: 40,
                              color: theme.palette.primary.main,
                            }}
                          />
                        </Box>
                        <Typography
                          variant="h6"
                          fontWeight={600}
                          sx={{ mb: 1 }}
                        >
                          Lightning Fast
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Process thousands of records in seconds with our
                          optimized bulk operations
                        </Typography>
                      </Card>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                      <Card
                        elevation={0}
                        sx={{
                          textAlign: 'center',
                          p: 3,
                          background:
                            'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                          border: `1px solid ${theme.palette.divider}`,
                          borderRadius: 3,
                          transition: 'all 0.3s ease-in-out',
                          '&:hover': {
                            transform: 'translateY(-8px)',
                            boxShadow: `0 12px 32px ${theme.palette.secondary.main}20`,
                          },
                        }}
                      >
                        <Box
                          sx={{
                            p: 2,
                            borderRadius: '50%',
                            background: `linear-gradient(45deg, ${theme.palette.secondary.main}15 0%, ${theme.palette.secondary.main}25 100%)`,
                            width: 80,
                            height: 80,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mx: 'auto',
                            mb: 2,
                          }}
                        >
                          <Security
                            sx={{
                              fontSize: 40,
                              color: theme.palette.secondary.main,
                            }}
                          />
                        </Box>
                        <Typography
                          variant="h6"
                          fontWeight={600}
                          sx={{ mb: 1 }}
                        >
                          Secure & Reliable
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Enterprise-grade security with data validation and
                          error handling
                        </Typography>
                      </Card>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                      <Card
                        elevation={0}
                        sx={{
                          textAlign: 'center',
                          p: 3,
                          background:
                            'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                          border: `1px solid ${theme.palette.divider}`,
                          borderRadius: 3,
                          transition: 'all 0.3s ease-in-out',
                          '&:hover': {
                            transform: 'translateY(-8px)',
                            boxShadow: `0 12px 32px ${theme.palette.success.main}20`,
                          },
                        }}
                      >
                        <Box
                          sx={{
                            p: 2,
                            borderRadius: '50%',
                            background: `linear-gradient(45deg, ${theme.palette.success.main}15 0%, ${theme.palette.success.main}25 100%)`,
                            width: 80,
                            height: 80,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mx: 'auto',
                            mb: 2,
                          }}
                        >
                          <AutoAwesome
                            sx={{
                              fontSize: 40,
                              color: theme.palette.success.main,
                            }}
                          />
                        </Box>
                        <Typography
                          variant="h6"
                          fontWeight={600}
                          sx={{ mb: 1 }}
                        >
                          Smart Processing
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Intelligent duplicate detection and data normalization
                        </Typography>
                      </Card>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                      <Card
                        elevation={0}
                        sx={{
                          textAlign: 'center',
                          p: 3,
                          background:
                            'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                          border: `1px solid ${theme.palette.divider}`,
                          borderRadius: 3,
                          transition: 'all 0.3s ease-in-out',
                          '&:hover': {
                            transform: 'translateY(-8px)',
                            boxShadow: `0 12px 32px ${theme.palette.info.main}20`,
                          },
                        }}
                      >
                        <Box
                          sx={{
                            p: 2,
                            borderRadius: '50%',
                            background: `linear-gradient(45deg, ${theme.palette.info.main}15 0%, ${theme.palette.info.main}25 100%)`,
                            width: 80,
                            height: 80,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mx: 'auto',
                            mb: 2,
                          }}
                        >
                          <Insights
                            sx={{
                              fontSize: 40,
                              color: theme.palette.info.main,
                            }}
                          />
                        </Box>
                        <Typography
                          variant="h6"
                          fontWeight={600}
                          sx={{ mb: 1 }}
                        >
                          Rich Analytics
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Detailed reports with insights and recommendations
                        </Typography>
                      </Card>
                    </Grid>
                  </Grid>
                </Box>
              </Grow>
            </Grid>
          </Grid>

          {}
          <Dialog
            open={exportDialogOpen}
            onClose={() => setExportDialogOpen(false)}
            maxWidth="sm"
            fullWidth
            fullScreen={isMobile}
            PaperProps={{
              sx: {
                borderRadius: 3,
                background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
              },
            }}
          >
            <DialogTitle sx={{ pb: 1 }}>
              <Box display="flex" alignItems="center">
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: '50%',
                    background: `linear-gradient(45deg, ${theme.palette.secondary.main}15 0%, ${theme.palette.secondary.main}25 100%)`,
                    mr: 2,
                  }}
                >
                  <FileDownload sx={{ color: theme.palette.secondary.main }} />
                </Box>
                <Box>
                  <Typography variant="h5" fontWeight={700}>
                    {t(
                      'bulkImportExport.export.configureTitle',
                      'Configure Export'
                    )}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Customize your export settings
                  </Typography>
                </Box>
              </Box>
            </DialogTitle>
            <DialogContent sx={{ px: 3, pb: 2 }}>
              <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>
                      {t('bulkImportExport.export.format', 'Format')}
                    </InputLabel>
                    <Select
                      value={exportOptions.format}
                      label={t('bulkImportExport.export.format', 'Format')}
                      onChange={(e) =>
                        setExportOptions((prev) => ({
                          ...prev,
                          format: e.target.value as 'csv' | 'xlsx' | 'json',
                        }))
                      }
                      sx={{
                        borderRadius: 2,
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': {
                            borderColor: theme.palette.secondary.main,
                          },
                        },
                      }}
                    >
                      <MenuItem value="csv">
                        <Box display="flex" alignItems="center">
                          <Description sx={{ mr: 1, fontSize: '1rem' }} />
                          CSV
                        </Box>
                      </MenuItem>
                      <MenuItem value="xlsx">
                        <Box display="flex" alignItems="center">
                          <TableChart sx={{ mr: 1, fontSize: '1rem' }} />
                          Excel (XLSX)
                        </Box>
                      </MenuItem>
                      <MenuItem value="json">
                        <Box display="flex" alignItems="center">
                          <Description sx={{ mr: 1, fontSize: '1rem' }} />
                          JSON
                        </Box>
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>
                      {t('bulkImportExport.export.category', 'Category')}
                    </InputLabel>
                    <Select
                      value={exportOptions.category}
                      label={t('bulkImportExport.export.category', 'Category')}
                      onChange={(e) =>
                        setExportOptions((prev) => ({
                          ...prev,
                          category: e.target.value,
                        }))
                      }
                    >
                      <MenuItem value="all">
                        {t(
                          'bulkImportExport.export.allCategories',
                          'All Categories'
                        )}
                      </MenuItem>
                      <MenuItem value="electronics">Electronics</MenuItem>
                      <MenuItem value="food">Food & Beverages</MenuItem>
                      <MenuItem value="clothing">Clothing</MenuItem>
                      <MenuItem value="books">Books</MenuItem>
                      <MenuItem value="home">Home & Garden</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>
                      {t('bulkImportExport.export.dateRange', 'Date Range')}
                    </InputLabel>
                    <Select
                      value={exportOptions.dateRange}
                      label={t(
                        'bulkImportExport.export.dateRange',
                        'Date Range'
                      )}
                      onChange={(e) =>
                        setExportOptions((prev) => ({
                          ...prev,
                          dateRange: e.target.value as
                            | 'all'
                            | 'last30'
                            | 'last90'
                            | 'custom',
                        }))
                      }
                    >
                      <MenuItem value="all">
                        {t('bulkImportExport.export.allTime', 'All Time')}
                      </MenuItem>
                      <MenuItem value="last30">
                        {t(
                          'bulkImportExport.export.last30Days',
                          'Last 30 Days'
                        )}
                      </MenuItem>
                      <MenuItem value="last90">
                        {t(
                          'bulkImportExport.export.last90Days',
                          'Last 90 Days'
                        )}
                      </MenuItem>
                      <MenuItem value="custom">
                        {t(
                          'bulkImportExport.export.customRange',
                          'Custom Range'
                        )}
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {exportOptions.dateRange === 'custom' && (
                  <>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        type="date"
                        label={t(
                          'bulkImportExport.export.startDate',
                          'Start Date'
                        )}
                        value={exportOptions.customStartDate || ''}
                        onChange={(e) =>
                          setExportOptions((prev) => ({
                            ...prev,
                            customStartDate: e.target.value,
                          }))
                        }
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        type="date"
                        label={t('bulkImportExport.export.endDate', 'End Date')}
                        value={exportOptions.customEndDate || ''}
                        onChange={(e) =>
                          setExportOptions((prev) => ({
                            ...prev,
                            customEndDate: e.target.value,
                          }))
                        }
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                  </>
                )}

                <Grid item xs={12}>
                  <Paper
                    elevation={0}
                    sx={{ p: 2, backgroundColor: `${theme.palette.grey[50]}` }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{ mb: 1, fontWeight: 600 }}
                    >
                      Export Summary:
                    </Typography>
                    <Stack
                      direction="row"
                      spacing={1}
                      flexWrap="wrap"
                      useFlexGap
                    >
                      <Chip
                        label={`Format: ${exportOptions.format.toUpperCase()}`}
                        color="primary"
                        size="medium"
                        variant="filled"
                        sx={{ fontWeight: 600 }}
                      />
                      <Chip
                        label={`Category: ${exportOptions.category === 'all' ? 'All' : exportOptions.category}`}
                        color="secondary"
                        size="medium"
                        variant="filled"
                        sx={{ fontWeight: 600 }}
                      />
                      <Chip
                        label={`Range: ${exportOptions.dateRange}`}
                        color="info"
                        size="medium"
                        variant="filled"
                        sx={{ fontWeight: 600 }}
                      />
                    </Stack>
                  </Paper>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
              <Button
                onClick={() => setExportDialogOpen(false)}
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                  borderColor: theme.palette.grey[300],
                  '&:hover': {
                    borderColor: theme.palette.grey[400],
                    backgroundColor: theme.palette.grey[50],
                  },
                }}
              >
                {t('common.cancel', 'Cancel')}
              </Button>
              <Button
                onClick={handleExport}
                variant="contained"
                disabled={exporting}
                startIcon={<FileDownload />}
                sx={{
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                  background: `linear-gradient(45deg, ${theme.palette.secondary.main} 30%, ${theme.palette.secondary.dark} 90%)`,
                  fontWeight: 600,
                  '&:hover': {
                    background: `linear-gradient(45deg, ${theme.palette.secondary.dark} 30%, ${theme.palette.secondary.main} 90%)`,
                  },
                }}
              >
                {t('bulkImportExport.export.start', 'Start Export')}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Quick Action FAB */}
          <Tooltip title="Quick Import" placement="left">
            <Fab
              color="primary"
              sx={{
                position: 'fixed',
                bottom: { xs: 16, md: 24 },
                right: { xs: 16, md: 24 },
                background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
                boxShadow: `0 8px 32px ${theme.palette.primary.main}40`,
                '&:hover': {
                  background: `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.primary.main} 90%)`,
                  transform: 'translateY(-4px)',
                  boxShadow: `0 12px 40px ${theme.palette.primary.main}50`,
                },
                '&:active': {
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
              onClick={() => fileInputRef.current?.click()}
              disabled={importing || exporting}
            >
              <CloudUpload />
            </Fab>
          </Tooltip>

          {}
          <Backdrop
            open={importing || exporting}
            sx={{
              zIndex: theme.zIndex.drawer + 1,
              backdropFilter: 'blur(4px)',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
            }}
          >
            <Card
              elevation={0}
              sx={{
                p: 4,
                textAlign: 'center',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: 3,
                border: `1px solid ${theme.palette.divider}`,
                minWidth: 300,
              }}
            >
              <Box sx={{ mb: 2 }}>
                <LinearProgress
                  variant="determinate"
                  value={importing ? importProgress : exportProgress}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: `${importing ? theme.palette.primary.main : theme.palette.secondary.main}15`,
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 4,
                      background: importing
                        ? `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`
                        : `linear-gradient(90deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.light} 100%)`,
                    },
                  }}
                />
              </Box>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                {importing ? 'Processing Import...' : 'Generating Export...'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {importing ? importProgress : exportProgress}% Complete
              </Typography>
            </Card>
          </Backdrop>
        </Box>
      </Fade>
    </Box>
  );
};

export default BulkImportExport;
