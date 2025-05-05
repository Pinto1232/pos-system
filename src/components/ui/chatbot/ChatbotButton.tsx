'use client';

import React, {
  useEffect,
  useState,
} from 'react';
import {
  Fab,
  Tooltip,
  Badge,
} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import { useChatbot } from '@/contexts/ChatbotContext';
import { usePackageSelection } from '@/contexts/PackageSelectionContext';

const ChatbotButton = () => {
  const { toggleChatbot, isOpen } = useChatbot();
  const { selectedPackage } =
    usePackageSelection();
  const [showNotification, setShowNotification] =
    useState(false);

  useEffect(() => {
    if (selectedPackage && !isOpen) {
      setShowNotification(true);
    } else {
      setShowNotification(false);
    }
  }, [selectedPackage, isOpen]);

  return (
    <Tooltip
      title={
        selectedPackage
          ? `Chat about the ${selectedPackage.title} package`
          : 'Chat with Pisval Assistant'
      }
      placement="left"
    >
      <Badge
        color="error"
        variant="dot"
        invisible={!showNotification}
        overlap="circular"
      >
        <Fab
          color="primary"
          onClick={() => {
            console.log('Chatbot button clicked');
            toggleChatbot();
            setShowNotification(false);
          }}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 9998,
            margin: 0,
          }}
          aria-label="chat"
        >
          <ChatIcon />
        </Fab>
      </Badge>
    </Tooltip>
  );
};

export default ChatbotButton;
