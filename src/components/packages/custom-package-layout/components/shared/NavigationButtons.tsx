'use client';

import React from 'react';
import { Button, CircularProgress } from '@mui/material';
import styles from '../../CustomPackageLayout.module.css';
import { handleKeyboardAction } from '../../utils/accessibilityUtils';

interface NavigationButtonsProps {
  onBack?: () => void;
  onNext?: () => void;
  onSave?: () => void;
  backLabel?: string;
  nextLabel?: string;
  saveLabel?: string;
  isBackDisabled?: boolean;
  isNextDisabled?: boolean;
  isSaveDisabled?: boolean;
  isBackLoading?: boolean;
  isNextLoading?: boolean;
  isSaveLoading?: boolean;
  showBackButton?: boolean;
  showNextButton?: boolean;
  showSaveButton?: boolean;
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  onBack,
  onNext,
  onSave,
  backLabel = 'Back',
  nextLabel = 'Next',
  saveLabel = 'Save',
  isBackDisabled = false,
  isNextDisabled = false,
  isSaveDisabled = false,
  isBackLoading = false,
  isNextLoading = false,
  isSaveLoading = false,
  showBackButton = true,
  showNextButton = true,
  showSaveButton = false,
}) => {
  return (
    <div className={styles.packageDetailsControls}>
      {showBackButton && (
        <Button
          className={`${styles.packageDetailsButton} ${styles.packageDetailsButtonBack}`}
          variant="outlined"
          onClick={onBack}
          disabled={isBackDisabled || isBackLoading}
          aria-label={backLabel}
          onKeyDown={(e) => handleKeyboardAction(e, onBack || (() => {}))}
          tabIndex={0}
        >
          {isBackLoading ? <CircularProgress size={20} /> : backLabel}
        </Button>
      )}

      {showNextButton && (
        <Button
          className={`${styles.packageDetailsButton} ${styles.packageDetailsButtonContinue}`}
          variant="contained"
          onClick={onNext}
          disabled={isNextDisabled || isNextLoading}
          aria-label={nextLabel}
          onKeyDown={(e) => handleKeyboardAction(e, onNext || (() => {}))}
          tabIndex={0}
        >
          {isNextLoading ? (
            <CircularProgress size={20} sx={{ color: 'white' }} />
          ) : (
            nextLabel
          )}
        </Button>
      )}

      {showSaveButton && (
        <Button
          className={`${styles.packageDetailsButton} ${styles.packageDetailsButtonContinue}`}
          variant="contained"
          onClick={onSave}
          disabled={isSaveDisabled || isSaveLoading}
          aria-label={saveLabel}
          onKeyDown={(e) => handleKeyboardAction(e, onSave || (() => {}))}
          tabIndex={0}
        >
          {isSaveLoading ? (
            <CircularProgress size={20} sx={{ color: 'white' }} />
          ) : (
            saveLabel
          )}
        </Button>
      )}
    </div>
  );
};

export default React.memo(NavigationButtons);
