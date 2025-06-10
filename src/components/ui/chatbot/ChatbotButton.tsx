'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  Fab,
  Tooltip,
  Badge,
  IconButton,
  Box,
  Fade,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import { useChatbot } from '@/contexts/ChatbotContext';
import { usePackageSelection } from '@/contexts/PackageSelectionContext';
import { useCartUI } from '@/contexts/CartUIContext';

const ChatbotButton = () => {
  const { toggleChatbot, isOpen } = useChatbot();
  const { selectedPackage } = usePackageSelection();
  const { isCartOpen } = useCartUI();
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

  
  if (isCartOpen) {
    return null;
  }

  return (
    <Fade in={isVisible} timeout={500}>
      <Box
        sx={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 9998,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: 1,
        }}
      >
        {}
        {!isOpen && (
          <Fade in={!isOpen} timeout={800}>
            <Box
              sx={{
                backgroundColor: 'white',
                borderRadius: '18px 18px 0 18px',
                padding: '10px 16px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                maxWidth: '220px',
                marginBottom: '8px',
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: '-8px',
                  right: '12px',
                  width: '15px',
                  height: '15px',
                  backgroundColor: 'white',
                  transform: 'rotate(45deg)',
                  boxShadow: '4px 4px 12px rgba(0, 0, 0, 0.1)',
                  zIndex: -1,
                },
                animation: 'pulse 2s infinite',
                '@keyframes pulse': {
                  '0%': { transform: 'scale(1)' },
                  '50%': { transform: 'scale(1.03)' },
                  '100%': { transform: 'scale(1)' },
                },
                display: showNotification ? 'block' : 'none',
              }}
            >
              <Typography variant="body2" fontWeight="500" color="text.primary">
                {selectedPackage
                  ? `Have questions about the ${selectedPackage.title} package?`
                  : 'Need help with Pisval POS? Chat with us!'}
              </Typography>
            </Box>
          </Fade>
        )}

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
            sx={{
              '& .MuiBadge-badge': {
                width: '12px',
                height: '12px',
                borderRadius: '6px',
              },
            }}
          >
            <Box
              sx={{
                position: 'relative',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                },
              }}
            >
              {}
              <IconButton
                size="small"
                onClick={handleClose}
                sx={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  backgroundColor: 'white',
                  border: '1px solid #e0e0e0',
                  zIndex: 9999,
                  padding: '4px',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                  '&:hover': {
                    backgroundColor: '#f5f5f5',
                  },
                  transition: 'all 0.2s ease',
                }}
                aria-label="close chatbot"
              >
                <CloseIcon fontSize="small" />
              </IconButton>

              {}
              <Fab
                onClick={() => {
                  console.log('Chatbot button clicked');
                  toggleChatbot();
                  setShowNotification(false);
                }}
                sx={{
                  margin: 0,
                  background: 'linear-gradient(45deg, #2563eb, #1d4ed8)',
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #1d4ed8, #1e40af)',
                    boxShadow: '0 6px 20px rgba(37, 99, 235, 0.5)',
                  },
                  transition: 'all 0.3s ease',
                  width: '60px',
                  height: '60px',
                }}
                aria-label="chat"
              >
                <SupportAgentIcon sx={{ fontSize: 28 }} />
              </Fab>
            </Box>
          </Badge>
        </Tooltip>
      </Box>
    </Fade>
  );
};

export default ChatbotButton;
