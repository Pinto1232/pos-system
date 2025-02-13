"use client";

import { memo } from "react";
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Collapse, Avatar, Box, Typography, Badge, Paper, IconButton } from "@mui/material";
import { ExpandLess, ExpandMore, Notifications, Settings, Support, Close } from "@mui/icons-material";
import { FiSearch } from "react-icons/fi"; // Import the search icon from react-icons
import { useSidebar } from "@/contexts/SidebarContext";
import styles from "./Sidebar.module.css";

interface SidebarProps {
  activeItem: string;
  handleItemClick: (item: string) => void;
}

const Sidebar: React.FC<SidebarProps> = memo(({ activeItem, handleItemClick }) => {
  const { isSidebarOpen, toggleSidebar } = useSidebar();

  return (
    <Drawer anchor="left" open={isSidebarOpen} onClose={toggleSidebar} className={styles.sidebar}>
      <Paper className={styles.sidebarContainer}>
        <Box className={styles.sidebarHeader}>
          <Avatar src="/logo.svg" alt="Logo" className={styles.logo} />
          <Typography variant="h6" className={styles.title}>Untitled UI</Typography>
          <IconButton onClick={toggleSidebar} className={styles.closeIcon}>
            <Close />
          </IconButton>
        </Box>

        <Box className={styles.searchBox}>
          <FiSearch className={styles.searchIcon} /> {/* Use the search icon from react-icons */}
          <Typography variant="body2" className={styles.searchText}>Search</Typography>
        </Box>

        <List className={styles.list}>
          {['home', 'dashboard', 'projects', 'tasks', 'reporting'].map((item) => (
            <ListItem
              key={item}
              onClick={() => handleItemClick(item)}
              className={`${styles.listItem} ${activeItem === item ? styles.activeItem : ''}`}
            >
              <ListItemIcon className={styles.listItemIcon}>
              </ListItemIcon>
              <ListItemText
                primary={item.charAt(0).toUpperCase() + item.slice(1)}
                primaryTypographyProps={{
                  className: `${styles.listItemText} ${activeItem === item ? styles.activeText : ''}`
                }}
              />
              {item === 'reporting' && (activeItem === "reporting" ? <ExpandLess /> : <ExpandMore />)}
            </ListItem>
          ))}

          <Collapse in={activeItem === "reporting"} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {['Overview', 'Notifications', 'Analytics', 'Reports'].map((subItem) => (
                <ListItem
                  key={subItem}
                  className={styles.nestedItem}
                >
                  <ListItemText
                    primary={subItem}
                    primaryTypographyProps={{
                      className: styles.nestedItemText
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Collapse>

          <Box className={styles.divider} />

          {['notifications', 'support'].map((item) => (
            <ListItem
              key={item}
              className={styles.listItem}
            >
              <ListItemIcon className={styles.listItemIcon}>
                {item === 'notifications' ? (
                  <Badge badgeContent={4} color="primary" className={styles.badge}>
                    <Notifications />
                  </Badge>
                ) : <Support />}
              </ListItemIcon>
              <ListItemText
                primary={item.charAt(0).toUpperCase() + item.slice(1)}
                primaryTypographyProps={{ className: styles.listItemText }}
              />
            </ListItem>
          ))}

          <Box className={styles.userProfile}>
            <Avatar src="/user.jpg" alt="User" className={styles.userAvatar} />
            <Box className={styles.userInfo}>
              <Typography variant="body2" className={styles.userName}>Elina Kouba</Typography>
              <Typography variant="caption" className={styles.userEmail}>
                kouba.elina@gmail.com
              </Typography>
            </Box>
            <Settings className={styles.userSettings} />
          </Box>
        </List>
      </Paper>
    </Drawer>
  );
});

Sidebar.displayName = "Sidebar";
export default Sidebar;
