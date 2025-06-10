'use client';

import React from 'react';
import { Box, Typography, Chip, Paper, Collapse } from '@mui/material';
import { FaInfoCircle, FaCheck, FaPlus, FaCheckCircle } from 'react-icons/fa';
import BarChartIcon from '@mui/icons-material/BarChart';
import CodeIcon from '@mui/icons-material/Code';
import BrushIcon from '@mui/icons-material/Brush';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import StorageIcon from '@mui/icons-material/Storage';
import { AddOn } from '../../types';
import {
  handleKeyboardAction,
  getSelectableItemProps,
} from '../../utils/accessibilityUtils';

const ListItem = ({
  text,
  type = 'feature',
}: {
  text: string;
  type?: 'feature' | 'dependency';
}) => (
  <Box
    component="li"
    sx={{
      mb: 0.75,
      color: '#475569',
      fontSize: '0.85rem',
      display: 'flex',
      alignItems: 'flex-start',
      gap: 1,
    }}
  >
    <Box
      sx={{
        flexShrink: 0,
        mt: 0.1,
        color: type === 'feature' ? '#2563eb' : '#10b981',
      }}
    >
      <FaCheckCircle size={14} />
    </Box>
    <Typography
      variant="body2"
      sx={{
        color: '#475569',
        fontSize: '0.85rem',
        lineHeight: 1.5,
        mt: 0,
      }}
    >
      {text}
    </Typography>
  </Box>
);

interface AddOnToggleProps {
  addOn: AddOn;
  isSelected: boolean;
  onToggle: (addOn: AddOn) => void;
  currency: string;
  formatPrice: (currency: string, price: number) => string;
}

