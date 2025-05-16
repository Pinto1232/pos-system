import React from 'react';
import SettingsModalContainer from './SettingsModalContainer';
import { SettingsModalProps } from './types/settingsTypes';

/**
 * SettingsModal component
 * This is a wrapper component that renders the SettingsModalContainer
 * All the logic and UI has been moved to the container and presentation components
 * following the presentation-container pattern
 */
const SettingsModal: React.FC<SettingsModalProps> = (props) => {
  return <SettingsModalContainer {...props} />;
};

export default SettingsModal;
