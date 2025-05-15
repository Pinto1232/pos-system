'use client';

import React, {
  useState,
  useRef,
  useEffect,
} from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  IconButton,
  Box,
  Typography,
  Paper,
  Avatar,
  Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import { useChatbot } from '@/contexts/ChatbotContext';
import { usePackageSelection } from '@/contexts/PackageSelectionContext';
import {
  useCurrency,
  currencySymbols,
} from '@/contexts/CurrencyContext';
import Image from 'next/image';

const ChatbotDialog = () => {
  const {
    isOpen,
    toggleChatbot,
    messages,
    sendMessage,
    handleSuggestedResponse,
    handleCtaButtonClick,
    themeColor,
  } = useChatbot();
  const { selectedPackage } =
    usePackageSelection();
  const {
    currency,
    formatPrice,
    currencySymbol,
  } = useCurrency();
  const [input, setInput] = useState('');
  const messagesEndRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: 'smooth',
      });
    }
  }, [messages]);

  // Log currency information when it changes
  useEffect(() => {
    console.log(
      'Current currency in ChatbotDialog:',
      {
        currency,
        currencySymbol,
        selectedPackage: selectedPackage
          ? {
              id: selectedPackage.id,
              type: selectedPackage.type,
              multiCurrencyPrices:
                selectedPackage.multiCurrencyPrices,
            }
          : null,
      }
    );
  }, [currency, currencySymbol, selectedPackage]);

  // Helper function to get localized price from multiCurrencyPrices
  const getLocalizedPrice = (
    basePrice: number,
    multiCurrencyPrices?: string
  ): number => {
    if (!multiCurrencyPrices) {
      return basePrice;
    }

    try {
      const pricesObj = JSON.parse(
        multiCurrencyPrices
      );
      // If we have a price for the current currency, use it
      if (pricesObj && pricesObj[currency]) {
        return pricesObj[currency];
      }
    } catch (error) {
      console.error(
        'Error parsing multiCurrencyPrices:',
        error
      );
    }

    // Fallback to base price if no matching currency found
    return basePrice;
  };

  // Format price according to the current currency's format
  const formatCurrencyValue = (
    price: number
  ): string => {
    const locale =
      currency === 'ZAR' ? 'en-ZA' : 'en-US';
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const handleSend = () => {
    if (input.trim()) {
      sendMessage(input);
      setInput('');
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={toggleChatbot}
      maxWidth="sm"
      fullWidth={false}
      PaperProps={{
        sx: {
          borderRadius: '16px',
          borderBottomRightRadius: '0',
          overflow: 'hidden',
          maxWidth: '380px',
          height: '500px',
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow:
            '0 8px 32px rgba(0, 0, 0, 0.2)',
          marginRight: 0,
          '@media (max-width: 480px)': {
            margin: '16px',
            marginRight: 0,
            maxWidth: 'calc(100% - 32px)',
          },
        },
      }}
      sx={{
        zIndex: 9999,
        '& .MuiBackdrop-root': {
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
        },
        '& .MuiDialog-container': {
          justifyContent: 'flex-end',
          alignItems: 'flex-end',
          paddingRight: '20px',
          paddingBottom: '80px',
        },
        '& .MuiPaper-root': {
          margin: 0,
          marginBottom: '10px',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px',
          backgroundColor: themeColor,
          color: 'white',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Image
            src="/Pisval_Logo.jpg"
            alt="Pisval Logo"
            width={24}
            height={24}
            style={{
              borderRadius: '50%',
              objectFit: 'cover',
            }}
          />
          <Typography
            variant="h6"
            sx={{ transition: 'all 0.3s ease' }}
          >
            {selectedPackage
              ? `Pisval Assistant - ${selectedPackage.title}`
              : 'Pisval Assistant'}
          </Typography>
        </Box>
        <IconButton
          edge="end"
          color="inherit"
          onClick={toggleChatbot}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          overflow: 'auto',
          backgroundColor: '#f5f5f5',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            flexGrow: 1,
            overflowY: 'auto',
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': {
              display: 'none',
            },
          }}
        >
          {messages.map((message) => (
            <Box
              key={message.id}
              sx={{
                display: 'flex',
                justifyContent:
                  message.sender === 'user'
                    ? 'flex-end'
                    : 'flex-start',
                mb: 1,
              }}
            >
              {message.sender === 'bot' && (
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    mr: 1,
                    bgcolor: themeColor,
                  }}
                  alt="Bot"
                >
                  <Image
                    src="/Pisval_Logo.jpg"
                    alt="Pisval Logo"
                    width={32}
                    height={32}
                    style={{
                      objectFit: 'cover',
                    }}
                  />
                </Avatar>
              )}

              <Paper
                elevation={1}
                sx={{
                  padding: '10px 16px',
                  maxWidth: '70%',
                  borderRadius:
                    message.sender === 'user'
                      ? '18px 18px 0 18px'
                      : '18px 18px 18px 0',
                  backgroundColor:
                    message.sender === 'user'
                      ? themeColor
                      : 'white',
                  color:
                    message.sender === 'user'
                      ? 'white'
                      : 'inherit',
                }}
              >
                <Typography variant="body1">
                  {message.text}
                </Typography>

                {/* Display features if available */}
                {message.sender === 'bot' &&
                  message.features &&
                  message.features.length > 0 && (
                    <Box sx={{ mt: 2, mb: 1 }}>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: 'bold',
                          mb: 0.5,
                        }}
                      >
                        Key Features:
                      </Typography>
                      <Box
                        component="ul"
                        sx={{ pl: 2, m: 0 }}
                      >
                        {message.features.map(
                          (feature, index) => (
                            <Typography
                              component="li"
                              variant="body2"
                              key={index}
                              sx={{ mb: 0.5 }}
                            >
                              {feature}
                            </Typography>
                          )
                        )}
                      </Box>
                    </Box>
                  )}

                {/* Display pricing if available */}
                {message.sender === 'bot' &&
                  message.pricing && (
                    <Box
                      sx={{
                        mt: 2,
                        mb: 1,
                        p: 1,
                        bgcolor:
                          'rgba(0,0,0,0.03)',
                        borderRadius: 1,
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: 'bold',
                          mb: 0.5,
                        }}
                      >
                        Pricing:
                      </Typography>
                      {(() => {
                        // Get localized prices if the selected package has multiCurrencyPrices
                        const monthlyPrice =
                          selectedPackage?.multiCurrencyPrices
                            ? getLocalizedPrice(
                                message.pricing
                                  .monthly,
                                selectedPackage.multiCurrencyPrices
                              )
                            : message.pricing
                                .monthly;

                        const annualPrice =
                          selectedPackage?.multiCurrencyPrices
                            ? getLocalizedPrice(
                                message.pricing
                                  .annual,
                                selectedPackage.multiCurrencyPrices
                              )
                            : message.pricing
                                .annual;

                        // Calculate savings percentage
                        const savingsPercentage =
                          Math.round(
                            (1 -
                              annualPrice /
                                (monthlyPrice *
                                  12)) *
                              100
                          );

                        return (
                          <>
                            <Typography variant="body2">
                              Monthly:{' '}
                              {currencySymbol}
                              {formatCurrencyValue(
                                monthlyPrice
                              )}
                            </Typography>
                            <Typography variant="body2">
                              Annual:{' '}
                              {currencySymbol}
                              {formatCurrencyValue(
                                annualPrice
                              )}
                              <Typography
                                component="span"
                                variant="caption"
                                sx={{
                                  color:
                                    'success.main',
                                }}
                              >
                                {' '}
                                (Save{' '}
                                {
                                  savingsPercentage
                                }
                                %)
                              </Typography>
                            </Typography>
                          </>
                        );
                      })()}
                    </Box>
                  )}

                {/* Display CTA buttons if available */}
                {message.sender === 'bot' &&
                  message.ctaButtons &&
                  message.ctaButtons.length >
                    0 && (
                    <Box
                      sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 1,
                        mt: 2,
                      }}
                    >
                      {message.ctaButtons.map(
                        (button, index) => (
                          <Button
                            key={index}
                            variant="contained"
                            size="small"
                            onClick={() =>
                              handleCtaButtonClick(
                                button.action,
                                button.data
                              )
                            }
                            sx={{
                              bgcolor: themeColor,
                              '&:hover': {
                                bgcolor: `${themeColor}dd`,
                              },
                            }}
                          >
                            {button.text}
                          </Button>
                        )
                      )}
                    </Box>
                  )}

                <Typography
                  variant="caption"
                  sx={{
                    display: 'block',
                    mt: 0.5,
                    textAlign:
                      message.sender === 'user'
                        ? 'right'
                        : 'left',
                    opacity: 0.7,
                  }}
                >
                  {message.timestamp.toLocaleTimeString(
                    [],
                    {
                      hour: '2-digit',
                      minute: '2-digit',
                    }
                  )}
                </Typography>
              </Paper>

              {message.sender === 'user' && (
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    ml: 1,
                    bgcolor: '#f50057',
                  }}
                  alt="User"
                >
                  U
                </Avatar>
              )}
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Box>
      </DialogContent>

      {/* Suggested responses */}
      {messages.length > 0 &&
        (() => {
          const lastMessage =
            messages[messages.length - 1];
          return lastMessage?.suggestedResponses &&
            lastMessage.suggestedResponses
              .length > 0 ? (
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1,
                p: 2,
                borderTop:
                  '1px solid rgba(0, 0, 0, 0.12)',
                backgroundColor: 'white',
              }}
            >
              {lastMessage.suggestedResponses.map(
                (response, index) => (
                  <Button
                    key={index}
                    variant="outlined"
                    size="small"
                    onClick={() =>
                      handleSuggestedResponse(
                        response
                      )
                    }
                    sx={{
                      borderColor: themeColor,
                      color: themeColor,
                      '&:hover': {
                        borderColor: themeColor,
                        backgroundColor: `${themeColor}10`,
                      },
                    }}
                  >
                    {response}
                  </Button>
                )
              )}
            </Box>
          ) : null;
        })()}

      {/* Message input */}
      <Box
        component="form"
        sx={{
          display: 'flex',
          padding: '16px',
          borderTop:
            '1px solid rgba(0, 0, 0, 0.12)',
          backgroundColor: 'white',
        }}
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
      >
        <TextField
          fullWidth
          placeholder="Type a message..."
          value={input}
          onChange={(e) =>
            setInput(e.target.value)
          }
          onKeyDown={(e) => {
            if (
              e.key === 'Enter' &&
              !e.shiftKey
            ) {
              e.preventDefault();
              handleSend();
            }
          }}
          variant="outlined"
          size="small"
          autoComplete="off"
          inputProps={{
            style: { paddingRight: '48px' },
          }}
          sx={{
            position: 'relative',
            '& .MuiOutlinedInput-root': {
              borderRadius: '24px',
              '&.Mui-focused fieldset': {
                borderColor: themeColor,
              },
            },
          }}
        />
        <IconButton
          sx={{
            color: themeColor,
            position: 'absolute',
            right: '24px',
            top: '50%',
            transform: 'translateY(-50%)',
          }}
          onClick={handleSend}
          disabled={!input.trim()}
        >
          <SendIcon />
        </IconButton>
      </Box>
    </Dialog>
  );
};

export default ChatbotDialog;
