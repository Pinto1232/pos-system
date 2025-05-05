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
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import { useChatbot } from '@/contexts/ChatbotContext';
import Image from 'next/image';

const ChatbotDialog = () => {
  const {
    isOpen,
    toggleChatbot,
    messages,
    sendMessage,
  } = useChatbot();
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
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          overflow: 'hidden',
          maxWidth: '380px',
          height: '500px',
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow:
            '0 8px 32px rgba(0, 0, 0, 0.2)',
          '@media (max-width: 480px)': {
            margin: '16px',
            maxWidth: 'calc(100% - 32px)',
          },
        },
      }}
      sx={{
        zIndex: 9999,
        '& .MuiBackdrop-root': {
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px',
          backgroundColor: '#1976d2',
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
          <Typography variant="h6">
            Pisval Assistant
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
                    bgcolor: '#1976d2',
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
                      ? '#1976d2'
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
                  color="primary"
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
            },
          }}
        />
      </Box>
    </Dialog>
  );
};

export default ChatbotDialog;
