'use client';

import React from 'react';
import { Stepper, Step, StepLabel } from '@mui/material';
import styles from '../../CustomPackageLayout.module.css';
import { getStepAriaProps } from '../../utils/accessibilityUtils';

interface StepperComponentProps {
  steps: string[];
  currentStep: number;
}

const StepperComponent: React.FC<StepperComponentProps> = ({
  steps,
  currentStep,
}) => {
  return (
    <div className={styles.stepperWrapper}>
      <Stepper
        activeStep={currentStep}
        alternativeLabel
        className={styles.stepperContainer}
        sx={{
          borderBottom: 'none',
          '& .MuiStepConnector-line': {
            borderColor: '#e2e8f0',
            borderTopWidth: '1px',
          },
        }}
      >
        {steps.map((label, index) => {
          const stepLabel = label || `Step ${index + 1}`;
          const ariaProps = getStepAriaProps(index, steps.length, stepLabel);

          return (
            <Step key={index} {...ariaProps}>
              <StepLabel>{stepLabel}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
    </div>
  );
};

export default React.memo(StepperComponent);
