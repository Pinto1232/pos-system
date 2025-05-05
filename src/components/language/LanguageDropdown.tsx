'use client';
import React, { useState } from 'react';
import {
  Menu,
  MenuItem,
  Typography,
  Box,
  Fade,
} from '@mui/material';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import CheckIcon from '@mui/icons-material/Check';
import styles from './LanguageDropdown.module.css';

// Define available languages with their flags
const AVAILABLE_LANGUAGES = [
  {
    code: 'en',
    name: 'English',
    flag: '🇬🇧',
  },
  {
    code: 'pt',
    name: 'Português',
    flag: '🇵🇹',
  },
  {
    code: 'es',
    name: 'Español',
    flag: '🇪🇸',
  },
  {
    code: 'fr',
    name: 'Français',
    flag: '🇫🇷',
  },
];

const LanguageDropdown: React.FC = () => {
  // Get default language from localStorage or use English
  const getDefaultLanguage = () => {
    if (typeof window !== 'undefined') {
      const savedLanguage =
        localStorage.getItem('language');
      if (savedLanguage) {
        try {
          return JSON.parse(savedLanguage);
        } catch (e) {
          console.error(
            'Error parsing saved language:',
            e
          );
        }
      }
    }
    return AVAILABLE_LANGUAGES[0];
  };

  const [currentLanguage, setCurrentLanguage] =
    useState(getDefaultLanguage());
  const [anchorEl, setAnchorEl] =
    useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (
    event: React.MouseEvent<HTMLElement>
  ) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageSelect = (
    language: (typeof AVAILABLE_LANGUAGES)[0]
  ) => {
    setCurrentLanguage(language);
    localStorage.setItem(
      'language',
      JSON.stringify(language)
    );
    handleClose();
  };

  return (
    <>
      <Box
        component="button"
        onClick={handleClick}
        aria-controls={
          open ? 'language-menu' : undefined
        }
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        title={`Current language: ${currentLanguage.name}`}
        className={styles.flagButton}
        sx={{
          cursor: 'pointer',
          border: 'none',
          outline: 'none',
          padding: '4px 8px',
          height: '32px',
        }}
      >
        <span className={styles.flagIcon}>
          {currentLanguage.flag}
        </span>
        <ExpandMoreRoundedIcon
          sx={{
            fontSize: '16px',
            color: 'white',
            opacity: 0.9,
            transition: 'transform 0.2s ease',
            transform: open
              ? 'rotate(180deg)'
              : 'rotate(0)',
            ml: '0px',
          }}
        />
      </Box>
      <Menu
        id="language-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
        transitionDuration={200}
        MenuListProps={{
          'aria-labelledby': 'language-button',
          dense: true,
        }}
        PaperProps={{
          elevation: 3,
          sx: {
            minWidth: '180px',
            backgroundColor: '#fff',
            marginTop: '8px',
          },
        }}
      >
        {AVAILABLE_LANGUAGES.map((language) => (
          <MenuItem
            key={language.code}
            onClick={() =>
              handleLanguageSelect(language)
            }
            selected={
              currentLanguage.code ===
              language.code
            }
            className={`${styles.menuItem} ${currentLanguage.code === language.code ? styles.selected : ''}`}
          >
            <Box
              component="span"
              className={styles.menuFlagIcon}
            >
              {language.flag}
            </Box>
            <Typography
              variant="body2"
              className={styles.languageText}
            >
              {language.name}
            </Typography>
            {currentLanguage.code ===
              language.code && (
              <CheckIcon
                sx={{
                  ml: 'auto',
                  fontSize: '16px',
                  color: '#1976d2',
                  opacity: 0.9,
                }}
              />
            )}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default LanguageDropdown;
