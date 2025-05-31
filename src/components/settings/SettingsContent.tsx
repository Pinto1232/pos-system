import React, { useState } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import GeneralSettingsContent from './content/GeneralSettingsContent';
import TaxSettingsContent from './content/TaxSettingsContent';
import RegionalSettingsContent from './content/RegionalSettingsContent';
import BusinessInfoContent from './content/BusinessInfoContent';
import UserRoleContent from './content/UserRoleContent';
import PackageManagementContent from './content/PackageManagementContent';
import SubscriptionManagement from './content/SubscriptionManagement';
import EmailSettingsContent from './content/EmailSettingsContent';
import SystemBackupContent from './content/SystemBackupContent';
import ApiIntegrationsContent from './content/ApiIntegrationsContent';
import CacheManagementContent from './content/CacheManagementContent';
import ChangeHistoryContent from './content/ChangeHistoryContent';
import { TaxSettings, RegionalSettings } from '../../types/settingsTypes';

import type { Package, Subscription } from './content/PackageManagementContent';

interface SettingsContentProps {
  isLoading: boolean;
  error: Error | null;
  selectedSetting: string;
  sidebarColor: string;
  setSidebarColor: (color: string) => void;
  navbarColor: string;
  setNavbarColor: (color: string) => void;
  logoPreview: string;
  showSidebarColorPicker: boolean;
  setShowSidebarColorPicker: (show: boolean) => void;
  showNavbarColorPicker: boolean;
  setShowNavbarColorPicker: (show: boolean) => void;
  handleLogoFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  taxSettings: TaxSettings;
  setTaxSettings: (settings: TaxSettings) => void;
  regionalSettings: RegionalSettings;
  setRegionalSettings: (settings: RegionalSettings) => void;
  selectedRoleTab: number;
  setSelectedRoleTab: (tab: number) => void;
  setCreateRoleModalOpen: (open: boolean) => void;
  packages: Package[] | undefined;
  isPackagesLoading?: boolean;
  packagesError?: Error | null;
  refetchPackages?: () => void;
  subscription: Subscription;
  availableFeatures: string[];
  enableAdditionalPackage: (packageId: number) => Promise<void>;
  disableAdditionalPackage: (packageId: number) => Promise<void>;
  cacheDuration: string;
  setCacheDuration: (duration: string) => void;
  autoRefreshOnFocus: boolean;
  setAutoRefreshOnFocus: (refresh: boolean) => void;
  prefetchImportantData: boolean;
  setPrefetchImportantData: (prefetch: boolean) => void;
  changeHistory: {
    timestamp: Date;
    setting: string;
    oldValue: unknown;
    newValue: unknown;
  }[];
}

const SettingsContent: React.FC<SettingsContentProps> = ({
  isLoading,
  error,
  selectedSetting,
  sidebarColor,
  setSidebarColor,
  navbarColor,
  setNavbarColor,
  logoPreview,
  showSidebarColorPicker,
  setShowSidebarColorPicker,
  showNavbarColorPicker,
  setShowNavbarColorPicker,
  handleLogoFileChange,
  taxSettings,
  setTaxSettings,
  regionalSettings,
  setRegionalSettings,
  selectedRoleTab,
  setSelectedRoleTab,
  setCreateRoleModalOpen,
  packages,
  isPackagesLoading,
  packagesError,
  refetchPackages,
  subscription,
  availableFeatures,
  enableAdditionalPackage,
  disableAdditionalPackage,
  cacheDuration,
  setCacheDuration,
  autoRefreshOnFocus,
  setAutoRefreshOnFocus,
  prefetchImportantData,
  setPrefetchImportantData,
  changeHistory,
}) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    'success' | 'error' | 'info' | 'warning'
  >('success');

  const handleSnackbar = (
    message: string,
    severity: 'success' | 'error' | 'info' | 'warning'
  ) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };
  const renderSettingContent = () => {
    switch (selectedSetting) {
      case 'General Settings':
        return (
          <GeneralSettingsContent
            sidebarColor={sidebarColor}
            setSidebarColor={setSidebarColor}
            navbarColor={navbarColor}
            setNavbarColor={setNavbarColor}
            logoPreview={logoPreview}
            showSidebarColorPicker={showSidebarColorPicker}
            setShowSidebarColorPicker={setShowSidebarColorPicker}
            showNavbarColorPicker={showNavbarColorPicker}
            setShowNavbarColorPicker={setShowNavbarColorPicker}
            handleLogoFileChange={handleLogoFileChange}
          />
        );
      case 'Tax & VAT Configuration':
        return (
          <TaxSettingsContent
            taxSettings={taxSettings}
            setTaxSettings={setTaxSettings}
          />
        );
      case 'Currency & Regional Settings':
        return (
          <RegionalSettingsContent
            regionalSettings={regionalSettings}
            setRegionalSettings={setRegionalSettings}
          />
        );
      case 'Business Information':
        return <BusinessInfoContent />;
      case 'User & Role Management':
        return (
          <UserRoleContent
            selectedRoleTab={selectedRoleTab}
            setSelectedRoleTab={setSelectedRoleTab}
            setCreateRoleModalOpen={setCreateRoleModalOpen}
          />
        );
      case 'Subscription Management':
        return <SubscriptionManagement onSnackbar={handleSnackbar} />;
      case 'Package Management':
        return (
          <PackageManagementContent
            packages={packages}
            isLoading={isPackagesLoading}
            error={packagesError}
            refetchPackages={refetchPackages}
            subscription={subscription}
            availableFeatures={availableFeatures}
            enableAdditionalPackage={enableAdditionalPackage}
            disableAdditionalPackage={disableAdditionalPackage}
          />
        );
      case 'Email & Notification Settings':
        return <EmailSettingsContent />;
      case 'System Backup & Restore':
        return <SystemBackupContent />;
      case 'API & Third-Party Integrations':
        return <ApiIntegrationsContent />;
      case 'Cache Management':
        return (
          <CacheManagementContent
            cacheDuration={cacheDuration}
            setCacheDuration={setCacheDuration}
            autoRefreshOnFocus={autoRefreshOnFocus}
            setAutoRefreshOnFocus={setAutoRefreshOnFocus}
            prefetchImportantData={prefetchImportantData}
            setPrefetchImportantData={setPrefetchImportantData}
          />
        );
      case 'Change History':
        return <ChangeHistoryContent changeHistory={changeHistory} />;
      default:
        return (
          <Box sx={{ p: 2 }}>
            <Typography>Select a setting from the sidebar</Typography>
          </Box>
        );
    }
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        p: 0,
        display: 'flex',
        flexDirection: 'column',
        width: 'calc(100% - 280px)',
        height: '600px',
        overflowY: 'auto',
        bgcolor: '#fff',
        '&::-webkit-scrollbar': {
          display: 'none',
        },
        msOverflowStyle: 'none',
        scrollbarWidth: 'none',
      }}
    >
      {}
      <Box
        sx={{
          position: 'relative',
          height: '100%',
          width: '100%',
        }}
      >
        {renderSettingContent()}

        {isLoading && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              bgcolor: 'rgba(255,255,255,0.8)',
              zIndex: 10,
            }}
          >
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              bgcolor: 'rgba(255,255,255,0.8)',
              zIndex: 10,
            }}
          >
            <Typography color="error">{error.message}</Typography>
          </Box>
        )}
      </Box>

      {}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SettingsContent;
