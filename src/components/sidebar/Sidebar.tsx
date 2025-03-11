import React, { useState } from "react";
import {
  Drawer,
  Box,
  List,
  ListItem,
  ListItemText,
  IconButton,
  ListItemIcon,
  Typography,
  Collapse,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { navItems } from "@/settings";
import Image from "next/image";

interface SidebarProps {
  drawerWidth: number;
  isDrawerOpen: boolean;
  onDrawerToggle: () => void;
  backgroundColor?: string;
  textColor?: string;
  iconColor?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ drawerWidth, isDrawerOpen, onDrawerToggle, backgroundColor, textColor, iconColor }) => {
  const [isImageError, setIsImageError] = useState(false);
  const [openCategory, setOpenCategory] = useState(false);

  const handleCategoryClick = () => {
    setOpenCategory(!openCategory);
  };

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
            backgroundColor: backgroundColor || "default",
            color: textColor || "inherit",
          },
        }}
        open
      >
        <Box sx={{ overflow: "auto" }}>
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'start', justifyContent: 'start', py: 2 }}>
            {!isImageError ? (
              <Image src="/path/to/logo.png" alt="Logo" width={40} height={40} onError={() => setIsImageError(true)} />
            ) : (
              <Typography variant="h4" px={2}>Pisval POS</Typography>
            )}
          </Box>
          <List>
            {navItems.map((item, index) => (
              <React.Fragment key={index}>
                {item.label === "Category" ? (
                  <>
                    <ListItem onClick={handleCategoryClick} sx={{ py: 1, display: 'flex', alignItems: 'center' }} component="li">
                      <ListItemIcon sx={{ color: iconColor || "inherit", minWidth: 'auto', mr: 0.5 }}>
                        <item.icon />
                      </ListItemIcon>
                      <ListItemText
                        primary={isDrawerOpen ? item.label : ""}
                        sx={{ textAlign: "center", color: textColor || "inherit", ml: 0.5 }}
                      />
                      {openCategory ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse in={openCategory} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        <ListItem component="li" sx={{ pl: 4 }}>
                          <ListItemText primary="Sub-item 1" />
                        </ListItem>
                        <ListItem component="li" sx={{ pl: 4 }}>
                          <ListItemText primary="Sub-item 2" />
                        </ListItem>
                      </List>
                    </Collapse>
                  </>
                ) : (
                  <ListItem key={index} sx={{ py: 1, display: 'flex', alignItems: 'center' }} component="li">
                    <ListItemIcon sx={{ color: iconColor || "inherit", minWidth: 'auto', mr: 0.5 }}>
                      <item.icon />
                    </ListItemIcon>
                    <ListItemText
                      primary={isDrawerOpen ? item.label : ""}
                      sx={{ textAlign: "center", color: textColor || "inherit", ml: 0.5 }}
                    />
                  </ListItem>
                )}
              </React.Fragment>
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
            backgroundColor: backgroundColor || "default",
            color: textColor || "inherit",
          },
        }}
        ModalProps={{
          keepMounted: true,
        }}
      >
        <Box sx={{ overflow: "auto" }}>
          <IconButton onClick={onDrawerToggle} sx={{ color: iconColor || "inherit" }}>
            <ChevronLeftIcon />
          </IconButton>
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 2 }}>
            {!isImageError ? (
              <Image src="/path/to/logo.png" alt="Logo" width={40} height={40} onError={() => setIsImageError(true)} />
            ) : (
              <Typography variant="h6">Pisval POS</Typography>
            )}
          </Box>
          <List>
            {navItems.map((item, index) => (
              <React.Fragment key={index}>
                {item.label === "Category" ? (
                  <>
                    <ListItem onClick={handleCategoryClick} sx={{ py: 1, display: 'flex', alignItems: 'center' }} component="li">
                      <ListItemIcon sx={{ color: iconColor || "inherit", minWidth: 'auto', mr: 0.5 }}>
                        <item.icon />
                      </ListItemIcon>
                      <ListItemText primary={item.label} sx={{ color: textColor || "inherit", ml: 0.5 }} />
                      {openCategory ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse in={openCategory} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        <ListItem component="li" sx={{ pl: 4 }}>
                          <ListItemText primary="Sub-item 1" />
                        </ListItem>
                        <ListItem component="li" sx={{ pl: 4 }}>
                          <ListItemText primary="Sub-item 2" />
                        </ListItem>
                      </List>
                    </Collapse>
                  </>
                ) : (
                  <ListItem key={index} sx={{ py: 1, display: 'flex', alignItems: 'center' }} component="li">
                    <ListItemIcon sx={{ color: iconColor || "inherit", minWidth: 'auto', mr: 0.5 }}>
                      <item.icon />
                    </ListItemIcon>
                    <ListItemText primary={item.label} sx={{ color: textColor || "inherit", ml: 0.5 }} />
                  </ListItem>
                )}
              </React.Fragment>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Sidebar;
