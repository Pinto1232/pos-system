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
  InputAdornment,
  Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import { useChatbot } from '@/contexts/ChatbotContext';
import { usePackageSelection } from '@/contexts/PackageSelectionContext';
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
  const [input, setInput] = useState('');
  const messagesEndRef =
    useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages when new messages are added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const handleSend = () => {
    if (input.trim()) {
      sendMessage(input);
      setInput('');
    }
  };

  const handleKeyPress = (
    e: React.KeyboardEvent
  ) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
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
          paddingBottom: '80px', // Space for the button
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
                      <Typography variant="body2">
                        Monthly:{' '}
                        {message.pricing.currency}
                        {message.pricing.monthly}
                      </Typography>
                      <Typography variant="body2">
                        Annual:{' '}
                        {message.pricing.currency}
                        {message.pricing.annual}
                        <Typography
                          component="span"
                          variant="caption"
                          sx={{
                            color: 'success.main',
                          }}
                        >
                          {' '}
                          (Save{' '}
                          {Math.round(
                            (1 -
                              message.pricing
                                .annual /
                                (message.pricing
                                  .monthly *
                                  12)) *
                              100
                          )}
                          %)
                        </Typography>
                      </Typography>
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
        messages[messages.length - 1]
          .suggestedResponses && (
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
            {messages[
              messages.length - 1
            ].suggestedResponses.map(
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
        )}

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
          onKeyPress={handleKeyPress}
          variant="outlined"
          size="small"
          autoComplete="off"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  sx={{ color: themeColor }}
                  onClick={handleSend}
                  edge="end"
                  disabled={!input.trim()}
                >
                  <SendIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '24px',
              '&.Mui-focused fieldset': {
                borderColor: themeColor,
              },
            },
          }}
        />
      </Box>
    </Dialog>
  );
};

export default ChatbotDialog;
