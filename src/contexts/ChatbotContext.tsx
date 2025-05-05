'use client';

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from 'react';
import {
  Dialog,
  DialogContent,
} from '@mui/material';

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatbotContextProps {
  toggleChatbot: () => void;
  sendMessage: (message: string) => void;
  messages: ChatMessage[];
  isOpen: boolean;
}

const ChatbotContext = createContext<
  ChatbotContextProps | undefined
>(undefined);

export const useChatbot = () => {
  const context = useContext(ChatbotContext);
  if (context === undefined) {
    throw new Error(
      'useChatbot must be used within a ChatbotProvider'
    );
  }
  return context;
};

export const ChatbotProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<
    ChatMessage[]
  >([
    {
      id: '1',
      text: 'Hello! How can I help you with Pisval Tech POS today?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);

  const toggleChatbot = () => {
    console.log(
      'Toggling chatbot, current state:',
      isOpen
    );
    setIsOpen((prev) => !prev);
  };

  const sendMessage = (message: string) => {
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: message,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    // Simulate bot response after a short delay
    setTimeout(() => {
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(message),
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [
        ...prev,
        botMessage,
      ]);
    }, 1000);
  };

  // Simple bot response logic - can be expanded later
  const getBotResponse = (
    message: string
  ): string => {
    const lowerMessage = message.toLowerCase();

    if (
      lowerMessage.includes('hello') ||
      lowerMessage.includes('hi')
    ) {
      return 'Hello! How can I assist you with Pisval Tech POS today?';
    } else if (
      lowerMessage.includes('pricing') ||
      lowerMessage.includes('cost') ||
      lowerMessage.includes('price')
    ) {
      return 'We offer various pricing packages for our POS system. Would you like to see our pricing plans?';
    } else if (
      lowerMessage.includes('feature') ||
      lowerMessage.includes('what can')
    ) {
      return 'Pisval Tech POS offers inventory management, sales tracking, customer management, and reporting features. What specific feature would you like to know more about?';
    } else if (
      lowerMessage.includes('support') ||
      lowerMessage.includes('help')
    ) {
      return 'Our support team is available 24/7. You can reach us at support@pisvaltech.com or call us at 1-800-PISVAL.';
    } else {
      return "I'm not sure I understand. Could you please rephrase your question about our POS system?";
    }
  };

  return (
    <ChatbotContext.Provider
      value={{
        toggleChatbot,
        sendMessage,
        messages,
        isOpen,
      }}
    >
      {children}
    </ChatbotContext.Provider>
  );
};

export default ChatbotProvider;
