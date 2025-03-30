import React, { useState, useEffect } from "react";
import {
  Drawer,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Collapse,
  Typography,
  useMediaQuery,
  useTheme,
  IconButton,
} from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";
import { sidebarItems } from "@/settings";
import { useSpinner } from "@/contexts/SpinnerContext";
import ChevronRight from "@mui/icons-material/ChevronRight";

// Hamburger menu button component that appears on small screens
const MenuToggleButton: React.FC<{ onClick: () => void; isOpen: boolean }> = ({
  onClick,
  isOpen
}) => (
  <IconButton
    color="inherit"
    aria-label="toggle drawer"
    onClick={onClick}
    sx={{
      position: 'fixed',
      top: 10,
      left: isOpen ? 'auto' : 10,
      zIndex: 1200,
      bgcolor: '#173a79',
      color: '#fff',
      '&:hover': {
        bgcolor: '#2a4d8a',
      },
      boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
    }}
  >
    {isOpen ? <CloseIcon /> : <MenuIcon />}
  </IconButton>
);

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
  onDrawerToggle = () => { },
}) => {
  const { setLoading } = useSpinner();
  const [expandedItems, setExpandedItems] = useState<{ [key: string]: boolean }>({});
  const [activeItemState, setActiveItemState] = useState<string>("");
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [localDrawerOpen, setLocalDrawerOpen] = useState(isDrawerOpen);

  useEffect(() => {
    setLocalDrawerOpen(isDrawerOpen);
  }, [isDrawerOpen]);

  const handleDrawerToggle = () => {
    const newState = !localDrawerOpen;
    setLocalDrawerOpen(newState);
    onDrawerToggle();
  };

  const handleDrawerClose = () => {
    if (isSmallScreen) {
      setLocalDrawerOpen(false);
      onDrawerToggle();
    }
  };

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

    setTimeout(() => {
      handleItemClick(label);
      onSectionSelect(label);
      setLoading(false);

      if (isSmallScreen) {
        handleDrawerClose();
      }
    }, 500);
  };

  if (isSmallScreen && !localDrawerOpen) {
    return <MenuToggleButton onClick={handleDrawerToggle} isOpen={false} />;
  }

  if (!isSmallScreen && !localDrawerOpen) return null;

  return (
    <>
      {isSmallScreen && (
        <MenuToggleButton onClick={handleDrawerToggle} isOpen={true} />
      )}

      <Drawer
        variant={isSmallScreen ? "temporary" : "permanent"}
        open={localDrawerOpen}
        onClose={handleDrawerClose}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor,
            color: textColor,
            height: '100%',
            overflowY: 'auto',
            scrollbarWidth: 'none', // Firefox
            msOverflowStyle: 'none', // IE and Edge
            '&::-webkit-scrollbar': {
              display: 'none', // Chrome, Safari, and Opera
            },
          },
          display: { xs: 'block', sm: 'block', md: 'block' },
        }}
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
                <ListItemIcon sx={{
                  color: iconColor,
                  minWidth: '40px',
                  '& > *': {
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }
                }}>
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
                          sx={{ color: textColor }}
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
    </>
  );
};

export default Sidebar;