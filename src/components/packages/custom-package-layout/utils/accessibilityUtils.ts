import React from 'react';

export const handleKeyboardAction = (
  e: React.KeyboardEvent,
  callback: () => void
): void => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    callback();
  }
};

export const getSelectableItemProps = (
  isSelected: boolean,
  label: string
): Record<string, string> => {
  return {
    role: 'button',
    'aria-pressed': isSelected.toString(),
    'aria-label': label,
  };
};

export const getStepAriaProps = (
  stepIndex: number,
  totalSteps: number,
  stepName: string
): Record<string, string> => {
  return {
    'aria-current': 'step',
    'aria-label': `Step ${stepIndex + 1} of ${totalSteps}: ${stepName}`,
  };
};

export const getFormFieldAriaProps = (
  id: string,
  label: string,
  isRequired: boolean = false,
  hasError: boolean = false,
  errorMessage: string = ''
): Record<string, string> => {
  const props: Record<string, string> = {
    id,
    'aria-label': label,
  };

  if (isRequired) {
    props['aria-required'] = 'true';
  }

  if (hasError) {
    props['aria-invalid'] = 'true';
    if (errorMessage) {
      props['aria-errormessage'] = `${id}-error`;
    }
  }

  return props;
};
