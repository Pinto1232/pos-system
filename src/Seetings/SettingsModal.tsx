import React from 'react';
import SettingsModalContainer from './SettingsModalContainer';
import { SettingsModalProps } from '../types/settingsTypes';

const SettingsModal: React.FC<SettingsModalProps> = (props) => {
  return <SettingsModalContainer {...props} />;
};

export default SettingsModal;
