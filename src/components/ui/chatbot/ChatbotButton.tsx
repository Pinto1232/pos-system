'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Fab, Tooltip, Badge, IconButton, Box, Fade } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import { useChatbot } from '@/contexts/ChatbotContext';
import { usePackageSelection } from '@/contexts/PackageSelectionContext';

const ChatbotButton = () => {
  const { toggleChatbot, isOpen } = useChatbot();
  const { selectedPackage } = usePackageSelection();
  const [showNotification, setShowNotification] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const showTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const AUTO_SHOW_DELAY = 10000;

  const hideButton = useCallback(() => {
    setIsVisible(false);

    if (showTimeoutRef.current) {
      clearTimeout(showTimeoutRef.current);
      showTimeoutRef.current = null;
    }

    showTimeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, AUTO_SHOW_DELAY);
  }, [AUTO_SHOW_DELAY]);

  const handleClose = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      hideButton();
    },
    [hideButton]
  );

  useEffect(() => {
    if (selectedPackage) {
      setIsVisible(true);

      if (showTimeoutRef.current) {
        clearTimeout(showTimeoutRef.current);
        showTimeoutRef.current = null;
      }
    }
  }, [selectedPackage]);

  useEffect(() => {
    if (selectedPackage && !isOpen) {
      setShowNotification(true);
    } else {
      setShowNotification(false);
    }
  }, [selectedPackage, isOpen]);

  return (
    <Fade in={isVisible} timeout={300}>
      <Box
        sx={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 9998,
        }}
      >
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
            <Box sx={{ position: 'relative' }}>
              {}
              <IconButton
                size="small"
                onClick={handleClose}
                sx={{
                  position: 'absolute',
                  top: '-10px',
                  right: '-10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid #e0e0e0',
                  zIndex: 9999,
                  padding: '4px',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 1)',
                  },
                }}
                aria-label="close chatbot"
              >
                <CloseIcon fontSize="small" />
              </IconButton>

              {}
              <Fab
                color="primary"
                onClick={() => {
                  console.log('Chatbot button clicked');
                  toggleChatbot();
                  setShowNotification(false);
                }}
                style={{
                  margin: 0,
                }}
                aria-label="chat"
              >
                <ChatIcon />
              </Fab>
            </Box>
          </Badge>
        </Tooltip>
      </Box>
    </Fade>
  );
};

export default ChatbotButton;
