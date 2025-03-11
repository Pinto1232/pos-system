import React from "react";
import {
  Drawer,
  Box,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
//import styles from './Sidebar.module.css'; 

interface SidebarProps {
  drawerWidth: number;
  isDrawerOpen: boolean;
  onDrawerToggle: () => void;
  backgroundColor?: string; // Add backgroundColor prop
  textColor?: string; // Add textColor prop
  iconColor?: string; // Add iconColor prop
}

const Sidebar: React.FC<SidebarProps> = ({ drawerWidth, isDrawerOpen, onDrawerToggle, backgroundColor, textColor, iconColor }) => {
  const navItems = ["Inventory", "Category", "Brand", "Products", "Reports"];

  return (
    <>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          width: isDrawerOpen ? drawerWidth : 60, 
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: isDrawerOpen ? drawerWidth : 60,
            boxSizing: "border-box",
            backgroundColor: backgroundColor || "default", // Apply background color
            color: textColor || "inherit", // Apply text color
          },
        }}
        open
      >
        <Box sx={{ overflow: "auto" }}>
          <List>
            {navItems.map((item, index) => (
              <ListItem key={index} sx={{ py: 1 }} component="li">
                <ListItemText
                  primary={isDrawerOpen ? item : ""}
                  sx={{ textAlign: "center", color: textColor || "inherit" }} // Apply text color
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      <Drawer
        variant="temporary"
        open={isDrawerOpen}
        onClose={onDrawerToggle}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            backgroundColor: backgroundColor || "default", // Apply background color
            color: textColor || "inherit", // Apply text color
          },
        }}
        ModalProps={{
          keepMounted: true, 
        }}
      >
        <Box sx={{ overflow: "auto" }}>
          <IconButton onClick={onDrawerToggle} sx={{ color: iconColor || "inherit" }}> {/* Apply icon color */}
            <MenuIcon />
          </IconButton>
          <List>
            {navItems.map((item, index) => (
              <ListItem key={index} sx={{ py: 1 }} component="li">
                <ListItemText primary={item} sx={{ color: textColor || "inherit" }} /> {/* Apply text color */}
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Sidebar;
