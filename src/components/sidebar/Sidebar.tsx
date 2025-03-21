import React, { useState } from "react";
import {
  Drawer,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Collapse,
  Typography,
} from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { sidebarItems } from "@/settings";
import Image from "next/image";

export interface SidebarProps {
  drawerWidth: number;
  isDrawerOpen: boolean;
  onDrawerToggle: () => void;
  onSettingsClick?: () => void;
  backgroundColor?: string;
  textColor?: string;
  iconColor?: string;
  logoUrl?: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  drawerWidth,
  isDrawerOpen,
  //onDrawerToggle,
  onSettingsClick,
  backgroundColor = "#173a79",
  textColor = "#fff",
  iconColor = "#fff",
  logoUrl = "/Pisval_Logo.jpg",
}) => {
  const [expandedItems, setExpandedItems] = useState<{ [key: string]: boolean }>({});

  const handleToggle = (label: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  if (!isDrawerOpen) {
    return null;
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundColor: backgroundColor,
          color: textColor,
        },
      }}
      open
    >
      <Box sx={{ textAlign: "center", p: 2 }}>
        <Image
          src={logoUrl}
          alt="Logo"
          width={80}
          height={80}
          style={{ borderRadius: "50%" }}
        />
        <Typography
          variant="h6"
          sx={{
            color: "#000",
            background: "#ffffff",
            borderRadius: "6px",
            mt: 2,
            p: 0.2,
            fontWeight: "semibold",
            textAlign: "center", // Center the text horizontally
            display: "flex",     // Flexbox for centering
            justifyContent: "center", // Center horizontally
            alignItems: "center", // Center vertically
          }}
        >
          Pinto Manuel
        </Typography>
      </Box>
      <List>
        {sidebarItems.map((item) => (
          <React.Fragment key={item.label}>
            <ListItem
              onClick={() => {
                if (item.label === "Settings" && onSettingsClick) {
                  onSettingsClick();
                } else if (item.expandable) {
                  handleToggle(item.label);
                }
              }}
              sx={{
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "#52B788",
                },
              }}
            >
              <ListItemIcon sx={{ color: iconColor }}>
                <item.icon />
              </ListItemIcon>
              <ListItemText primary={item.label} sx={{ color: textColor }} />
              {item.expandable &&
                (expandedItems[item.label] ? <ExpandLess /> : <ExpandMore />)}
            </ListItem>
            {item.expandable && item.subItems && (
              <Collapse in={expandedItems[item.label]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.subItems.map((subItem) => (
                    <ListItem
                      key={subItem.label}
                      sx={{
                        pl: 4,
                        cursor: "pointer",
                        "&:hover": {
                          backgroundColor: "#52B788",
                        },
                      }}
                    >
                      <ListItemText primary={subItem.label} sx={{ color: textColor }} />
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            )}
          </React.Fragment>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
