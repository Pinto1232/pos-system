'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { usePackageSelection } from './PackageSelectionContext';

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  features?: string[];
  pricing?: {
    monthly: number;
    annual: number;
    currency: string;
  };
  suggestedResponses?: string[];
  ctaButtons?: {
    text: string;
    action: string;
    data?: Record<string, unknown>;
  }[];
}

interface ChatbotContextProps {
  toggleChatbot: () => void;
  sendMessage: (message: string) => void;
  sendBotMessage: (message: string, clearPrevious?: boolean) => void;
  handleSuggestedResponse: (response: string) => void;
  handleCtaButtonClick: (
    action: string,
    data?: Record<string, unknown>
  ) => void;
  messages: ChatMessage[];
  isOpen: boolean;
  themeColor: string;
}

const ChatbotContext = createContext<ChatbotContextProps | undefined>(
  undefined
);

export const useChatbot = () => {
  const context = useContext(ChatbotContext);
  if (context === undefined) {
    throw new Error('useChatbot must be used within a ChatbotProvider');
  }
  return context;
};

const getPackageColor = (packageType: string): string => {
  switch (packageType) {
    case 'starter':
      return '#4caf50';
    case 'growth':
      return '#2196f3';
    case 'premium':
      return '#da4792';
    case 'enterprise':
      return '#9772e5';
    case 'custom':
      return '#ff9800';
    default:
      return '#1976d2';
  }
};

const getPackageFeatures = (packageType: string): string[] => {
  switch (packageType) {
    case 'starter-plus':
      return [
        'Basic POS functionality',
        'Inventory management',
        'Single store support',
        'Email support',
        'Basic reporting',
        'Customer database',
        'Simple analytics',
      ];
    case 'growth-pro':
      return [
        'Everything in Starter Plus',
        'Advanced inventory forecasting',
        'Enhanced customer loyalty program',
        'Marketing automation tools',
        'Staff performance tracking',
        'Customizable dashboards',
        'Mobile app access',
      ];
    case 'premium-plus':
      return [
        'All-inclusive POS package',
        'Advanced AI-powered analytics',
        'Predictive inventory management',
        'Omnichannel integration',
        'VIP support',
        'Quarterly business reviews',
        'Custom reporting',
      ];
    case 'enterprise-elite':
      return [
        'Comprehensive POS solutions',
        'Multi-location management',
        'Enterprise-level analytics',
        'Custom API integrations',
        'White-label options',
        'Dedicated account manager',
        'Priority 24/7 support',
      ];
    case 'custom-pro':
      return [
        'Tailor-made solutions',
        'Build your own feature set',
        'Pay only for what you need',
        'Flexible scaling options',
        'Industry-specific solutions',
        'Personalized onboarding',
        'Professional customization services',
      ];
    default:
      return [
        'Inventory management',
        'Sales tracking',
        'Customer management',
        'Reporting tools',
      ];
  }
};

const getPackagePricing = (
  packageType: string
): {
  monthly: number;
  annual: number;
  currency: string;
} => {
  switch (packageType) {
    case 'starter-plus':
      return {
        monthly: 39.99,
        annual: 399.9,
        currency: 'USD',
      };
    case 'growth-pro':
      return {
        monthly: 79.99,
        annual: 799.9,
        currency: 'USD',
      };
    case 'premium-plus':
      return {
        monthly: 349.99,
        annual: 3499.9,
        currency: 'USD',
      };
    case 'enterprise-elite':
      return {
        monthly: 249.99,
        annual: 2499.9,
        currency: 'USD',
      };
    case 'custom-pro':
      return {
        monthly: 129.99,
        annual: 1299.9,
        currency: 'USD',
      };
    default:
      return {
        monthly: 49.99,
        annual: 499.9,
        currency: 'USD',
      };
  }
};

const getSuggestedResponses = (packageType: string): string[] => {
  switch (packageType) {
    case 'starter-plus':
      return [
        'Tell me about pricing',
        'What features are included?',
        'How does it compare to Growth Pro?',
      ];
    case 'growth-pro':
      return [
        'What advanced features do I get?',
        'Is there a free trial?',
        'How does it compare to Premium Plus?',
      ];
    case 'premium-plus':
      return [
        'What makes this your best value?',
        'Do you offer VIP support?',
        'What AI features are included?',
      ];
    case 'enterprise-elite':
      return [
        'Do you offer dedicated support?',
        'Can I get a custom quote?',
        'What security features are included?',
      ];
    case 'custom-pro':
      return [
        'How do I select features?',
        'What is the pricing structure?',
        'Can I talk to a sales representative?',
      ];
    default:
      return [
        'Tell me more about this package',
        'What features are included?',
        'How much does it cost?',
      ];
  }
};

