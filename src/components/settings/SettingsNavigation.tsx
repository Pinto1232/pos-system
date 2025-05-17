import React from 'react';
import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  TextField,
  Tooltip,
  IconButton,
} from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { SettingsItem } from '../../types/settingsTypes';

interface SettingsNavigationProps {
  selectedSetting: string;
  setSelectedSetting: (setting: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  settingsItems: SettingsItem[];
}

const SettingsNavigation: React.FC<SettingsNavigationProps> = ({
  selectedSetting,
  setSelectedSetting,
  searchQuery,
  setSearchQuery,
  settingsItems,
}) => {
  return (
    <Box
      sx={{
        width: '280px',
        borderRight: '1px solid #e0e0e0',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#f8f8f8',
        height: '100%',
      }}
    >
      {}
      <Box
        sx={{
          p: 2,
          borderBottom: '1px solid #e0e0e0',
        }}
      >
        <TextField
          placeholder="Search settings..."
          size="small"
          fullWidth
          value={searchQuery}
          onChange={(e) => {
            const query = e.target.value.toLowerCase();
            setSearchQuery(query);
          }}
          InputProps={{
            startAdornment: (
              <Box
                component="span"
                sx={{
                  color: 'text.secondary',
                  mr: 1,
                }}
              >
                🔍
              </Box>
            ),
            sx: {
              borderRadius: 4,
              bgcolor: '#fff',
            },
          }}
        />
      </Box>

      {}
      <Box
        sx={{
          overflowY: 'auto',
          flexGrow: 1,
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        }}
      >
        <List
          component="nav"
          aria-label="settings categories"
          sx={{
            py: 0,
          }}
        >
          {(searchQuery.trim() === ''
            ? settingsItems
            : settingsItems.filter((item) =>
                item.label.toLowerCase().includes(searchQuery.toLowerCase())
              )
          ).map((item) => (
            <Tooltip title={item.tooltip} placement="right" key={item.label}>
              <ListItemButton
                onClick={() => {
                  setSelectedSetting(item.label);
                }}
                selected={selectedSetting === item.label}
                sx={{
                  py: 2,
                  borderLeft:
                    selectedSetting === item.label
                      ? '4px solid #173A79'
                      : '4px solid transparent',
                  bgcolor:
                    selectedSetting === item.label ? '#fff' : 'transparent',
                  borderBottom: '1px solid #f0f0f0',
                  '&:hover': {
                    bgcolor:
                      selectedSetting === item.label ? '#fff' : '#f0f0f0',
                  },
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight:
                      selectedSetting === item.label ? 'bold' : 'normal',
                    color:
                      selectedSetting === item.label ? '#173A79' : 'inherit',
                  }}
                />
                <IconButton size="small" sx={{ opacity: 0.5, ml: 1 }}>
                  <HelpOutlineIcon fontSize="small" />
                </IconButton>
              </ListItemButton>
            </Tooltip>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default SettingsNavigation;
