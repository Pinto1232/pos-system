'use client';

import React from 'react';
import { Fab, Tooltip } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import { useChatbot } from '@/contexts/ChatbotContext';

const ChatbotButton = () => {
  const { toggleChatbot } = useChatbot();

  return (
    <Tooltip
      title="Chat with Pisval Assistant"
      placement="left"
    >
      <Fab
        color="primary"
        onClick={() => {
          console.log('Chatbot button clicked');
          toggleChatbot();
        }}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 9999,
        }}
        aria-label="chat"
      >
        <ChatIcon />
      </Fab>
    </Tooltip>
  );
};

export default ChatbotButton;