export const ChatbotProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const [firstVisit, setFirstVisit] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('chatbot_hasVisited') !== 'true';
    }
    return true;
  });

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Hello! How can I help you with Pisval Tech POS today?',
      sender: 'bot',
      timestamp: new Date(),
      suggestedResponses: [
        'Tell me about your packages',
        'How does pricing work?',
        'What features do you offer?',
      ],
    },
  ]);

  const { selectedPackage } = usePackageSelection();

  const [previousPackageId, setPreviousPackageId] = useState<number | null>(
    null
  );

  const [themeColor, setThemeColor] = useState<string>('#1976d2');

  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    if (firstVisit && typeof window !== 'undefined') {
      localStorage.setItem('chatbot_hasVisited', 'true');
      setFirstVisit(false);
    }
  }, [firstVisit]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoad(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (selectedPackage) {
      const savedHistory = localStorage.getItem(
        `chat_history_${selectedPackage.id}`
      );
      if (savedHistory) {
        try {
          const parsedHistory = JSON.parse(savedHistory);
          if (
            previousPackageId !== selectedPackage.id &&
            parsedHistory.length > 0
          ) {
          }
        } catch (e) {
          console.error(
            'Error parsing chat history:',
            JSON.stringify(e, null, 2)
          );
        }
      }
    }
  }, [selectedPackage, previousPackageId]);

  useEffect(() => {
    if (selectedPackage && selectedPackage.id !== previousPackageId) {
      const newThemeColor = getPackageColor(selectedPackage.type);
      setThemeColor(newThemeColor);

      const welcomeMessage: ChatMessage = {
        id: Date.now().toString(),
        text: 'Hello! How can I help you with Pisval Tech POS today?',
        sender: 'bot',
        timestamp: new Date(),
        suggestedResponses: [
          'Tell me about your packages',
          'How does pricing work?',
          'What features do you offer?',
        ],
      };

      setMessages([welcomeMessage]);
      const packageFeatures = getPackageFeatures(selectedPackage.type);

      const packagePricing = getPackagePricing(selectedPackage.type);

      const suggestedResponses = getSuggestedResponses(selectedPackage.type);

      setTimeout(() => {
        const packageMessage = getPackageDescription(selectedPackage.type);
        const botMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          text: packageMessage,
          sender: 'bot',
          timestamp: new Date(),
          features: packageFeatures,
          pricing: packagePricing,
          suggestedResponses: suggestedResponses,
          ctaButtons: [
            {
              text: 'Start Free Trial',
              action: 'startTrial',
              data: {
                packageId: selectedPackage.id,
              },
            },
            {
              text: 'View Pricing Details',
              action: 'viewPricing',
              data: {
                packageId: selectedPackage.id,
              },
            },
          ],
        };

        setMessages((prev) => [...prev, botMessage]);

        localStorage.setItem(
          `chat_history_${selectedPackage.id}`,
          JSON.stringify([welcomeMessage, botMessage])
        );
      }, 500);

      setPreviousPackageId(selectedPackage.id);

      if (!isOpen && !isInitialLoad) {
        setIsOpen(true);
      }
    }
  }, [selectedPackage, isOpen, previousPackageId, isInitialLoad]);

  const toggleChatbot = () => {
    console.log(
      'Toggling chatbot, current state:',
      JSON.stringify(isOpen, null, 2)
    );
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);

    if (typeof window !== 'undefined') {
      localStorage.setItem('chatbot_isOpen', newIsOpen.toString());
    }
  };

  const sendBotMessage = (message: string, clearPrevious = false) => {
    const botMessage: ChatMessage = {
      id: Date.now().toString(),
      text: message,
      sender: 'bot',
      timestamp: new Date(),
    };

    if (clearPrevious) {
      setMessages([botMessage]);
    } else {
      setMessages((prev) => [...prev, botMessage]);
    }
  };

  const sendMessage = (message: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: message,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    setTimeout(() => {
      const responseText = getBotResponse(message);
      const packageType = selectedPackage?.type || 'default';

      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'bot',
        timestamp: new Date(),
        suggestedResponses: getSuggestedResponses(packageType),
      };

      setMessages((prev) => [...prev, botMessage]);

      if (selectedPackage) {
        const currentMessages = [...messages, userMessage, botMessage];
        localStorage.setItem(
          `chat_history_${selectedPackage.id}`,
          JSON.stringify(currentMessages)
        );
      }
    }, 1000);
  };

  const handleSuggestedResponse = (response: string) => {
    sendMessage(response);
  };

  const handleCtaButtonClick = (
    action: string,
    data?: Record<string, unknown>
  ) => {
    console.log(`CTA button clicked: ${action}`, JSON.stringify(data, null, 2));

    switch (action) {
      case 'startTrial':
        sendMessage("I'd like to start a free trial");
        break;

      case 'viewPricing':
        sendMessage('Can you tell me more about pricing?');
        break;

      case 'upgradePackage': {
        const packageName =
          data && 'packageName' in data
            ? String(data.packageName)
            : 'a higher tier';
        sendMessage(`I'm interested in upgrading to ${packageName}`);
        break;
      }

      default:
        sendMessage(`I'm interested in the ${action} option`);
    }
  };

  const getPackageDescription = (packageType: string): string => {
    switch (packageType) {
      case 'starter-plus':
        return "I see you're looking at our Starter Plus Package! This is perfect for small businesses looking for essential features. It includes basic POS functionality, inventory management, single store support, email support, basic reporting, customer database, and simple analytics. Would you like to know more about specific features or pricing details?";

      case 'growth-pro':
        return "Great choice with the Growth Pro Package! This advanced option is designed for expanding businesses. You'll get everything in Starter Plus plus advanced inventory forecasting, enhanced customer loyalty programs, marketing automation tools, staff performance tracking, customizable dashboards, and mobile app access. Is there a specific aspect of this package you'd like me to explain further?";

      case 'premium-plus':
        return "You've selected our Premium Plus Package! This all-inclusive solution features advanced AI-powered analytics, predictive inventory management, omnichannel integration, VIP support, quarterly business reviews, and custom reporting. Would you like me to highlight any specific premium features?";

      case 'enterprise-elite':
        return 'Excellent choice with our Enterprise Elite Package! This comprehensive solution is tailored for large organizations with complex requirements. It includes multi-location management, enterprise-level analytics, custom API integrations, white-label options, dedicated account manager, and priority 24/7 support. What specific enterprise needs are you looking to address?';

      case 'custom-pro':
        return "I see you're exploring our Custom Pro Package option! This allows you to build a solution tailored exactly to your business needs with professional customization services. You can select specific features, add-ons, and create industry-specific solutions with personalized onboarding. Would you like suggestions on which features might be most valuable for your business?";

      default:
        return `I notice you're looking at our ${packageType} package. This is a great choice for your business needs. Would you like to know more about the specific features included?`;
    }
  };

  const getBotResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
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
    } else if (
      lowerMessage.includes('starter') ||
      lowerMessage.includes('basic')
    ) {
      return getPackageDescription('starter-plus');
    } else if (
      lowerMessage.includes('growth') ||
      lowerMessage.includes('medium')
    ) {
      return getPackageDescription('growth-pro');
    } else if (
      lowerMessage.includes('premium') ||
      lowerMessage.includes('advanced')
    ) {
      return getPackageDescription('premium-plus');
    } else if (
      lowerMessage.includes('enterprise') ||
      lowerMessage.includes('large')
    ) {
      return getPackageDescription('enterprise-elite');
    } else if (
      lowerMessage.includes('custom') ||
      lowerMessage.includes('tailored')
    ) {
      return getPackageDescription('custom-pro');
    } else {
      return "I'm not sure I understand. Could you please rephrase your question about our POS system?";
    }
  };

  return (
    <ChatbotContext.Provider
      value={{
        toggleChatbot,
        sendMessage,
        sendBotMessage,
        handleSuggestedResponse,
        handleCtaButtonClick,
        messages,
        isOpen,
        themeColor,
      }}
    >
      {children}
    </ChatbotContext.Provider>
  );
};

export default ChatbotProvider;
