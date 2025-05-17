import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import Image from 'next/image';
import { MdRestore } from 'react-icons/md';
import {
  SettingsModalPresentationProps,
  settingsItems,
} from './types/settingsTypes';
import SettingsNavigation from './components/settings/SettingsNavigation';
import SettingsContent from './components/settings/SettingsContent';
import CreateRoleModal from './components/settings/CreateRoleModal';

const SettingsModalPresentation: React.FC<SettingsModalPresentationProps> = ({
  open,
  onClose,
  isLoading,
  error,
  sidebarColor,
  setSidebarColor,
  navbarColor,
  setNavbarColor,
  logoPreview,
  showSidebarColorPicker,
  setShowSidebarColorPicker,
  showNavbarColorPicker,
  setShowNavbarColorPicker,
  selectedSetting,
  setSelectedSetting,
  searchQuery,
  setSearchQuery,
  handleLogoFileChange,
  handleSave,
  handleReset,
  taxSettings,
  setTaxSettings,
  regionalSettings,
  setRegionalSettings,
  selectedRoleTab,
  setSelectedRoleTab,
  createRoleModalOpen,
  setCreateRoleModalOpen,
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
  packages,
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
  snackbarOpen,
  setSnackbarOpen,
  snackbarMessage,
  snackbarSeverity,
  changeHistory,
  isSaving = false,
}) => {
  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="lg"
        fullWidth
        aria-labelledby="settings-dialog-title"
        sx={{
          '& .MuiBackdrop-root': {
            backdropFilter: 'blur(8px)',
            backgroundColor: 'rgba(23, 58, 121, 0.2)',
          },

          '& .MuiDialog-paper': {
            height: '80vh',
            maxHeight: '800px',
            borderRadius: 4,
            overflow: 'hidden',
            background:
              'linear-gradient(135deg, rgba(23, 58, 121, 0.1) 0%, rgba(23, 58, 121, 0.05) 100%)',
            boxShadow: '0 8px 32px rgba(23, 58, 121, 0.15)',
            border: '1px solid rgba(23, 58, 121, 0.1)',
            backdropFilter: 'blur(4px)',

            '@media (min-width: 1024px) and (max-width: 1440px)': {
              height: '90vh',
              maxHeight: '900px',
            },
          },
          '& ::-webkit-scrollbar': {
            display: 'none',
          },
          '& *': {
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
          },
        }}
      >
        <DialogTitle
          id="settings-dialog-title"
          sx={{
            fontSize: '1.3rem',
            fontWeight: 'bold',
            padding: '16px 24px',
            color: '#173A79',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            bgcolor: 'rgba(249, 249, 249, 0.9)',
            borderBottom: '1px solid rgba(23, 58, 121, 0.1)',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Image
              src={logoPreview}
              alt="Pisval Tech Logo"
              width={32}
              height={32}
              style={{ borderRadius: '4px' }}
              unoptimized
            />
            Pisval Tech Settings
          </Box>
        </DialogTitle>

        <DialogContent
          dividers
          sx={{
            display: 'flex',
            padding: 0,
            background: 'rgba(255, 255, 255, 0.8)',
            borderTop: '1px solid rgba(23, 58, 121, 0.1)',
            borderBottom: '1px solid rgba(23, 58, 121, 0.1)',
          }}
        >
          {}
          <SettingsNavigation
            selectedSetting={selectedSetting}
            setSelectedSetting={setSelectedSetting}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            settingsItems={settingsItems}
          />

          {}
          <SettingsContent
            isLoading={isLoading}
            error={error}
            selectedSetting={selectedSetting}
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
            taxSettings={taxSettings}
            setTaxSettings={setTaxSettings}
            regionalSettings={regionalSettings}
            setRegionalSettings={setRegionalSettings}
            selectedRoleTab={selectedRoleTab}
            setSelectedRoleTab={setSelectedRoleTab}
            setCreateRoleModalOpen={setCreateRoleModalOpen}
            packages={packages}
            subscription={subscription}
            availableFeatures={availableFeatures}
            enableAdditionalPackage={enableAdditionalPackage}
            disableAdditionalPackage={disableAdditionalPackage}
            cacheDuration={cacheDuration}
            setCacheDuration={setCacheDuration}
            autoRefreshOnFocus={autoRefreshOnFocus}
            setAutoRefreshOnFocus={setAutoRefreshOnFocus}
            prefetchImportantData={prefetchImportantData}
            setPrefetchImportantData={setPrefetchImportantData}
            changeHistory={changeHistory}
          />
        </DialogContent>

        <DialogActions
          sx={{
            justifyContent: 'space-between',
            padding: '16px 24px',
            borderTop: '1px solid rgba(23, 58, 121, 0.1)',
            bgcolor: 'rgba(249, 249, 249, 0.9)',
          }}
        >
          <Button
            onClick={onClose}
            variant="outlined"
            sx={{
              textTransform: 'none',
              borderRadius: 4,
              px: 3,
              py: 1,
              color: '#666',
              borderColor: '#ccc',
              '&:hover': {
                borderColor: '#999',
                bgcolor: 'rgba(0,0,0,0.03)',
              },
            }}
          >
            Cancel
          </Button>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                color="inherit"
                sx={{
                  textTransform: 'none',
                  borderRadius: 4,
                  px: 2,
                }}
              >
                Export
              </Button>

              <Button
                variant="outlined"
                color="inherit"
                component="label"
                sx={{
                  textTransform: 'none',
                  borderRadius: 4,
                  px: 2,
                }}
              >
                Import
                <input
                  type="file"
                  accept="application/json"
                  style={{ display: 'none' }}
                />
              </Button>
            </Box>

            <Box
              sx={{
                display: 'flex',
                gap: 1,
                ml: 1,
              }}
            >
              <Button
                onClick={handleReset}
                variant="outlined"
                color="warning"
                startIcon={<MdRestore />}
                sx={{
                  textTransform: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  borderRadius: 4,
                  px: 3,
                  py: 1,
                }}
              >
                Reset
              </Button>
              <Button
                onClick={handleSave}
                color="primary"
                variant="contained"
                disabled={isSaving}
                sx={{
                  textTransform: 'none',
                  borderRadius: 4,
                  px: 3,
                  py: 1,
                  fontWeight: 'bold',
                  boxShadow: 'none',
                  minWidth: '100px',
                  bgcolor: '#173A79',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(23, 58, 121, 0.3)',
                    bgcolor: '#0f2d6a',
                  },
                }}
              >
                {isSaving ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Save'
                )}
              </Button>
            </Box>
          </Box>
        </DialogActions>
      </Dialog>

      {}
      <CreateRoleModal
        open={createRoleModalOpen}
        onClose={() => setCreateRoleModalOpen(false)}
        newRoleName={newRoleName}
        setNewRoleName={setNewRoleName}
        newRoleDescription={newRoleDescription}
        setNewRoleDescription={setNewRoleDescription}
        selectedTemplate={selectedTemplate}
        setSelectedTemplate={setSelectedTemplate}
        configurePermissionsAfter={configurePermissionsAfter}
        setConfigurePermissionsAfter={setConfigurePermissionsAfter}
        roleNameError={roleNameError}
        createRolePending={createRolePending}
        handleCreateRole={handleCreateRole}
        getTemplatePermissions={getTemplatePermissions}
      />

      {}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default SettingsModalPresentation;
