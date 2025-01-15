import React, { useState, useEffect } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Box,
  Typography,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useRouter } from 'next/navigation';
import { fetchAppRoutes } from '@/services/fetchAppRoutes';
import { Route } from '@/routes/appRoutes';

interface AppDrawerProps {
  open: boolean;
  onClose: () => void;
  userRole: string;
}

const AppDrawer: React.FC<AppDrawerProps> = ({ open, onClose, userRole }) => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const router = useRouter();

  useEffect(() => {
    const loadRoutes = async () => {
      try {
        const fetchedRoutes = await fetchAppRoutes(userRole);
        setRoutes(fetchedRoutes);
      } catch (error) {
        console.error('Error fetching routes:', error);
      }
    };

    loadRoutes();
  }, [userRole]);

  const handleNavigation = (path?: string) => {
    if (path) {
      router.push(path);
    } else {
      console.error('Navigation path is undefined');
    }
  };

  return (
    <Drawer
      anchor="left"
      open={open}
      PaperProps={{
        sx: {
          backgroundColor: '#1e3a8a',
          width: 300, 
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        },
      }}
    >
      {/* Drawer Header */}
      <Box
        sx={{
          padding: '12px',
          textAlign: 'center',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          backgroundColor: '#0c1b48',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h6" sx={{ color: '#fff', fontWeight: 'bold' }}>
          Pisval Tech
        </Typography>
        <IconButton
          onClick={onClose}
          sx={{
            color: '#fff',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Navigation List */}
      <List sx={{ flex: 1, padding: '10px' }}>
        {routes.map((route) => (
          <ListItem key={route.label} disablePadding>
            <ListItemButton
              onClick={() => handleNavigation(route.path)}
              sx={{
                padding: '10px 20px',
                borderRadius: '10px',
                '&:hover': {
                  backgroundColor: '#1f2937',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: '#fff',
                  minWidth: '40px',
                }}
              >
                {React.createElement(route.icon)}
              </ListItemIcon>
              <ListItemText
                primary={route.label}
                primaryTypographyProps={{
                  sx: { fontSize: '16px', fontWeight: 'medium' },
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Logout Button */}
      <Box
        sx={{
          padding: '20px',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          textAlign: 'center',
          backgroundColor: '#1f2937',
        }}
      >
        <Typography sx={{ fontSize: 12 }}>Powered by Pisval Tech</Typography>
      </Box>
    </Drawer>
  );
};

export default AppDrawer;