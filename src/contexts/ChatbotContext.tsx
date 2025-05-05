'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
// No Material UI imports needed here
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
  sendBotMessage: (
    message: string,
    clearPrevious?: boolean
  ) => void;
  handleSuggestedResponse: (
    response: string
  ) => void;
  handleCtaButtonClick: (
    action: string,
    data?: Record<string, unknown>
  ) => void;
  messages: ChatMessage[];
  isOpen: boolean;
  themeColor: string;
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

// Get package-specific color theme
const getPackageColor = (
  packageType: string
): string => {
  switch (packageType) {
    case 'starter':
      return '#4caf50'; // Green
    case 'growth':
      return '#2196f3'; // Blue
    case 'premium':
      return '#9c27b0'; // Purple
    case 'enterprise':
      return '#f44336'; // Red
    case 'custom':
      return '#ff9800'; // Orange
    default:
      return '#1976d2'; // Default blue
  }
};

// Get package-specific features
const getPackageFeatures = (
  packageType: string
): string[] => {
  switch (packageType) {
    case 'starter':
      return [
        'Basic inventory management',
        'Simple sales tracking',
        'Customer management',
        'Single user account',
        'Email support',
      ];
    case 'growth':
      return [
        'Advanced inventory management',
        'Detailed sales analytics',
        'Customer loyalty program',
        'Up to 5 user accounts',
        'Email and chat support',
        'Mobile app access',
      ];
    case 'premium':
      return [
        'Everything in Growth package',
        'Advanced reporting',
        'Multi-location support',
        'Integrated marketing tools',
        'Up to 15 user accounts',
        'Priority customer support',
        'API access',
      ];
    case 'enterprise':
      return [
        'Everything in Premium package',
        'Custom integrations',
        'Dedicated account manager',
        'Unlimited users',
        'Advanced security features',
        '24/7 priority support',
        'Custom branding',
        'On-site training',
      ];
    case 'custom':
      return [
        'Choose your own features',
        'Pay only for what you need',
        'Flexible scaling options',
        'Custom development available',
        'Tailored support options',
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

// Get package-specific pricing
const getPackagePricing = (
  packageType: string
): {
  monthly: number;
  annual: number;
  currency: string;
} => {
  switch (packageType) {
    case 'starter':
      return {
        monthly: 29.99,
        annual: 299.9,
        currency: 'USD',
      };
    case 'growth':
      return {
        monthly: 59.99,
        annual: 599.9,
        currency: 'USD',
      };
    case 'premium':
      return {
        monthly: 99.99,
        annual: 999.9,
        currency: 'USD',
      };
    case 'enterprise':
      return {
        monthly: 199.99,
        annual: 1999.9,
        currency: 'USD',
      };
    case 'custom':
      return {
        monthly: 0, // Custom pricing
        annual: 0, // Custom pricing
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

// Get suggested responses based on package type
const getSuggestedResponses = (
  packageType: string
): string[] => {
  switch (packageType) {
    case 'starter':
      return [
        'Tell me about pricing',
        'What features are included?',
        'How does it compare to Growth?',
      ];
    case 'growth':
      return [
        'What advanced features do I get?',
        'Is there a free trial?',
        'How does it compare to Premium?',
      ];
    case 'premium':
      return [
        'What makes this your best value?',
        'Do you offer support?',
        'Can I customize any features?',
      ];
    case 'enterprise':
      return [
        'Do you offer dedicated support?',
        'Can I get a custom quote?',
        'What security features are included?',
      ];
    case 'custom':
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
  const [messages, setMessages] = useState<
    ChatMessage[]
  >([
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

  const { selectedPackage } =
    usePackageSelection();

  // Track previous package to avoid duplicate messages
  const [
    previousPackageId,
    setPreviousPackageId,
  ] = useState<number | null>(null);

  // Theme color based on selected package
  const [themeColor, setThemeColor] =
    useState<string>('#1976d2');

  // Load chat history from localStorage
  useEffect(() => {
    if (selectedPackage) {
      const savedHistory = localStorage.getItem(
        `chat_history_${selectedPackage.id}`
      );
      if (savedHistory) {
        try {
          // Parse saved history but only use it if we're not already in a conversation about this package
          const parsedHistory =
            JSON.parse(savedHistory);
          if (
            previousPackageId !==
              selectedPackage.id &&
            parsedHistory.length > 0
          ) {
            // We'll handle this in the package selection effect instead
            // setMessages(parsedHistory);
          }
        } catch (e) {
          console.error(
            'Error parsing chat history:',
            e
          );
        }
      }
    }
  }, [selectedPackage, previousPackageId]);

  // Listen for package selection changes
  useEffect(() => {
    if (
      selectedPackage &&
      selectedPackage.id !== previousPackageId
    ) {
      // Update theme color based on package type
      const newThemeColor = getPackageColor(
        selectedPackage.type
      );
      setThemeColor(newThemeColor);

      // Reset messages when a new package is selected
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

      // Clear previous messages and set welcome message
      setMessages([welcomeMessage]);

      // Get package-specific features
      const packageFeatures = getPackageFeatures(
        selectedPackage.type
      );

      // Get package-specific pricing
      const packagePricing = getPackagePricing(
        selectedPackage.type
      );

      // Get suggested responses for this package
      const suggestedResponses =
        getSuggestedResponses(
          selectedPackage.type
        );

      // Send a message about the selected package after a short delay
      setTimeout(() => {
        const packageMessage =
          getPackageDescription(
            selectedPackage.type
          );
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

        setMessages((prev) => [
          ...prev,
          botMessage,
        ]);

        // Save to localStorage
        localStorage.setItem(
          `chat_history_${selectedPackage.id}`,
          JSON.stringify([
            welcomeMessage,
            botMessage,
          ])
        );
      }, 500);

      // Update previous package ID
      setPreviousPackageId(selectedPackage.id);

      // Open the chatbot if it's not already open
      if (!isOpen) {
        setIsOpen(true);
      }
    }
  }, [
    selectedPackage,
    isOpen,
    previousPackageId,
  ]);

  const toggleChatbot = () => {
    console.log(
      'Toggling chatbot, current state:',
      isOpen
    );

    // If we're closing the chatbot and there's a selected package,
    // we'll keep the messages for now. Otherwise, we'll reset them
    // when the chatbot is reopened.
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);

    // If we're closing the chatbot, don't reset messages
    // They'll be reset when a new package is selected
  };

  const sendBotMessage = (
    message: string,
    clearPrevious = false
  ) => {
    const botMessage: ChatMessage = {
      id: Date.now().toString(),
      text: message,
      sender: 'bot',
      timestamp: new Date(),
    };

    if (clearPrevious) {
      setMessages([botMessage]);
    } else {
      setMessages((prev) => [
        ...prev,
        botMessage,
      ]);
    }
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
      const responseText =
        getBotResponse(message);
      const packageType =
        selectedPackage?.type || 'default';

      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'bot',
        timestamp: new Date(),
        suggestedResponses:
          getSuggestedResponses(packageType),
      };

      setMessages((prev) => [
        ...prev,
        botMessage,
      ]);

      // Save to localStorage if we have a selected package
      if (selectedPackage) {
        // Create a copy of the current messages to avoid stale closure issues
        const currentMessages = [
          ...messages,
          userMessage,
          botMessage,
        ];
        localStorage.setItem(
          `chat_history_${selectedPackage.id}`,
          JSON.stringify(currentMessages)
        );
      }
    }, 1000);
  };

  // Handle suggested response clicks
  const handleSuggestedResponse = (
    response: string
  ) => {
    // Just send the suggested response as a user message
    sendMessage(response);
  };

  // Handle CTA button clicks
  const handleCtaButtonClick = (
    action: string,
    data?: Record<string, unknown>
  ) => {
    console.log(
      `CTA button clicked: ${action}`,
      data
    );

    switch (action) {
      case 'startTrial':
        // Add a user message indicating they want to start a trial
        sendMessage(
          "I'd like to start a free trial"
        );
        break;

      case 'viewPricing':
        // Add a user message asking about pricing
        sendMessage(
          'Can you tell me more about pricing?'
        );
        break;

      case 'upgradePackage': {
        // Logic to upgrade package would go here
        const packageName =
          data && 'packageName' in data
            ? String(data.packageName)
            : 'a higher tier';
        sendMessage(
          `I'm interested in upgrading to ${packageName}`
        );
        break;
      }

      default:
        // For any other actions
        sendMessage(
          `I'm interested in the ${action} option`
        );
    }
  };

  // Get package-specific descriptions
  const getPackageDescription = (
    packageType: string
  ): string => {
    switch (packageType) {
      case 'starter':
        return "I see you're looking at our Starter Package! This is perfect for small businesses just getting started. It includes essential POS features like basic inventory management, simple sales tracking, and customer management. Would you like to know more about specific features or pricing details?";

      case 'growth':
        return "Great choice with the Growth Package! This mid-tier option is designed for expanding businesses. You'll get advanced inventory management, detailed sales analytics, multi-user support, and customer loyalty programs. Is there a specific aspect of this package you'd like me to explain further?";

      case 'premium':
        return "You've selected our Premium Package! This comprehensive solution includes everything in the Growth package plus advanced reporting, multi-location support, integrated marketing tools, and priority customer support. Would you like me to highlight any specific premium features?";

      case 'enterprise':
        return 'Excellent choice with our Enterprise Package! This top-tier solution is tailored for large businesses with complex needs. It includes custom integrations, dedicated account management, unlimited users, advanced security features, and 24/7 priority support. What specific enterprise needs are you looking to address?';

      case 'custom':
        return "I see you're exploring our Custom Package option! This allows you to build a solution tailored exactly to your business needs. You can select specific features, add-ons, and usage-based pricing that makes sense for your operation. Would you like suggestions on which features might be most valuable for your business?";

      default:
        return `I notice you're looking at our ${packageType} package. This is a great choice for your business needs. Would you like to know more about the specific features included?`;
    }
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
    } else if (
      lowerMessage.includes('starter') ||
      lowerMessage.includes('basic')
    ) {
      return getPackageDescription('starter');
    } else if (
      lowerMessage.includes('growth') ||
      lowerMessage.includes('medium')
    ) {
      return getPackageDescription('growth');
    } else if (
      lowerMessage.includes('premium') ||
      lowerMessage.includes('advanced')
    ) {
      return getPackageDescription('premium');
    } else if (
      lowerMessage.includes('enterprise') ||
      lowerMessage.includes('large')
    ) {
      return getPackageDescription('enterprise');
    } else if (
      lowerMessage.includes('custom') ||
      lowerMessage.includes('tailored')
    ) {
      return getPackageDescription('custom');
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
