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
import Image from "next/image";
import { sidebarItems } from "@/settings";
import { useSpinner } from "@/contexts/SpinnerContext";
import ChevronRight from "@mui/icons-material/ChevronRight";

export interface SidebarProps {
  drawerWidth: number;
  isDrawerOpen: boolean;
  onSectionSelect: (section: string) => void;
  onSettingsClick?: () => void;
  backgroundColor?: string;
  textColor?: string;
  iconColor?: string;
  logoUrl?: string;
  handleItemClick: (section: string) => void;
  onDrawerToggle?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  drawerWidth,
  isDrawerOpen,
  onSectionSelect,
  onSettingsClick,
  backgroundColor = "#173a79",
  textColor = "#fff",
  iconColor = "#fff",
  logoUrl = "/Pisval_Logo.jpg",
  handleItemClick = () => { },
}) => {
  const { setLoading } = useSpinner();
  const [expandedItems, setExpandedItems] = useState<{ [key: string]: boolean }>({});
  const [activeItemState, setActiveItemState] = useState<string>("");

  const handleToggle = (label: string) => {
    setExpandedItems((prev) => {
      const newState = Object.keys(prev).reduce((acc, key) => {
        acc[key] = key === label ? !prev[key] : false;
        return acc;
      }, {} as { [key: string]: boolean });

      if (!(label in prev)) {
        newState[label] = true;
      }

      return newState;
    });
  };

  const handleItemClickInternal = (label: string, parentLabel?: string) => {
    setLoading(true);
    setActiveItemState(label);

    setExpandedItems((prev) => {
      if (parentLabel) {
        return { ...prev, [parentLabel]: true };
      }
      return {};
    });

    // Check if the section exists before navigating
    const validSections = ["Dashboard", "Products", "Sales", "Orders", "Customers", "Settings"];
    if (!validSections.includes(label)) {
      setLoading(false);
      return;
    }

    setTimeout(() => {
      handleItemClick(label);
      onSectionSelect(label);
      setLoading(false);
    }, 500);
  };

  if (!isDrawerOpen) return null;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundColor,
          color: textColor,
          overflowY: 'auto',
          '&::-webkit-scrollbar': {
            display: 'none', // Hide scrollbar for Chrome, Safari and Opera
          },
          scrollbarWidth: 'none', // Hide scrollbar for Firefox
          msOverflowStyle: 'none', // Hide scrollbar for IE and Edge
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
            textAlign: "center",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
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
                } else {
                  handleItemClickInternal(item.label);
                }
              }}
              sx={{
                cursor: "pointer",
                backgroundColor: activeItemState === item.label ? "#34D399" : "inherit",
                "&:hover": { backgroundColor: "" },
              }}
            >
              <ListItemIcon sx={{ color: iconColor }}>
                <item.icon />
              </ListItemIcon>
              <ListItemText primary={item.label} sx={{ color: textColor }} />
              {activeItemState === item.label && (
                <ChevronRight sx={{ color: textColor }} />
              )}
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
                        pl: 11,
                        cursor: "pointer",
                        backgroundColor:
                          activeItemState === subItem.label ? "#34D399" : "inherit",
                        "&:hover": { backgroundColor: " " },
                      }}
                      onClick={() => handleItemClickInternal(subItem.label, item.label)}
                    >
                      <ListItemText
                        primary={subItem.label}
                        sx={{
                          color: textColor,
                          '& .MuiTypography-root': {
                            display: 'flex',
                            alignItems: 'center',
                            '&::before': {
                              content: '"•"',
                              marginRight: '12px',
                              fontSize: '20px',
                            }
                          }
                        }}
                      />
                      {activeItemState === subItem.label && (
                        <ChevronRight sx={{ color: textColor }} />
                      )}
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
