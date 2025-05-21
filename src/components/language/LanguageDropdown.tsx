'use client';
import React, { useState } from 'react';
import { Menu, MenuItem, Typography, Box } from '@mui/material';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import CheckIcon from '@mui/icons-material/Check';
import { FiGlobe } from 'react-icons/fi';
import styles from './LanguageDropdown.module.css';
import { useTranslationContext, AVAILABLE_LANGUAGES } from '@/i18n';
import FlagIcon from './FlagIcon';

const LanguageDropdown: React.FC = () => {
  const { currentLanguage, changeLanguage } = useTranslationContext();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageSelect = (language: (typeof AVAILABLE_LANGUAGES)[0]) => {
    handleClose();

    setTimeout(() => {
      changeLanguage(language.code);
      console.log(`Language changed to ${language.code} via dropdown`);
    }, 100);
  };

  return (
    <>
      <Box
        component="button"
        onClick={handleClick}
        aria-controls={open ? 'language-menu' : undefined}
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
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <FiGlobe
          style={{
            fontSize: '18px',
            color: 'white',
            marginRight: '4px',
          }}
        />
        <span className={styles.flagIcon}>
          <FlagIcon countryCode={currentLanguage.flag} size={24} />
        </span>
        <ExpandMoreRoundedIcon
          sx={{
            fontSize: '16px',
            color: 'white',
            opacity: 0.9,
            transition: 'transform 0.2s ease',
            transform: open ? 'rotate(180deg)' : 'rotate(0)',
            ml: '0px',
          }}
        />
      </Box>
      <Menu
        id="language-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            elevation: 3,
            sx: {
              minWidth: '200px',
              backgroundColor: '#fff',
              marginTop: '8px',
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1) !important',
              animation: 'fadeIn 0.2s ease-out forwards',
            },
          },
        }}
        className={styles.menuContainer}
      >
        {AVAILABLE_LANGUAGES.map((language) => (
          <MenuItem
            key={language.code}
            onClick={() => handleLanguageSelect(language)}
            selected={currentLanguage.code === language.code}
            className={`${styles.menuItem} ${currentLanguage.code === language.code ? styles.selected : ''}`}
          >
            <Box component="span" className={styles.menuFlagIcon}>
              <FlagIcon countryCode={language.flag} size={26} />
            </Box>
            <Typography variant="body2" className={styles.languageText}>
              {language.name}
            </Typography>
            {currentLanguage.code === language.code && (
              <CheckIcon
                sx={{
                  ml: 'auto',
                  fontSize: '16px',
                  color: '#1976d2',
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