const AddOnToggle: React.FC<AddOnToggleProps> = ({
  addOn,
  isSelected,
  onToggle,
  currency,
  formatPrice,
}) => {
  const sanitizeAddOnName = React.useCallback((name: string) => {
    return name.replace(/[^a-zA-Z0-9 ]/g, '');
  }, []);

  const addOnPrice = React.useMemo(() => {
    return addOn.multiCurrencyPrices
      ? addOn.multiCurrencyPrices[currency]
      : addOn.price;
  }, [addOn.multiCurrencyPrices, addOn.price, currency]);

  const handleToggle = React.useCallback(() => {
    onToggle(addOn);
  }, [onToggle, addOn]);

  const renderIcon = React.useCallback(() => {
    if (!addOn.icon) return null;

    switch (addOn.icon) {
      case 'analytics_icon':
        return <BarChartIcon fontSize="small" />;
      case 'api_icon':
        return <CodeIcon fontSize="small" />;
      case 'branding_icon':
        return <BrushIcon fontSize="small" />;
      case 'support_icon':
        return <SupportAgentIcon fontSize="small" />;
      case 'migration_icon':
        return <StorageIcon fontSize="small" />;
      default:
        return null;
    }
  }, [addOn.icon]);

  const features = React.useMemo(() => {
    if (!addOn.features) return [];
    if (Array.isArray(addOn.features)) {
      return addOn.features.filter(
        (feature) => feature && feature.trim() !== ''
      );
    }

    try {
      // Cast to string to ensure TypeScript knows we're working with a string
      const featuresAsString = addOn.features as unknown as string;
      const parsedFeatures = JSON.parse(featuresAsString);
      return Array.isArray(parsedFeatures)
        ? parsedFeatures.filter((feature) => feature && feature.trim() !== '')
        : [];
    } catch {
      // If it's a string but not valid JSON, try to split by commas

      const featuresAsString = addOn.features as unknown as string;
      if (
        typeof featuresAsString === 'string' &&
        featuresAsString.trim() !== ''
      ) {
        return featuresAsString
          .split(',')
          .map((f) => f.trim())
          .filter((f) => f !== '');
      }
      return [];
    }
  }, [addOn.features]);

  const dependencies = React.useMemo(() => {
    if (!addOn.dependencies) return [];
    if (Array.isArray(addOn.dependencies)) {
      return addOn.dependencies.filter((dep) => dep && dep.trim() !== '');
    }

    try {
      // Cast to string to ensure TypeScript knows we're working with a string
      const dependenciesAsString = addOn.dependencies as unknown as string;
      const parsedDeps = JSON.parse(dependenciesAsString);
      return Array.isArray(parsedDeps)
        ? parsedDeps.filter((dep) => dep && dep.trim() !== '')
        : [];
    } catch {
      // If it's a string but not valid JSON, try to split by commas

      const dependenciesAsString = addOn.dependencies as unknown as string;
      if (
        typeof dependenciesAsString === 'string' &&
        dependenciesAsString.trim() !== ''
      ) {
        return dependenciesAsString
          .split(',')
          .map((d) => d.trim())
          .filter((d) => d !== '');
      }
      return [];
    }
  }, [addOn.dependencies]);

  const ariaProps = React.useMemo(() => {
    return getSelectableItemProps(
      isSelected,
      `Add-on: ${sanitizeAddOnName(addOn.name)}, Price: ${formatPrice(currency, addOnPrice)}`
    );
  }, [
    isSelected,
    addOn.name,
    formatPrice,
    currency,
    addOnPrice,
    sanitizeAddOnName,
  ]);

  return (
    <Paper
      elevation={isSelected ? 4 : 1}
      sx={{
        height: '100%',
        background: 'white',
        border: isSelected
          ? '2px solid #2563eb'
          : '1px solid rgba(226, 232, 240, 0.8)',
        borderRadius: '12px',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: isSelected
          ? '0 8px 20px rgba(37, 99, 235, 0.12)'
          : '0 2px 10px rgba(0, 0, 0, 0.04)',
        cursor: 'pointer',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 24px rgba(0, 0, 0, 0.08)',
          borderColor: isSelected ? '#2563eb' : '#94a3b8',
        },
        ...(isSelected && {
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background:
              'linear-gradient(135deg, rgba(37, 99, 235, 0.03) 0%, transparent 100%)',
            borderRadius: '10px',
            pointerEvents: 'none',
          },
        }),
      }}
      onClick={handleToggle}
      onKeyDown={(e) => handleKeyboardAction(e, handleToggle)}
      tabIndex={0}
      {...ariaProps}
    >
      {}
      {isSelected && (
        <Box
          sx={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            backgroundColor: '#10b981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            boxShadow: '0 2px 5px rgba(16, 185, 129, 0.3)',
            border: '2px solid white',
            zIndex: 2,
          }}
        >
          <FaCheck size={10} aria-hidden="true" />
        </Box>
      )}

      {}
      <Box
        sx={{
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
          borderBottom: isSelected
            ? '1px dashed rgba(37, 99, 235, 0.2)'
            : 'none',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {addOn.icon && (
            <Box
              sx={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                backgroundColor: isSelected
                  ? 'rgba(37, 99, 235, 0.1)'
                  : 'rgba(226, 232, 240, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#2563eb',
                flexShrink: 0,
              }}
            >
              {renderIcon()}
            </Box>
          )}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: '#1e293b',
              fontSize: '1.1rem',
              lineHeight: 1.3,
              flexGrow: 1,
            }}
          >
            {sanitizeAddOnName(addOn.name)}
          </Typography>
        </Box>

        <Typography
          variant="body2"
          sx={{
            color: '#64748b',
            fontSize: '0.875rem',
            lineHeight: 1.5,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {addOn.description}
        </Typography>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 1,
          }}
        >
          <Chip
            label={formatPrice(currency, addOnPrice)}
            size="medium"
            sx={{
              fontWeight: 700,
              color: isSelected ? 'white' : '#2563eb',
              backgroundColor: isSelected
                ? '#2563eb'
                : 'rgba(37, 99, 235, 0.08)',
              padding: '0 8px',
              height: '28px',
              borderRadius: '6px',
              fontSize: '0.85rem',
              transition: 'all 0.2s ease',
              border: isSelected ? 'none' : '1px solid rgba(37, 99, 235, 0.15)',
              boxShadow: isSelected
                ? '0 2px 5px rgba(37, 99, 235, 0.2)'
                : 'none',
            }}
          />
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              color: isSelected ? '#10b981' : '#64748b',
              fontSize: '0.85rem',
              fontWeight: 500,
            }}
          >
            {isSelected ? (
              <>
                <FaCheck size={14} />
                <span>Selected</span>
              </>
            ) : (
              <>
                <FaPlus size={14} />
                <span>Add to package</span>
              </>
            )}
          </Box>
        </Box>
      </Box>

      {}
      <Collapse in={isSelected}>
        <Box
          sx={{
            padding: '1.25rem 1.5rem',
            backgroundColor: 'rgba(248, 250, 252, 0.8)',
            borderTop: '1px dashed rgba(203, 213, 225, 0.5)',
          }}
        >
          {}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                mb: 1,
                color: '#1e293b',
                display: 'flex',
                alignItems: 'center',
                gap: 0.75,
                fontSize: '0.9rem',
                pb: 0.5,
                borderBottom: '1px dashed rgba(37, 99, 235, 0.2)',
              }}
            >
              <FaInfoCircle size={14} color="#2563eb" />
              Features
            </Typography>
            {features.length > 0 ? (
              <Box
                component="ul"
                sx={{
                  pl: 0,
                  m: 0,
                  listStyleType: 'none',
                }}
                role="list"
                aria-label={`Features of ${sanitizeAddOnName(addOn.name)}`}
              >
                {features.map((feature: string, idx: number) => (
                  <ListItem key={idx} text={feature} type="feature" />
                ))}
              </Box>
            ) : (
              <Box
                component="ul"
                sx={{
                  pl: 0,
                  m: 0,
                  listStyleType: 'none',
                }}
                role="list"
                aria-label={`Default features of ${sanitizeAddOnName(addOn.name)}`}
              >
                {sanitizeAddOnName(addOn.name) === 'Advanced Analytics' && (
                  <>
                    <ListItem text="Real-time dashboard" type="feature" />
                    <ListItem text="Custom report builder" type="feature" />
                    <ListItem text="Data visualization tools" type="feature" />
                    <ListItem text="Performance metrics" type="feature" />
                    <ListItem text="Export to Excel/PDF" type="feature" />
                  </>
                )}
                {sanitizeAddOnName(addOn.name) === 'API Access' && (
                  <>
                    <ListItem text="RESTful API endpoints" type="feature" />
                    <ListItem text="OAuth authentication" type="feature" />
                    <ListItem
                      text="Comprehensive documentation"
                      type="feature"
                    />
                    <ListItem
                      text="Rate limits up to 10,000 requests/day"
                      type="feature"
                    />
                    <ListItem text="Webhook support" type="feature" />
                  </>
                )}
                {sanitizeAddOnName(addOn.name) === 'Custom Branding' && (
                  <>
                    <ListItem text="Custom logo" type="feature" />
                    <ListItem
                      text="Color scheme customization"
                      type="feature"
                    />
                    <ListItem text="Receipt customization" type="feature" />
                    <ListItem text="Email template branding" type="feature" />
                    <ListItem text="Custom domain" type="feature" />
                  </>
                )}
                {sanitizeAddOnName(addOn.name) === '247 Support' && (
                  <>
                    <ListItem text="Phone support" type="feature" />
                    <ListItem text="Live chat" type="feature" />
                    <ListItem text="Priority email" type="feature" />
                    <ListItem text="Dedicated account manager" type="feature" />
                    <ListItem text="Monthly check-ins" type="feature" />
                  </>
                )}
                {sanitizeAddOnName(addOn.name) === 'Data Migration' && (
                  <>
                    <ListItem text="Data mapping" type="feature" />
                    <ListItem text="Automated transfer" type="feature" />
                    <ListItem text="Data validation" type="feature" />
                    <ListItem text="Historical data import" type="feature" />
                    <ListItem text="Custom field mapping" type="feature" />
                  </>
                )}
                {![
                  'Advanced Analytics',
                  'API Access',
                  'Custom Branding',
                  '247 Support',
                  'Data Migration',
                ].includes(sanitizeAddOnName(addOn.name)) && (
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#64748b',
                      fontSize: '0.85rem',
                      fontStyle: 'italic',
                    }}
                  >
                    Enhanced functionality for your POS system.
                  </Typography>
                )}
              </Box>
            )}
          </Box>

          {}
          <Box>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                mb: 1,
                color: '#1e293b',
                display: 'flex',
                alignItems: 'center',
                gap: 0.75,
                fontSize: '0.9rem',
                mt: 2,
                pb: 0.5,
                borderBottom: '1px dashed rgba(16, 185, 129, 0.2)',
              }}
            >
              <FaInfoCircle size={14} color="#10b981" />
              Requirements
            </Typography>
            {dependencies.length > 0 ? (
              <Box
                component="ul"
                sx={{
                  pl: 0,
                  m: 0,
                  listStyleType: 'none',
                }}
                role="list"
                aria-label={`Requirements for ${sanitizeAddOnName(addOn.name)}`}
              >
                {dependencies.map((dep: string, idx: number) => (
                  <ListItem key={idx} text={dep} type="dependency" />
                ))}
              </Box>
            ) : (
              <Box
                component="ul"
                sx={{
                  pl: 0,
                  m: 0,
                  listStyleType: 'none',
                }}
                role="list"
                aria-label={`Default requirements for ${sanitizeAddOnName(addOn.name)}`}
              >
                {sanitizeAddOnName(addOn.name) === 'Advanced Analytics' && (
                  <>
                    <ListItem text="Base POS System" type="dependency" />
                    <ListItem text="Data Storage Extension" type="dependency" />
                  </>
                )}
                {sanitizeAddOnName(addOn.name) === 'API Access' && (
                  <>
                    <ListItem text="Base POS System" type="dependency" />
                    <ListItem text="Security Module" type="dependency" />
                  </>
                )}
                {sanitizeAddOnName(addOn.name) === 'Custom Branding' && (
                  <>
                    <ListItem text="Base POS System" type="dependency" />
                    <ListItem text="UI Components" type="dependency" />
                  </>
                )}
                {sanitizeAddOnName(addOn.name) === '247 Support' && (
                  <>
                    <ListItem text="Base POS System" type="dependency" />
                    <ListItem text="Communication Module" type="dependency" />
                  </>
                )}
                {sanitizeAddOnName(addOn.name) === 'Data Migration' && (
                  <>
                    <ListItem text="Base POS System" type="dependency" />
                    <ListItem text="Data Storage Extension" type="dependency" />
                    <ListItem text="ETL Tools" type="dependency" />
                  </>
                )}
                {![
                  'Advanced Analytics',
                  'API Access',
                  'Custom Branding',
                  '247 Support',
                  'Data Migration',
                ].includes(sanitizeAddOnName(addOn.name)) && (
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#64748b',
                      fontSize: '0.85rem',
                      fontStyle: 'italic',
                    }}
                  >
                    Standard system requirements apply.
                  </Typography>
                )}
              </Box>
            )}
          </Box>
        </Box>
      </Collapse>
    </Paper>
  );
};

export default React.memo(AddOnToggle);
