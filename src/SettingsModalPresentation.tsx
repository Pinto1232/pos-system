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
} from '@mui/material';
import Image from 'next/image';
import { MdRestore } from 'react-icons/md';
import { SettingsModalPresentationProps, settingsItems } from './types/settingsTypes';
import SettingsNavigation from './components/settings/SettingsNavigation';
import SettingsContent from './components/settings/SettingsContent';
import CreateRoleModal from './components/settings/CreateRoleModal';

/**
 * Presentation component for the Settings Modal
 * Responsible for rendering the UI structure without business logic
 */
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
          '& .MuiDialog-paper': {
            height: '80vh',
            maxHeight: '800px',
            borderRadius: 4,
            overflow: 'hidden',
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
            bgcolor: '#f9f9f9',
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
          sx={{ display: 'flex', padding: 0 }}
        >
          {/* Sidebar Navigation */}
          <SettingsNavigation
            selectedSetting={selectedSetting}
            setSelectedSetting={setSelectedSetting}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            settingsItems={settingsItems}
          />

          {/* Content Area */}
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
            borderTop: '1px solid #e0e0e0',
            bgcolor: '#f9f9f9',
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
                sx={{
                  textTransform: 'none',
                  borderRadius: 4,
                  px: 3,
                  py: 1,
                  fontWeight: 'bold',
                  boxShadow: 'none',
                  '&:hover': {
                    boxShadow: 'none',
                    bgcolor: '#0f2d6a',
                  },
                }}
              >
                Save
              </Button>
            </Box>
          </Box>
        </DialogActions>
      </Dialog>

      {/* Create Role Modal */}
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

      {/* Snackbar for notifications */}
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
    </>
  );
};

export default SettingsModalPresentation;
