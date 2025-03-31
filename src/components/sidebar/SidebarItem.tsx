import React from "react";
import {
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ChevronRight from "@mui/icons-material/ChevronRight";
import { SidebarItemProps } from "./types";
import SubItems from "./SubItems";

const SidebarItem: React.FC<SidebarItemProps> = ({
  item,
  isActive,
  isExpanded,
  iconColor,
  textColor,
  onToggle,
  onItemClick,
  onSettingsClick
}) => {
  const handleClick = () => {
    if (item.label === "Settings" && onSettingsClick) {
      onSettingsClick();
    } else if (item.expandable) {
      onToggle(item.label);
    } else {
      onItemClick(item.label);
    }
  };

  return (
    <>
      <ListItem
        onClick={handleClick}
        sx={{
          cursor: "pointer",
          backgroundColor: isActive ? "#34D399" : "inherit",
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
        {isActive && (
          <ChevronRight sx={{ color: textColor }} />
        )}
        {item.expandable &&
          (isExpanded ? <ExpandLess /> : <ExpandMore />)}
      </ListItem>

      {item.expandable && item.subItems && (
        <SubItems
          parentLabel={item.label}
          subItems={item.subItems}
          isExpanded={isExpanded}
          activeItem={isActive ? item.label : ""}
          textColor={textColor}
          onItemClick={onItemClick}
        />
      )}
    </>
  );
};

export default SidebarItem;
