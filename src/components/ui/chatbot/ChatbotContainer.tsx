'use client';

import React from 'react';
import ChatbotButton from './ChatbotButton';
import ChatbotDialog from './ChatbotDialog';
import ChatbotProvider from '@/contexts/ChatbotContext';

const ChatbotContainer = () => {
  return (
    <ChatbotProvider>
      <ChatbotButton />
      <ChatbotDialog />
    </ChatbotProvider>
  );
};

export default ChatbotContainer;
