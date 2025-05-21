'use client';

import React, { useState, useRef, useEffect } from 'react';
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
  Slide,
  Fade,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import { useChatbot } from '@/contexts/ChatbotContext';
import { usePackageSelection } from '@/contexts/PackageSelectionContext';
import { useCurrency } from '@/contexts/CurrencyContext';
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
  const { selectedPackage } = usePackageSelection();
  const { currency, currencySymbol } = useCurrency();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: 'smooth',
      });
    }
  }, [messages]);

  useEffect(() => {
    console.log('Current currency in ChatbotDialog:', {
      currency,
      currencySymbol,
      selectedPackage: selectedPackage
        ? {
            id: selectedPackage.id,
            type: selectedPackage.type,
            multiCurrencyPrices: selectedPackage.multiCurrencyPrices,
          }
        : null,
    });
  }, [currency, currencySymbol, selectedPackage]);

  const getLocalizedPrice = (
    basePrice: number,
    multiCurrencyPrices?: string
  ): number => {
    if (!multiCurrencyPrices) {
      return basePrice;
    }

    try {
      const pricesObj = JSON.parse(multiCurrencyPrices);

      if (pricesObj && pricesObj[currency]) {
        return pricesObj[currency];
      }
    } catch (error) {
      console.error(
        'Error parsing multiCurrencyPrices:',
        JSON.stringify(error, null, 2)
      );
    }

    return basePrice;
  };

  const formatCurrencyValue = (price: number): string => {
    const locale = currency === 'ZAR' ? 'en-ZA' : 'en-US';
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
      slots={{ transition: Slide }}
      slotProps={{
        transition: {
          timeout: 400,
        },
      }}
      sx={{
        zIndex: 9999,
        '& .MuiBackdrop-root': {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)',
        },
        '& .MuiDialog-container': {
          justifyContent: 'flex-end',
          alignItems: 'flex-end',
          paddingRight: '20px',
          paddingBottom: '80px',
          '@media (max-width: 480px)': {
            paddingBottom: '16px',
            paddingRight: '0',
          },
        },
        '& .MuiPaper-root': {
          margin: 0,
          marginBottom: '10px',
          borderRadius: '20px',
          borderBottomRightRadius: '4px',
          overflow: 'hidden',
          maxWidth: '400px',
          height: '550px',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.25)',
          marginRight: 0,
          background: 'linear-gradient(to bottom, #ffffff, #f8f9fa)',
          '@media (max-width: 480px)': {
            margin: '16px',
            marginRight: 0,
            maxWidth: 'calc(100% - 32px)',
            height: 'calc(100% - 100px)',
            maxHeight: 'calc(100% - 32px)',
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          background: `linear-gradient(135deg, ${themeColor}, ${themeColor}dd)`,
          color: 'white',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        }}
      >
        <Fade in={true} timeout={800}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
            }}
          >
            <Avatar
              sx={{
                width: 36,
                height: 36,
                bgcolor: 'white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                padding: '4px',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <Image
                src="/Pisval_Logo.jpg"
                alt="Pisval Logo"
                width={28}
                height={28}
                style={{
                  objectFit: 'cover',
                }}
              />
            </Avatar>
            <Box>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  lineHeight: 1.2,
                  fontSize: '1rem',
                  letterSpacing: '0.01em',
                }}
              >
                {selectedPackage ? `Pisval Assistant` : 'Pisval Assistant'}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  opacity: 0.9,
                  display: 'block',
                  marginTop: '2px',
                  fontSize: '0.75rem',
                }}
              >
                {selectedPackage
                  ? `${selectedPackage.title} Package Specialist`
                  : 'Online • Ready to help'}
              </Typography>
            </Box>
          </Box>
        </Fade>
        <IconButton
          edge="end"
          color="inherit"
          onClick={toggleChatbot}
          aria-label="close"
          sx={{
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.15)',
            },
            transition: 'all 0.2s ease',
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          overflow: 'auto',
          backgroundColor: '#f8f9fa',
          backgroundImage:
            'radial-gradient(circle at 25px 25px, rgba(200, 200, 200, 0.1) 2%, transparent 0%), radial-gradient(circle at 75px 75px, rgba(200, 200, 200, 0.1) 2%, transparent 0%)',
          backgroundSize: '100px 100px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2.5,
            flexGrow: 1,
            overflowY: 'auto',
            msOverflowStyle: 'none',
            scrollbarWidth: 'thin',
            scrollbarColor: '#ddd transparent',
            '&::-webkit-scrollbar': {
              width: '6px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#ddd',
              borderRadius: '3px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: '#ccc',
            },
            paddingRight: '6px',
          }}
        >
          {messages.map((message, index) => {
            return (
              <Box
                key={message.id}
                sx={{
                  display: 'flex',
                  justifyContent:
                    message.sender === 'user' ? 'flex-end' : 'flex-start',
                  mb: 1,
                  position: 'relative',
                  animation: 'fadeIn 0.3s ease-in-out',
                  '@keyframes fadeIn': {
                    '0%': {
                      opacity: 0,
                      transform: 'translateY(10px)',
                    },
                    '100%': {
                      opacity: 1,
                      transform: 'translateY(0)',
                    },
                  },
                  animationDelay: `${index * 100}ms`,
                }}
              >
                {message.sender === 'bot' && (
                  <Avatar
                    sx={{
                      width: 36,
                      height: 36,
                      mr: 1.5,
                      bgcolor: 'white',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      padding: '4px',
                    }}
                    alt="Bot"
                  >
                    <SmartToyIcon sx={{ color: themeColor, fontSize: 20 }} />
                  </Avatar>
                )}

                <Paper
                  elevation={message.sender === 'user' ? 1 : 2}
                  sx={{
                    padding: '12px 18px',
                    maxWidth: '75%',
                    borderRadius:
                      message.sender === 'user'
                        ? '18px 18px 0 18px'
                        : '18px 18px 18px 0',
                    backgroundColor:
                      message.sender === 'user'
                        ? `linear-gradient(135deg, ${themeColor}, ${themeColor}dd)`
                        : 'white',
                    color: message.sender === 'user' ? 'white' : 'inherit',
                    boxShadow:
                      message.sender === 'user'
                        ? '0 2px 10px rgba(0,0,0,0.1)'
                        : '0 2px 10px rgba(0,0,0,0.05)',
                    position: 'relative',
                    '&::after':
                      message.sender === 'user'
                        ? {
                            content: '""',
                            position: 'absolute',
                            bottom: 0,
                            right: '-8px',
                            width: '15px',
                            height: '15px',
                            backgroundColor: themeColor,
                            transform: 'rotate(45deg)',
                            borderRadius: '0 0 3px 0',
                            zIndex: -1,
                          }
                        : {},
                  }}
                >
                  <Typography variant="body1">{message.text}</Typography>

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
                        <Box component="ul" sx={{ pl: 2, m: 0 }}>
                          {message.features.map((feature, index) => (
                            <Typography
                              component="li"
                              variant="body2"
                              key={index}
                              sx={{ mb: 0.5 }}
                            >
                              {feature}
                            </Typography>
                          ))}
                        </Box>
                      </Box>
                    )}

                  {message.sender === 'bot' && message.pricing && (
                    <Box
                      sx={{
                        mt: 2,
                        mb: 1,
                        p: 1,
                        bgcolor: 'rgba(0,0,0,0.03)',
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
                        const monthlyPrice =
                          selectedPackage?.multiCurrencyPrices
                            ? getLocalizedPrice(
                                message.pricing.monthly,
                                selectedPackage.multiCurrencyPrices
                              )
                            : message.pricing.monthly;

                        const annualPrice = selectedPackage?.multiCurrencyPrices
                          ? getLocalizedPrice(
                              message.pricing.annual,
                              selectedPackage.multiCurrencyPrices
                            )
                          : message.pricing.annual;

                        const savingsPercentage = Math.round(
                          (1 - annualPrice / (monthlyPrice * 12)) * 100
                        );

                        return (
                          <>
                            <Typography variant="body2">
                              Monthly: {currencySymbol}
                              {formatCurrencyValue(monthlyPrice)}
                            </Typography>
                            <Typography variant="body2">
                              Annual: {currencySymbol}
                              {formatCurrencyValue(annualPrice)}
                              <Typography
                                component="span"
                                variant="caption"
                                sx={{
                                  color: 'success.main',
                                }}
                              >
                                {' '}
                                (Save {savingsPercentage}
                                %)
                              </Typography>
                            </Typography>
                          </>
                        );
                      })()}
                    </Box>
                  )}

                  {message.sender === 'bot' &&
                    message.ctaButtons &&
                    message.ctaButtons.length > 0 && (
                      <Box
                        sx={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: 1,
                          mt: 2,
                        }}
                      >
                        {message.ctaButtons.map((button, index) => (
                          <Button
                            key={index}
                            variant="contained"
                            size="small"
                            onClick={() =>
                              handleCtaButtonClick(button.action, button.data)
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
                        ))}
                      </Box>
                    )}

                  <Typography
                    variant="caption"
                    sx={{
                      display: 'block',
                      mt: 0.5,
                      textAlign: message.sender === 'user' ? 'right' : 'left',
                      opacity: 0.7,
                    }}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Typography>
                </Paper>

                {message.sender === 'user' && (
                  <Avatar
                    sx={{
                      width: 36,
                      height: 36,
                      ml: 1.5,
                      bgcolor: 'white',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      padding: '4px',
                    }}
                    alt="User"
                  >
                    <PersonIcon sx={{ color: '#f50057', fontSize: 20 }} />
                  </Avatar>
                )}
              </Box>
            );
          })}
          <div ref={messagesEndRef} />
        </Box>
      </DialogContent>

      {}
      {messages.length > 0 &&
        (() => {
          const lastMessage = messages[messages.length - 1];
          return lastMessage?.suggestedResponses &&
            lastMessage.suggestedResponses.length > 0 ? (
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1,
                p: 2,
                borderTop: '1px solid rgba(0, 0, 0, 0.12)',
                backgroundColor: 'white',
              }}
            >
              {lastMessage.suggestedResponses.map((response, index) => (
                <Button
                  key={index}
                  variant="outlined"
                  size="small"
                  onClick={() => handleSuggestedResponse(response)}
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
              ))}
            </Box>
          ) : null;
        })()}

      {}
      <Box
        component="form"
        sx={{
          display: 'flex',
          padding: '16px 20px 20px',
          borderTop: '1px solid rgba(0, 0, 0, 0.08)',
          backgroundColor: 'white',
          boxShadow: '0 -4px 10px rgba(0, 0, 0, 0.03)',
          position: 'relative',
          zIndex: 2,
        }}
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
      >
        <TextField
          fullWidth
          placeholder="Type your message here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          variant="outlined"
          size="small"
          autoComplete="off"
          slotProps={{
            input: {
              style: {
                paddingRight: '48px',
                fontSize: '0.95rem',
                paddingTop: '12px',
                paddingBottom: '12px',
              },
            },
          }}
          sx={{
            position: 'relative',
            '& .MuiOutlinedInput-root': {
              borderRadius: '24px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              },
              '&.Mui-focused': {
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)',
              },
              '&.Mui-focused fieldset': {
                borderColor: themeColor,
                borderWidth: '1px',
              },
            },
          }}
        />
        <IconButton
          sx={{
            color: 'white',
            backgroundColor: themeColor,
            position: 'absolute',
            right: '24px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '36px',
            height: '36px',
            '&:hover': {
              backgroundColor: `${themeColor}dd`,
            },
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
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
